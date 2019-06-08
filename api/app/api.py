from flask import request, make_response, render_template, redirect, abort, jsonify
from flask_restful import Resource
from models import db, User, Daily, Weather, MyScrap, MyDaily, LoginSession
from utils import serializer, dictionalizer
import datetime
from weather import query_now, query_5day
import boto3
import json
import random

import os
from werkzeug.utils import secure_filename

from flask_jwt_extended import (
    JWTManager, create_access_token, create_refresh_token,
    jwt_required, jwt_refresh_token_required, get_jwt_identity,
    get_jti, get_raw_jwt)



class Users(Resource):
    def _get_user(self):
        users = User.query.all()
        return users

    def get(self):
        users = self._get_user()
        return serializer(users)

    def post(self):
        data = request.get_json()
        if User.query.filter_by(name=data['name']).first():
            return abort(409, description='user name already exists')

        new_user = User(name=data['name'], password=data['password'])
        db.session.add(new_user)
        db.session.commit()
        return jsonify({'message': 'successfully registered'})

    def delete(self):
        data = request.get_json()  # name, password
        del_user = User.query.filter_by(name=data['name']).first()

        if del_user is None:
            return jsonify({'message':'user name {} does not exist'.format(data['name'])})
        if not del_user.check_password(data['password']):
            jsonify({'message': 'password does not match'})

        db.session.delete(del_user)
        db.session.commit()
        return jsonify({'message': 'deleted successfully'})


class WeatherNow(Resource):
    def get(self):
        args = request.args
        data = query_now(args['city'], args['country'])
        return json.dumps(data)


class Weather5day(Resource):
    def get(self):
        args = request.args
        data = query_5day(args['city'], args['country'])
        return json.dumps(data)


class WeatherPast(Resource):
    def get(self):
        args = request.args  # city, datetime
        weather = Weather.query.filter_by(city=args['city'], datetime=args['datetime']).first()
        return serializer([weather])

    def post(self):
        data = request.get_json()  # city, datetime, cluster
        new_weather = Weather(city=data['city'], datetime=data['datetime'], cluster=data['cluster'])
        db.session.add(new_weather)
        db.session.commit()
        return serializer([new_weather])
        

class ImageUpload(Resource):
    #---temp----------
    def get(self):
        headers = {'Content-Type': 'text/html'}
        return make_response(render_template("upload_image_temp.html"), 200, headers)
    #--------------

    def post(self):
        if request.files:
            image = request.files['image']
            print(image)
            if image.filename == '':
                print("Image doesnt exist!!")
                return redirect(request.url)

            #------------
            # image.save(os.path.join('./../static/img', secure_filename(image.filename)))
            s3 = boto3.resource('s3')
            s3.Bucket('project-lookmorning').put_object(Key=image.filename, Body=image)

            #-------------
            print("Image saved")
            return "image {} has posted".format(image)
        return make_response(404)


class Dailys(Resource):
    def get(self, cluster):
        # # query by daily id
        # if 'id' in args:
        #     daily = Daily.query.filter_by(id=args['id']).first()
        #     return serializer([daily])

        # query by weather cluster
        weathers = Weather.query.filter_by(cluster=cluster).all()  # 현재 날씨와 같은 클러스터의 날씨들을 쿼리
        dailys = []
        for weather in weathers:
            weather_dailys = Daily.query.filter_by(weather_id=weather.id).all()  # 해당 날씨에 촬영된 데일리룩 쿼리
            weather_dt = Weather.query.filter_by(id=weather.id).first().datetime

            for weather_daily in dictionalizer(weather_dailys):
                weather_daily['datetime'] = weather_dt
                dailys += [weather_daily]  # datetime이 추가된 weather_daily를 이어 붙인다

        random.shuffle(dailys)
        return json.dumps(dailys)

    def post(self):
        data = request.get_json()  # city, timestamp, img or imgpath, [satis]
        print(data)

        ###
        # image = request.files['image'] # 이미지파일
        # print(image)
        # if image.filename == '':
        #     print("Image doesnt exist!!")
        #     img_path = 'anonymous.JPG'
        # else:
        #     img_path = secure_filename(image.filename)
        #     image.save(os.path.join('./../static/img', secure_filename(image.filename)))
        #     print("Image saved")
        ###

        ### 기존 인스타 이미지 db 저장
        dt = datetime.datetime.fromtimestamp(data['timestamp']).strftime('%Y-%m-%d %H')
        weather_id = Weather.query.filter_by(city=data['city'], datetime=dt).first().id
        new_daily = Daily(weather_id=weather_id, img_path=data['img_path'], satis=data['satis'])
        db.session.add(new_daily)
        db.session.commit()

        ## 유저가 데일리 등록한다면 MyDaily 객체 create까지 해줘야함

        return serializer([new_daily])


class MyDailys(Resource):
    @jwt_required
    def get(self, user_id):
        print(MyDaily.query.filter_by(user_id=user_id).all())
        if user_id:
            my_dailys = MyDaily.query.filter_by(
                user_id=user_id).all()
        else:
            return "user not found"

        dailys = []
        for my_daily in my_dailys:
            daily_ = Daily.query.filter_by(id=my_daily.daily_id).first()
            daily = {}
            daily['daily_id'] = daily_.id
            daily['img_path'] = daily_.img_path
            daily['datetime'] = Weather.query.filter_by(id=daily_.weather_id).first().datetime
            daily['satis'] = daily_.satis
            dailys.append(daily)
        return jsonify({"dailys": dailys, 'message': "get MyDaily successfully"})

    # def post(self, user_id):
    #     data = request.get_json()
    #     daily_id = data['daily_id']
    #     new_scrap = MyScrap(user_id, daily_id)
    #     db.session.add(new_scrap)
    #     db.session.commit()
    #     return "scrap successfully"


class MyScraps(Resource):
    @jwt_required
    def get(self, user_id):
        print(MyScrap.query.filter_by(user_id=user_id).all())
        if user_id:
            scraps = MyScrap.query.filter_by(
                user_id=user_id).all()
        else:
            return jsonify({"dailys": [], 'message': "user not found"})

        dailys = []
        for scrap in scraps:
            daily_ = Daily.query.filter_by(id=scrap.daily_id).first()
            daily_creater = MyDaily.query.filter_by(daily_id=scrap.daily_id).first()

            daily = {}
            daily['daily_id'] = daily_.id
            daily['img_path'] = daily_.img_path
            daily['datetime'] = Weather.query.filter_by(id=daily_.weather_id).first().datetime
            daily['satis'] = daily_.satis
            if daily_creater:
                daily['creater_id'] = daily_creater.user_id
            dailys.append(daily)
        return jsonify({"dailys": dailys, 'message': "get MyScrap successfully"})

    def post(self, user_id):
        data = request.get_json()
        daily_id = data['daily_id']
        scrap = MyScrap.query.filter_by(
            user_id=user_id).filter_by(
            daily_id=daily_id).first()

        if scrap:
            db.session.delete(scrap)
            db.session.commit()
            return jsonify({"message": "unscrap successfully"})

        new_scrap = MyScrap(user_id, daily_id)
        db.session.add(new_scrap)
        db.session.commit()
        return jsonify({"message": "scrap successfully"})


class UserLogin(Resource):
    def post(self):
        data = request.get_json()
        name = data['name']
        password = data['password']

        user = User.query.filter_by(name=name).first()
        if user is None:
            abort(400, 'User is not exists')
        if not user.check_password(password):
            abort(400, 'Password is incorrect')

        _user = json.loads(user.serialize())
        del _user['password']
        access_token = create_access_token(identity=_user)
        refresh_token = create_refresh_token(identity=_user)
        jti = get_jti(refresh_token)
        _user['token'] = access_token
        _user['refresh'] = refresh_token
        print(_user)
        login_session = LoginSession.query.filter_by(user_id=user.id).first()

        if login_session:
            login_session.jti = jti
        else:
            new_login_session = LoginSession(user.id, jti)
            db.session.add(new_login_session)
        try:
            db.session.commit()
        except Exception as e:
            print(e)
            abort(400, e)

        return json.dumps({'message': 'login successfully', 'data': _user})





# def token_required(f):
#     @wraps(f)
#     def decorated(*args, **kwargs):
#         token = None
#
#         # request header에 토큰이 있으면 진행
#         if 'Authorization' in request.headers:
#             token = request.headers['Authorization']
#
#         if not token:
#             print('if not token')
#             return make_response('{"msg":"Token is missing"}', 401)
#
#         try:
#             data = jwt.decode(token, 'chankoo')  # decoded with secret key
#         except:
#             return make_response('{"msg":"Token is invalid"}', 401)
#
#         return f(*args, **kwargs)  # user 오브젝트를 route에 넘겨주기위해 return
#
#     return decorated
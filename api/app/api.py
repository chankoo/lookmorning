from flask import request, make_response, render_template, redirect
from flask_restful import Resource
from models import db, User, Daily, Weather, MyScrap, MyDaily
from utils import serializer, dictionalizer
import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from weather import query_now, query_5day
import boto3

import json

import os
from werkzeug.utils import secure_filename



class Users(Resource):
    # method_decorators = {
    #     'get': [token_required],
    #     'delete': [token_required],
    #     }

    def _get_user(self):
        users = User.query.all()
        return users

    def get(self):
        print(request.get_json())
        users = self._get_user()
        data = request.get_json()
        # return all users
        return serializer(users)

    def post(self):
        data = request.get_json()
        print(data)
        hashed_pwd = generate_password_hash(data['password'], method='sha256')
        new_user = User(name=data['name'], password=hashed_pwd)

        db.session.add(new_user)
        db.session.commit()
        return serializer([new_user])

    def delete(self):
        data = request.get_json()
        print(data)
        del_user = User.query.filter_by(public_id=data['public_id']).first()
        if del_user is None:
            return 'user public_id {} does not exist'.format(data['public_id'])

        db.session.delete(del_user)
        db.session.commit()
        return 'deleted successfully'


class WeatherNow(Resource):
    def get(self):
        args = request.args
        print(args)
        data = query_now(args['city'], args['country'])
        return json.dumps(data)


class Weather5day(Resource):
    def get(self):
        args = request.args
        print(args)
        data = query_5day(args['city'], args['country'])
        return json.dumps(data)


class WeatherPast(Resource):
    def get(self):
        args = request.args # city, datetime
        weather = Weather.query.filter_by(city=args['city'], datetime=args['datetime'])
        return weather.id

    def post(self):
        print(request)
        data = request.get_json()  # city, datetime, cluster

        print(data)
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
        return json.dumps({"dailys": dailys})

    # def post(self, user_id):
    #     data = request.get_json()
    #     daily_id = data['daily_id']
    #     new_scrap = MyScrap(user_id, daily_id)
    #     db.session.add(new_scrap)
    #     db.session.commit()
    #     return "scrap successfully"


class MyScraps(Resource):
    def get(self, user_id):
        print(MyScrap.query.filter_by(user_id=user_id).all())
        if user_id:
            scraps = MyScrap.query.filter_by(
                user_id=user_id).all()
        else:
            return "user not found"

        dailys = []
        for scrap in scraps:
            daily_ = Daily.query.filter_by(id=scrap.daily_id).first()
            daily = {}
            daily['daily_id'] = daily_.id
            daily['img_path'] = daily_.img_path
            daily['datetime'] = Weather.query.filter_by(id=daily_.weather_id).first().datetime
            daily['satis'] = daily_.satis
            dailys.append(daily)
        return json.dumps({"dailys": dailys})

    def post(self, user_id):
        data = request.get_json()
        daily_id = data['daily_id']
        scrap = MyScrap.query.filter_by(
            user_id=user_id).filter_by(
            daily_id=daily_id).first()

        if scrap:
            db.session.delete(scrap)
            db.session.commit()
            return "unscrap successfully"

        new_scrap = MyScrap(user_id, daily_id)
        db.session.add(new_scrap)
        db.session.commit()
        return "scrap successfully"






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
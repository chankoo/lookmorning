# -*- coding: utf-8 -*-
import os
from flask import Flask
from flask_restful import Api
from flask_cors import CORS
# from models import db
from api import WeatherNow, Weather5day, Users, ImageUpload, WeatherPast, Dailys, MyScraps, MyDailys, UserLogin
from config import alchemy_uri

from flask_sqlalchemy import SQLAlchemy

from flask_jwt_extended import JWTManager
from datetime import timedelta

####
# import boto3
# from config import S3_BUCKET, S3_KEY, S3_SECRET
#
# s3 = boto3.client(
#     's3',
#     aws_access_key_id=S3_KEY,
#     aws_secret_access_key=S3_SECRET,
# )
#
# @app.route('/files')
# def files():
#     s3_resource = boto3.resource('s3')
#     my_bucket = s3_resource.Bucket(S3_BUCKET)
#     summaries = my_bucket.objects.all()
#
#     # return render_template('files.html', my_bucket=my_bucket, files=summaries)
#     return
####

# basedir = os.path.dirname(os.path.abspath(__file__))
# SQLALCHEMY_DATABASE_URI = 'sqlite:///' + os.path.join(basedir, 'app.db')
print(os.path.abspath('../template'))
app = Flask(__name__, template_folder=os.path.abspath('../templates'))
app.config.update({
    'SQLALCHEMY_TRACK_MODIFICATIONS': False,
    'SQLALCHEMY_DATABASE_URI': alchemy_uri(),
    'SQLALCHEMY_ECHO': True,
    # 'SECRET_KEY': 'chankoo',
    'JWT_SECRET_KEY': 'doori',
    'JWT_ACCESS_TOKEN_EXPIRES': timedelta(minutes=15),
    'JWT_REFRESH_TOKEN_EXPIRES': timedelta(days=15),
})
cors = CORS(app)
api = Api(app)

# db.init_app(app)
db = SQLAlchemy(app)
db.create_all()
db.session.commit()

jwt = JWTManager(app)

api.add_resource(UserLogin, '/user/login')
api.add_resource(Users, '/users')
api.add_resource(WeatherNow, '/weather/now')
api.add_resource(Weather5day, '/weather/weekly')
api.add_resource(WeatherPast, '/weather/past')
api.add_resource(MyScraps, '/user/<int:user_id>/myscrap')
api.add_resource(MyDailys, '/user/<int:user_id>/mydaily')

api.add_resource(Dailys, '/daily/<int:user_id>/<int:cluster>')

api.add_resource(ImageUpload, '/daily/<int:user_id>/image-upload')


@app.route('/', methods=['GET'])
def index():
    return 'Hello this is nginx_uwsgi_flask'

if __name__ == '__main__':
    # with app.app_context():
    #     db.create_all()
    #     db.session.commit()
    app.run(host='0.0.0.0', port=8080, debug=True)

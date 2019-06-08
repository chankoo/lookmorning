
## mysql

```bash

docker run -d -p 3306:3306 -e MYSQL_ROOT_PASSWORD=1234 --name db mysql:latest

docker exec -it db bash

mysql -u root -p


```

```mysql

CREATE DATABASE test default CHARACTER SET UTF8; 

USE test;

CREATE TABLE user (id INT PRIMARY KEY AUTO_INCREMENT, name VARCHAR(50) NOT NULL, password VARCHAR(256) ) ENGINE=INNODB;

CREATE TABLE weather (id INT PRIMARY KEY AUTO_INCREMENT, city VARCHAR(30), datetime VARCHAR(50) NOT NULL, cluster INT(8) NOT NULL ) ENGINE=INNODB;

CREATE TABLE daily (id INT PRIMARY KEY AUTO_INCREMENT, weather_id INT, img_path VARCHAR(256), satis INT, FOREIGN KEY (weather_id) REFERENCES weather (id) ) ENGINE=INNODB;

CREATE TABLE myscrap (id INT PRIMARY KEY AUTO_INCREMENT, user_id INT, daily_id INT, FOREIGN KEY (user_id) REFERENCES user (id), FOREIGN KEY (daily_id) REFERENCES daily (id) ) ENGINE=INNODB;

CREATE TABLE mydaily (id INT PRIMARY KEY AUTO_INCREMENT, user_id INT, daily_id INT, FOREIGN KEY (user_id) REFERENCES user (id), FOREIGN KEY (daily_id) REFERENCES daily (id) ) ENGINE=INNODB;

CREATE TABLE login_session (id INT PRIMARY KEY AUTO_INCREMENT, user_id INT, jti VARCHAR(500), FOREIGN KEY (user_id) REFERENCES user (id)) ENGINE=INNODB;

INSERT INTO mydaily (user_id, daily_id) VALUES (1, 307);

```

## flask_app

```bash
docker build -t flask_app_test .

docker run -p 8080:80  -e MYSQL_USER=root  -e MYSQL_PASS=1234  -e MYSQL_DB=test  --name server --rm flask_app_test 


```


## db 데이터 

1. 서울의 1년 hourly weather 데이터로 클러스터링 진행 후 클러스터 할
2. `temp-weatherPast-post.py` 로 weather 테이블에 이전 날씨 저장
3. s3에 daily img 업로드(완료)
3. `temp_daily_post.py` 로 daily 테이블에 데일리룩 path와 날씨id 저장(서버에서 timestamp 기준으로 날씨id 판별)

임시 유저와 mydaily, myscrap 생성
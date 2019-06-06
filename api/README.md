
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



```


## flask_app

```bash
docker build -t flask_app_test .

docker run -p 8080:80  -e MYSQL_USER=root  -e MYSQL_PASS=1234  -e MYSQL_DB=test  --name server --rm flask_app_test 


```


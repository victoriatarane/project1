# This project is a demonstration of a System Design architecture

In order to successfully run this application, following installations are required:
1. ```node```
2. ```psql```
3. ```redis```
   
After downloading this project to a local machine
```gh repo clone victoriatarane/HydroX```
it is necessary to install dependencies
``` npm install ```

Additionally, this project requires a PostgreSQL database setup:
```CREATE DATABASE hydrox;```
Username: Vic
Password: 
```CREATE TABLE evaluation (```
  ```id BIGSERIAL NOT NULL PRIMARY KEY,```
  ```input VARCHAR(50) NOT NULL,```
  ```output VARCHAR(50),```
  ```date_in TIMESTAMP NOT NULL,```
  ```date_out TIMESTAMP```
```);```

To run this project you will need to open 5 terminals and run the following in each of them:
1. ```node input.js```
2. ```node ./machine/validators/8G.js```
3. ```node ./machine/validators/8G_1.js```
4. ```node ./machine/validators/16G.js```
5. ```node ./machine/validators/32G.js```

Once the program is running you can input a string below 32 characters long into the first terminal and observe a simulation of a time consuming evaluation queue being distributed across four processors with limited capacity ensuring we don't reach the maximum capacity.

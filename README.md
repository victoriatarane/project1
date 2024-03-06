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

Password: ''

```CREATE TABLE evaluation (   id BIGSERIAL NOT NULL PRIMARY KEY,   input VARCHAR(50) NOT NULL,   output VARCHAR(50),   date_in TIMESTAMP NOT NULL,   date_out TIMESTAMP   );```

To run this project you will need to open 2 terminals and run the following in each of them:

1. ```node input.js```;
2. ```node ./machine/run-validators.js 8G 8G_1 16G 32G```

Second command contains 4 optional input parameters indicating simulated capacity of different runners, where runner 8G and 8G_1 have a capacity of processing strings of length under 8 characters long, runner 16G processes from 8 and up to 16 characters and runner 32G from 8 and up to 32 characters. Maximum capacity of the machine is 62 characters, ensuring that full capacity is never met. Second command can be passed with one or more parameters.

Once the program is running you can input a string below 32 characters long into the first terminal and observe a simulation of a time consuming evaluation queue being distributed across four processors with limited capacity ensuring we don't reach the maximum capacity.

# Quote Management Backend
This is backend implementation for quote management system in Node JS. It is based on MVC architecture. Express JS is used as node js framework. For Database, postgres is used with Sequelize as ORM. JSON Web Token (JWT) is used for Authentication and Authorization.

## Prerequisites
1. Install Node JS > 16.
2. Install PostgreSQL.

## Getting started
1. Run "npm install"
2. Create config.env file at root level of the application.
3. Create database and put database name in the config.env file against DATABASE variable name.
4. There is no need to create tables or run any .sql file as tables will be created automatically by Sequelize when app is run.
5. Run "npm run swagger-autogen" to generate swagger docs. Swaggers docs are available on /docs route.
6. To run test cases, first change NODE_ENV=test in the config.env file. Also create a new database for testing and set DATABASE_TEST in the config.env file with that. After that run "npm test".
7. Run "npm start", to start the application. It will connect with database and will create all the tables.

## Environment variables / parameters overview
1. PORT - Port at which server will listen for API requests. 
2. NODE_ENV - There are 3 types of enviroments currently. development, test and production. By default it is set to development. Set it to "test" for testing the test suits. When deploying the application, set it to "production".
3. DATABASE - Name of the database with which the application will connect.
4. DATABASE_TEST - This will be the database which will be used when environment set to "test".
5. USER - postgres user, which is by default "postgres"
6. PASSWORD - postgres user password
7. HOST - host name, set it to localhost for local development.
8. JWT_EXPIRY - Expiry duration for JWT token. Set it to "1d" if you want it to be expired after one day.
9. JWT_PRIVATE_KEY - Set any private key here, it should not be too short.

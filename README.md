# NousFood API
Live app: https://nousfood-api.herokuapp.com/api/

## Summary
The API supporting [NousFood Client] (https://github.com/Quanda/nousfood-clien)

## Built with
* NodeJS
* ExpressJS
* MongoDB
* MongooseJS
* PassportJS
* ES6
* See package.json for more

## Using the API

### Authentication / Login
##### POST &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; /api/auth/login
Bearer Authentication with JSON Web Token
Must supply valid Email and Password in request header
If authentication suceeds, a valid 7d expiry JWT will be provided in response body

### Register New User
##### POST &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; /api/users <br>
Must supply Firstname, Lastname, Email, and Password in request body <br>
If successful, a valid 7d expiry JWT will be provided in response body <br>

### Get All Nootropics
##### GET &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; /api/nootropics <br>
This endpoint retrieves all nootropics from the system <br>

### Get All Stacks
##### GET &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; /api/stacks <br>
This endpoint retrieves all public stacks from the system <br>

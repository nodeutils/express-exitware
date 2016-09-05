# Express Exitware

Allows a standardised exit from controllers so you can standardise behaviour across your application, with access to req, res and next.

Includes by default:
```
res.ok(someResponse); //For a 200 response with a body
res.ok(someObject, true) //for a 200 JSON response
res.badRequest(responseText); //for a 400 response
res.forbidden(responseText); //for a 403 response
res.notFound(responseText); //for a 404 response
res.serverError(responseText); //for a 500 response
```

## Installation

Install the package via `npm`:

```
$ npm install express-exitware
```

## Usage

Declare either basic exitware, or with a path to more exitware:
```
var exitware = require("express-exitware");
app.use(exitware());
//or
app.use(exitware("./pathToMyExitwares");
```

## Adding Exitware

Adding exitware is very simple, just create a folder and name your files based on the response you want. 

Example: 

You want to standardise your response for bad parameters and also log any bad parameters server side for future debugging.
You make a folder called `responses` and inside it you create a file called badParameters.js (or a folder called badParameters containing an index.js).

The file might look like:
```
module.exports = function(error){
    var log = require("winston"); //Your error logger of choice
    var sentParameters = this.req.params; //Any parameters sent you can get form the req object.
    var sentBody = this.req.body;
    error.sentParameters = sentParameters; //Add the extra information to your error object you're logging
    error.sentBody = sentBody; //As above
    var messageToSend = error.message; //Get the message from the error message you passed in
    log.error(error); //log the error for future debugging
    this.res.status(400).send(messageToSend); //Send the message as a 400 response 
};
```

You attach exitware to your application as described at the top
```
var exitware = require("express-exitware");
app.use(exitware("./pathToMyExitwares");
```

Then it's bound to res, so from ANY controller when you get a bad parameter or input you can report it to the user and log it with ease:
```
app.get("/item/:itemName", function(req, res){
    if(!req.params.itemName){
        var myError = new Error("Missing itemName");
        return res.badParameters(myError);
    }
    if(!req.body.hasOwnProperty.somethingRequired){
        var myError = new Error("Missing somethingRequired");
        myError.someMeta = {hah:"meh"};
        return res.badParameters(myError);
    };
    // All OK, do your code below... 
    
});
``` 


## Further Examples
Check out the examples folder on GitHub
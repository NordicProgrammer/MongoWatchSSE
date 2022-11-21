# MongoWatchSSE
A simple way to enable realtime HTML applications, using Express.JS, Server-Sent-Events and MongoDB Watch Streams.
MongoWatchSSE provides a Express.JS Get handler for easy integration. 
## NPM Package Dependencies
- [mongodb-legacy](https://www.npmjs.com/package/mongodb-legacy)
- [express](https://www.npmjs.com/package/express)
# Setup
To setup, just create a instance of MongoWatchSSE, then pass the ```stream.routerHandler``` to the `router.get()` callback.
## Example
```javascript
var express = require('express');
var router = express.Router();
var MongoWatchSSE = require("MongoWatchSSE")
var stream = new MongoWatchSSE({mongoDBCS: "mongodb://0.0.0.0:27017", collection: "test", db:"test"})
router.get('/events', stream.routerHandler);
module.exports = router;
```

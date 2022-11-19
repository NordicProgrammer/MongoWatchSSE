const { AggregationCursor } = require('mongodb-legacy');

var MongoClient = require('mongodb-legacy').MongoClient;
class MongoWatchSSE {
    /**
     * 
     * @param {Object} parameters
     * @param {string} parameters.mongoDBCS The MongoDB connection string. The MongoDB must be a replica set!
     * @param {string} parameters.collection The MongoDB collection name to be watched.
     * @param {string} parameters.db The name of the MongoDB database.
     * @param {Object} parameters.options Options for MongoWatchSSE.
     * @param {Object[]} parameters.options.pipeline The MongoDB Watch Stream pipeline. Optional, if not inputed, all documents will be watched.

     */
    constructor(parameters) {
        this.listOfReqOpts = ["mongoDBCS", "collection", "db"]
        for (const key in parameters) {
            if (this.listOfReqOpts.includes(key)) {
                this.listOfReqOpts.splice(this.listOfReqOpts.indexOf(key), 1)
            } else {
                continue;
            }
        }
        if (this.listOfReqOpts.length != 0) {
            throw "Required parameter's not included in parameter JSON"
        }
        if ("options" in parameters) {
            this.options = parameters.options;
        } else {
            this.options = {};

        }
        this.mongoDBCS = parameters.mongoDBCS;
        this.collection = parameters.collection;
        this.db = parameters.db
        Object.getOwnPropertyNames(MongoWatchSSE.prototype).forEach((key) => {
            if (key !== 'constructor') {
                this[key] = this[key].bind(this);
            }
        });
    }
    /**
     * The handler for the Express.JS router. Pass this where the callback function is.
     * 
     */
    routerHandler(req, res, next) {
        const headers = {
            'Content-Type': 'text/event-stream',
            'Connection': 'keep-alive',
            'Cache-Control': 'no-cache'
        };
        res.writeHead(200, headers);
        res.write('retry: 5000\n\n');
        var dbName = this.db
        var collection = this.collection
        var options = this.options
        MongoClient.connect(this.mongoDBCS, function (err, db) {
            if (err) throw err;
            var dbo = db.db(dbName);
            var changeStream;
            if ("pipeline" in options) {
                changeStream = dbo.collection(collection).watch(options.pipeline, {
                    "fullDocument": "updateLookup"
                });

            } else {
                changeStream = dbo.collection(collection).watch();
            }
            changeStream.on("change", next => {
                res.write(`data: ${JSON.stringify(next)}\n\n`)
            });
            res.on("close", function () {
                changeStream.close()
                db.close()
                res.end()
            })

        });
    }
}
module.exports = MongoWatchSSE;
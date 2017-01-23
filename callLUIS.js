module.exports = function() {   
var request = require('request');

recognizeThis = function (utterance, modelUrl, callback) {
        try {
            var uri = modelUrl.trim();
            if (uri.lastIndexOf('&q=') != uri.length - 3) {
                uri += '&q=';
            }
            uri += encodeURIComponent(utterance || '');
            request.get(uri, function (err, res, body) {
                var result;
                try {
                    if (!err) {
                        result = JSON.parse(body);
                        result.intents = result.intents || [];
                        result.entities = result.entities || [];
                        if (result.intents.length == 1 && typeof result.intents[0].score !== 'number') {
                            result.intents[0].score = 1.0;
                        }
                    }
                }
                catch (e) {
                    err = e;
                }
                try {
                    if (!err) {
                        callback(null, result.topScoringIntent, result.entities);
                    }
                    else {
                        callback(err instanceof Error ? err : new Error(err.toString()));
                    }
                }
                catch (e) {
                    console.error(e.toString());
                }
            });
        }
        catch (err) {
            callback(err instanceof Error ? err : new Error(err.toString()));
        }
    };
}

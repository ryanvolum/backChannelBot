require('./connectorSetup.js')();
require('./callLUIS.js')();

const modelUrl = "https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/9a9b25d8-4cb1-4caf-949b-dadcba63922e?subscription-key=1f4ea5b6343241678394dc5f47bfed30";
// Entry point of the bot
bot.dialog('/', [
    function (session) {
        var msg = session.message.text;
        recognizeThis(msg, modelUrl, function (err, results, entities) {
            var s = "";
            if (results && results.intent && results.intent != "None") {
                session.beginDialog("/" + results.intent, { entities });
            } else {
                session.send("Really not sure what you're going for there, champ.");
            }
        })
    }
]);

bot.dialog('/changeBackground', [
    function (session, args) {
        if (args && args.entities && args.entities[0]){
            /*
            var msg = {
                "type": "event",
                "text": "You wanted to change the background to " + args.entities[0].entity,
                "from": {
                    "id": session.message.address.bot.id,
                    "name": "Bot"
                },
                "recipient": {
                    "id": session.message.user.id
                },
                "channelId": session.message.address.bot.channelId,
                "conversation": {
                    "id": session.message.address.conversation.id
                }
            }
            */
        }
        session.endDialog("You wanted to change your background to " + args.entities[0].entity);
    }
]);

bot.dialog('/error', [
    function (session) {
        var msg = "Seems I slipped up - sorry!";
        session.send(msg);
        global.restartDialog(session, '/promptButtons');
    }
]);

bot.dialog('/socialMedia', [
    function (session) {
        var msg = "Tweet about the event at https://twitter.com/AIWorldExpo !"
        session.send(msg);
        global.restartDialog(session, '/promptButtons');

    }
]);

bot.dialog('/promptButtons', [
    function (session) {
        var choices = [
            "Schedule Explorer",
            "Sponsors/Expos",
            "Speaker Search",
            "Social Media"]

        if (session.message.source === "skype") {
            builder.Prompts.choice(session, "How would you like to explore AI World?", choices, { listStyle: builder.ListStyle.button });
        } else {
            builder.Prompts.choice(session, "How would you like to explore AI World?", choices);
        }
    },
    function (session, results) {
        if (results.response) {
            session.privateConversationData.clickingButtons = true;
            var selection = results.response.entity;
            // route to corresponding dialogs
            switch (selection) {
                case "Schedule Explorer":
                    session.replaceDialog('/sessions');
                    break;
                case "Speaker Search":
                    session.replaceDialog('/people');
                    break;
                case "Sponsors/Expos":
                    session.replaceDialog('/sponsors');
                    break;
                case "Social Media":
                    session.replaceDialog('/socialMedia');
                    break;
                default:
                    restart(session);
                    break;
            }
        }
    }
]);



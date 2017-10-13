const request = require('request')
const apiaiApp = require('apiai')("820fabf8d8574d13ac6cb89dd3db33d7");
const token = "EAACYfc2K7rcBAFERnp7T3eZAcCGDTMD0iDCGj818wWzhc6BuBCQhVyOVStyDFA9EECh5wFHuOZAmNrsPdOq0hS5Qn8IjZABGX0EUV3tLkeMICd6HxJmPL1x2Kj4WOZB482TYmjNJbJfnSDtMxExeo4k9RTwe8k0NuohDzixjdgZDZD"
exports.validate = function(req, res){
    if (req.query['hub.mode'] === 'subscribe' && req.query['hub.verify_token'] === "T@nm0yMitr@") {
        console.log("Validating webhook");
        res.status(200).send(req.query['hub.challenge']);
    } else {
        console.error("Failed validation. Make sure the validation tokens match.");
        res.sendStatus(403);          
    }
};


exports.sendMessage = function(req, res){
    var data = req.body;
    // Make sure this is a page subscription
    if (data.object === 'page') {
      //console.log(data);
      // Iterate over each entry - there may be multiple if batched
      data.entry.forEach(function(entry) {
        var pageID = entry.id;
        var timeOfEvent = entry.time;
        // Iterate over each messaging event
        entry.messaging.forEach(function(event) {
          if (event.message) {
            receivedMessage(event);
          } 
        });
      });
      res.sendStatus(200);
    }
};

function receivedMessage(event) {
    var senderID = event.sender.id;
    var recipientID = event.recipient.id;
    var recipientName = event.recipient.name;
    var timeOfMessage = event.timestamp;
    var message = event.message;
    var messageId = message.mid;
  
    var messageText = message.text;
    var messageAttachments = message.attachments;
    if (messageText) {
        sendTextMessage(senderID, messageText);
    }
}
function sendTextMessage(recipientId, messageText) {
    //console.log("sendTextMessage");
    let apiai = apiaiApp.textRequest(messageText, {
        sessionId: 'tabby_cat' // use any arbitrary id
    });
    apiai.on('response', (response) => {
    // Got a response from api.ai. Let's POST to Facebook Messenger
        let aiText = response.result.fulfillment.speech;
        request({
            uri: 'https://graph.facebook.com/v2.6/'+recipientId,
            qs: { fields:'first_name,last_name', access_token: token },
            method: 'GET'
          }, function (error, response, body) {
              console.log(body);
            if (!error && response.statusCode == 200) {
                var first_name = JSON.parse(body).first_name;
                var Last_name = JSON.parse(body).last_name;
                var messageData = {
                    recipient: {
                      id: recipientId
                    },
                    message: {
                      text: aiText 
                    }
                };
                callSendAPI(messageData);
            }
        }); 
    });

    apiai.on('error', (error) => {
        console.log(error);
    });

    apiai.end();
}
function callSendAPI(messageData) {
    request({
      uri: 'https://graph.facebook.com/v2.6/me/messages',
      qs: { access_token: token },
      method: 'POST',
      json: messageData
  
    }, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        var recipientId = body.recipient_id;
        var messageId = body.message_id;
      } else {
        console.error("Unable to send message.");
      }
    });  
}
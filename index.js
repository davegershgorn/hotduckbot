// Require modules here
var Twitter = require('twitter');
var config = require('./config.js');
const fs = require('fs');
const AWS = require('aws-sdk');
const s3 = new AWS.S3();

// Include global variables here (if any)
var T = new Twitter(config);

var s3_params = {
          ACL: 'public-read',
          Bucket: "hotduck.today",
          Key: "index.html",
          ContentType: "text/html; charset=utf-8",
          //set s3_params.Body as the answer/data
      };

// Set up your search parameters
var params = {
  screen_name: 'birdcentralpark',
  count: 4,
  lang: 'en'
}
var send_back = "OK";

exports.handler = function(event, context, callback){
      if (event.command == 'check') {

        T.get('statuses/user_timeline', params, function(err, data, response) {
          if(data[0].text.toLowerCase().includes("mandarin duck") &&
          data[0].text.toLowerCase().includes("central park pond")){
            s3_params.Body = getPage("YES");
            s3.putObject(s3_params, function(s3_err, s3_response) {
                if (s3_err) {
                    console.log("S3 error: " + s3_err);

                    // format is callback(error, response);
                    callback(null, "Error")
                  }
                 else {
                    console.log("Successfully uploaded data");

                    // format is callback(error, response);
                    console.log('duck saved!');
                    callback(null, send_back);
                        }
                      });
                    }
          else if(data[0].text.toLowerCase().includes("mandarin duck") &&
            data[0].text.toLowerCase().includes(" no " || " not ")) {
              s3_params.Body = getPage("NO");
              s3.putObject(s3_params, function(s3_err, s3_response) {
                  if (s3_err) {
                      console.log("S3 error: " + s3_err);

                      // format is callback(error, response);
                      callback(null, "Error");
                      return

                      console.log("Successfully uploaded data");

                      // format is callback(error, response);
                      console.log('duck is gone!');
                      callback(null, send_back);
                        }
                    });
                  }
          else {
                console.log('regular bird alert');
                callback(null, send_back);
                        }
                      });
                    }
      else if (event.command == 'setYes') {
        s3_params.Body = getPage("YES");
        s3.putObject(s3_params, function(s3_err, s3_response) {
            if (s3_err) {
                console.log("S3 error: " + s3_err);

                // format is callback(error, response);
                callback(null, "Error")
              }
             else {
                console.log("Successfully uploaded data");

                // format is callback(error, response);
                console.log('duck saved!');
                callback(null, send_back);
                    }
                  });
      }

      else {
        s3_params.Body = getPage("NO");
        s3.putObject(s3_params, function(s3_err, s3_response) {
            if (s3_err) {
                console.log("S3 error: " + s3_err);

                // format is callback(error, response);
                callback(null, "Error");
                return
              }
                console.log("Successfully uploaded data");

                // format is callback(error, response);
                console.log("it's a new day!");
                callback(null, send_back);
                  });
              }


      }
    // funtional code goes here ... with the 'event' and 'context' coming from
    // whatever calls the lambda function (like CloudWatch or Alexa function).
    // callback function goes back to the caller.

    // format is callback(error, response);
function getPage (YESORNO){

var page = `<!DOCTYPE html>
<html>

<h2>
  <center>
  was the hot duck spotted in central park today?
</center>
</h2>

<div style="font-size:800%;">
  <center>
${YESORNO}
  </center>
</div>

<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>
<center> <a class="twitter-timeline" data-width="400" href="https://twitter.com/BirdCentralPark?ref_src=twsrc%5Etfw">Tweets by BirdCentralPark</a> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script></center>
`;
return page;
}

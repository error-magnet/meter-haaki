/**
 * Info.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

var uber_api = 'https://api.uber.com/v1.2/estimates/price';
var os = require('os');

module.exports = {
  
    uber_data: function (from, to, callback){
      var request = require("request");
      var server_token = process.env.UBER_SERVER_TOKEN;
      var options = {
        method: 'GET',
        uri: uber_api+'?start_latitude='+from['lat']+
                '&'+'start_longitude='+from['lng']+
                '&'+'end_latitude='+to['lat']+
                '&'+'end_longitude='+to['lng'],
        headers: {
          'Authorization': 'Token '+server_token,
          'content-type': 'application/json'
        }
      }

      request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var prices = JSON.parse(body).prices;
            var uberInfo = [];
            for(var i=0; i<2; i++){
                uberInfo.push(
                    {
                        name: prices[i].display_name,
                        distance: prices[i].distance,
                        duration: prices[i].duration,
                        estimate: prices[i].estimate,
                        low_estimate: prices[i].low_estimate
                    });
            }
            
            callback(uberInfo);
        }
      });
      
      

    },

    

    place_search: function (locationString, callback){
      var place_api = 'https://maps.googleapis.com/maps/api/place/textsearch/json';
      var request = require("request");
      var google_key = process.env.GOOGLE_API_KEY;
      var options = {
        method: 'GET',
        uri: place_api+'?key='+google_key+'&query='+locationString
            +'&location=12.978438,77.591479'
      }

      request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var location = JSON.parse(body).results[0].geometry.location;
            callback(location);
        }
      });
    },

    google_distance: function(start, end, callback){
      var place_api = 'https://maps.googleapis.com/maps/api/distancematrix/json';
      var request = require("request");
      var google_key = process.env.GOOGLE_API_KEY;;
      var options = {
        method: 'GET',
        uri: place_api+'?key='+google_key+'&origins='+ start['lat']+','+start['lng']+
          '&destinations='+ end['lat']+','+end['lng']
      }

      request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var distance = JSON.parse(body).rows[0].elements[0];
            callback(distance);
        }
      });

    }

};


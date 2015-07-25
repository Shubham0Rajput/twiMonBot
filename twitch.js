/**
 * Created by anton on 19.07.15.
 */
var utils = require('./utils');
var apiNormalization = function(data) {
  "use strict";
  if (!data || !Array.isArray(data.streams)) {
    console.error('Twitch bad response!');
    return;
  }
  var now = parseInt(Date.now() / 1000);
  var streams = [];
  var origStreams = data && data.streams || [];
  for (var i = 0, origItem; origItem = origStreams[i]; i++) {
    if (!origItem.channel || !origItem.channel.name) {
      console.error('Twitch channel without name!');
      continue;
    }
    var item = {
      _service: 'twitch',
      _addItemTime: now,
      _id: origItem._id,
      _isOffline: false,
      _channelName: origItem.channel.name.toLowerCase(),

      game: origItem.game,
      preview: origItem.preview && origItem.preview.large,
      created_at: origItem.created_at,
      channel: {
        display_name: origItem.channel.display_name,
        name: origItem.channel.name,
        status: origItem.channel.status,
        logo: origItem.channel.logo,
        url: origItem.channel.url
      }
    };
    streams.push(item);
  }
  return streams;
};
var getTwitchStreamList = function(channelList, cb) {
  var params = {};
  params.channel = channelList.join(',');
  utils.ajax({
    url: 'https://api.twitch.tv/kraken/streams?' + utils.param(params),
    dataType: 'json',
    success: function(data) {
      cb(apiNormalization(data));
    },
    error: function(responseText) {
      console.error('Twitch check request error!', responseText);
      cb();
    }
  });
};
module.exports = getTwitchStreamList;
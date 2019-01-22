/* jshint ignore:start */
import fbinstant as fbinstant;
/* jshint ignore:end */

exports = (function() {
  var obj = {};

  obj.logEvent = function (event_name, value, params) {
    fbinstant.logEvent(event_name, value, params);
  };

  obj.firstLaunch = function (params) {
    this.logEvent('first_launch', null, {
      app_version: params.app_version
    });
  };
  
  obj.screenLoaded = function (params) {
    this.logEvent('screen_loaded', null, {
      screen_id: params.screen
    });
  };

  obj.logHighestMerge = function (params) {
    this.logEvent('merge_achieved', params.value, null);
  };

  obj.gameOver = function (params) {
    this.logEvent('game_over', null, {
      session_highest_merge: params.highest_merge,
      score: params.score
    });
  }

  return obj;
})();
/* jshint ignore:start */
import fbinstant as fbinstant;
/* jshint ignore:end */

exports = (function() {
  var obj = {};

  obj.prompt = function () {
    fbinstant.getDataAsync(['shortcut_created'])
      .then(function (data) {
        if (!data['shortcut_created']) {
          return fbinstant.canCreateShortcutAsync();
        }
      })
      .then(function () {
        fbinstant.createShortcutAsync(function (status) {
          if (status === 'success') {
            fbinstant.setDataAsync({
              shortcut_created: true
            })
          }
        });
      });
  };

  return obj;
})();
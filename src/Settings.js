/* jshint ignore:start */
import ui.View as View;
import src.gc.ButtonView as ButtonView;
import util.underscore as _;

import src.Storage as Storage;
import src.Utils as Utils;
/* jshint ignore:end */

exports = Class(View, function(supr) {

  this.init = function(opts) {
    supr(this, 'init', [opts]);
  };

  this.setTheme = function(theme) {
    var toast = this.toast;

    Utils.setTheme(theme);
    Storage.setTheme(theme);
    GC.app.refresh();
  };
});

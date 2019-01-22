/* jshint ignore:start */
import ui.View as View;
import ui.ImageView as ImageView;
import ui.resource.Image as Image;
import src.gc.ButtonView as ButtonView;
import util.underscore as _;

import src.Storage as Storage;
import src.Utils as Utils;
/* jshint ignore:end */

exports = Class(View, function(supr) {

  this.init = function(opts) {
    merge(opts, {
      layout: 'linear',
      direction: 'vertical',
      justifyContent: 'space-outside'
    });
    supr(this, 'init', [opts]);
  };
});

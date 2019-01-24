/* jshint ignore:start */
import ui.View as View;
import ui.ImageView as ImageView;
import ui.resource.Image as Image;
import src.gc.ButtonView as ButtonView;
import util.underscore as _;
import ui.TextView as TextView;
import ui.ImageScaleView as ImageScaleView;
import src.LeaderboardPopup as LeaderboardPopup;

import src.Storage as Storage;
import src.Utils as Utils;
/* jshint ignore:end */

exports = Class(View, function(supr) {

  this.init = function() {

  	supr(this, 'init');
  	return this;    
  };

  this.build = function(parent) {

    var parent_view = parent,
      img_popup = Utils.getImage("menu/popup_bg", true),
      img_friend_icon = Utils.getImage("menu/friends-icon",true),
      img_friend_leaderboard = Utils.getImage("menu/leaderboards-icon", true),
      img_close = Utils.getImage("menu/close_btn",true);

      this.overlay = new ImageScaleView({
        superview: parent,
        image: img_popup,
        layout: 'box',
        zIndex: 1,
        inLayout: false,
        centerX: true,
        centerY: true,
        scaleMethod: '9slice',
        sourceSlices: {
         horizontal: {
          left: 30,
          center: 6,
          right: 30
         },
         vertical: {
          top: 50,
          middle: 36,
          bottom: 40
          }
        },
        destSlices: {
         horizontal: {
          left: 30,
          center: 6,
          right: 30
         },
         vertical: {
          top: 100,
          middle: 36,
          bottom: 40
          }
        }, 
        width: 700,
        height: 500,
      })

      this.view = new View({
        superview: this.overlay,
        layout: 'linear',
        direction: 'vertical'
      })

      this.head = new View({
        superview: this.view,
        layout: 'linear',
        direction: 'horizontal',
        order: 0,
        height: 100
      })


      this.title = new TextView({
        superview: this.head,
        text: "Menu",
        layout: "box",
        zIndex: 1,
        height: 100,
        width: 600,
        left: 50,
        centerX: true,
        size: 50,
        color: "#fff",
      })

      this.close_btn = new ButtonView({
        superview:  this.head,
        images: {
          up: img_close
        },
        layout: "box",
        width: img_close.getWidth(),
        height: img_close.getHeight(),
        inLayout: false,
        right: 20,
        top: 20,
        zIndex: 1,
        on: {
          up: bind(this, this.close)
        }
      })

      this.container = new View({
        superview: this.view,
        layout: 'linear',
        direction: 'vertical',
        order: 1,
        top: 40
      })

      this.play_friends = new View ({
        superview:  this.container,
        layout: "linear",
        direction: "horizontal",
        height: 150,
        left: 20,

      })

      this.friend_icon = new ImageView({
        superview:  this.play_friends,
        image: img_friend_icon,
        width: 100,
        height: 100,
        x: 0,
        y: 0
      })

      this.friend_play = new TextView({
        superview:  this.play_friends,
        text: "Play with Friends",
        layout: "box",
        zIndex: 1,
        height: 100,
        left: -60,
        size: 50,
        color: "#bbbbbb"
      })

      this.leaderboard = new View ({
        superview:  this.container,
        layout: "linear",
        direction: "horizontal",
        height: 150,
        top: 40,
        left: 20,

      })

      this.leaderboard_icon = new ImageView({
        superview:  this.leaderboard,
        image: img_friend_leaderboard,
        width: 100,
        height: 100,
        x: 0,
        y: 0
      })

      this.leaderboard_show = new TextView({
        superview:  this.leaderboard,
        text: "Leaderboards",
        layout: "box",
        zIndex: 1,
        height: 100,
        left: -60,
        size: 50,
        color: "#bbbbbb"
      })

      this.friend_play.on('InputSelect', function (event, point) {
        console.log("clicked friends")
        FBInstant.shareAsync({
            intent: 'REQUEST',
            image: "https://s3.amazonaws.com/hashcube/images/2048/img_invite",
            text: 'Hey I\'m playing 2048',
            data: { myReplayData: '...' },
          })
      });

      this.leaderboard.on('InputSelect',function (event, point) {
        this.close;
        var leaderboard_pops = new LeaderboardPopup();
        leaderboard_pops.build(parent_view)

      });
  }

  this.close = function () {
    this.overlay.hide();
    this.overlay.removeAllSubviews();
    this.emit("menu-closed");
  }

});
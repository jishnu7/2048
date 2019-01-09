/* jshint ignore:start */
import device;
import ui.TextView as TextView;
import ui.GestureView as GestureView;
import AudioManager;
import event.Callback as Callback;
import util.underscore as _;

import src.Utils as Utils;
import src.History as History;
import src.Storage as Storage;

import src.Grid as Grid;
import src.Score as Score;
import src.Menu as Menu;
import src.Tutorial as Tutorial;
/* jshint ignore:end */

exports = Class(GC.Application, function () {
  this.initUI = function () {
    var size = this.scaleUI();

    this.view.updateOpts({
      width: size.width,
      height: size.height
    });
    this.refresh();
    this._refresh = [];

    var audio = new AudioManager({
      path: 'resources/audio/',
      files: {
        merge: {
          volume: 10
        },
        swipe: {
          volume: 100
        }
      }
    });

    if(localStorage.getItem('mute') === 'true') {
      audio.setMuted(true);
    }

    // Entire puzzle screen accepts swipe actions.
    var game = new GestureView({
      layout: 'linear',
      direction: 'vertical',
      justifyContent: 'center',
      width: size.width,
      height: size.height,
      swipeMagnitude: 50,
      swipeTime: 1000
    });

    var score = new Score({
      superview: game,
      width: size.width
    });
    this._refresh.push(score);

    var grid = new Grid({
      superview: game,
      baseWidth: size.width,
      score: score
    });
    this._refresh.push(grid);

    var tutorial = new Tutorial({
      superview: game,
      width: size.width
    });
    this._refresh.push(tutorial);

    var gameInit = function() {
      grid.initCells(bind(game, game.setHandleEvents, true));
      tutorial.start();
    };

    grid.on('updateScore', function() {
      audio.play('merge');
    });

    grid.on('Over', function() {
      game.setHandleEvents(false);
    });

    grid.on('Restart', function() {
      gameInit();
      var evnt = {};
      evnt[grid.mode] = true;
    });

    var busy = false;
    game.on('Swipe', bind(this, function(angle, direction) {
      if(!busy) {
        busy = true;
        audio.play('swipe');
        var callback = new Callback();
        callback.run(function(newCell) {
          busy = false;
          // add a new cell only if a move is made.
          newCell && grid.addRandomCell();
          if(newCell || grid.mode === 'time') {
            tutorial.swipe();
          }
        });
        grid.moveCells(direction, callback);
      }
    }));

    var menu = new Menu({
      width: size.width,
      height: size.height
    });

    menu.on('continue', bind(this.view, function() {
      gameInit();
      this.push(game);
    }));

    var newGame = bind(this, function(mode) {
      grid.setMode(mode);
      Storage.deleteGame();
      tutorial.reset();
      menu.emit('continue');
      var evnt = {};
      evnt[mode] = true;
    });
    newGame('classic');
  };

  this.launchUI = function () {
    device.setBackButtonHandler(History.release);
  };

  // Function to scale the UI.
  this.scaleUI = function() {
    var boundsWidth = 768,
      //boundsHeight = 1024,
      deviceWidth = device.screen.width,
      deviceHeight = device.screen.height,
      baseHeight, baseWidth,
      scale;

    // Portrait mode
    baseWidth = boundsWidth;
    baseHeight = deviceHeight *
                      (boundsWidth / deviceWidth);
    scale = deviceWidth / baseWidth;
    this.view.style.scale = scale;
    this.tabletScale = device.isTablet ? 0.8 : 1;
    return { width: baseWidth, height: baseHeight };
  };

  this.refresh = function () {
    this.view.updateOpts({
      backgroundColor: Utils.theme.background
    });

    _.each(this._refresh, function (view) {
      view.refresh && view.refresh();
    });
  };
});

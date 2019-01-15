/* jshint ignore:start */
import src.modules.facebook_event as facebook_event;
import fbinstant as fbinstant;
/* jshint ignore:end */

exports = (function() {
  var prevGameID = 'prev_game',
    statsID = 'stats_tile',
    statsGame = 'stats_game',
    tutorialID = 'tutorial',
    themeID = 'theme',
    saveData = function(id, data, notJSON) {
      if(!notJSON) {
        data = JSON.stringify(data);
      }
      localStorage.setItem(id, data);
    },
    getData = function(id, notJSON) {
      var data = localStorage.getItem(id);
      if(!notJSON) {
        data = JSON.parse(data);
      }
      return data;
    };

  return {
    // Function to save the game to local storage
    saveGame: function(game) {
      var cells = [],
        score = game.score;
      score.saveHighScore();
      game.eachCell(function(row, col, cell) {
        if(cell) {
          cells.push({row: row, col: col, value: cell.getValue()});
        }
      });
      saveData(prevGameID, {
        cells: cells,
        mode: game.mode,
        score: score.score,
        highestTile: score.highestTile,
        timer: score.timer,
        speed: game.timer.get()
      });
    },

    getGame: function() {
      return getData(prevGameID);
    },

    deleteGame: function() {
      localStorage.removeItem(prevGameID);
    },

    getTileStats: function() {
      return getData(statsID) || {};
    },

    saveTileStats: function(tile) {
      if(tile < 8) {
        return;
      }
      var data = this.getTileStats(tile),
        highest_merge;
      if(!data[tile]) {
        data[tile] = 1;
        fbinstant.getDataAsync(['highest_merge'])
        .then(function (data) {
          highest_merge = data['highest_merge'];
          if (!highest_merge || highest_merge < tile) {
            fbinstant.setDataAsync({
              highest_merge: tile
            });
            facebook_event.logHighestMerge({
              value: tile
            });
          }
        });
      } else {
        ++data[tile];
      }
      saveData(statsID, data);
    },

    getGameStats: function() {
      return getData(statsGame) || [];
    },

    saveGameStats: function(game) {
      var data = this.getGameStats(),
        score = game.score.score,
        highestTile = game.score.highestTile;
      data.push({
        mode: game.mode,
        score: score,
        time: score.timer,
        highestTile: highestTile,
      });

      facebook_event.gameOver({
        highest_merge: highestTile,
        score: score
      });

      saveData(statsGame, data);
    },

    isTutorialCompleted: function() {
      return getData(tutorialID, true) === 'true';
    },

    setTutorialCompleted: function() {
      saveData(tutorialID, true);
    },

    resetTutorial: function() {
      localStorage.removeItem(tutorialID);
    },

    getTheme: function() {
      return getData(themeID, true) || 'default';
    },

    setTheme: function(theme) {
      saveData(themeID, theme, true);
    }
  };
})();

'use strict';

app.controller('GameCtrl', function ($rootScope, $scope, $interval, Api, Socket, Sound, ngDialog, $location) {
  var isDialogOpened = false;
  var minute = 1000 * 60;
  var previousTimedEventTime = null;
  $scope.users = {};
  $scope.game = {};
  $scope.selectedPlayer = {};
  $scope.selectedPosition = 0;
  $scope.currentSound = null;
  $scope.currentMusic = null;
  $scope.playAudio = false;
  $scope.gameTimer = undefined;

  $scope.queues = [{attack: {}, defend: {}}, {attack: {}, defend: {}}, {attack: {}, defend: {}}];

  $scope.getGame = function() {
    Api.getGames().game(function(game){
      $scope.game = game;
      startGameTimer();
      $scope.playAudio = $scope.currentUser.play_sound;
    });
      Api.getGames().getQueue(function (queue) {
          $scope.queues = queue;
      });
  };

    function selectUser(players, position, selectedPlayer) {
        players[position] = selectedPlayer;
        Sound.playerSelectionSound(selectedPlayer, function(audio){
            changeCurrentSound(audio);
        });
        Api.getGames().update($scope.game, function (game) {
        });
    }

    function removeUserFromCurrentSelectedPosition() {
        var player;
        for (var i = 0; i < $scope.game.team_white.players.length; i++) {
            player = $scope.game.team_white.players[i];
            if (player != null && player.username === $scope.currentUser.username) {
              return $scope.game.team_white.players[i] = null;
            }
        }
        for (i = 0; i < $scope.game.team_blue.players.length; i++) {
            player = $scope.game.team_blue.players[i];
            if (player != null && player.username === $scope.currentUser.username) {
              return $scope.game.team_blue.players[i] = null;
            }
        }
    }

  $scope.getPlayers = function(){
    var white_players = $scope.game.team_white.players;
    var blue_players = $scope.game.team_blue.players;
    Api.getUsers().query(function(players){
      $scope.players = players
          .filter(function (el) {
            var inWhiteTeam = $.grep(white_players, function(e){ return e ? e._id == el._id : false; });
            var inBlueTeam = $.grep(blue_players, function(e){ return e ? e._id == el._id : false; });
            return !inWhiteTeam.length && !inBlueTeam.length;
          });
    });
  };

    $scope.openListPlayers = function (team, position) {
        if ($scope.game.game_status == "NEW"  && !isDialogOpened) {
            if ($scope.currentUser.username === 'admin') {
                $scope.selectedPosition = position;
                var confirm = ngDialog.openConfirm({
                    template: 'views/partials/dialogs/listPlayers.html',
                    className: 'ngdialog-theme-plain',
                    scope: $scope,
                    showClose: false,
                    closeByDocument: true
                });
                confirm.then(function (selectedPlayer) {
                    var players = team === "white" ?  $scope.game.team_white.players : $scope.game.team_blue.players;
                  removeUserFromQueueSelectedPosition(selectedPlayer);
                    selectUser(players, $scope.selectedPosition, selectedPlayer);
                });
            } else {
                var players = team === "white" ?  $scope.game.team_white.players : $scope.game.team_blue.players;
                if (players[position] == undefined || players[position] == null)
                {
                    removeUserFromCurrentSelectedPosition();
                  removeUserFromQueueSelectedPosition();
                    selectUser(players, position, $scope.currentUser);
                } else if (players[position].username === $scope.currentUser.username)
                {
                    players[position] = null;
                }
            }
        }
    };

  $rootScope.$on('ngDialog.opened', function () {
    isDialogOpened = true;
  });

  $rootScope.$on('ngDialog.closed', function () {
    isDialogOpened = false;
  });


  Socket.on('user:new', function () {
      $scope.getUsers();
  });

  $scope.canStart = function () {
    if ($scope.game.team_white && $scope.game.team_blue && $scope.currentUser) {
      var countOfWhitePlayers = angular.copy($scope.game.team_white.players).filter(function (x) {
        return x != null
      }).length;
      var countOfBluePlayers = angular.copy($scope.game.team_blue.players).filter(function (x) {
        return x != null
      }).length;
      return countOfWhitePlayers + countOfBluePlayers == 4 && canCurrentUserModifyGame();
    }
    return false;
  };

    $scope.canCancel = function () {
        var result = false;
        if ($scope.game.game_status == "IN_PROGRESS" && $scope.currentUser) {
            result = canCurrentUserModifyGame();
        }
        return result;
    };

    function canCurrentUserModifyGame() {
        var result = false;
        if ( $scope.currentUser.username === 'admin'){
            result = true;
        }
        else {
            for (var i = 0; i < $scope.game.team_white.players.length; i++) {
                var whitePlayer = $scope.game.team_white.players[i];
                var bluePlayer = $scope.game.team_blue.players[i];
                if (whitePlayer.username === $scope.currentUser.username || bluePlayer.username === $scope.currentUser.username) {
                    result = true;
                }
            }
        }
        return result;
    }

  $scope.start = function() {
    $scope.game.game_type = "TEAM";
    Api.getGames().start($scope.game, function(){}) ;
  };

  $scope.stop = function () {
    stopGameTimer();
    stopCurrentMusic();
    stopCurrentSound();
    Api.getGames().stop($scope.game, function () {
      $location.path('players');
    });
  };

  $scope.toTimestamp = function(date) {
    return new Date(date).getTime();
  };

    function startGameTimer() {
        if ($scope.game.game_status === "IN_PROGRESS" && !angular.isDefined($scope.gameTimer)) {
            $scope.gameTimer = $interval(function () {
                if (!previousTimedEventTime){
                    //console.log("Run interval function");
                    Sound.playTimedSound($scope.game, function (sound, music) {
                        if (sound){
                            changeCurrentSound(sound);
                        }
                        if (music){
                            changeCurrentMusic(music);
                        }
                        if (sound || music) {
                            previousTimedEventTime = new Date().getTime();
                        }
                    });
                } else if (new Date().getTime() - previousTimedEventTime > minute){
                    previousTimedEventTime = null;
                }
            }, 1000);
        }
    }

    function gameStartListener(game) {
    console.log(game);
    $scope.game = game;
    console.log("Start game");
    startGameTimer();
    Sound.playGameStartAudio(game, function(sound, music){
        changeCurrentSound(sound);
        changeCurrentMusic(music);
    });
  }

  function gameUpdateListener(game) {
    $scope.game = game;
      if ($scope.game.game_status == "IN_PROGRESS"){
          Sound.playGameGoalAudio(game, function(sound, music){
              changeCurrentSound(sound);
              changeCurrentMusic(music);
          });
      }
  }

    function queueUpdateListener(queues) {
        $scope.queues = queues;
    }

   function gameEndAchievementsCalculatedListener(game) {
       console.log("End achievements calculation");
      $scope.end_game = game;
      $scope.end_game.winner_players = game.team_white.score === 10 ? game.team_white.players : game.team_blue.players;
      $scope.end_game.winner_team = game.team_white.score === 10 ? "WHITE" : "BLUE";

    if (game.game_status == "FINISHED" && !isDialogOpened) {
          var confirm = ngDialog.openConfirm({
              template: 'views/partials/dialogs/winner.html',
              className: 'ngdialog-theme-plain',
              scope: $scope,
              showClose: false,
              closeByDocument: true
          });
          confirm.then(function () {
          });
      }
   }

  $scope.showQueue = function () {
    if (!isDialogOpened) {
      var confirm = ngDialog.openConfirm({
        template: 'views/partials/dialogs/queue.html',
        className: 'ngdialog-theme-plain',
        scope: $scope,
        showClose: false,
        closeByDocument: true
      });
      confirm.then(function () {
      });
    }
  };

    $scope.switchSound = function () {
        $rootScope.currentUser.play_sound = !$rootScope.currentUser.play_sound;
        $scope.playAudio = $rootScope.currentUser.play_sound;
        console.log("switch sound");
        stopCurrentMusic();
        stopCurrentSound();
        Api.getUsers().update($rootScope.currentUser, function (user) {
            $rootScope.currentUser = user;
        });
    };

  $scope.showQueuePlayerList = function (position, index) {
    if ($scope.currentUser.username === 'admin') {
      var confirm = ngDialog.openConfirm({
        template: 'views/partials/dialogs/listPlayers.html',
        className: 'ngdialog-theme-plain',
        scope: $scope,
        showClose: false,
        closeByDocument: true
      });
      confirm.then(function (selectedPlayer) {
        removeUserFromQueueSelectedPosition(selectedPlayer);
        $scope.queues[index][position] = selectedPlayer;
          Api.getGames().updateQueue($scope.queues, function (queues) {
              $scope.queues = queues;
          })
      });
    } else {
      removeUserFromCurrentSelectedPosition();
      removeUserFromQueueSelectedPosition();
      $scope.queues[index][position] = $scope.currentUser;
        Api.getGames().updateQueue($scope.queues, function (queues) {
            $scope.queues = queues;
        })
    }
  };

  function removeUserFromQueueSelectedPosition(player) {
    player = player ? player : $scope.currentUser;
    var playerAttack, playerDefend;
    for (var i = 0; i < $scope.queues.length; i++) {
      playerAttack = $scope.queues[i].attack;
      if (playerAttack != null && playerAttack.username === player.username) {
        return $scope.queues[i].attack = null;
      }
      playerDefend = $scope.queues[i].defend;
      if (playerDefend != null && playerDefend.username === player.username) {
        return $scope.queues[i].defend = null;
      }
    }
  }

    function stopGameTimer() {
        if (angular.isDefined($scope.gameTimer)) {
            console.log("Stop timer");
            $interval.cancel($scope.gameTimer);
            $scope.gameTimer = undefined;
        }
    }

    function gameEndListener(game) {
      console.log("Update game = " + game.game_status);
      stopGameTimer();
      if (game.game_status === "FINISHED") {
          Sound.playGameEndSound(game, function(sound, music){
              changeCurrentSound(sound);
              changeCurrentMusic(music);
          });
      }
  }

  function gameAchievementListener(player, achievement) {
    var white_players = $scope.game.team_white.players;
    var blue_players = $scope.game.team_blue.players;
    var inBlueTeam = $.grep(blue_players, function (e) {
      return e ? e._id == player._id : false;
    }).length;
    var achievementObject = {
      content: {
        title: "New Achievement",
        info: achievement.description,
        message: achievement.name,
        img: '../../media/' + achievement.image,
        user: player.username
      },
      theme: "user green",
      position: inBlueTeam ? 'top right' : 'top left',
      inEffect: inBlueTeam ? 'slideRight' : 'slideLeft',
      delay: 10000
    };
    $.amaran(achievementObject);
  }

    function changeCurrentSound(sound) {
        console.log("stop current sound");
        console.log("play audio = " + $scope.playAudio);
        stopCurrentSound();
        if ($scope.playAudio) {
            $scope.currentSound = sound;
            console.log($scope.currentSound);
            $scope.currentSound.volume = 1;
            console.log("play current sound = " + $scope.currentSound);
            $scope.currentSound.play();
            /*if (!$scope.currentSound.error && $scope.currentSound.canPlay) {
                console.log("Play current sound = " + $scope.currentSound.src);
                console.log($scope.currentSound);
                $scope.currentSound.volume = 1;
                $scope.currentSound.play();
            } else {
                console.log("Can't play current sound");
                console.log($scope.currentSound.error);
                console.log("can play = " + $scope.currentSound.canPlay);
            }*/
        }
    }

    function changeCurrentMusic(music) {
        stopCurrentMusic();
        if ($scope.playAudio) {
            $scope.currentMusic = music;
            $scope.currentMusic.volume = 0.3;
            $scope.currentMusic.play();
            console.log($scope.currentSound);
            /*if (!$scope.currentMusic.error && $scope.currentMusic.canPlay) {
                $scope.currentMusic.volume = 0.2;
                $scope.currentMusic.play();
            } else {
                console.log("Can't play current music, error = " + $scope.currentMusic.error);
                console.log("Can't play current music, canPlay = " + $scope.currentMusic.canPlay);
            }*/
        }
    }

  function stopCurrentSound() {
      if ($scope.currentSound != null) {
          console.log("stop current sound");
          $scope.currentSound.restart();
          /*if (!$scope.currentSound.error && $scope.currentSound.canPlay){
              console.log("stop current sound");
              $scope.currentSound.restart();
          }*/
      }
  }

    function stopCurrentMusic() {
        if ($scope.currentMusic != null) {
            console.log("stop current music");
            $scope.currentMusic.restart();
            /*if (!$scope.currentMusic.error && $scope.currentMusic.canPlay){
                console.log("stop current music");
                $scope.currentMusic.restart();
            }*/
        }
    }

  //Init socket listeners
  Socket.on('game:start', gameStartListener);
  Socket.on('game:update', gameUpdateListener);
  Socket.on('game:end', gameEndListener);
  Socket.on('game:achievement', gameAchievementListener);
  Socket.on('game:end:achievement', gameEndAchievementsCalculatedListener);
    Socket.on('queue:update', queueUpdateListener);
  //Clean up
  $scope.$on('$destroy', function () {
    Socket.removeListener('game:start', gameStartListener);
    Socket.removeListener('game:update', gameUpdateListener);
    Socket.removeListener('game:end', gameEndListener);
    Socket.removeListener('game:achievement', gameAchievementListener);
    Socket.removeListener('game:end:achievement', gameEndAchievementsCalculatedListener);
      Socket.removeListener('queue:update', queueUpdateListener);
  })
});

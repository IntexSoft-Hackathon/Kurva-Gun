'use strict';

app.factory('Sound', function ($rootScope, ngAudio) {

    var playerSelectionSounds = [
        preLoadAudio("come_here.mp3"),
        preLoadAudio("fear_me.mp3"),
        preLoadAudio("get_over_here.mp3"),
        preLoadAudio("i_will_show_no_mercy.mp3"),
        preLoadAudio("oh_yeah.mp3"),
        preLoadAudio("prepare_to_fight.mp3"),
        preLoadAudio("i'm_so_pretty.mp3"),
        preLoadAudio("damn_i'm_good.mp3"),
        preLoadAudio("come_with_me_if_you_want_to_live.mp3"),
        preLoadAudio("i'm_the_law.mp3"),
        preLoadAudio("i_have_come_here_to_chew_bubble_gum_and_kick_ass_and_I'm_all_out_of_bubble_gum.mp3"),
        preLoadAudio("i_need_your_close_your_boots_and_your_motocycle.mp3"),
        preLoadAudio("i'm_back.mp3"),
        preLoadAudio("i'm_too_old_for_this_shit.mp3"),
        preLoadAudio("too_old_for_this_shit.mp3")
    ];

    var startSounds = [
        preLoadAudio("fight.mp3"),
        preLoadAudio("play.mp3"),
        preLoadAudio("gagarin_poehali.mp3")
    ];

    var startMusic = [
        preLoadAudio("carry_on_my_wayward_son_intro.mp3"),
        preLoadAudio("coldplay_viva_la_vida_intro.mp3"),
        preLoadAudio("eye_of_a_tiger_intro.mp3"),
        preLoadAudio("kasabian_fire_cut.mp3"),
        preLoadAudio("lost_in_the_echo_intro.mp3"),
        preLoadAudio("mr_vain_recall_intro.mp3"),
        preLoadAudio("muse_dead_star_intro.mp3"),
        preLoadAudio("thousand_foot_krutch_move_cut.mp3"),
        preLoadAudio("whiskey_in_the_jar_intro.mp3"),
        preLoadAudio("you_give_love_a_bad_name_intro.mp3"),
        preLoadAudio("who_need_a_war_cut.mp3"),
        preLoadAudio("bon_jovi_it's_my_life_cut.mp3"),
        preLoadAudio("kino_gruppa_krovi_cut.mp3")
    ];

    var goalMusic = [
        preLoadAudio("mein_herz_brennt_cut.mp3"),
        preLoadAudio("new_divide_cut.mp3"),
        preLoadAudio("thousand_foot_krutch_war_of_change_cut.mp3"),
        preLoadAudio("butterflies_and_hurricanes_cut.mp3"),
        preLoadAudio("du_hast_intro.mp3"),
        preLoadAudio("paul_stanley_live_to_win_cut.mp3"),
        preLoadAudio("vlad_the_impaler_get_loose_cut.mp3"),
        preLoadAudio("what_i've_done_cut.mp3"),
        preLoadAudio("you_give_love_a_bad_name_cut.mp3")
    ];

    var comebackEqualGoalMusic = [
        preLoadAudio("chumbawamba_tumbthumping_cut.mp3"),
        preLoadAudio("paul_stanley_live_to_win_cut.mp3"),
        preLoadAudio("you_gotta_fight_for_your_right_cut.mp3"),
        preLoadAudio("thousand_foot_krutch_phenomenon_cut.mp3"),
        preLoadAudio("metallica_master_of_puppets_cut.mp3")
    ];

    var goalSounds = [
        preLoadAudio("well_done.mp3"),
        preLoadAudio("oh_yeah.mp3"),
        preLoadAudio("mwa_ha_ha.mp3"),
        preLoadAudio("impressive.mp3"),
        preLoadAudio("excellent.mp3")];

    var firstGoalSounds = [
        preLoadAudio("first_blood.mp3")
    ];

    var fiveToZeroMusic = [
        preLoadAudio("chaif_kakaya_bol.mp3")
    ];

    var goalSeriesSounds = [
        preLoadAudio("humiliation.mp3"),
        preLoadAudio("holy_shit.mp3"),
        preLoadAudio("godlike.mp3"),
        preLoadAudio("unstoppable.mp3"),
        preLoadAudio("rampage.mp3"),
        preLoadAudio("outstanding.mp3"),
        preLoadAudio("dominating.mp3"),
        preLoadAudio("wicked_sick.mp3")
    ];

    var goalWinningSeriesMusic = [
        preLoadAudio("metallica_battery_cut.mp3"),
        preLoadAudio("prodigy_world's_on_fire.mp3"),
        preLoadAudio("splean_lifeline_cut.mp3"),
        preLoadAudio("static_x_the_only_cut.mp3"),
        preLoadAudio("tatu_nas_ne_dogonyat.mp3"),
        preLoadAudio("depeche_mode_just_can't_get_enough_cut.mp3"),
        preLoadAudio("highway_to_hell_cut.mp3"),
        preLoadAudio("hit_girls_bad_reputation_cut.mp3"),
        preLoadAudio("rammstein_mehr_cut.mp3")
    ];

    var goalSeriesBrokenMusic = [
        preLoadAudio("zemfira_pochemu_cut.mp3"),
        preLoadAudio("metallica_and_justice_for_all_cut.mp3"),
        preLoadAudio("metallica_king_nothing_cut.mp3"),
        preLoadAudio("blame_canada_cut.mp3"),
        preLoadAudio("metallica_no_leaf_clover_cut.mp3")
    ];

    var goalComebackFirstGoalSounds = [
        preLoadAudio("if_it_bleeds_we_can_kill_it.mp3"),
        preLoadAudio("big_mistake.mp3")
    ];

    var goalComebackSeriesMusic = [
        preLoadAudio("bob_dylan_the_times_they_are_a-changin'_cut.mp3"),
        preLoadAudio("brutto_underdog_cut.mp3"),
        preLoadAudio("kino_dalse_dejstvovat_budem_my_cut.mp3"),
        preLoadAudio("kino_peremen_cut.mp3"),
        preLoadAudio("louna_dalse_dejstvovat_budem_my_cut.mp3")
    ];

    var nineToNineGoalSound = [
        preLoadAudio("to_be_or_not_to_be.mp3")
    ];

    var nineGoalBigDifferenceSound = [
        preLoadAudio("finish_him.mp3"),
        preLoadAudio("godlike.mp3"),
        preLoadAudio("last_chance_fancy_pants.mp3")
    ];

    var nineGoalRegularMusic = [
        preLoadAudio("eye_of_a_tiger_intro.mp3"),
        preLoadAudio("eminem_lose_yourself_cut.mp3")
    ];

    var nineGoalBigDifferenceMusic = [
        preLoadAudio("my_heart_will_go_on_cut.mp3"),
        preLoadAudio("dont_stop_believing_cut.mp3"),
        preLoadAudio("mission_impossible_intro.mp3")
    ];

    var nineToNineGoalMusic = [
        preLoadAudio("requiem_for_a_dream_mix.mp3"),
        preLoadAudio("requiem_for_a_dream_symphonyc_cut.mp3"),
        preLoadAudio("rob_dougan_clubbed_to_death_cut.mp3"),
        preLoadAudio("apocalyptica_path_vol.2_cut.mp3")
    ];

    var flawlessVictorySound = [
        preLoadAudio("flawless_victory.mp3")
    ];

    var timedSounds = [
        preLoadAudio("football_crowd.mp3"),
        preLoadAudio("football_crowd.mp3"),
        preLoadAudio("crowd_laughing.mp3"),
        preLoadAudio("crowd_boo.mp3")
    ];

    var timedMusic = [
        preLoadAudio("apocalypse_please_intro.mp3"),
        preLoadAudio("south_park_uncle_fucker.mp3"),
        preLoadAudio("kasabian_club_foot_cut.mp3"),
        preLoadAudio("leningrad_gol_gol_cut.mp3"),
        preLoadAudio("leningrad_gol_gol_cut_2.mp3"),
        preLoadAudio("o_zone_numa_numa_cut.mp3"),
        preLoadAudio("prodigy_diesel_power_intro.mp3"),
        preLoadAudio("kino_mama_my_vse_soshli_s_uma_cut.mp3"),
        preLoadAudio("pixies_where_is_my_mind_cut.mp3"),
        preLoadAudio("south_park_poker_face_cartman.mp3")
    ];

    var endSounds = [
        preLoadAudio("football_crowd.mp3"),
        preLoadAudio("hasta_la_vista_baby.mp3"),
        preLoadAudio("fatality.mp3"),
        preLoadAudio("yippee_ki_yay_motherfucker.mp3"),
        preLoadAudio("yippee_ki_yay_motherfucker_2.mp3")
    ];

    var endMusic = [
        preLoadAudio("muse_survival_cut.mp3"),
        preLoadAudio("we_are_the_champions_cut.mp3"),
        preLoadAudio("paul_stanley_live_to_win_cut_2.mp3"),
        preLoadAudio("still_alive_cut.mp3")
    ];

    var lubeKonMusic = preLoadAudio("lube_kon_long_cut.mp3");

    var andrewMusic = preLoadAudio("lyapis_bej_andrusha_cut.mp3");

    var eugenLooseMusic = preLoadAudio("lyapis_mujchiny_ne_plachut.mp3");

    var awesomeMusic = preLoadAudio("barney_stinson_awesome.mp3");

    var previousSound = null;
    var previousMusic = null;


    function addPersonalMusic(player, music, game, team, oppositeTeam) {
        if (player.username.indexOf("Андрей") > -1) {
            music.push(andrewMusic);
        }
        if (player.username.indexOf("Саша Сивов") > -1) {
            music.push(lubeKonMusic);
        }
        if (player.username.indexOf("Настя Голубович") > -1) {
            music.push(awesomeMusic);
        }
        if (player.username.indexOf("Женя") > -1 && game[team].score < game[oppositeTeam].score) {
            music.push(eugenLooseMusic);
        }
    }

    return {
        playGameStartAudio: function (game, callback) {
            var cb = callback || angular.noop;
            cb(getRandomSound(startSounds), getRandomMusic(startMusic));
        },

        playGameGoalAudio: function (game, callback) {
            var cb = callback || angular.noop;
            var lastScore = getLastScore(game);
            var score = lastScore.score;
            var team = lastScore.team;
            var oppositeTeam = lastScore.oppositeTeam;
            var seriesCount = calculateGoalSeries(game);
            var interruptedSeriesCount = calculateInterruptedSeriesCount(game);
            //First goal
            if (game.team_white.score + game.team_blue.score === 1) {
                cb(getRandomSound(firstGoalSounds), getRandomMusic(goalMusic));
                return;
            }
            //If first goal while opponent already had goal series
            else if (score === 1 && game.team_white.score + game.team_blue.score >= 4) {
                cb(getRandomSound(goalComebackFirstGoalSounds), getRandomMusic(goalSeriesBrokenMusic));
                return;
            }
            //Five to zero
            else if ((game.team_white.score === 0 && game.team_blue.score === 5) || (game.team_white.score === 5 && game.team_blue.score === 0)) {
                cb(getRandomSound(goalSounds), getRandomMusic(fiveToZeroMusic));
                return;
            }
            //Score is nine
            else if (score === 9) {
                var opponentScore = team === 'team_white' ? game.team_blue.score : game.team_white.score;
                if (opponentScore === 9) {
                    //TODO 9:9 sound
                    cb(getRandomSound(nineToNineGoalSound), getRandomMusic(nineToNineGoalMusic));
                    return;
                } else if (opponentScore < 7) {
                    //TODO 9 to small score sound
                    cb(getRandomSound(nineGoalBigDifferenceSound), getRandomMusic(nineGoalBigDifferenceMusic));
                    return;
                } else {
                    //Regular nine sound
                    cb(getRandomSound(nineGoalRegularMusic), getRandomMusic(goalMusic));
                    return;
                }
            }
            //Series sound
            else if (seriesCount >= 3) {
                if (game[team].score > game[oppositeTeam].score) {
                    cb(getRandomSound(goalSeriesSounds), getRandomMusic(goalWinningSeriesMusic));
                    return;
                } else if (game[team].score === game[oppositeTeam].score) {
                    cb(getRandomSound(goalSeriesSounds), getRandomMusic(comebackEqualGoalMusic));
                    return;
                }
                else {
                    cb(getRandomSound(goalSeriesSounds), getRandomMusic(goalComebackSeriesMusic));
                    return;
                }
            }
            else if (interruptedSeriesCount >= 3) {
                cb(getRandomSound(goalSeriesSounds), getRandomMusic(goalSeriesBrokenMusic));
                return;
            }
            else {
                cb(getRandomSound(goalSounds), getRandomMusic(goalMusic));
                return;
            }
        },

        playTimedSound: function (game, callback) {
            var cb = callback || angular.noop;

            var player;
            var team;
            var oppositeTeam;
            var music = timedMusic.slice(0);
            var personalMusic = [];
            for (var i = 0; i < game.team_white.players.length; i++) {
                player = game.team_white.players[i];
                team = 'team_white';
                oppositeTeam = 'team_blue';
                addPersonalMusic(player, personalMusic, game, team, oppositeTeam);
                player = game.team_blue.players[i];
                team = 'team_blue';
                oppositeTeam = 'team_white';
                addPersonalMusic(player, personalMusic, game, team, oppositeTeam);
            }
            personalMusic.push(getRandom(music));
            personalMusic.push(getRandom(music));
            personalMusic.push(getRandomMusic(music));
            cb(getRandomSound(timedSounds), getRandomMusic(personalMusic));
            return;
        },

        playGameEndSound: function (game, callback) {
            var cb = callback || angular.noop;
            if (game.team_white.score + game.team_blue.score === 10) {
                cb(getRandomSound(flawlessVictorySound), getRandomMusic(endMusic));
                return;
            } else {
                cb(getRandomSound(endSounds), getRandomMusic(endMusic));
                return;
            }
        },

        playerSelectionSound: function (player, callback) {
            var cb = callback || angular.noop;
            if (player.username === 'Настя Голубович') {
                cb(preLoadAudio("barney_stinson_awesome_small_cut.mp3"), null);
                return;
            }
            else if (player.username === 'Саша Сивов') {
                cb(preLoadAudio("lube_ty_nesi_po_poljy.mp3"), null);
                return;
            } else {
                cb(getRandomSound(playerSelectionSounds), null);
                return;
            }
        }

    };

    function getLastEventTime(game) {
        var lastEventTime = getLastGoalTime(game);
        if (!lastEventTime) {
            lastEventTime = new Date(game.start_time).getTime();
        }
        return lastEventTime;
    }

    function getLastScore(game) {
        var lastGoalTime = getLastGoalTime(game);
        var lastGoalScore;
        var team;
        var oppositeTeam;
        if (game.team_blue.goals.length > 0 && lastGoalTime === new Date(game.team_blue.goals[game.team_blue.goals.length - 1].time).getTime()) {
            lastGoalScore = game.team_blue.score;
            team = "team_blue";
            oppositeTeam = "team_white";
        } else {
            lastGoalScore = game.team_white.score;
            team = "team_white";
            oppositeTeam = "team_blue";
        }
        return {team: team, score: lastGoalScore, oppositeTeam: oppositeTeam};
    }

    function getLastGoalTime(game) {
        var lastGoalTime = null;
        if (game.team_blue.goals.length > 0) {
            lastGoalTime = new Date(game.team_blue.goals[game.team_blue.goals.length - 1].time).getTime();
        }
        if (game.team_white.goals.length > 0) {
            var lastWhiteGoalTime = new Date(game.team_white.goals[game.team_white.goals.length - 1].time).getTime();
            lastGoalTime = lastGoalTime > lastWhiteGoalTime ? lastGoalTime : lastWhiteGoalTime;
        }
        return lastGoalTime;
    }

    function preLoadAudio(sound) {
        var audio = ngAudio.load("../../media/sounds/" + sound);
        //audio.loop = 0;
        return audio;
    }


    function getRandomMusic(musics) {
        var music = getRandom(musics);
        while (previousMusic === music) {
            music = getRandom(musics);
        }
        previousMusic = music;
        return music;
    }

    function getRandomSound(sounds) {
        var sound = getRandom(sounds);
        while (previousSound === sound) {
            sound = getRandom(sounds);
        }
        previousSound = sound;
        return sound;
    }

    function getRandom(array) {
        var index = Math.floor(Math.random() * (array.length));
        return array[index];
    }

    function calculateInterruptedSeriesCount(game) {
        var lastBlueGoal = 0;
        var lastWhiteGoal = 0;
        var seriesCount = 0;
        if (game.team_blue.goals.length > 0) {
            lastBlueGoal = new Date(game.team_blue.goals[game.team_blue.goals.length - 1].time).getTime();
        }
        if (game.team_white.goals.length > 0) {
            lastWhiteGoal = new Date(game.team_white.goals[game.team_white.goals.length - 1].time).getTime();
        }
        var scoredTeam = lastWhiteGoal > lastBlueGoal ? 'team_white' : 'team_blue';
        var opponentTeam = scoredTeam === 'team_white' ? 'team_blue' : 'team_white';

        var previousScoredTeamGoal = game[scoredTeam].goals.length > 1 ? new Date(game[scoredTeam].goals[game[scoredTeam].goals.length - 2].time).getTime() : 0;
        var minSeriesScore = 3;
        //console.log("Scored team goals length = " + game[scoredTeam].goals.length);
        if (game[opponentTeam].goals.length >= minSeriesScore) {
            for (var i = 0; i < game[opponentTeam].goals.length; i++) {
                var nextItem = game[opponentTeam].goals.length - i - 1;
                var previousGoalTime = new Date(game[opponentTeam].goals[nextItem].time).getTime();
                //console.log("check next goal time, previous goal time = " + previousGoalTime + "; last opponent goal = " + lastOpponentGoal);
                if (previousGoalTime > previousScoredTeamGoal) {
                    seriesCount++;
                } else {
                    break;
                }
            }
        }
        return seriesCount;
    }

    function calculateGoalSeries(game) {

        var lastBlueGoal = 0;
        var lastWhiteGoal = 0;
        var seriesCount = 0;
        if (game.team_blue.goals.length > 0) {
            lastBlueGoal = new Date(game.team_blue.goals[game.team_blue.goals.length - 1].time).getTime();
        }
        if (game.team_white.goals.length > 0) {
            lastWhiteGoal = new Date(game.team_white.goals[game.team_white.goals.length - 1].time).getTime();
        }
        var scoredTeam = lastWhiteGoal > lastBlueGoal ? 'team_white' : 'team_blue';
        var lastOpponentGoal = scoredTeam === 'team_white' ? lastBlueGoal : lastWhiteGoal;

        var minSeriesScore = 3;
        //console.log("Scored team goals length = " + game[scoredTeam].goals.length);
        if (game[scoredTeam].goals.length >= minSeriesScore) {
            for (var i = 0; i < game[scoredTeam].goals.length; i++) {
                var nextItem = game[scoredTeam].goals.length - i - 1;
                var previousGoalTime = new Date(game[scoredTeam].goals[nextItem].time).getTime();
                //console.log("check next goal time, previous goal time = " + previousGoalTime + "; last opponent goal = " + lastOpponentGoal);
                if (previousGoalTime > lastOpponentGoal) {
                    seriesCount++;
                } else {
                    break;
                }
            }
        }
        return seriesCount;
    }

});

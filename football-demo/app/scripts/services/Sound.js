'use strict';

app.factory('Sound', function ($rootScope, ngAudio) {

    var playerSelectionSounds = [
        getPathToAudio("come_here.mp3"),
        getPathToAudio("fear_me.mp3"),
        getPathToAudio("get_over_here.mp3"),
        getPathToAudio("i_will_show_no_mercy.mp3"),
        getPathToAudio("oh_yeah.mp3"),
        getPathToAudio("prepare_to_fight.mp3"),
        getPathToAudio("i'm_so_pretty.mp3"),
        getPathToAudio("damn_i'm_good.mp3"),
        getPathToAudio("come_with_me_if_you_want_to_live.mp3"),
        getPathToAudio("i'm_the_law.mp3"),
        getPathToAudio("i_have_come_here_to_chew_bubble_gum_and_kick_ass_and_I'm_all_out_of_bubble_gum.mp3"),
        getPathToAudio("i_need_your_close_your_boots_and_your_motocycle.mp3"),
        getPathToAudio("i'm_back.mp3"),
        getPathToAudio("i'm_too_old_for_this_shit.mp3"),
        getPathToAudio("too_old_for_this_shit.mp3")
    ];

    var startSounds = [
        getPathToAudio("fight.mp3"),
        getPathToAudio("play.mp3"),
        getPathToAudio("gagarin_poehali.mp3")
    ];

    var startMusic = [
        getPathToAudio("carry_on_my_wayward_son_intro.mp3"),
        getPathToAudio("coldplay_viva_la_vida_intro.mp3"),
        getPathToAudio("eye_of_a_tiger_intro.mp3"),
        getPathToAudio("kasabian_fire_cut.mp3"),
        getPathToAudio("lost_in_the_echo_intro.mp3"),
        getPathToAudio("mr_vain_recall_intro.mp3"),
        getPathToAudio("muse_dead_star_intro.mp3"),
        getPathToAudio("thousand_foot_krutch_move_cut.mp3"),
        getPathToAudio("whiskey_in_the_jar_intro.mp3"),
        getPathToAudio("you_give_love_a_bad_name_intro.mp3"),
        getPathToAudio("who_need_a_war_cut.mp3"),
        getPathToAudio("bon_jovi_it's_my_life_cut.mp3"),
        getPathToAudio("kino_gruppa_krovi_cut.mp3"),
        getPathToAudio("haddaway_what_is_love_cut.mp3"),
        getPathToAudio("michael_jackson_smouth_criminal_cut.mp3"),
        getPathToAudio("muse_knights_of_cydonia_intro.mp3"),
        getPathToAudio("rammstein_du_riechst_so_gut_intro.mp3"),
        getPathToAudio("the_prodigy_stand_up_cut.mp3"),
        getPathToAudio("ghostbusters_cut.mp3")
    ];

    var goalMusic = [
        getPathToAudio("mein_herz_brennt_cut.mp3"),
        getPathToAudio("new_divide_cut.mp3"),
        getPathToAudio("thousand_foot_krutch_war_of_change_cut.mp3"),
        getPathToAudio("butterflies_and_hurricanes_cut.mp3"),
        getPathToAudio("du_hast_intro.mp3"),
        getPathToAudio("paul_stanley_live_to_win_cut.mp3"),
        getPathToAudio("vlad_the_impaler_get_loose_cut.mp3"),
        getPathToAudio("what_i've_done_cut.mp3"),
        getPathToAudio("you_give_love_a_bad_name_cut.mp3"),
        getPathToAudio("billy_talent_viking_death_march_intro.mp3"),
        getPathToAudio("blur_song2_cut.mp3"),
        getPathToAudio("deep_purple_smoke_on_the_water_intro.mp3"),
        getPathToAudio("europe_the_final_countdown_cut.mp3"),
        getPathToAudio("gorky_park_moscow_calling_cut.mp3"),
        getPathToAudio("in_extremo_vollmond_cut.mp3"),
        getPathToAudio("metallica_fuel_cut.mp3"),
        getPathToAudio("my_chemical_romance_desolation_row_cut.mp3"),
        getPathToAudio("metallica_the_day_that_never_comes_cut.mp3"),
        getPathToAudio("papa_roach_burn_cut.mp3"),
        getPathToAudio("papa_roach_not_listening_cut.mp3"),
        getPathToAudio("papa_roach_one_track_mind_cut.mp3"),
        getPathToAudio("queen_we_will_rock_you_cut.mp3"),
        getPathToAudio("rammstein_der_meister_intro.mp3"),
        getPathToAudio("rammstein_feuer_frei_cut.mp3"),
        getPathToAudio("rammstein_ich_will_cut.mp3"),
        getPathToAudio("rammstein_liebe_ist_fur_alle_da_cut.mp3"),
        getPathToAudio("rammstein_rozenrot_cut.mp3"),
        getPathToAudio("rammstein_sehnsucht_cut.mp3"),
        getPathToAudio("red_hot_chili_peppers_by_the_way_cut.mp3"),
        getPathToAudio("smash_mouth_all_stars_cut.mp3"),
        getPathToAudio("the_offspring_living_in_chaos.mp3"),
        getPathToAudio("the_prodigy_firestarter_cut.mp3"),
        getPathToAudio("the_prodigy_voodoo_people_cut.mp3"),
        getPathToAudio("prodigy_diesel_power_intro.mp3")
    ];

    var comebackEqualGoalMusic = [
        getPathToAudio("chumbawamba_tumbthumping_cut.mp3"),
        getPathToAudio("paul_stanley_live_to_win_cut.mp3"),
        getPathToAudio("you_gotta_fight_for_your_right_cut.mp3"),
        getPathToAudio("thousand_foot_krutch_phenomenon_cut.mp3"),
        getPathToAudio("metallica_master_of_puppets_cut.mp3"),
        getPathToAudio("billy_talent_fallen_leaves_cut.mp3"),
        getPathToAudio("cake_i_will_survive_cut.mp3"),
        getPathToAudio("gloria_gaynor_i_will_survive_cut.mp3"),
        getPathToAudio("led_zeppelin_immigrant_song_cut.mp3"),
        getPathToAudio("linkin_park_in_the_end_cut.mp3"),
        getPathToAudio("muse_starlight_cut.mp3"),
        getPathToAudio("papa_roach_the_enemy_cut.mp3"),
        getPathToAudio("pennywise_revolution_cut.mp3"),
        getPathToAudio("the_offspring_dammit_i_changed_again_cut.mp3"),
        getPathToAudio("the_offspring_the_future_is_now_cut.mp3"),
        getPathToAudio("the_offspring_you're_gonna_go_far_kid_cut.mp3")
    ];

    var goalSounds = [
        getPathToAudio("well_done.mp3"),
        getPathToAudio("oh_yeah.mp3"),
        getPathToAudio("mwa_ha_ha.mp3"),
        getPathToAudio("impressive.mp3"),
        getPathToAudio("excellent.mp3")];

    var firstGoalSounds = [
        getPathToAudio("first_blood.mp3")
    ];

    var fiveToZeroMusic = [
        getPathToAudio("chaif_kakaya_bol.mp3")
    ];

    var goalSeriesSounds = [
        getPathToAudio("humiliation.mp3"),
        getPathToAudio("holy_shit.mp3"),
        getPathToAudio("godlike.mp3"),
        getPathToAudio("unstoppable.mp3"),
        getPathToAudio("rampage.mp3"),
        getPathToAudio("outstanding.mp3"),
        getPathToAudio("dominating.mp3"),
        getPathToAudio("wicked_sick.mp3")
    ];

    var goalWinningSeriesMusic = [
        getPathToAudio("metallica_battery_cut.mp3"),
        getPathToAudio("prodigy_world's_on_fire.mp3"),
        getPathToAudio("splean_lifeline_cut.mp3"),
        getPathToAudio("static_x_the_only_cut.mp3"),
        getPathToAudio("tatu_nas_ne_dogonyat.mp3"),
        getPathToAudio("depeche_mode_just_can't_get_enough_cut.mp3"),
        getPathToAudio("highway_to_hell_cut.mp3"),
        getPathToAudio("hit_girls_bad_reputation_cut.mp3"),
        getPathToAudio("rammstein_mehr_cut.mp3"),
        getPathToAudio("billy_talent_cut_the_curtains_cut.mp3"),
        getPathToAudio("foo_fighters_my_hero_cut.mp3"),
        getPathToAudio("linkin_park_somewhere_i_belong_cut.mp3"),
        getPathToAudio("muse_assassin_cut.mp3"),
        getPathToAudio("muse_stockholm_syndrome_cut.mp3"),
        getPathToAudio("offspring_hammerhead_cut.mp3"),
        getPathToAudio("poets_of_the_fall_more_cut.mp3"),
        getPathToAudio("queen_the_show_must_go_on_cut.mp3"),
        getPathToAudio("rammstein_wollt_ihr_das_bett_in_flammen_sehen_cut_2.mp3"),
        getPathToAudio("rancid_out_of_control_cut.mp3"),
        getPathToAudio("red_hot_chili_peppers_cant_stop_cut.mp3"),
        getPathToAudio("scorpions_the_game_of_life_cut.mp3"),
        getPathToAudio("sunrise_avenue_diamonds_cut.mp3"),
        getPathToAudio("the_offspring_all_i_want_cut.mp3"),
        getPathToAudio("kasabian_eez-eh_cut.mp3")

    ];

    var goalSeriesBrokenMusic = [
        getPathToAudio("zemfira_pochemu_cut.mp3"),
        getPathToAudio("metallica_and_justice_for_all_cut.mp3"),
        getPathToAudio("metallica_king_nothing_cut.mp3"),
        getPathToAudio("metallica_no_leaf_clover_cut.mp3"),
        getPathToAudio("fall_out_boy_the_phoenix_cut.mp3"),
        getPathToAudio("foo_fighters_everlong_cut.mp3"),
        getPathToAudio("hans_zimmer_despair_cut.mp3"),
        getPathToAudio("hans_zimmer_mind_heist_cut.mp3"),
        getPathToAudio("linkin_park_burn_it_down_cut.mp3"),
        getPathToAudio("linkin_park_from_the_inside_cut.mp3"),
        getPathToAudio("linkin_park_guilty_all_the_same_cut.mp3"),
        getPathToAudio("linkin_park_numb_cut.mp3"),
        getPathToAudio("muse_dark_shines_cut.mp3"),
        getPathToAudio("muse_take_a_bow_cut.mp3"),
        getPathToAudio("papa_roach_kick_in_the_teeth_cut.mp3"),
        getPathToAudio("the_offspring_gone_away_cut.mp3"),
        getPathToAudio("the_pretty_reckless_panic_cut.mp3"),
        getPathToAudio("thousand_foot_krutch_take_it_out_on_me_cut.mp3"),
        getPathToAudio("three_days_grace_break_cut.mp3")
    ];

    var goalComebackFirstGoalSounds = [
        getPathToAudio("if_it_bleeds_we_can_kill_it.mp3"),
        getPathToAudio("big_mistake.mp3")
    ];

    var goalComebackSeriesMusic = [
        getPathToAudio("bob_dylan_the_times_they_are_a-changin'_cut.mp3"),
        getPathToAudio("brutto_underdog_cut.mp3"),
        getPathToAudio("kino_dalse_dejstvovat_budem_my_cut.mp3"),
        getPathToAudio("kino_peremen_cut.mp3"),
        getPathToAudio("louna_dalse_dejstvovat_budem_my_cut.mp3"),
        getPathToAudio("billy_talent_devil_on_my_shoulder_cut.mp3"),
        getPathToAudio("billy_talent_red_flag_cut.mp3"),
        getPathToAudio("chaif_ne_speshy_cut.mp3"),
        getPathToAudio("foo_fighters_pretender_cut.mp3"),
        getPathToAudio("linkin_park_no_more_sorrow_cut.mp3"),
        getPathToAudio("linkin_park_one_step_closer_cut.mp3"),
        getPathToAudio("muse_resistance_intro.mp3"),
        getPathToAudio("muse_the_small_print_cut.mp3"),
        getPathToAudio("our_last_night_dark_horse_cut.mp3"),
        getPathToAudio("papa_roach_blood_brothers_cut.mp3"),
        getPathToAudio("rammstein_asche_zu_asche_cut.mp3"),
        getPathToAudio("rammstein_sonne_cut.mp3"),
        getPathToAudio("system_of_a_down_toxity_cut.mp3"),
        getPathToAudio("thousand_foot_krutch_e_for_extinction_cut.mp3"),
        getPathToAudio("thousand_foot_krutch_welcome_to_the_masquerade_cut.mp3")
    ];

    var nineToNineGoalSound = [
        getPathToAudio("to_be_or_not_to_be.mp3")
    ];

    var nineGoalBigDifferenceSound = [
        getPathToAudio("finish_him.mp3"),
        getPathToAudio("godlike.mp3"),
        getPathToAudio("last_chance_fancy_pants.mp3")
    ];

    var nineGoalRegularMusic = [
        getPathToAudio("eye_of_a_tiger_intro.mp3"),
        getPathToAudio("eminem_lose_yourself_cut.mp3"),
        getPathToAudio("muse_citizen_erased_cut.mp3"),
        getPathToAudio("muse_hysteria_intro.mp3"),
        getPathToAudio("papa_roach_do_or_die_cut.mp3"),
        getPathToAudio("rammstein_links_cut.mp3"),
        getPathToAudio("rammstein_waidmanns_heil_cut.mp3"),
        getPathToAudio("rammstein_wollt_ihr_das_bett_in_flammen_sehen_cut.mp3"),
        getPathToAudio("rise_against_give_it_all_cut.mp3"),
        getPathToAudio("the_prodigy_omen_cut.mp3"),
        getPathToAudio("the_prodigy_smack_my_bitch_up_cut.mp3"),
        getPathToAudio("the_prodigy_warriors_dance_cut.mp3"),
        getPathToAudio("red_hot_chili_peppers_get_on_top_cut.mp3")
    ];

    var nineGoalBigDifferenceMusic = [
        getPathToAudio("my_heart_will_go_on_cut.mp3"),
        getPathToAudio("dont_stop_believing_cut.mp3"),
        getPathToAudio("mission_impossible_intro.mp3"),
        getPathToAudio("nrm_try_charapahi_cut.mp3"),
        getPathToAudio("skillet_hero_cut.mp3")
    ];

    var nineToNineGoalMusic = [
        getPathToAudio("requiem_for_a_dream_mix.mp3"),
        getPathToAudio("requiem_for_a_dream_symphonyc_cut.mp3"),
        getPathToAudio("rob_dougan_clubbed_to_death_cut.mp3"),
        getPathToAudio("apocalyptica_path_vol.2_cut.mp3"),
        getPathToAudio("hans_zimmer_the_battle_cut.mp3"),
        getPathToAudio("hans_zimmer_mind_heist_cut.mp3"),
        getPathToAudio("hans_zimmer_rise_cut.mp3"),
        getPathToAudio("hans_zimmer_the_fire_rises_cut.mp3"),
        getPathToAudio("hans_zimmer_i'm_not_a_hero_cut.mp3"),
        getPathToAudio("muse_resistance_intro.mp3")
    ];

    var flawlessVictorySound = [
        getPathToAudio("flawless_victory.mp3")
    ];

    var timedSounds = [
        getPathToAudio("football_crowd.mp3"),
        getPathToAudio("crowd_boo.mp3"),
        getPathToAudio("crowd_cheering.mp3"),
        getPathToAudio("crowd_cheering2.mp3")
    ];

    var timedMusic = [
        getPathToAudio("apocalypse_please_intro.mp3"),
        getPathToAudio("kasabian_club_foot_cut.mp3"),
        getPathToAudio("leningrad_gol_gol_cut.mp3"),
        getPathToAudio("leningrad_gol_gol_cut_2.mp3"),
        getPathToAudio("o_zone_numa_numa_cut.mp3"),
        getPathToAudio("kino_mama_my_vse_soshli_s_uma_cut.mp3"),
        getPathToAudio("pixies_where_is_my_mind_cut.mp3"),
        getPathToAudio("south_park_poker_face_cartman.mp3"),
        getPathToAudio("chaif_vremya_ne_jdet_cut.mp3"),
        getPathToAudio("los_lobos_cancion_del_cut.mp3"),
        getPathToAudio("muse_isolated_system_cut.mp3"),
        getPathToAudio("splean_pausy_v_slovah_cut.mp3"),
        getPathToAudio("kasabian_fire_cut.mp3"),
        getPathToAudio("thousand_foot_krutch_move_cut.mp3"),
        getPathToAudio("bon_jovi_it's_my_life_cut.mp3"),
        getPathToAudio("haddaway_what_is_love_cut.mp3"),
        getPathToAudio("muse_knights_of_cydonia_intro.mp3"),
        getPathToAudio("michael_jackson_smouth_criminal_cut.mp3"),
        getPathToAudio("the_prodigy_stand_up_cut.mp3"),
        getPathToAudio("coldplay_viva_la_vida_intro.mp3"),
        getPathToAudio("carry_on_my_wayward_son_intro.mp3"),
        getPathToAudio("ghostbusters_cut.mp3")
    ];

    var endSounds = [
        getPathToAudio("football_crowd.mp3"),
        getPathToAudio("hasta_la_vista_baby.mp3"),
        getPathToAudio("fatality.mp3"),
        getPathToAudio("yippee_ki_yay_motherfucker.mp3"),
        getPathToAudio("yippee_ki_yay_motherfucker_2.mp3")
    ];

    var endMusic = [
        getPathToAudio("muse_survival_cut.mp3"),
        getPathToAudio("we_are_the_champions_cut.mp3"),
        getPathToAudio("paul_stanley_live_to_win_cut_2.mp3"),
        getPathToAudio("still_alive_cut.mp3"),
        getPathToAudio("scorpions_moment_of_glory_cut.mp3")
    ];

    var lubeKonMusic = getPathToAudio("lube_kon_long_cut.mp3");

    var andrewMusic = getPathToAudio("lyapis_bej_andrusha_cut.mp3");

    var eugenLooseMusic = getPathToAudio("lyapis_mujchiny_ne_plachut.mp3");

    var awesomeMusic = getPathToAudio("barney_stinson_awesome.mp3");

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
                    cb(getRandomSound(goalSounds), getRandomMusic(nineGoalRegularMusic));
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
                cb(getRandomSound(goalSounds), getRandomMusic(goalSeriesBrokenMusic));
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
            var timedMusicCount = 0;
            while (timedMusicCount < 2) {
                var music = getRandom(timedMusic);
                if (personalMusic.indexOf(music) === -1) {
                    personalMusic.push(music);
                    timedMusicCount++;
                }
            }
            console.log(personalMusic);
            cb(null, getRandomMusic(personalMusic));
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
                cb(ngAudio.load(getPathToAudio("barney_stinson_awesome_small_cut.mp3")), null);
                return;
            }
            else if (player.username === 'Саша Сивов') {
                cb(ngAudio.load(getPathToAudio("lube_ty_nesi_po_poljy.mp3")), null);
                return;
            }
            else if (player.username === 'Таня Зайцева') {
                cb(ngAudio.load(getPathToAudio("ghostbusters_small_cut.mp3")), null);
                return;
            }
            else {
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

    function getPathToAudio(sound) {
        //var audio = ngAudio.load("../../media/sounds/" + sound);
        var audio = "../../media/sounds/" + sound;
        return audio;
    }


    function getRandomMusic(musics) {
        var music = getRandom(musics);
        while (previousMusic === music) {
            music = getRandom(musics);
        }
        previousMusic = music;
        console.log(music);
        return ngAudio.load(music);
    }

    function getRandomSound(sounds) {
        var sound = getRandom(sounds);
        while (previousSound === sound) {
            sound = getRandom(sounds);
        }
        previousSound = sound;
        return ngAudio.load(sound);
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

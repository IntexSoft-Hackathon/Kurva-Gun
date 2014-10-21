'use strict';

var AchievementsCollection = function() {
    var self=this;

    //In game achievements
    self.ACHIEVEMENT_MAD = createAchievement("ШАЛЬНОЙ", "50 голов", "achievements/mad.png");
    self.ACHIEVEMENT_SLAYER = createAchievement("ЗВЕРОБОЙ", "100 голов", "achievements/slayer.png");
    self.ACHIEVEMENT_CHUCK_NORRIS = createAchievement("ЧАК НОРРИС", "250 голов", "achievements/chuck_norris.png");

    self.ACHIEVEMENT_UNSTOPPABLE = createAchievement("НЕУДЕРЖИМЫЙ", "3 гола подряд", "achievements/unstoppable.png");
    self.ACHIEVEMENT_SHAITAN = createAchievement("ШАЙТАН", "5 голов подряд", "achievements/shaitan.png");
    self.ACHIEVEMENT_SKOROSTREL = createAchievement("СКОРОСТРЕЛ", "7 голов подряд", "achievements/skorostrel.png");

    self.ACHIEVEMENT_BOLT = createAchievement("БОЛТЯРА", "Забить гол в первые 5 секунд игры", "achievements/bolt.png");
    self.ACHIEVEMENT_BEAST = createAchievement("ЗВЕРЮГА", "Забить 3 гола в течение 30 секунд", "achievements/beast.png");
    self.GUNNER = createAchievement("ПУЛЕМЕТЧИК", "Забить 5 голов за 1 минуту", "achievements/gunner.png");

    //End game achievements
    self.ACHIEVEMENT_BULLET = createAchievement("ПУЛЯ", "Выиграть 10 игр", "achievements/bullet.png");
    self.ACHIEVEMENT_ROCK = createAchievement("СКАЛА", "Выиграть 20 игр", "achievements/rock.png");
    self.ACHIEVEMENT_ROCK_BULLET = createAchievement("СКАЛА-ПУЛЯ", "Выиграть 50 игр", "achievements/rock_bullet.png");

    self.ACHIEVEMENT_IMPUDENT = createAchievement("ДЕРЗКИЙ", "Выиграть игру всухую", "achievements/impudent.png");
    self.ACHIEVEMENT_WOW = createAchievement("ФИГАСЕ!", "Выиграть 5 игр всухую", "achievements/wow.png");
    self.ACHIEVEMENT_JEWELER = createAchievement("ЮВЕЛИР", "Выиграть 10 игр всухую", "achievements/jeweler.png");

    self.ACHIEVEMENT_DRINK_THE_POISON = createAchievement("ВЫПЕЙ ЯДУ!", "3 поражения подряд", "achievements/drink_the_poison.png");
    self.ACHIEVEMENT_GOLDEN_GOAL = createAchievement("ЗОЛОТОЙ ГОЛ", "Забить решающий гол при счете 9:9", "achievements/golden_goal.png");

    self.ACHIEVEMENT_PERFECT_WEEK = createAchievement("ИДЕАЛЬНАЯ НЕДЕЛЯ", "Победить 7 раз подряд", "achievements/perfect_week.png");
    self.ACHIEVEMENT_WE_ARE_BEAUTIFUL = createAchievement("ЗАТО МЫ КРАСИВЫЕ!", "Констатация факта", "achievements/we_are_beautiful.png");
    self.ACHIEVEMENT_WALL = createAchievement("СТЕНА", "Меньше 5 пропещенных за игру", "achievements/wall.png");

    self.ACHIEVEMENT_FLASH = createAchievement("ФЛЕШ", "Выйграть меньше чем за 2 минуты", "achievements/flash.png");
    self.ACHIEVEMENT_BATMAN = createAchievement("БЭТМАН", "Выйграть меньше чем за 3 минуты", "achievements/batman.png");
    self.ACHIEVEMENT_LOSER = createAchievement("СОСУЛЯ", "Проиграть 5 игр подряд", "achievements/loser.png");

    //Timed achievements
    self.ACHIEVEMENT_PARTY_SUCKS = createAchievement("ПАТИ-ТУХЛЯК", "Игра дольше 10 минут", "achievements/party_sucks.png");

    function createAchievement(name, description, image) {
        var achievement = {
            name: String,
            time: new Date(),
            description: String,
            image: String
        };
        achievement.name = name;
        achievement.description = description;
        achievement.image = image;
        return achievement;
    }
};

module.exports = AchievementsCollection;
'use strict';

var AchievementsCollection = function() {
    var self=this;

    //In game achievements
    self.ACHIEVEMENT_MAD = createAchievement("ШАЛЬНОЙ", "50 голов", "achievements/mad.png");
    self.ACHIEVEMENT_SLAYER = createAchievement("ЗВЕРОБОЙ", "100 голов", "achievements/slayer.png");
    self.ACHIEVEMENT_CHUCK_NORRIS = createAchievement("ЧАК НОРРИС", "250 голов", "achievements/chuck_norris.png");

    self.ACHIEVEMENT_UNSTOPPABLE = createAchievement("НЕУДЕРЖИМЫЙ", "3 гола подряд", "achievements/unstoppable.png");

    //End game achievements
    self.ACHIEVEMENT_BULLET = createAchievement("ПУЛЯ", "Выиграть 10 игр", "achievements/bullet.png");
    self.ACHIEVEMENT_ROCK = createAchievement("СКАЛА", "Выиграть 20 игр", "achievements/rock.png");
    self.ACHIEVEMENT_ROCK_BULLET = createAchievement("СКАЛА-ПУЛЯ", "Выиграть 50 игр", "achievements/rock_bullet.png");

    self.ACHIEVEMENT_IMPUDENT = createAchievement("ДЕРЗКИЙ", "Выиграть игру всухую", "achievements/impudent.png");
    self.ACHIEVEMENT_WOW = createAchievement("ФИГАСЕ!", "Выиграть 5 игр всухую", "achievements/wow.png");
    self.ACHIEVEMENT_JEWELER = createAchievement("ЮВЕЛИР", "Выиграть 10 игр всухую", "achievements/jeweler.png");

    self.ACHIEVEMENT_DRINK_THE_POISON = createAchievement("ВЫПЕЙ ЯДУ!", "3 поражения подряд", "achievements/drink_the_poison.png");

    //Timed achievements
    self.ACHIEVEMENT_PARTY_SUCKS = createAchievement("ПАТИ-ТУХЛЯК", "Игра дольше 10 минут", "achievements/party_sucks.png");

    function createAchievement(name, description, image) {
        var achievement = {
            name: String,
            time: Date,
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
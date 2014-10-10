'use strict';

var AchievementsCollection = function() {
    var self=this;

    self.ACHIEVEMENT_PARTY_SUCKS = createAchievement("ПАТИ-ТУХЛЯК", "Игра дольше 10 минут", "achievements/party_sucks.PNG");

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
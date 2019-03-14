'use strict';

var Sequelize = require('sequelize');

/**
 * Actions summary:
 *
 * createTable "notifications", deps: []
 *
 **/

var info = {
    "revision": 1,
    "name": "initial",
    "created": "2019-03-14T22:21:05.590Z",
    "comment": ""
};

var migrationCommands = [{
    fn: "createTable",
    params: [
        "notifications",
        {
            "id": {
                "type": Sequelize.INTEGER,
                "field": "id",
                "autoIncrement": true,
                "primaryKey": true,
                "allowNull": false
            },
            "data": {
                "type": Sequelize.STRING,
                "field": "data"
            },
            "createdAt": {
                "type": Sequelize.DATE,
                "field": "createdAt",
                "allowNull": false
            },
            "updatedAt": {
                "type": Sequelize.DATE,
                "field": "updatedAt",
                "allowNull": false
            }
        },
        {}
    ]
}];

module.exports = {
    pos: 0,
    up: function(queryInterface, Sequelize)
    {
        var index = this.pos;
        return new Promise(function(resolve, reject) {
            function next() {
                if (index < migrationCommands.length)
                {
                    let command = migrationCommands[index];
                    console.log("[#"+index+"] execute: " + command.fn);
                    index++;
                    queryInterface[command.fn].apply(queryInterface, command.params).then(next, reject);
                }
                else
                    resolve();
            }
            next();
        });
    },
    info: info
};

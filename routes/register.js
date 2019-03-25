const express = require('express');
const request = require('request');
const router = express.Router();
const async = require('async');
const uuidv1 = require('uuid/v1');
const generatePassword = require('password-generator');

const models = require('../models');
const config = require('config');

/**
 * @api {get} /register/:nhsNumber NHS number to be used to grab EHR.
 * @apiName RegisterNumber
 * @apiGroup Register
 *
 * @apiParam {Number} nhsNumber Users unique NHS number.
 *
 * @apiSuccess {String} token A token used to check the status of the EHR acquisition.
 */
router.get('/:nhsNumber', function(req, res, next) {

  const token = generatePassword();

  models.users.create({

    nhsNumber: req.params.nhsNumber,
    token: token

  }).error(function(err) {

    console.log(err);

  }).then(function() {

    res.send(token);

  });

});

router.get('/token/:token', function(req, res, next) {

  models.users.findOne({
    where: {

      token: req.params.token

    }
  }).then(function(user) {

    if ( user && user.nhsNumber == null && user.patientID ) {

      models.users.destroy({
        where: {

          token: req.params.token

        }
      }).then(function(destory) {

        res.send(user.patientID);

      });

    } else {

      res.sendStatus(404);

    }

  });

});

module.exports = router;

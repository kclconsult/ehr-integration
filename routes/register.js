const express = require('express');
const request = require('request');
const router = express.Router();
const async = require('async');
const uuidv1 = require('uuid/v1');
const generatePassword = require('password-generator');
const crypto = require('crypto');
const config = require('config');

const models = require('../models');

/**
 * @api {get} /register/:nhsNumber NHS number to be used to grab EHR. Patient signup protocol step 1.
 * @apiName RegisterNumber
 * @apiGroup Register
 *
 * @apiParam {Number} nhsNumber Users unique NHS number.
 *
 * @apiSuccess {String} token A token used to check the status of the EHR acquisition.
 */
router.get('/:nhsNumber', function(req, res, next) {

  if ( config.get('user_registration.ENABLED') ) {

    const token = generatePassword();

    models.users.create({

      nhsNumber: req.params.nhsNumber,
      token: token

    }).error(function(err) {

      console.log(err);

    }).then(function() {

      res.send(token);

    });

  } else {

    res.send("Patient registration is not enabled.");

  }

});

/**
 * @api {get} /token/:token Exchange token for system patient ID, if record grabbed. Patient signup protocol step 2.
 * @apiName GetToken
 * @apiGroup Register
 *
 * @apiParam {Number} token Token supplied upon registration
 *
 * @apiSuccess {String} credentials An ID and secondary token (temporary password), to later be exchanged for a full password in order to access the UI and chat interface.
 */
router.get('/token/:token', function(req, res, next) {

  if ( config.get('user_registration.ENABLED') ) {

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

        }).then(function(destroy) {

          res.send("curl localhost:3005/Patient/register/" + user.patientID + "/" + crypto.createHmac('sha256', config.get('credentials.SECRET')).update(user.patientID).digest('hex'));

        });

      } else {

        res.sendStatus(404);

      }

    });

  } else {

    res.send("Patient registration is not enabled.");

  }

});

module.exports = router;

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

          res.send("Patient ID: " + user.patientID + "<br />Secondary token: " + crypto.createHmac('sha256', config.get('credentials.SECRET')).update(user.patientID).digest('hex'));

        });

      } else {

        res.sendStatus(404);

      }

    });

  } else {

    res.send("Patient registration is not enabled.");

  }

});

/**
 * @api {get} /:id/:token Exchange a (second) temporary token acquired along with a system ID (post record collection based upon NHS number) for a full password and thus access to the UI and chat. Patient signup protocol step 3 (forwarded).
 * @apiName GetPassword
 * @apiGroup Register
 *
 * @apiParam {String} id System ID supplied in exachange for first token supplied upon provision of NHS number.
 * @apiParam {String} token Token supplied upon issue of system ID.
 *
 * @apiSuccess {String} Confirmation of ID and newly generated password.
 */
router.get('/:id/:token', function(req, res, next) {

  if ( req.params.id && req.params.token ) {

    request({
      method: "GET",
      url : config.get('user_registration.MESSAGE_PASSER_REGISTRATION_URL') + "/" + req.params.id + "/" + req.params.token,
      requestCert: true
    },
    function (error, response, body) {

      if (!error && response.statusCode <= 200) {

        res.send(body);

      } else {

        console.log("Error when contacting message passer: " + error + " " + ( ( body && typeof body === "object" ) ? JSON.stringify(body) : body ) + " " + ( response && response.statusCode ? response.statusCode : "Status unknown." ));
        res.sendStatus(400);

      }

    });

  } else {

    res.send("Invalid parameters.");

  }

});

module.exports = router;

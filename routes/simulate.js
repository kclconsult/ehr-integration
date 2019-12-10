const express = require('express');
const request = require('request');
const router = express.Router();
const async = require('async');
const uuidv1 = require('uuid/v1');

const models = require('../models');
const config = require('config');
const PRACTITIONER_ID = "da6da8b0-56e5-11e9-8d7b-95e10210fac3";

module.exports = function(messageObject) {

	function sendEHRData(patientID, practitionerID, callback, patientSubscription=false) {

		const organizationID = uuidv1();
		const conditionAID = uuidv1();
		const conditionBID = uuidv1();
		const medicationAID = uuidv1();
		const medicationBID = uuidv1();
		const dispenseAID = uuidv1();
		const dispenseBID = uuidv1();

	  fhirResources =  [["Organization", {"id": organizationID}],
	                   ["Practitioner",	{"id": practitionerID, "familyName": "Careful", "givenName": "Adam"}],
	                   ["Patient", {"id": patientID, "title": "MR", "familyName": "Chalmers", "givenName": "Peter", "birthDate": "1952-02-17", "organizationReference": organizationID, "ethnicityCode": "2106-3", "ethnicityDisplay": "White"}],
	                   ["Condition", {"id": conditionAID, "codeSystem": "http://snomed.info/sct", "code": "396275006", "display": "Osteoarthritis", "subjectReference": patientID, "practitionerReference": practitionerID}],
	                   ["Condition", {"id": conditionBID, "codeSystem": "http://snomed.info/sct", "code": "38341003", "display": "Hypertension", "subjectReference": patientID, "practitionerReference": practitionerID}],
	                   ["Medication", {"id": medicationAID, "codeSystem": "http://snomed.info/sct", "code": "16403005", "display": "NSAID"}],
	                   ["Medication", {"id": medicationBID, "codeSystem": "http://snomed.info/sct", "code": "91667005", "display": "Thiazide"}],
	                   ["MedicationDispense", {"id": dispenseAID, "medicationReference": medicationAID, "subjectReference": patientID, "practitionerReference": practitionerID, "organizationReference": organizationID}],
	                   ["MedicationDispense", {"id": dispenseBID, "medicationReference": medicationBID, "subjectReference": patientID, "practitionerReference": practitionerID, "organizationReference": organizationID}],
	                   ["Subscription", {"id": "hapi-message-passer-observation-subscription", "criteria": "Observation?_format=json", "URL": config.get('message_passer.URL')}]];

		if ( patientSubscription ) fhirResources.unshift(["Subscription", {"id": "hapi-message-passer-patient-subscription", "criteria": "Patient?_format=json", "URL": config.get('message_passer.URL')}]);

		async.eachSeries(fhirResources, function (value, next) {

			value[1].resource = value[0];
			messageObject.send(config.get('ehr_to_fhir.URL') + "/create/" + value[0], value[1]).then(() => next());

		}, function(err) {

			if (!err) {

				callback("Patient generated: " + patientID + "<br /><br /><a href=\"" + config.get('nokia.URL') + "/nokia/simulate/incomingBP/" + patientID + "/" + practitionerID + "\" target=\"_blank\">Simulate incoming BP</a><br /><a href=\"" + config.get('garmin.URL') + "/garmin/simulate/incomingHR/" + patientID + "/" + practitionerID + "\" target=\"_blank\">Simulate incoming HR</a><br /><a href=\"" + config.get('vitalpatch.URL') + "/vitalpatch/simulate/incomingECG/" + patientID + "/" + practitionerID + "\" target=\"_blank\">Simulate incoming ECG</a>");

			} else {

				callback("Error generating patient: " + err);

			}

		});

	}

	/**
	 * @api {get} /simulate/incomingEHR Simulate an incoming patient EHR (output pre-formatted as FHIR).
	 * @apiName SimulateEHR
	 * @apiGroup Simulate
	 *
	 */
	router.get('/incomingEHR', function(req, res, next) {

		sendEHRData(uuidv1(), PRACTITIONER_ID, function(links) {

			res.send(links);

		}, true);

	});

	/**
	 * @api {get} /simulate/incomingEHR/id/:patientID Simulate an incoming patient EHR with a specified patient ID (output pre-formatted as FHIR).
	 * @apiName SimulateEHR
	 * @apiGroup Simulate
	 *
	 * @apiParam {Number} patientID ID of the patient being created.
	 *
	 */
	router.get('/incomingEHR/id/:patientID', function(req, res, next) {

		sendEHRData(req.params.patientID, PRACTITIONER_ID, function(links) {

			res.send(links);

		}, true);

	});

	/**
	 * @api {get} /simulate/incomingEHR/:nhsNumber Simulate an incoming patient EHR against a previously logged NHS number (output pre-formatted as FHIR).
	 * @apiName SimulateEHRnhs
	 * @apiGroup Simulate
	 *
	 * @apiParam {Number} nhsNumber Users unique NHS number.
	 *
	 */
	router.get('/incomingEHR/:nhsNumber', function(req, res, next) {

		if ( config.get('user_registration.ENABLED') ) {

			const patientID = uuidv1();

			models.users.update({

				nhsNumber: null,
				patientID: patientID

			},
			{
				where: {

				 nhsNumber: req.params.nhsNumber

				}
		    }).then(function(update) {

			    sendEHRData(patientID, PRACTITIONER_ID, function(links) {

				    res.send(links);

				}, true);

			});

	    } else {

		res.send("Patient registration is not enabled.");

	    }

	});

    return router;

}

const express = require('express');
const request = require('request');
const router = express.Router();
const async = require('async');
const uuidv1 = require('uuid/v1');

const config = require('config');

module.exports = function(messageObject) {

	/**
	 * @api {get} /simulate/incomingEHR Simulate an incoming patient EHR (output pre-formatted as FHIR).
	 * @apiName simulateEHR
	 * @apiGroup Simulate
	 *
	 */
	router.get('/incomingEHR', function(req, res, next) {

		const organizationID = uuidv1();
		const practitionerID = uuidv1();
	  const	patientID = uuidv1();
		const conditionAID = uuidv1();
		const conditionBID = uuidv1();
		const medicationAID = uuidv1();
		const medicationBID = uuidv1();
		const dispenseAID = uuidv1();
		const dispenseBID = uuidv1();

	  fhirResources = [["organization", {"id": organizationID}],
	                   ["practitioner",	{"id": practitionerID, "familyName": "Careful", "givenName": "Adam"}],
	                   ["patient", {"id": patientID, "title": "MR", "familyName": "Chalmers", "givenName": "Peter", "birthDate": "1952-02-17", "organizationReference": organizationID, "ethnicityCode": "2106-3", "ethnicityDiplay": "White"}],
	                   ["condition", {"id": conditionAID, "codeSystem": "http://snomed.info/sct", "code": "396275006", "display": "Osteoarthritis", "subjectReference": patientID, "practitionerReference": practitionerID}],
	                   ["condition", {"id": conditionBID, "codeSystem": "http://snomed.info/sct", "code": "38341003", "display": "Hypertension", "subjectReference": patientID, "practitionerReference": practitionerID}],
	                   ["medication", {"id": medicationAID, "codeSystem": "http://snomed.info/sct", "code": "16403005", "display": "NSAID"}],
	                   ["medication", {"id": medicationBID, "codeSystem": "http://snomed.info/sct", "code": "91667005", "display": "Thiazide"}],
	                   ["dispense", {"id": dispenseAID, "medicationReference": medicationAID, "subjectReference": patientID, "practitionerReference": practitionerID, "organizationReference": organizationID}],
	                   ["dispense", {"id": dispenseBID, "medicationReference": medicationBID, "subjectReference": patientID, "practitionerReference": practitionerID, "organizationReference": organizationID}],
	                   ["subscription", {"id": "hapi-message-passer-subscription"}]];

		async.eachSeries(fhirResources, function (value, next){

			messageObject.send(config.get('ehr_to_fhir.URL') + "create/" + value[0], value[1]).then(() => next());

		}, function(err) {

			res.sendStatus(200);

		});

	});

	return router;

}
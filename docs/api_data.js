define({ "api": [
  {
    "type": "get",
    "url": "/token/:token",
    "title": "Exchange token for system patient ID, if record grabbed. Patient signup protocol step 2.",
    "name": "GetToken",
    "group": "Register",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "token",
            "description": "<p>Token supplied upon registration</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "credentials",
            "description": "<p>An ID and temporary password combination, to later be exchanged for a full password in order to acess the UI and chat interface.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "./routes/register.js",
    "groupTitle": "Register"
  },
  {
    "type": "get",
    "url": "/register/:nhsNumber",
    "title": "NHS number to be used to grab EHR. Patient signup protocol step 1.",
    "name": "RegisterNumber",
    "group": "Register",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "nhsNumber",
            "description": "<p>Users unique NHS number.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "token",
            "description": "<p>A token used to check the status of the EHR acquisition.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "./routes/register.js",
    "groupTitle": "Register"
  },
  {
    "type": "get",
    "url": "/simulate/incomingEHR",
    "title": "Simulate an incoming patient EHR (output pre-formatted as FHIR).",
    "name": "SimulateEHR",
    "group": "Simulate",
    "version": "0.0.0",
    "filename": "./routes/simulate.js",
    "groupTitle": "Simulate"
  },
  {
    "type": "get",
    "url": "/simulate/incomingEHR/:nhsNumber",
    "title": "Simulate an incoming patient EHR against a previously logged NHS number (output pre-formatted as FHIR).",
    "name": "SimulateEHRnhs",
    "group": "Simulate",
    "version": "0.0.0",
    "filename": "./routes/simulate.js",
    "groupTitle": "Simulate"
  },
  {
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "optional": false,
            "field": "varname1",
            "description": "<p>No type.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "varname2",
            "description": "<p>With type.</p>"
          }
        ]
      }
    },
    "type": "",
    "url": "",
    "version": "0.0.0",
    "filename": "./docs/main.js",
    "group": "_home_martin_Dropbox_University_Postdoctoral_Associate_2018_19_Research_CONSULT_EHR_Vendors_dev_ehr_integration_docs_main_js",
    "groupTitle": "_home_martin_Dropbox_University_Postdoctoral_Associate_2018_19_Research_CONSULT_EHR_Vendors_dev_ehr_integration_docs_main_js",
    "name": ""
  }
] });

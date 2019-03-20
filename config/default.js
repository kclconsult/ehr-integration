module.exports = {

  credentials: {
    USERNAME: process.env.USERNAME,
    PASSWORD: process.env.PASSWORD
  },

  ehr_to_fhir: {
    URL: 'http://localhost:3004',
  },

  message_passer: {
    URL: 'http://localhost:3005'
  },

  message_queue: {
    ACTIVE: false,
    HOST: "localhost",
    NAME: "ehr-integration_ehr-fhir-mapper"
  }

};

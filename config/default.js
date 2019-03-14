module.exports = {

  credentials: {
    USERNAME: process.env.USERNAME,
    PASSWORD: process.env.PASSWORD
  },

  ehr_to_fhir: {
    URL: 'http://localhost:3004/',
  },

  message_queue: {
    ACTIVE: true,
    HOST: "localhost",
    NAME: "ehr-integration-ehr-fhir-mapper"
  }

};

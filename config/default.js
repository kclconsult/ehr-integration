module.exports = {

  credentials: {
    USERNAME: process.env.USERNAME,
    PASSWORD: process.env.PASSWORD
  },

  ehr_to_fhir: {
    URL: 'https://localhost', // TODO: Setup proxy endpoint.
  },

  message_passer: {
    URL: 'https://localhost'
  },

  message_queue: {
    ACTIVE: false,
    HOST: "localhost",
    NAME: "ehr-integration_ehr-fhir-mapper"
  }

};

module.exports = {

  dbConfig: {
    username: "user",
    password: "password",
    database: "database",
    host: "ehr-integration_mysql_1",
    dialect: "mysql"
  },

  // Addresses for simulation sensor links.
  nokia: {
    URL: "https://" + process.env.DEVICE_ADDRESS
  },

  garmin: {
    URL: "https://" + process.env.DEVICE_ADDRESS
  },

  // TODO: Add proxy entry so port does not have to be specified here.
  ehr_to_fhir: {
    URL: "http://ehr-fhir-mapper_webapp-queue_1:3004"
  },

  message_passer: {
    URL: "https://" + process.env.MESSAGE_PASSER_ADDRESS
  },

  message_queue: {
    ACTIVE: true,
    HOST: "ehr-fhir-mapper_rabbit_1",
    NAME: "ehr-integration_ehr-fhir-mapper"
  }

};

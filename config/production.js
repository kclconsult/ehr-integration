module.exports = {

  dbConfig: {
    username: "user",
    password: "password",
    database: "database",
    host: "ehr-integration_mysql_1",
    dialect: "mysql"
  },

  message_passer: {
    URL: "https://" + process.env.MESSAGE_PASSER_ADDRESS
  },

  message_queue: {
    ACTIVE: true,
    HOST: "ehr-fhir-mapper_rabbit_1"
  }

};

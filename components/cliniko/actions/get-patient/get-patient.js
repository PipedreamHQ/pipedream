const cliniko = require("../../cliniko.app.js");

module.exports = {
  name: "Get Patient",
  key: "cliniko-get-patient",
  description: "Get the details of a patient by `patientId`.",
  version: "0.0.6",
  type: "action",
  props: {
    cliniko,
    patientId: {
      propDefinition: [
        cliniko,
        "patientId",
      ],
    },
  },
  async run() {
    return await this.cliniko.getPatient(this.patientId);
  },
};

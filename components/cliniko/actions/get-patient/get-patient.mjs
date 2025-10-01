import app from "../../cliniko.app.mjs";

export default {
  name: "Get Patient",
  key: "cliniko-get-patient",
  description: "Get the details of a patient by patient ID.",
  version: "0.1.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    patientId: {
      propDefinition: [
        app,
        "patientId",
      ],
    },
  },
  methods: {
    /**
     * Get the details of a specified patient.
     * @params {Integer} patientId - The unique identifier of the patient
     * @returns {Object} The details of the specified patient.
     */
    getPatient({
      patientId, ...args
    } = {}) {
      return this.app.makeRequest({
        path: `/patients/${patientId}`,
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      getPatient,
      patientId,
    } = this;

    const response = await getPatient({
      $,
      patientId,
    });

    $.export("$summary", `Suceesfully retrieved patient with ID: \`${response.id}\``);

    return response;
  },
};

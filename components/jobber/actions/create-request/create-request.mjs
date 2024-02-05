import jobber from "../../jobber.app.mjs";

export default {
  key: "jobber-create-request",
  name: "Create Service Request",
  description: "Creates a new service request for a client's first property within Jobber. [See the documentation](https://developer.getjobber.com/docs/)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    jobber,
    clientId: {
      propDefinition: [
        jobber,
        "clientId",
      ],
    },
    serviceDetails: {
      propDefinition: [
        jobber,
        "serviceDetails",
      ],
    },
    appointmentTime: {
      propDefinition: [
        jobber,
        "appointmentTime",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.jobber.createServiceRequest({
      clientId: this.clientId,
      serviceDetails: this.serviceDetails,
      appointmentTime: this.appointmentTime,
    });
    $.export("$summary", `Successfully created service request for client ${this.clientId}`);
    return response;
  },
};

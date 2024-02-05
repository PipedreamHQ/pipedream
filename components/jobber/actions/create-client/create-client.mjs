import jobber from "../../jobber.app.mjs";

export default {
  key: "jobber-create-client",
  name: "Create Client",
  description: "Generates a new client within Jobber. [See the documentation](https://developer.getjobber.com/docs)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    jobber,
    clientName: {
      type: "string",
      label: "Client Name",
      description: "The name of the client",
    },
    clientContactInfo: {
      type: "string",
      label: "Client Contact Information",
      description: "The contact information of the client",
    },
    clientAddress: {
      type: "string",
      label: "Client Address",
      description: "The address of the client",
    },
  },
  async run({ $ }) {
    const response = await this.jobber.createClient({
      clientName: this.clientName,
      clientContactInfo: this.clientContactInfo,
      clientAddress: this.clientAddress,
    });
    $.export("$summary", `Successfully created client ${this.clientName}`);
    return response;
  },
};

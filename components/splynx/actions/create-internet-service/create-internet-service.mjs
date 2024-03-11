import splynx from "../../splynx.app.mjs";

export default {
  key: "splynx-create-internet-service",
  name: "Create Internet Service",
  description: "Creates a new internet service with specified details. [See the documentation](https://splynx.docs.apiary.io/)",
  version: "0.0.1",
  type: "action",
  props: {
    splynx,
    customerId: {
      propDefinition: [
        splynx,
        "customerId",
      ],
    },
    serviceDetails: {
      propDefinition: [
        splynx,
        "serviceDetails",
      ],
    },
    specialConditions: {
      propDefinition: [
        splynx,
        "specialConditions",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.splynx.createInternetService({
      customerId: this.customerId,
      serviceDetails: this.serviceDetails,
      specialConditions: this.specialConditions,
    });

    $.export("$summary", `Successfully created a new internet service for customer ID ${this.customerId}`);
    return response;
  },
};

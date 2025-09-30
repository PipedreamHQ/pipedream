import faraday from "../../faraday.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "faraday-predict",
  name: "Predict",
  description: "Returns a prediction about a single person. [See the documentation](https://faraday.ai/developers/reference/lookupontarget)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    faraday,
    alert: {
      type: "alert",
      alertType: "info",
      content: `You must provide at least one of the following combinations to retrieve a match:
        - address + city + state
        - email
        - phone + lastName
      `,
    },
    targetId: {
      propDefinition: [
        faraday,
        "targetId",
      ],
    },
    email: {
      type: "string",
      label: "Email",
      description: "The person's email address",
      optional: true,
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "The person's phone number",
      optional: true,
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "The person's first name",
      optional: true,
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "The person's last name",
      optional: true,
    },
    address: {
      type: "string",
      label: "Street Address",
      description: "The person's street address",
      optional: true,
    },
    city: {
      type: "string",
      label: "City",
      description: "The person's city",
      optional: true,
    },
    state: {
      type: "string",
      label: "State",
      description: "The person's state",
      optional: true,
    },
    postcode: {
      type: "string",
      label: "Postcode",
      description: "The person's postcode",
      optional: true,
    },
  },
  async run({ $ }) {
    if (
      !this.email
      && !(this.address && this.city && this.state)
      && !(this.phone && this.lastName)
    ) {
      throw new ConfigurationError("You must provide at least one of the following combinations to retrieve a match: (address + city + state), (email), or (phone + lastName)");
    }

    const response = await this.faraday.generatePrediction({
      $,
      targetId: this.targetId,
      data: {
        email: this.email,
        phone: this.phone,
        person_first_name: this.firstName,
        person_last_name: this.lastName,
        house_number_and_street: this.address,
        city: this.city,
        state: this.state,
        postcode: this.postcode,
      },
    });
    $.export("$summary", "Prediction generated successfully");
    return response;
  },
};

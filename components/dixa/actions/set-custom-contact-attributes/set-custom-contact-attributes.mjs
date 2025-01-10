import dixa from "../../dixa.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "dixa-set-custom-contact-attributes",
  name: "Set Custom Contact Attributes",
  description: "Updates custom attributes for a specified user. [See the documentation]()",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    dixa,
    userId: {
      propDefinition: [
        dixa,
        "userId",
      ],
    },
    attributes: {
      propDefinition: [
        dixa,
        "attributes",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.dixa.updateCustomAttributes({
      userId: this.userId,
      attributes: this.attributes,
    });
    $.export("$summary", `Updated custom attributes for user ${this.userId}`);
    return response;
  },
};

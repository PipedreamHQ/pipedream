import elastic_email from "../../elastic_email.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "elastic_email-unsubscribe-contact",
  name: "Unsubscribe Contact",
  description: "Unsubscribes a contact from future emails. [See the documentation]()",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    elastic_email,
    unsubscribeEmail: {
      propDefinition: [
        "elastic_email",
        "unsubscribeEmail",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.elastic_email.unsubscribeContact();
    $.export("$summary", `Unsubscribed contact ${this.unsubscribeEmail} successfully`);
    return response;
  },
};

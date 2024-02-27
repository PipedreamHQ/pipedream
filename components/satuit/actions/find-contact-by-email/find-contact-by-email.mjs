import satuit from "../../satuit.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "satuit-find-contact-by-email",
  name: "Find Contact by Email",
  description: "Searches for a specific contact within the Satuit platform using an email address as the key identifier. [See the documentation](https://satuittechnologies.zendesk.com/hc/en-us/articles/360055725213-satuit-rest-api-postman-documentation)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    satuit,
    emailAddress: {
      propDefinition: [
        satuit,
        "emailAddress",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.satuit.searchContactByEmail({
      emailAddress: this.emailAddress,
    });
    $.export("$summary", `Successfully found contact by email: ${this.emailAddress}`);
    return response;
  },
};

import { parseObject } from "../../common/utils.mjs";
import app from "../../elastic_email.app.mjs";

export default {
  key: "elastic_email-unsubscribe-contact",
  name: "Unsubscribe Contact",
  description: "Unsubscribes a contact from future emails. [See the documentation](https://elasticemail.com/developers/api-documentation/rest-api#operation/suppressionsUnsubscribesPost)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    unsubscribeEmails: {
      propDefinition: [
        app,
        "unsubscribeEmails",
      ],
    },
  },
  async run({ $ }) {
    const parsedEmails = parseObject(this.unsubscribeEmails);
    const response = await this.app.unsubscribeContact({
      $,
      data: parsedEmails,
    });
    $.export("$summary", `Unsubscribed ${parsedEmails.length} contact(s) successfully`);
    return response;
  },
};

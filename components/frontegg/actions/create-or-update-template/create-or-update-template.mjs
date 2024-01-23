import frontegg from "../../frontegg.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "frontegg-create-or-update-template",
  name: "Create or Update Template",
  description: "Create or update an email template in Frontegg. [See the documentation](https://docs.frontegg.com/reference/mailv1controller_addorupdatetemplate-2)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    frontegg,
    type: {
      propDefinition: [
        frontegg,
        "type",
      ],
    },
    senderEmail: {
      propDefinition: [
        frontegg,
        "senderEmail",
      ],
    },
    redirectURL: {
      propDefinition: [
        frontegg,
        "redirectURL",
      ],
    },
    htmlTemplate: {
      propDefinition: [
        frontegg,
        "htmlTemplate",
      ],
    },
    subject: {
      propDefinition: [
        frontegg,
        "subject",
      ],
    },
    fromName: {
      propDefinition: [
        frontegg,
        "fromName",
      ],
    },
    successRedirectUrl: {
      propDefinition: [
        frontegg,
        "successRedirectUrl",
      ],
    },
    active: {
      propDefinition: [
        frontegg,
        "active",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.frontegg.createOrUpdateTemplate({
      type: this.type,
      senderEmail: this.senderEmail,
      redirectURL: this.redirectURL,
      htmlTemplate: this.htmlTemplate,
      subject: this.subject,
      fromName: this.fromName,
      successRedirectUrl: this.successRedirectUrl,
      active: this.active,
    });

    $.export("$summary", `Template ${this.type} created or updated successfully`);
    return response;
  },
};

import frontegg from "../../frontegg.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "frontegg-create-or-update-configuration",
  name: "Create or Update Configuration",
  description: "Create or update a configuration in Frontegg. [See the documentation](https://docs.frontegg.com/reference/mailconfigcontroller_createorupdatemailconfig)",
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
    sendGridSecretKey: {
      propDefinition: [
        frontegg,
        "sendGridSecretKey",
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
      sendGridSecretKey: this.sendGridSecretKey,
    });

    $.export("$summary", "Successfully created or updated the configuration");
    return response;
  },
};

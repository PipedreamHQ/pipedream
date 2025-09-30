import frontegg from "../../frontegg.app.mjs";

export default {
  key: "frontegg-create-template",
  name: "Create Template",
  description: "Create an email template in Frontegg. [See the documentation](https://docs.frontegg.com/reference/mailv1controller_addorupdatetemplate-2)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
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
      optional: false,
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
      $,
      data: {
        type: this.type,
        senderEmail: this.senderEmail,
        redirectURL: this.redirectURL,
        htmlTemplate: this.htmlTemplate,
        subject: this.subject,
        fromName: this.fromName,
        successRedirectUrl: this.successRedirectUrl,
        active: this.active,
      },
    });

    $.export("$summary", `Successfully created template with ID ${response.id}`);
    return response;
  },
};

import sparkpost from "../../sparkpost.app.mjs";

export default {
  key: "sparkpost-send-email",
  name: "Send Email",
  description: "Send an email using a template in SparkPost. [See the documentation](https://developers.sparkpost.com/api/transmissions/#transmissions-post-send-a-template)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    sparkpost,
    templateId: {
      propDefinition: [
        sparkpost,
        "templateId",
      ],
    },
    recipients: {
      type: "string[]",
      label: "Recipients",
      description: "The email addresses of the recipients",
    },
    description: {
      type: "string",
      label: "Description",
      description: "A description for the transmission",
      optional: true,
    },
    useDraftTemplate: {
      type: "boolean",
      label: "Use Draft Template",
      description: "Whether to use the draft version. If this is set to `true` and no draft exists, the transmission will fail.",
      optional: true,
    },
    sandbox: {
      type: "boolean",
      label: "Sandbox",
      description: "Whether to use the sandbox sending domain",
      optional: true,
    },
  },
  async run({ $ }) {
    const recipients = this.recipients.map((email) => ({
      address: {
        email,
      },
    }));
    const response = await this.sparkpost.sendTransmission({
      $,
      data: {
        options: {
          sandbox: this.sandbox,
        },
        recipients,
        content: {
          template_id: this.templateId,
          use_draft_template: this.useDraftTemplate,
        },
        description: this.description,
      },
    });
    $.export("$summary", "Email successfully sent");
    return response;
  },
};

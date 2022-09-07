import common from "../common";

export default {
  ...common,
  key: "smtp2go-send-single-email",
  name: "Send Single Email with Template",
  description: "Send a single email with SMTP2GO using a pre-defined template and data object [(See docs here)](https://apidoc.smtp2go.com/documentation/#/POST%20/email/send)",
  version: "0.1.0",
  type: "action",
  props: {
    subject: {
      type: "string",
      label: "Subject",
      description: "Email subject.",
    },
    templateId: {
      type: "string",
      label: "Template ID",
      description: "The ID of the pre-defined template in SMTP2GO.",      
    },
    templateModel: {
      type: "object",
      label: "Template Model",
      description:
        "The model to be applied to the specified template to generate the email body and subject.",
    },
    // The above props are intentionally placed first
    ...common.props,
  },
  async run({ $ }) {
    const data = {
      ...this.getActionRequestCommonData(),
      template_id: this.templateId,
      template_data: this.templateModel
    };
    const response = await this.smtp2go.sendSingleEmailWithTemplate($, data, this.ignoreFailures);
    $.export("$summary", `Sent email successfully with email ID ${response.data.email_id}`);
    return response;
  },
};

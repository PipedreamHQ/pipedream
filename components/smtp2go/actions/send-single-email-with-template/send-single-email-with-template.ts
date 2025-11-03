import smtp2go from "../../app/smtp2go.app";
import common from "../common";

export default {
  ...common,
  key: "smtp2go-send-single-email-with-template",
  name: "Send Single Email with Template",
  description: "Send a single email with SMTP2GO using a pre-defined template and data object [(See docs here)](https://apidoc.smtp2go.com/documentation/#/POST%20/email/send)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    smtp2go,
    subject: {
      type: "string",
      label: "Subject",
      description: "Email subject.",
    },
    templateId: {
      propDefinition: [
        smtp2go,
        "templateId",
      ],
      reloadProps: true,
    },
    // The above props are intentionally placed first
    ...common.props,
  },
  async additionalProps() {
    const props = {};
    const { template_variables: variables } = await this.smtp2go.getTemplate(this.templateId);
    for (const key of Object.keys(variables)) {
      props[key] = {
        type: "string",
        label: key,
        description: `Value for ${key}`,
        optional: true,
      };
    }
    return props;
  },
  async run({ $ }) {
    const data = {
      ...this.getActionRequestCommonData(),
      template_id: this.templateId,
      template_data: {},
    };
    const { template_variables: variables } = await this.smtp2go.getTemplate(this.templateId);
    for (const key of Object.keys(variables)) {
      if (this[key]) {
        data.template_data[key] = this[key];
      }
    }
    const response = await this.smtp2go.sendSingleEmailWithTemplate($, data, this.ignoreFailures);
    $.export("$summary", `Sent email successfully with email ID ${response.data.email_id}`);
    return response;
  },
};

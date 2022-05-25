import postmark from "../../postmark.app.mjs";
import common from "../common.mjs";

export default {
  ...common,
  key: "postmark-send-email-with-template",
  name: "Send Email With Template",
  description: "Send a single email with Postmark using a template [(See docs here)](https://postmarkapp.com/developer/api/templates-api#email-with-template)",
  version: "0.0.1",
  type: "action",
  props: {
    ...common.props,
    templateAlias: {
      propDefinition: [
        postmark,
        "templateAlias",
      ],
    },
    templateModel: {
      type: "object",
      label: "Template Model",
      description:
        "The model to be applied to the specified template to generate the email body and subject.",
    },
    inlineCss: {
      type: "boolean",
      label: "Inline CSS",
      description:
        "By default, if the specified template contains an HTMLBody, Postmark will apply the style blocks as inline attributes to the rendered HTML content. You may opt-out of this behavior by passing false for this request field.",
      optional: true,
    },
  },
  async run({ $ }) {
    const data = {
      ...this.getActionRequestCommonData(),
      TemplateAlias: this.templateAlias,
      TemplateModel: this.templateModel,
      InlineCSS: this.inlineCss,
    };
    const response = await this.postmark.sendEmailWithTemplate($, data);
    $.export("$summary", "Sent email with template successfully");
    return response;
  },
};

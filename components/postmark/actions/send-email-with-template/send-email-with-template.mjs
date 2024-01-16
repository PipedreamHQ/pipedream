import common from "../common/common.mjs";
import templateProps from "../common/templateProps.mjs";

export default {
  ...common,
  key: "postmark-send-email-with-template",
  name: "Send Email With Template",
  description: "Send a single email with Postmark using a template [See the documentation](https://postmarkapp.com/developer/api/templates-api#email-with-template)",
  version: "0.0.2",
  type: "action",
  props: {
    ...common.props,
    ...templateProps,
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

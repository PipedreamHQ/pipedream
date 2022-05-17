import postmark from "../../postmark.app.mjs";

let objSharedProps = {};
postmark.methods.listSharedProps().forEach((propName) => {
  objSharedProps[propName] = {
    propDefinition: [
      postmark,
      propName,
    ],
  };
});

export default {
  key: "postmark-send-email-with-template",
  name: "Send Email With Template",
  description: "Send a single email with Postmark using a template [(See docs here)](https://postmarkapp.com/developer/api/templates-api#email-with-template)",
  version: "0.1.23",
  type: "action",
  props: {
    postmark,
    template_alias: {
      type: "string",
      label: "Template",
      description: "The template to use for this email.",
      options() {
        return this.postmark.listTemplates();
      },
    },
    template_model: {
      type: "object",
      label: "Template Model",
      description:
        "The model to be applied to the specified template to generate the email body and subject.",
    },
    inline_css: {
      type: "boolean",
      label: "Inline CSS",
      description:
        "By default, if the specified template contains an HTMLBody, Postmark will apply the style blocks as inline attributes to the rendered HTML content. You may opt-out of this behavior by passing false for this request field.",
      optional: true,
    },
    ...objSharedProps,
  },
  async run({ $ }) {
    return this.postmark.sharedActionRequest($, this, "email/withTemplate", {
      TemplateAlias: this.template_alias,
      TemplateModel: this.template_model,
      InlineCSS: this.inline_css,
    });
  },
};

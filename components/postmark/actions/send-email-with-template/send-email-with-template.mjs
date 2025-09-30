import common from "../common/common.mjs";

const {
  postmark, ...props
} = common.props;

export default {
  ...common,
  key: "postmark-send-email-with-template",
  name: "Send Email With Template",
  description: "Send a single email with Postmark using a template [See the documentation](https://postmarkapp.com/developer/api/templates-api#email-with-template)",
  version: "0.0.5",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    postmark,
    templateAlias: {
      type: "string",
      label: "Template",
      description: "The template to use for this email.",
      async options ({ page }) {
        const data = await this.postmark.listTemplates(page);
        const options = data.Templates?.map((obj) => {
          return {
            label: obj.Name,
            value: obj.Alias,
          };
        }) ?? [];

        return {
          options,
          context: {
            page,
          },
        };
      },
    },
    templateModel: {
      type: "object",
      label: "Template Model",
      description:
        "The model to be applied to the specified template to generate the email body and subject.",
    },
    ...props,
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
      ...this.getTemplateRequestData(),
      InlineCSS: this.inlineCss,
    };
    const response = await this.postmark.sendEmailWithTemplate({
      $,
      data,
    });
    $.export("$summary", "Sent email with template successfully");
    return response;
  },
};

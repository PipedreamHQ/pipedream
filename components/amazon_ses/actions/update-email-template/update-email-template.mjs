import base from "../common/base.mjs";
import constants from "../common/constants.mjs";

export default {
  key: "amazon_ses-update-email-template",
  name: "Update Email Template",
  description: "Update an email template. [See the docs](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-sesv2/classes/updateemailtemplatecommand.html)",
  version: "0.0.1",
  type: "action",
  props: {
    ...base.props,
    TemplateName: {
      propDefinition: [
        base.props.amazonSes,
        "TemplateName",
        (c) => ({
          region: c.region,
        }),
      ],
      reloadProps: true,
    },
  },
  async additionalProps() {
    /**
     * This endpoint requires Subject and one of Html or Text values so we are getting the
     * default values
     */
    if (this.TemplateName) {
      const { TemplateContent } = await this.amazonSes.getEmailTemplate(this.region, {
        TemplateName: this.TemplateName,
      });
      return this.createTemplateProps(TemplateContent);
    }
  },
  methods: {
    createTemplateProps(TemplateContent) {
      const baseProps = base.props.amazonSes.propDefinitions;
      const Subject = baseProps.Subject;
      const Html = baseProps.Html;
      const Text = baseProps.Text;
      const props = {
        Subject: {
          type: Subject.type,
          label: Subject.label,
          description: Subject.description,
          default: TemplateContent.Subject,
        },
        Html: {
          type: Html.type,
          label: Html.label,
          description: Html.description,
          default: TemplateContent.Html,
        },
        Text: {
          type: Text.type,
          label: Text.label,
          description: `The email body that will be visible to recipients whose email clients do not display HTML. ${constants.TAGNAME_DESCRIPTION}`,
          default: TemplateContent.Text,
        },
      };
      return props;
    },
  },
  async run({ $ }) {
    const params = {
      TemplateName: this.TemplateName,
      TemplateContent: {
        Subject: this.amazonSes.replaceCurlyBrackets(this.Subject),
        Html: this.amazonSes.replaceCurlyBrackets(this.Html),
        Text: this.amazonSes.replaceCurlyBrackets(this.Text),
      },
    };
    const response = await this.amazonSes.updateEmailTemplate(this.region, params);
    $.export("$summary", "Successfully updated email template");
    return response;
  },
};

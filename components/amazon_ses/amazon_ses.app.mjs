import aws from "@pipedream/aws";
import {
  SESClient,
  SendTemplatedEmailCommand,
} from "@aws-sdk/client-ses";
import {
  SESv2Client,
  SendEmailCommand,
  CreateEmailTemplateCommand,
  GetEmailTemplateCommand,
  ListEmailTemplatesCommand,
  UpdateEmailTemplateCommand,
} from "@aws-sdk/client-sesv2";
import constants from "./actions/common/constants.mjs";

export default {
  type: "app",
  app: "amazon_ses",
  propDefinitions: {
    ...aws.propDefinitions,
    TemplateName: {
      type: "string",
      label: "Template Name",
      description: "The email template name",
      async options({
        prevContext, region,
      }) {
        const {
          NextToken,
          TemplatesMetadata: templates,
        } = await this.listEmailTemplates(region, {
          NextToken: prevContext.NextToken,
        });
        return {
          options: templates.map((template) => template.TemplateName),
          context: {
            NextToken,
          },
        };
      },
    },
    ToAddresses: {
      type: "string[]",
      label: "To Addresses",
      description: "An array of recipient email addresses you want to send to",
    },
    CcAddresses: {
      type: "string[]",
      label: "CC Addresses",
      description: "An array of email addresses you want to CC",
      optional: true,
    },
    BccAddresses: {
      type: "string[]",
      label: "BCC Addresses",
      description: "An array of email addresses you want to BCC",
      optional: true,
    },
    ReplyToAddresses: {
      type: "string[]",
      label: "Reply To Addresses",
      description: "An array of reply-to addresses",
      optional: true,
    },
    FromEmailAddress: {
      type: "string",
      label: "From",
      description: "The email from which the email is addressed",
    },
    Subject: {
      type: "string",
      label: "Subject",
      description: `The email subject line. ${constants.TAGNAME_DESCRIPTION}`,
    },
    Text: {
      type: "string",
      label: "Text",
      description: `The email body that will be visible to recipients whose email clients do not display HTML. ${constants.TAGNAME_DESCRIPTION}`,
    },
    Html: {
      type: "string",
      label: "HTML",
      description: `The HTML email body. ${constants.TAGNAME_DESCRIPTION}`,
    },
  },
  methods: {
    ...aws.methods,
    _clientV1(region) {
      return this.getAWSClient(SESClient, region);
    },
    _clientV2(region) {
      return this.getAWSClient(SESv2Client, region);
    },
    createCharsetContent(Data, Charset = constants.UTF_8) {
      return {
        Charset,
        Data,
      };
    },
    replaceCurlyBrackets(text) {
      return text
        ? text.replace(/\\{/g, "{").replace(/\\}/g, "}")
        : undefined;
    },
    async sendEmail(region, params) {
      return this._clientV2(region).send(new SendEmailCommand(params));
    },
    async sendTemplatedEmail(region, params) {
      return this._clientV1(region).send(new SendTemplatedEmailCommand(params));
    },
    async getEmailTemplate(region, params) {
      return this._clientV2(region).send(new GetEmailTemplateCommand(params));
    },
    async listEmailTemplates(region, params) {
      return this._clientV2(region).send(new ListEmailTemplatesCommand(params));
    },
    async createEmailTemplate(region, params) {
      return this._clientV2(region).send(new CreateEmailTemplateCommand(params));
    },
    async updateEmailTemplate(region, params) {
      return this._clientV2(region).send(new UpdateEmailTemplateCommand(params));
    },
  },
};

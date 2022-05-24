import aws from "../aws/aws.app.mjs";
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
      async options({ prevContext }) {
        const {
          NextToken,
          TemplatesMetadata: templates,
        } = await this.listEmailTemplates({
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
      description: `The plaintext email body. ${constants.TAGNAME_DESCRIPTION}`,
    },
    Html: {
      type: "string",
      label: "HTML",
      description: `The HTML email body. ${constants.TAGNAME_DESCRIPTION}`,
    },
  },
  methods: {
    ...aws.methods,
    _clientV1() {
      return this.getAWSClient(SESClient, this.region);
    },
    _clientV2() {
      return this.getAWSClient(SESv2Client, this.region);
    },
    createCharsetContent(Data, Charset = constants.UTF_8) {
      return {
        Charset,
        Data,
      };
    },
    replaceCurlyBrackets(text) {
      return text.replace(/\\{/g, "{").replace(/\\}/g, "}");
    },
    async sendEmail(params) {
      return this._clientV2().send(new SendEmailCommand(params));
    },
    async sendTemplatedEmail(params) {
      return this._clientV1().send(new SendTemplatedEmailCommand(params));
    },
    async getEmailTemplate(params) {
      return this._clientV2().send(new GetEmailTemplateCommand(params));
    },
    async listEmailTemplates(params) {
      return this._clientV2().send(new ListEmailTemplatesCommand(params));
    },
    async createEmailTemplate(params) {
      return this._clientV2().send(new CreateEmailTemplateCommand(params));
    },
    async updateEmailTemplate(params) {
      return this._clientV2().send(new UpdateEmailTemplateCommand(params));
    },
  },
};

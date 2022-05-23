import aws from "../aws/aws.app.mjs";
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
    Subject: {
      type: "string",
      label: "Subject",
      description: "The email subject line",
    },
    Text: {
      type: "string",
      label: "Text",
      description: "The plaintext email body",
    },
    Html: {
      type: "string",
      label: "HTML",
      description: "The HTML email body",
    },
  },
  methods: {
    ...aws.methods,
    _client() {
      return this.getAWSClient(SESv2Client, this.region);
    },
    createCharsetContent(Data, Charset = constants.UTF_8) {
      return {
        Charset,
        Data,
      };
    },
    async sendEmail(params) {
      return this._client().send(new SendEmailCommand(params));
    },
    async getEmailTemplate(params) {
      return this._client().send(new GetEmailTemplateCommand(params));
    },
    async listEmailTemplates(params) {
      return this._client().send(new ListEmailTemplatesCommand(params));
    },
    async createEmailTemplate(params) {
      return this._client().send(new CreateEmailTemplateCommand(params));
    },
    async updateEmailTemplate(params) {
      return this._client().send(new UpdateEmailTemplateCommand(params));
    },
  },
};

import {
  EmailWebhook,
  MailerSend,
  EmailParams,
  Sender,
  Recipient,
} from "mailersend";

export default {
  type: "app",
  app: "mailersend",
  propDefinitions: {
    domainId: {
      type: "string",
      label: "Domain ID",
      description: "The id of a verified domain.",
      async options({ prevContext }) {
        const page = prevContext?.nextPage || 0;
        const { body: response } = await this.listDomains({
          page,
        });
        return {
          options: response.data.map((item) => ({
            label: item.name,
            value: item.id,
          })),
          context: {
            nextPage: page + 1,
          },
        };
      },
    },
    templateId: {
      type: "string",
      label: "Template ID",
      description: "The id of an email template.",
      async options({ domainId }) {
        if (!domainId) {
          return [];
        }
        const { body: response } = await this.listTemplates({
          domainId,
        });
        return response.data.map((item) => ({
          label: item.name,
          value: item.id,
        }));
      },
    },
    fromEmail: {
      type: "string",
      label: "From Email",
      description: "The 'From' email address used to deliver the message. This address should be a verified sender in your MailerSend account.",
    },
    fromName: {
      type: "string",
      label: "From Name",
      description: "A name or title associated with the sending email address.",
    },
    toEmail: {
      type: "string",
      label: "To Email",
      description: "The intended recipient's email address.",
    },
    toName: {
      type: "string",
      label: "To Name",
      description: "The intended recipient's name.",
      optional: true,
    },
    subject: {
      type: "string",
      label: "Subject",
      description: "The email subject.",
    },
    substitutions: {
      type: "object",
      label: "Variables Substitutions",
      description: "Dynamic variables that should be replaced on the email. e.g: `{ \"company\": \"MailerSend\" }`.",
      optional: true,
    },
  },
  methods: {
    getApiKey() {
      return this.$auth.api_token;
    },
    getClient() {
      const mailerSend = new MailerSend({
        apiKey: this.getApiKey(),
      });
      return mailerSend;
    },
    listDomains({ page }) {
      return this.getClient().email.domain.list({
        queryParams: {
          page,
          verified: true,
        },
      });
    },
    listTemplates({ domainId }) {
      return this.getClient().email.template.list({
        queryParams: {
          domain_id: domainId,
        },
      });
    },
    async sendEmail({
      fromEmail,
      fromName,
      toEmail,
      toName,
      templateId,
      subject,
      text,
      html,
      variables,
    }) {
      const sentFrom = new Sender(fromEmail, fromName);

      const recipients = [
        new Recipient(toEmail, toName),
      ];

      let emailParams = new EmailParams()
        .setFrom(sentFrom)
        .setTo(recipients)
        .setReplyTo(sentFrom)
        .setSubject(subject);

      if (variables && variables.length) {
        emailParams = emailParams.setVariables(variables);
      }

      if (templateId) {
        emailParams = emailParams
          .setTemplateId(templateId);
      } else {
        emailParams = emailParams
          .setHtml(html)
          .setText(text);
      }

      try {
        const response = await this.getClient().email.send(emailParams);
        return response;
      } catch (ex) {
        throw new Error(ex?.body?.message || JSON.stringify(ex));
      }
    },
    createWebhook({
      url,
      domainId,
      events,
    }) {
      const emailWebhook = new EmailWebhook()
        .setName("pipedream")
        .setUrl(url)
        .setDomainId(domainId)
        .setEnabled(true)
        .setEvents(events);

      return this.getClient().email.webhook.create(emailWebhook);
    },
    deleteWebhook({ webhookId }) {
      return this.getClient().email.webhook.delete(webhookId);
    },
    parseVariables(toEmail, substitutions) {
      const variablesMap = [];
      if (substitutions && Object.keys(substitutions).length) {
        const substitutionsMapped = [];
        for (const key of Object.keys(substitutions)) {
          substitutionsMapped.push({
            var: key,
            value: substitutions[key],
          });
        }
        variablesMap.push({
          email: toEmail,
          substitutions: substitutionsMapped,
        });
      }
      return variablesMap;
    },
  },
};

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
      description: "The id of a verified domain",
      async options({ prevContext }) {
        const page = (prevContext?.nextPage || 0);
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
      description: "The id of an email template, must select the domain first.",
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
    sendEmail({
      fromEmail,
      fromName,
      toEmail,
      toName,
      templateId,
      subject,
      text,
      html,
    }) {

      const sentFrom = new Sender(fromEmail, fromName);

      const recipients = [
        new Recipient(toEmail, toName),
      ];

      let emailParams = new EmailParams()
        .setFrom(sentFrom)
        .setTo(recipients)
        .setReplyTo(sentFrom);

      if (templateId) {
        emailParams = emailParams
          .setTemplateId(templateId);
      } else {
        emailParams = emailParams
          .setSubject(subject)
          .setHtml(html)
          .setText(text);
      }

      return this.getClient().email.send(emailParams);
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
  },
};

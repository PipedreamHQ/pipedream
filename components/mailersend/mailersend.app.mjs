import {
  EmailWebhook,
  MailerSend,
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
      return this.getClient({
        page,
        verified: true,
      }).email.domain.list();
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

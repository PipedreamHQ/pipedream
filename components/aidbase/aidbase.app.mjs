import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "aidbase",
  propDefinitions: {
    knowledgeItemId: {
      type: "string",
      label: "Knowledge Item ID",
      description: "The ID of the knowledge item to trigger training for",
      async options() {
        const { data: { items } } = await this.listKnowledgeItems();
        return items?.map(({
          id, type,
        }) => ({
          value: id,
          label: `${id} - ${type}`,
        })) || [];
      },
    },
    emailInboxId: {
      type: "string",
      label: "Email Inbox ID",
      description: "The ID of the email inbox",
      async options() {
        const { data: { items } } = await this.listEmailInboxes();
        return items?.map(({
          id: value, title: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    ticketFormId: {
      type: "string",
      label: "Ticket Form ID",
      description: "The ID of the ticket form",
      async options() {
        const { data: { items } } = await this.listTicketForms();
        return items?.map(({
          id: value, title: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    chatbotId: {
      type: "string",
      label: "Chatbot ID",
      description: "The ID of the chatbot",
      async options() {
        const { data: { items } } = await this.listChatbots();
        return items?.map(({
          id: value, title: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    faqId: {
      type: "string",
      label: "FAQ ID",
      description: "The ID of the FAQ to add a question to",
      async options() {
        const { data: { items } } = await this.listKnowledgeItems();
        const faqs = items?.filter(({ type }) => type === "faq") || [];
        return faqs?.map(({
          id: value, title: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.aidbase.ai/v1";
    },
    _headers() {
      return {
        Authorization: `Bearer ${this.$auth.api_key}`,
      };
    },
    _makeRequest({
      $ = this,
      path,
      ...args
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(),
        ...args,
      });
    },
    listKnowledgeItems(opts = {}) {
      return this._makeRequest({
        path: "/knowledge",
        ...opts,
      });
    },
    listEmailInboxes(opts = {}) {
      return this._makeRequest({
        path: "/email-inboxes",
        ...opts,
      });
    },
    listTicketForms(opts = {}) {
      return this._makeRequest({
        path: "/ticket-forms",
        ...opts,
      });
    },
    listChatbots(opts = {}) {
      return this._makeRequest({
        path: "/chatbots",
        ...opts,
      });
    },
    listEmailInboxKnowledgeItems({
      emailInboxId, ...opts
    }) {
      return this._makeRequest({
        path: `/email-inbox/${emailInboxId}/knowledge`,
        ...opts,
      });
    },
    listTicketFormKnowledgeItems({
      ticketFormId, ...opts
    }) {
      return this._makeRequest({
        path: `/ticket-form/${ticketFormId}/knowledge`,
        ...opts,
      });
    },
    listChatbotKnowledgeItems({
      chatbotId, ...opts
    }) {
      return this._makeRequest({
        path: `/chatbot/${chatbotId}/knowledge`,
        ...opts,
      });
    },
    createVideo(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/knowledge/video",
        ...opts,
      });
    },
    createFaq(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/knowledge/faq",
        ...opts,
      });
    },
    createFaqItem({
      faqId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/knowledge/${faqId}/faq-item`,
        ...opts,
      });
    },
    startTraining({
      knowledgeItemId, ...opts
    }) {
      return this._makeRequest({
        method: "PUT",
        path: `/knowledge/${knowledgeItemId}/train`,
        ...opts,
      });
    },
  },
};

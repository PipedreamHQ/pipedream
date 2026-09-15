import { axios } from "@pipedream/platform";

const DOCS_URL = "https://crpro.com.br/integracoes/whatsapp-com-pipedream";

export default {
  type: "app",
  app: "crpro",
  propDefinitions: {
    connectedPhone: {
      type: "string",
      label: "Connected Number",
      description: `The WhatsApp number connected to CRPRO that this operation runs through. Digits only, in international format, with no \`+\`, spaces or punctuation — e.g. \`5511999999999\` for a São Paulo number. This is one of your own numbers, not the recipient's; find the ones connected to your organization under Settings → WhatsApp in CRPRO. [See the documentation](${DOCS_URL})`,
    },
    contactId: {
      type: "string",
      label: "Contact",
      description: "The CRPRO contact to act on, as a UUID such as `bad4699d-0507-414c-a408-4d0719d3e117`. Returned as `id` by **List Contacts** and by **Create a Contact**.",
      optional: true,
      async options({ page }) {
        const { data } = await this.listContacts({
          params: {
            limit: 100,
            offset: page * 100,
          },
        });
        return (data ?? []).map(({
          id, name, phone,
        }) => ({
          label: name
            ? `${name} (${phone})`
            : phone,
          value: id,
        }));
      },
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "Phone number in international format, digits only, with no `+`, spaces or punctuation — e.g. `5511999999999`. CRPRO matches Brazilian numbers across their 8- and 9-digit variants, so either form resolves to the same contact.",
    },
    recipientPhone: {
      type: "string",
      label: "Recipient Phone",
      description: "Phone of the person receiving the message, in international format, digits only, with no `+`, spaces or punctuation — e.g. `5511999999999`. Required unless **Contact** is set. CRPRO matches Brazilian numbers across their 8- and 9-digit variants, so either form resolves to the same contact.",
      optional: true,
    },
    pipelineId: {
      type: "string",
      label: "Pipeline",
      description: "The pipeline (kanban board) the deal belongs to, as a UUID returned by `GET /pipelines`. Leave empty to use the organization's default pipeline. Setting this also determines which stages **Stage** offers.",
      optional: true,
      async options() {
        const { data } = await this.listPipelines();
        return (data ?? []).map(({
          id, name,
        }) => ({
          label: name,
          value: id,
        }));
      },
    },
    stageId: {
      type: "string",
      label: "Stage",
      description: "The stage within the pipeline, as a UUID returned by `GET /pipelines` under each pipeline's `stages`. Stages belong to a pipeline, so this list is loaded from **Pipeline** — set that first, or leave both empty to land on the first stage of the default pipeline.",
      optional: true,
      async options({ pipelineId }) {
        const { data } = await this.listPipelines();
        const pipelines = data ?? [];
        const chosen = pipelineId
          ? pipelines.find(({ id }) => id === pipelineId)
          : pipelines.find(({ is_default: isDefault }) => isDefault) ?? pipelines[0];
        return (chosen?.stages ?? []).map(({
          id, name,
        }) => ({
          label: name,
          value: id,
        }));
      },
    },
    tags: {
      type: "string[]",
      label: "Tags",
      description: "Tag names, e.g. `[\"lead-quente\", \"black-friday\"]`. Tags are referenced by name, not by ID. Existing tags in the organization are offered as suggestions; typing a name that does not exist yet creates it.",
      async options() {
        const { data } = await this.listTags();
        return (data ?? []).map(({ name }) => name);
      },
    },
    tagName: {
      type: "string",
      label: "Tag",
      description: "A single tag name, e.g. `lead-quente`. Tags are referenced by name, not by ID.",
      optional: true,
      async options() {
        const { data } = await this.listTags();
        return (data ?? []).map(({ name }) => name);
      },
    },
    messageType: {
      type: "string",
      label: "Type",
      description: "The kind of message to send. `text` sends the text in **Message**; `image`, `audio`, `video` and `document` send the file at **Media URL**.",
      options: [
        "text",
        "image",
        "audio",
        "video",
        "document",
      ],
      default: "text",
    },
    message: {
      type: "string",
      label: "Message",
      description: "The message body, e.g. `Olá! Seu pedido foi confirmado.`. Required when **Type** is `text`, ignored otherwise.",
      optional: true,
    },
    mediaUrl: {
      type: "string",
      label: "Media URL",
      description: "Publicly reachable HTTPS URL of the file to send, e.g. `https://example.com/nota-fiscal.pdf`. WhatsApp downloads it server-side, so it cannot require authentication. Required when **Type** is anything other than `text`.",
      optional: true,
    },
    caption: {
      type: "string",
      label: "Caption",
      description: "Text shown alongside the media, e.g. `Segue sua nota fiscal`. Only applies when **Type** is not `text`.",
      optional: true,
    },
    events: {
      type: "string[]",
      label: "Events",
      description: "The CRPRO event types to subscribe to, e.g. `[\"contact.created\", \"deal.stage_changed\"]`. The full list is served by `GET /webhook-events` and offered below; picking none subscribes to nothing.",
      async options() {
        const { data } = await this.listWebhookEvents();
        return (data ?? []).map(({
          type, label,
        }) => ({
          label,
          value: type,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://app.crpro.com.br/api/v1";
    },
    _headers() {
      return {
        "x-api-key": this.$auth.api_key,
        "Content-Type": "application/json",
      };
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(),
        ...opts,
      });
    },
    /**
     * Lists contacts, optionally filtered by search term, tag or status.
     *
     * @param {object} [opts] - Axios options; `params` accepts `search`,
     * `tag`, `status`, `limit` and `offset`.
     * @returns {Promise<object>} `{ data, pagination }`.
     */
    listContacts(opts = {}) {
      return this._makeRequest({
        path: "/contacts",
        ...opts,
      });
    },
    /**
     * Creates a contact, or updates it when the phone already exists in the
     * organization.
     *
     * @param {object} [opts] - Axios options; `data` carries the contact.
     * @returns {Promise<object>} `{ data }` with the saved contact.
     */
    createContact(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/contacts",
        ...opts,
      });
    },
    /**
     * Sends a WhatsApp message through a number connected as a session
     * (unofficial). Numbers on the official Cloud API are rejected.
     *
     * @param {object} [opts] - Axios options; `data` carries the message.
     * @returns {Promise<object>} `{ data }` with the delivery receipt.
     */
    sendMessage(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/messages/send",
        ...opts,
      });
    },
    /**
     * Sends a WhatsApp message through a number on the official Cloud API,
     * within the 24-hour customer service window.
     *
     * @param {object} [opts] - Axios options; `data` carries the message.
     * @returns {Promise<object>} `{ data }` with the delivery receipt.
     */
    sendOfficialMessage(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/messages/official/send",
        ...opts,
      });
    },
    /**
     * Sends a template approved by Meta through the official Cloud API.
     *
     * @param {object} [opts] - Axios options; `data` carries the template.
     * @returns {Promise<object>} `{ data }` with the delivery receipt.
     */
    sendTemplate(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/messages/official/send-template",
        ...opts,
      });
    },
    /**
     * Lists the templates registered for a WhatsApp number on the official
     * Cloud API.
     *
     * @param {object} [opts] - Axios options; `params` accepts
     * `connected_phone` and `status` (defaults to `APPROVED`).
     * @returns {Promise<object>} `{ provider, source, templates }`.
     */
    listTemplates(opts = {}) {
      return this._makeRequest({
        path: "/messages/official/templates",
        ...opts,
      });
    },
    /**
     * Creates a deal, resolving or creating the contact from a phone number.
     *
     * @param {object} [opts] - Axios options; `data` carries the deal.
     * @returns {Promise<object>} `{ data }` with the created deal.
     */
    createDeal(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/deals",
        ...opts,
      });
    },
    /**
     * Updates a deal — its title, value, status or stage.
     *
     * @param {object} opts - Axios options.
     * @param {string} opts.dealId - UUID of the deal to update.
     * @returns {Promise<object>} `{ data }` with the updated deal.
     */
    updateDeal({
      dealId, ...opts
    }) {
      return this._makeRequest({
        method: "PATCH",
        path: `/deals/${dealId}`,
        ...opts,
      });
    },
    /**
     * Lists the organization's pipelines, each with its `stages`.
     *
     * @param {object} [opts] - Axios options.
     * @returns {Promise<object>} `{ data }`.
     */
    listPipelines(opts = {}) {
      return this._makeRequest({
        path: "/pipelines",
        ...opts,
      });
    },
    /**
     * Writes an internal note on a contact, never delivered to the customer.
     *
     * @param {object} opts - Axios options.
     * @param {string} opts.contactId - UUID of the contact.
     * @returns {Promise<object>} `{ data }` with the created note.
     */
    addNote({
      contactId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/contacts/${contactId}/notes`,
        ...opts,
      });
    },
    /**
     * Applies tags to a contact, creating any that do not exist yet.
     *
     * @param {object} opts - Axios options.
     * @param {string} opts.contactId - UUID of the contact.
     * @returns {Promise<object>} `{ data }` with the contact's tags.
     */
    addTags({
      contactId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/contacts/${contactId}/tags`,
        ...opts,
      });
    },
    /**
     * Lists the tags in use in the organization.
     *
     * @param {object} [opts] - Axios options.
     * @returns {Promise<object>} `{ data }`.
     */
    listTags(opts = {}) {
      return this._makeRequest({
        path: "/tags",
        ...opts,
      });
    },
    /**
     * Lists the event types a webhook can subscribe to.
     *
     * @param {object} [opts] - Axios options.
     * @returns {Promise<object>} `{ data }` of `{ type, label }`.
     */
    listWebhookEvents(opts = {}) {
      return this._makeRequest({
        path: "/webhook-events",
        ...opts,
      });
    },
    /**
     * Registers a webhook subscription.
     *
     * @param {object} [opts] - Axios options; `data` carries `url`, `events`
     * and `label`.
     * @returns {Promise<object>} `{ data }` with the created webhook.
     */
    createWebhook(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/webhooks",
        ...opts,
      });
    },
    /**
     * Removes a webhook subscription.
     *
     * @param {object} opts - Axios options.
     * @param {string} opts.hookId - UUID of the webhook to delete.
     * @returns {Promise<object>} The deletion result.
     */
    deleteWebhook({
      hookId, ...opts
    }) {
      return this._makeRequest({
        method: "DELETE",
        path: `/webhooks/${hookId}`,
        ...opts,
      });
    },
  },
};

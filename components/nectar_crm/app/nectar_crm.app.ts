import { defineApp } from "@pipedream/types";
import { axios } from "@pipedream/platform";

export default defineApp({
  type: "app",
  app: "nectar_crm",
  propDefinitions: {
    contactId: {
      label: "Contact ID",
      description: "The ID of the contact",
      type: "string",
      async options({ page }) {
        const contacts = await this.getContacts({
          page: page + 1,
        });

        return contacts.map((contact) => ({
          label: contact.nome,
          value: contact.id,
        }));
      },
    },
  },
  methods: {
    _apiToken() {
      return this.$auth.api_token;
    },
    _apiUrl() {
      return "https://app.nectarcrm.com.br/crm/api/1";
    },
    async _makeRequest(path, options: any = {}, $ = this) {
      return axios($, {
        ...options,
        url: `${this._apiUrl()}/${path}`,
        headers: {
          "Access-Token": this._apiToken(),
        },
      });
    },
    async getContacts({
      $, page,
    }) {
      return this._makeRequest("contatos", {
        params: {
          page: page ?? 1,
        },
      }, $);
    },
    async createContact({
      $, data,
    }) {
      return this._makeRequest("contatos", {
        method: "post",
        data,
      }, $);
    },
    async createTask({
      $, data,
    }) {
      return this._makeRequest("tarefas", {
        method: "post",
        data,
      }, $);
    },
    async createAppointment({
      $, data,
    }) {
      return this._makeRequest("compromissos", {
        method: "post",
        data,
      }, $);
    },
    async createSaleOpportunity({
      $, data,
    }) {
      return this._makeRequest("oportunidades", {
        method: "post",
        data,
      }, $);
    },
  },
});

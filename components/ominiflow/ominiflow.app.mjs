import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "ominiflow",
  propDefinitions: {
    templateName: {
      type: "string",
      label: "Template Name",
      description: "Select an approved WhatsApp template from your Ominiflow account",
      async options() {
        const templates = await this.getTemplates();
        if (!Array.isArray(templates)) {
          return [];
        }
        return templates.map((t) => ({
          label: `${t.name} (${t.language || "en"})`,
          value: t.name,
        }));
      },
    },
    groupId: {
      type: "string",
      label: "Contact Group",
      description: "Assign this contact to an Ominiflow group",
      optional: true,
      async options() {
        const groups = await this.getGroups();
        if (!Array.isArray(groups)) {
          return [];
        }
        return groups.map((g) => ({
          label: g.name,
          value: String(g.id),
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      const customUrl = this.$auth.base_url?.replace(/\/+$/, "");
      return customUrl || "https://whatsapp.ominiflow.com";
    },
    _headers() {
      return {
        "Authorization": `Bearer ${this.$auth.api_key}`,
        "Content-Type": "application/json",
        "Accept": "application/json",
      };
    },
    async _makeRequest({ $ = this, path, method = "GET", data = {}, params = {} }) {
      const url = `${this._baseUrl()}${path.startsWith("/") ? path : `/${path}`}`;
      const payload = typeof data === "object" && data !== null ? { ...data } : data;
      const queryParams = typeof params === "object" && params !== null ? { ...params } : params;

      if (this.$auth?.api_key) {
        if (method.toUpperCase() === "GET") {
          queryParams.token = queryParams.token || this.$auth.api_key;
        } else if (typeof payload === "object") {
          payload.token = payload.token || this.$auth.api_key;
        }
      }

      return axios($, {
        url,
        method,
        headers: this._headers(),
        data: payload,
        params: queryParams,
      });
    },
    async getAccountInfo($ = this) {
      return this._makeRequest({
        $,
        path: "/api/wpbox/me",
        method: "GET",
      });
    },
    async sendTextMessage({ $ = this, phone, message }) {
      return this._makeRequest({
        $,
        path: "/api/wpbox/sendmessage",
        method: "POST",
        data: {
          phone,
          message,
        },
      });
    },
    async sendTemplateMessage({ $ = this, phone, templateName, templateLanguage = "en", components = [] }) {
      return this._makeRequest({
        $,
        path: "/api/wpbox/sendtemplatemessage",
        method: "POST",
        data: {
          phone,
          template_name: templateName,
          template_language: templateLanguage,
          components,
        },
      });
    },
    async createOrUpdateContact({ $ = this, phone, name, email, groupId }) {
      return this._makeRequest({
        $,
        path: "/api/wpbox/updateContact",
        method: "POST",
        data: {
          phone,
          name,
          email,
          group_id: groupId,
        },
      });
    },
    async getTemplates($ = this) {
      const res = await this._makeRequest({
        $,
        path: "/api/wpbox/getTemplates",
        method: "GET",
      });
      return res?.data || res || [];
    },
    async getGroups($ = this) {
      const res = await this._makeRequest({
        $,
        path: "/api/wpbox/getGroups",
        method: "GET",
      });
      return res?.data || res || [];
    },
  },
};

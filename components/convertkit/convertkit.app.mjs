import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "convertkit",
  propDefinitions: {
    subscriber: {
      type: "string",
      label: "Subscriber",
      description: "Select a subscriber",
      async options({
        page, returnField,
      }) {
        const response = await this.listSubscribers({
          page: page + 1,
        });

        return response.subscribers.map((subscriber) => ({
          label: subscriber.first_name,
          value: subscriber[returnField],
        }));
      },
    },
    form: {
      type: "integer",
      label: "Form",
      description: "Select a form",
      async options() {
        const response = await this.listForms();
        return response.forms.map((form) => ({
          label: form.name,
          value: form.id,
        }));
      },
    },
  },
  methods: {
    _apiSecretToken() {
      return this.$auth.api_secret;
    },
    async createWebhook({
      target_url, event,
    }) {
      const options = {
        method: "post",
        data: {
          target_url,
          event,
        },
      };
      return this._makeRequest("automations/hooks", options);
    },
    async removeWebhook({ webhookId }) {
      return this._makeRequest(`automations/hooks/${webhookId}`, {
        method: "delete",
      });
    },
    async _makeRequest(path, options = {}, $ = this) {
      if (options.method.toLowerCase() === "get") {
        options.params = {
          ...options.params,
          api_secret: this._apiSecretToken(),
        };
      } else {
        options.data = {
          ...options.data,
          api_secret: this._apiSecretToken(),
        };
      }
      return axios($, {
        url: `${constants.API_HOST}${constants.API_VERSION}/${path}`,
        ...options,
      });
    },
    async *paginate({
      $, fn, payload,
    }, dataField = null) {
      do {
        const response = await fn({
          $,
          ...payload,
        });

        for (const d of (dataField
          ? response[dataField]
          : response)) {
          yield d;
        }
        if (response.total_pages > response.page) {
          payload.page++;
          return true;
        }
        break;
      } while (true);
    },
    async listSubscribers({
      $, ...params
    }) {
      return await this._makeRequest("subscribers", {
        method: "get",
        params,
      }, $);
    },
    async getSubscriber(subscriberId, $) {
      return await this._makeRequest(`subscribers/${subscriberId}`, {
        method: "get",
      }, $);
    },
    async listForms() {
      return await this._makeRequest("forms", {
        method: "get",
      });
    },
    async addSubscriberToForm(email, formId, $) {
      return await this._makeRequest(`forms/${formId}/subscribe`, {
        method: "post",
        data: {
          email,
        },
      }, $);
    },
    async listCourses() {
      return this._makeRequest("sequences", {
        method: "get",
      });
    },
    async listTags() {
      return this._makeRequest("tags", {
        method: "get",
      });
    },
  },
};

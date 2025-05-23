import { axios } from "@pipedream/platform";
import { LIMIT } from "./common/constants.mjs";

export default {
  type: "app",
  app: "selzy",
  propDefinitions: {
    listId: {
      type: "string",
      label: "List ID",
      description: "Code of the list on which the mailing will be sent.",
      async options() {
        const { result } = await this.listLists();

        return result.map(({
          id: value, title: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    templateId: {
      type: "string",
      label: "Template Id",
      description: "ID of the user letter template created before, on the basis of which a letter can be created. If you have transferred this parameter, you may skip the mandatory **Subject**, **Body**, as well as **Text Body** and **Lang** parameters. These values will be taken from the corresponding parameters of the template the id of which was specified. If any of the above parameters is still transferred, the system will ignore the parameter that is taken from the template parameters, and the parameter explicitly transferred in this method will be used.",
      async options({ page }) {
        const { result } = await this.listTemplates({
          params: {
            limit: LIMIT,
            offset: LIMIT * page,
            type: "user",
          },
        });

        return result.map(({
          id: value, title: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    systemTemplateId: {
      type: "string",
      label: "System Template Id",
      description: "ID of the system letter template created before, on the basis of which a letter can be created. If you have transferred this parameter, you may skip the mandatory **Subject**, **Body**, as well as **Text Body** and **Lang** parameters. These values will be taken from the corresponding parameters of the template the id of which was specified. If any of the above parameters is still transferred, the system will ignore the parameter that is taken from the template parameters, and the parameter explicitly transferred in this method will be used. If none of the **Template Id** or **System Template Id** parameters is specified, templates will not be used to create the letter.",
      async options({ page }) {
        const { result } = await this.listTemplates({
          params: {
            limit: LIMIT,
            offset: LIMIT * page,
            type: "system",
          },
        });

        return result.map(({
          id: value, title: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    messageId: {
      type: "string",
      label: "Message Id",
      description: "Code of the message to be sent.",
      async options({ page }) {
        const { result } = await this.listTemplates({
          params: {
            limit: LIMIT,
            offset: LIMIT * page,
            type: "system",
          },
        });

        return result.map(({
          id: value, title: label,
        }) => ({
          label,
          value,
        }));
      },
    },

    campaignId: {
      type: "string",
      label: "Campaign ID",
      description: "Select or enter the Campaign ID to monitor",
      async options() {
        const campaigns = await this.getCampaigns();
        return campaigns.map((campaign) => ({
          label: campaign.name,
          value: campaign.id,
        }));
      },
    },
    messageContent: {
      type: "string",
      label: "Message Content",
      description: "Content of the email message",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.selzy.com/en/api";
    },
    _params(params = {}) {
      return {
        api_key: `${this.$auth.api_key}`,
        format: "json",
        ...params,
      };
    },
    _makeRequest({
      $ = this, path, params, ...opts
    }) {
      return axios($, {
        url: this._baseUrl() + path,
        params: this._params(params),
        ...opts,
      });
    },
    listLists(opts = {}) {
      return this._makeRequest({
        path: "/getLists",
        ...opts,
      });
    },
    listTemplates(opts = {}) {
      return this._makeRequest({
        path: "/listTemplates",
        ...opts,
      });
    },
    getCampaigns(opts = {}) {
      return this._makeRequest({
        path: "/getCampaigns",
        ...opts,
      });
    },
    createEmailMessage(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/createEmailMessage",
        ...opts,
      });
    },
    createCampaign(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/createCampaign",
        ...opts,
      });
    },
    createWebhook(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/setHook",
        ...opts,
      });
    },
    deleteWebhook(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/removeHook",
        ...opts,
      });
    },
    async *paginate({
      fn, params = {}, maxResults = null, ...opts
    }) {
      let hasMore = false;
      let count = 0;
      let page = 0;

      do {
        params.limit = LIMIT;
        params.offset = LIMIT * page++;
        const { result } = await fn({
          params,
          ...opts,
        });
        for (const d of result) {
          yield d;

          if (maxResults && ++count === maxResults) {
            return count;
          }
        }

        hasMore = result.length;

      } while (hasMore);
    },
  },
};

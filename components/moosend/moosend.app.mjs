import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "moosend",
  propDefinitions: {
    mailingListId: {
      type: "string",
      label: "Mailing List ID",
      description: "The ID of the mailing list to add the new member. Example: `a589366a-1a34-4965-ac50-f1299fe5979e`.",
      async options({ page }) {
        const { Context: { MailingLists: resources } } =
          await this.getMailingLists({
            page,
            pageSize: constants.DEFAULT_LIMIT,
            params: {
              SortMethod: "DESC",
            },
          });
        return resources.map(({
          ID: value, Name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
  },
  methods: {
    getBaseUrl() {
      return `${constants.BASE_URL}${constants.VERSION_PATH}`;
    },
    getUrl(path, url) {
      return url || `${this.getBaseUrl()}${path}`;
    },
    getHeaders(headers = {}) {
      return {
        "Accept": "application/json",
        "Content-Type": "application/json",
        ...headers,
      };
    },
    getParams(params = {}) {
      return {
        apikey: this.$auth.api_key,
        ...params,
      };
    },
    makeRequest({
      step = this, url, path, headers, params, ...args
    } = {}) {
      const config = {
        headers: this.getHeaders(headers),
        url: this.getUrl(path, url),
        params: this.getParams(params),
        ...args,
      };
      console.log("config", config);
      return axios(step, config);
    },
    create(args = {}) {
      return this.makeRequest({
        method: "post",
        ...args,
      });
    },
    getMailingLists({
      page, pageSize, ...args
    } = {}) {
      return this.makeRequest({
        path: `/lists/${page}/${pageSize}.json`,
        ...args,
      });
    },
  },
};

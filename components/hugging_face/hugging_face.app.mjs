import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";
import utils from "./common/utils.mjs";

export default {
  type: "app",
  app: "hugging_face",
  propDefinitions: {
    modelId: {
      type: "string",
      label: "Model ID",
      description: "The model to use for inference.",
      async options({
        prevContext, tagFilter,
      }) {
        const { url } = prevContext;
        if (url === null) {
          return [];
        }

        const stream = await this.listModels({
          url,
          responseType: "stream",
          params: {
            sort: "downloads",
            direction: -1,
            limit: constants.DEFAULT_LIMIT,
            filter: tagFilter,
          },
        });

        const { headers: { link } } = stream;
        const linkParsed = utils.parseLinkHeader(link);
        const models = await utils.getDataFromStream(stream);

        return {
          options: models.map(({ id }) => (id)),
          context: {
            url: linkParsed?.next || null,
          },
        };
      },
    },
    imageUrl: {
      type: "string",
      label: "Image URL",
      description: "The image url to use for inference.",
    },
  },
  methods: {
    getBaseUrl(api = constants.API.HUB) {
      return `${api.BASE_URL}${api.VERSION_PATH}`;
    },
    getUrl({
      api, path, url,
    } = {}) {
      return url || `${this.getBaseUrl(api)}${path}`;
    },
    getHeaders(headers) {
      if (headers === false) {
        return;
      }
      return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.$auth.access_token}`,
        ...headers,
      };
    },
    makeRequest({
      step = this, api, path, headers, url, ...args
    } = {}) {

      const config = {
        headers: this.getHeaders(headers),
        url: this.getUrl({
          api,
          path,
          url,
        }),
        ...args,
      };
      return axios(step, config);
    },
    create(args = {}) {
      return this.makeRequest({
        method: "post",
        ...args,
      });
    },
    listModels(args = {}) {
      return this.makeRequest({
        path: "/models",
        ...args,
      });
    },
    inference({
      modelId, data, ...args
    } = {}) {
      return this.create({
        api: constants.API.INFERENCE,
        path: `/${modelId}`,
        data: JSON.stringify(data),
        headers: {
          ["X-Use-Cache"]: true,
          ["X-Wait-For-Model"]: true,
        },
        ...args,
      });
    },
    async getBinaryFromUrl(url) {
      const response = await this.makeRequest({
        url,
        responseType: "arraybuffer",
        headers: false,
      });
      return response.toString("base64");
    },
  },
};

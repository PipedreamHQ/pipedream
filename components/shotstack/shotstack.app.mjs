import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";
import utils from "./common/utils.mjs";

export default {
  type: "app",
  app: "shotstack",
  propDefinitions: {
    callback: {
      type: "string",
      label: "Callback URL",
      description: "An optional webhook callback URL used to receive status notifications when a render completes or fails.",
    },
    templateId: {
      type: "string",
      label: "Template",
      description: "The ID of a template saved in your Shotstack account, e.g. `980b66a0-6eb0-4454-81e2-01adbb0fac1f`. Use **List Templates** to find it (the `id` field).",
      async options() {
        const { response } = await this.listTemplates();
        return utils.newestFirst(response?.templates).map(({
          id, name,
        }) => ({
          label: name || id,
          value: id,
        }));
      },
    },
    renderId: {
      type: "string",
      label: "Render ID",
      description: "The ID of a render, e.g. `4a37ef85-b4d1-4b4a-90be-6515290c5091`. **Render From JSON** and **Render Template** return it (the `id` field).",
    },
    waitSeconds: {
      type: "integer",
      label: "Wait Up To (Seconds)",
      description: `How long to keep checking before returning, e.g. \`30\`. Returns as soon as the job is \`done\` or \`failed\`, or with its latest status when the time runs out; then call again. Defaults to \`0\` (check once). At most \`${constants.MAX_WAIT_SECONDS}\`.`,
      optional: true,
      min: 0,
      max: constants.MAX_WAIT_SECONDS,
    },
    assetType: {
      type: "string",
      label: "Asset Type",
      description: "The kind of asset to generate: `image`, `video` or `audio`, e.g. `image`. It decides which models fit.",
      options: [
        "image",
        "video",
        "audio",
      ],
    },
    prompt: {
      type: "string",
      label: "Prompt",
      description: "What to generate, e.g. `A lighthouse on a rocky coast at sunset, cinematic lighting`. For a text-to-speech model, the words to speak.",
    },
    model: {
      type: "string",
      label: "Model",
      description: "The ID of a generation model for the asset type, e.g. `seedance-2.0-text-to-video`. Use **List Generation Models** to find it (the `model` field). Leave empty for Shotstack's default model for the asset type.",
      optional: true,
      async options({ assetType }) {
        const { models } = await this.listModels();
        return utils.usableModels(models, assetType)
          .map((m) => ({
            label: m.name || m.model,
            value: m.model,
          }))
          .sort((a, b) => a.label.localeCompare(b.label));
      },
    },
    modelOptions: {
      type: "object",
      label: "Model Options",
      description: "Settings for the chosen model, e.g. `{\"aspectRatio\": \"16:9\"}`. **List Generation Models** returns what each model accepts (the `options` field). Leave empty for the model's defaults.",
      optional: true,
    },
    length: {
      type: "integer",
      label: "Clip Length (Seconds)",
      description: "The clip length for models that generate to a duration, e.g. `5`. Other models ignore it. Leave empty for the model's default.",
      optional: true,
      min: 1,
    },
  },
  methods: {
    getBaseUrl(apiPath = constants.API.EDIT) {
      const baseUrl = `${constants.BASE_URL}${apiPath}`;
      return baseUrl.replace(constants.VERSION_PLACEHOLDER, this.$auth.version);
    },
    // Actions pass `$`; the older components pass `step`.
    makeRequest({
      $, step = $ ?? this, apiPath, path, headers, ...args
    } = {}) {
      return axios(step, {
        url: `${this.getBaseUrl(apiPath)}${path}`,
        headers: {
          "Content-Type": "application/json",
          "x-api-key": this.$auth.api_key,
          "x-shotstack-origin": constants.ORIGIN,
          "User-Agent": constants.USER_AGENT,
          ...headers,
        },
        ...args,
      });
    },
    post(args = {}) {
      return this.makeRequest({
        method: "post",
        ...args,
      });
    },
    createRender(args = {}) {
      return this.post({
        path: "/render",
        ...args,
      });
    },
    renderTemplate(args = {}) {
      return this.post({
        path: "/templates/render",
        ...args,
      });
    },
    getRender({
      renderId, ...args
    } = {}) {
      return this.makeRequest({
        path: `/render/${encodeURIComponent(renderId)}`,
        ...args,
      });
    },
    listTemplates(args = {}) {
      return this.makeRequest({
        path: "/templates",
        ...args,
      });
    },
    getTemplate({
      templateId, ...args
    } = {}) {
      return this.makeRequest({
        path: `/templates/${encodeURIComponent(templateId)}`,
        ...args,
      });
    },
    generateAsset(args = {}) {
      return this.post({
        path: "/generate",
        ...args,
      });
    },
    quoteGeneration(args = {}) {
      return this.post({
        path: "/generate/quote",
        ...args,
      });
    },
    getGeneration({
      generationId, ...args
    } = {}) {
      return this.makeRequest({
        path: `/generate/${encodeURIComponent(generationId)}`,
        ...args,
      });
    },
    listModels(args = {}) {
      return this.makeRequest({
        path: "/models",
        ...args,
      });
    },
    listSources(args = {}) {
      return this.makeRequest({
        apiPath: constants.API.INGEST,
        path: "/sources",
        ...args,
      });
    },
    async *getResourcesStream({
      resourceFn,
      resourceFnArgs,
      resourceName = "data",
    }) {

      const response = await resourceFn(resourceFnArgs);

      const nextResources = resourceName && response[resourceName] || response;

      if (!nextResources?.length) {
        console.log("No more resources found");
        return;
      }

      for (const resource of nextResources) {
        yield resource;
      }
    },
  },
};

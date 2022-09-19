import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "bannerbear",
  propDefinitions: {
    videoUid: {
      type: "string",
      label: "Video UID",
      description: "The video UID that you want to update.",
      async options(args) {
        return this.paginateOptions({
          listResourcesFn: this.listVideos,
          ...args,
        });
      },
    },
    templateUid: {
      type: "string",
      label: "Template UID",
      description: "The template UID that you want to use. [See the docs](https://developers.bannerbear.com/#get-v2-templates)",
      async options(args) {
        return this.paginateOptions({
          listResourcesFn: this.listTemplates,
          ...args,
        });
      },
    },
    videoTemplateUid: {
      type: "string",
      label: "Video Template UID",
      description: "The video template UID that you want to use. [See the docs](https://developers.bannerbear.com/#get-v2-video_templates)",
      async options(args) {
        return this.paginateOptions({
          listResourcesFn: this.listVideoTemplates,
          ...args,
        });
      },
    },
    templateSetUid: {
      type: "string",
      label: "Template Set UID",
      description: "The template set UID that you want to use.",
      async options(args) {
        return this.paginateOptions({
          listResourcesFn: this.listTemplateSets,
          ...args,
        });
      },
    },
    transcription: {
      type: "string[]",
      label: "Transcription",
      description: "A replacement transcription containing your corrected / edited text. Note that each element of the transcription array represents a specific timestamp. For that reason, the number of lines of your patched text must match the original. Bannerbear will not update the record if the number is different. Editing transcriptions is meant for minor corrections, not making major changes.",
      optional: true,
    },
    approved: {
      type: "boolean",
      label: "Approved",
      description: "Set to true to approve the video and start the rendering process.",
      optional: true,
    },
    modifications: {
      type: "string",
      label: "Modifications",
      description: "A list of modifications you want to make. See [Create an image](https://developers.bannerbear.com/#post-v2-images) for more details on the child parameters. Unlike an Image the modifications list is not always required for a Video, for example: `[{\"name\": \"message\", \"text\": \"test message\"}]`.",
    },
    frames: {
      type: "string",
      label: "Frames",
      description: "A list of modifications lists to apply in sequence. See [Create an image](https://developers.bannerbear.com/#post-v2-images) for more details on the child parameters. Animated Gifs can have a maximum of 30 frames, for example: `[[{\"name\":\"layer1\",\"text\":\"This is my text\"},{\"name\":\"photo\",\"image_url\":\"https://www.pathtomyphoto.com/1.jpg\"}],[{\"name\":\"layer1\",\"text\":\"This is my follow up text\"},{\"name\":\"photo\",\"image_url\":\"https://www.pathtomyphoto.com/2.jpg\"}]]`",
    },
    webhookUrl: {
      type: "string",
      label: "Webhook URL",
      description: "A url to POST the full Animated Gif object to upon rendering completed.",
      optional: true,
    },
    metadata: {
      type: "string",
      label: "Metadata",
      description: "Any metadata that you need to store e.g. **ID** of a record in your DB.",
      optional: true,
    },
    inputMediaUrl: {
      type: "string",
      label: "Input Media URL",
      description: "Full url to a video or audio file you want to import as the background of the video. You can also use a static image, and the zoom parameter will be set automatically. This is required depending on the build pack of the template you are using: **Build Pack:** (*Overlay: Input Media URL is required*, *Transcribe: Input Media URL is required*, *Multi Overlay: Input Media URL is optional*)",
    },
  },
  methods: {
    buildBaseUrl(baseUrl) {
      return `${baseUrl}${constants.VERSION_PATH}`;
    },
    getUrl(path, url, baseUrl) {
      return url || `${this.buildBaseUrl(baseUrl)}${path}`;
    },
    getHeaders(headers) {
      return {
        "Authorization": `Bearer ${this.$auth.api_key}`,
        ...headers,
      };
    },
    async makeRequest({
      $ = this, baseUrl = constants.BASE_URL, path, headers, url, ...args
    } = {}) {
      const config = {
        headers: this.getHeaders(headers),
        url: this.getUrl(path, url, baseUrl),
        ...args,
      };

      return axios($, config);
    },
    async createImageSync(args = {}) {
      return this.makeRequest({
        baseUrl: constants.SYNC_BASE_URL,
        method: "post",
        path: "/images",
        ...args,
      });
    },
    async listVideos(args = {}) {
      return this.makeRequest({
        path: "/videos",
        ...args,
      });
    },
    async updateVideo(args = {}) {
      return this.makeRequest({
        method: "patch",
        path: "/videos",
        ...args,
      });
    },
    async createVideo(args = {}) {
      return this.makeRequest({
        method: "post",
        path: "/videos",
        ...args,
      });
    },
    async listTemplates(args = {}) {
      return this.makeRequest({
        path: "/templates",
        ...args,
      });
    },
    async listVideoTemplates(args = {}) {
      return this.makeRequest({
        path: "/video_templates",
        ...args,
      });
    },
    async createAnimatedGif(args = {}) {
      return this.makeRequest({
        method: "post",
        path: "/animated_gifs",
        ...args,
      });
    },
    async createCollection(args = {}) {
      return this.makeRequest({
        method: "post",
        path: "/collections",
        ...args,
      });
    },
    async listTemplateSets(args = {}) {
      return this.makeRequest({
        path: "/template_sets",
        ...args,
      });
    },
    async paginateOptions({
      listResourcesFn,
      prevContext,
    } = {}) {
      const { page } = prevContext;

      const resources = await listResourcesFn({
        page: page + 1,
      });

      return resources.map(({
        name, uid,
      }) => ({
        label: name || "Untitled",
        value: uid,
      }));
    },
  },
};

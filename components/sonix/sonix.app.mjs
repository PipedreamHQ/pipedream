import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "sonix",
  propDefinitions: {
    fileUrl: {
      type: "string",
      label: "File URL",
      description: "URL pointing to the audio/video file",
      required: true,
    },
    language: {
      type: "string",
      label: "Language",
      description: "Language code for the transcription",
      async options() {
        return [
          "en",
          "fr",
          "de",
          "es",
          "ar",
          "hy-AM",
          "bg",
          "ca",
          "hr",
          "yue-Hant-HK",
          "cmn-Hans-CN",
          "cs",
          "da",
          "nl",
          "fi",
          "el",
          "he-IL",
          "hi",
          "hu",
          "id-ID",
          "it",
          "ja",
          "ko",
          "lv",
          "lt",
          "ms-MY",
          "nb-NO",
          "pl",
          "pt",
          "ro",
          "ru",
          "sk",
          "sl",
          "sv",
          "th-TH",
          "tr-TR",
          "uk",
          "vi-VN",
        ].map((lang) => ({
          label: lang,
          value: lang,
        }));
      },
    },
    folderId: {
      type: "string",
      label: "Folder ID",
      description: "ID of folder to place the media in",
      async options() {
        const folders = await this.listFolders();
        return folders.map((folder) => ({
          label: folder.name,
          value: folder.id,
        }));
      },
    },
    mediaId: {
      type: "string",
      label: "Media ID",
      description: "ID of the media file",
      async options({ prevContext }) {
        const page = prevContext.page
          ? prevContext.page
          : 0;
        const { media } = await this.listMedia({
          params: {
            page,
            status: "completed",
          },
        });
        return {
          options: media.map((m) => ({
            label: m.name,
            value: m.id,
          })),
          context: {
            page: page + 1,
          },
        };
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.sonix.ai/v1";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "GET",
        path,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          Authorization: `Bearer ${this.$auth.api_token}`,
        },
      });
    },
    async listFolders() {
      return this._makeRequest({
        path: "/folders",
      });
    },
    async listMedia(opts = {}) {
      return this._makeRequest({
        ...opts,
        path: "/media",
      });
    },
    async submitNewMedia(opts = {}) {
      return this._makeRequest({
        ...opts,
        method: "POST",
        path: "/media",
      });
    },
    async getMediaStatus(mediaId) {
      return this._makeRequest({
        path: `/media/${mediaId}`,
      });
    },
    async getTextTranscript(mediaId) {
      return this._makeRequest({
        path: `/media/${mediaId}/transcript`,
      });
    },
    async createTranslation(mediaId, opts = {}) {
      return this._makeRequest({
        ...opts,
        method: "POST",
        path: `/media/${mediaId}/translations`,
      });
    },
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
  },
};

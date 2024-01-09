import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "happy_scribe",
  propDefinitions: {
    transcriptionId: {
      type: "string",
      label: "Transcription ID",
      description: "The ID of the transcription",
      async options({
        page, organizationId,
      }) {
        if (!organizationId) return [];

        const { results: resources } = await this.getTranscriptions({
          params: {
            page,
            organization_id: organizationId,
          },
        });

        return resources.map(({
          id, name,
        }) => ({
          value: id,
          label: name,
        }));
      },
    },
    organizationId: {
      type: "string",
      label: "Organization ID",
      description: "The ID of the organization",
    },
  },
  methods: {
    _apiKey() {
      return this.$auth.api_key;
    },
    _apiUrl() {
      return "https://www.happyscribe.com/api/v1";
    },
    _makeRequest({
      $ = this, path, ...args
    }) {
      return axios($, {
        url: `${this._apiUrl()}${path}`,
        ...args,
        headers: {
          "Authorization": `Bearer ${this._apiKey()}`,
        },
      });
    },
    async getTranscriptions(args = {}) {
      return this._makeRequest({
        path: "/transcriptions",
        ...args,
      });
    },
    async getTranscription({
      transcriptionId, ...args
    }) {
      return this._makeRequest({
        path: `/transcriptions/${transcriptionId}`,
        ...args,
      });
    },
    async deleteTranscription({
      transcriptionId, ...args
    }) {
      return this._makeRequest({
        path: `/transcriptions/${transcriptionId}`,
        method: "delete",
        ...args,
      });
    },
    async getSignedUrl(args = {}) {
      return this._makeRequest({
        path: "/uploads/new",
        ...args,
      });
    },
    async uploadFile({
      filename, ...args
    }) {
      const { signedUrl } = await this.getSignedUrl({
        $: args?.$ ?? this,
        params: {
          filename,
        },
      });

      return axios(args?.$ ?? this, {
        url: signedUrl,
        method: "PUT",
        ...args,
      });
    },
  },
};

import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "lessonspace",
  propDefinitions: {
    spaceId: {
      type: "string",
      label: "Space ID",
      description: "The ID of the Space",
    },
    name: {
      type: "string",
      label: "Name",
      description: "The name of the Space",
    },
    allowGuests: {
      type: "boolean",
      label: "Allow Guests",
      description: "Whether to allow guests or not in the Space",
    },
    recordContent: {
      type: "boolean",
      label: "Record Content",
      description: "Whether or not the space content will be recorded for this session",
    },
    transcribe: {
      type: "boolean",
      label: "Transcribe",
      description: "Whether or not a transcription will be generated for this session",
    },
    recordAv: {
      type: "boolean",
      label: "Record AV",
      description: "Whether or not audio and video will be recorded in this session",
    },
    userName: {
      type: "string",
      label: "User Name",
      description: "Full name of the person joining this space",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.thelessonspace.com/v2";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: this._baseUrl() + path,
        headers: {
          "Authorization": `Organisation ${this.$auth.api_key}`,
          ...headers,
        },
      });
    },

    async launchSpace(args = {}) {
      return this._makeRequest({
        path: "/spaces/launch/",
        method: "post",
        ...args,
      });
    },
  },
};

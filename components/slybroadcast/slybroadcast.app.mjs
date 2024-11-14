import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "slybroadcast",
  propDefinitions: {
    audioFileId: {
      type: "string",
      label: "Audio File ID",
      description: "The ID of the audio file uploaded to your slybroadcast account",
    },
    recipients: {
      type: "string[]",
      label: "Recipients",
      description: "List of recipients for the voicemail campaign",
    },
    audioFileUrl: {
      type: "string",
      label: "Audio File URL",
      description: "The URL of the audio file for the voicemail campaign",
    },
  },
  methods: {
    _baseUrl() {
      return "https://www.mobile-sphere.com/gateway/vmb.php";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this, method = "POST", path, headers, ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });
    },
    async startCampaignWithFileId({
      audioFileId, recipients,
    }) {
      return this._makeRequest({
        data: {
          c_uid: this.$auth.c_uid,
          c_password: this.$auth.c_password,
          c_callerID: this.$auth.c_callerID,
          c_phone: recipients.join(","),
          c_date: "now",
          c_record_audio: audioFileId,
        },
      });
    },
    async startCampaignWithFileUrl({
      audioFileUrl, recipients,
    }) {
      return this._makeRequest({
        data: {
          c_uid: this.$auth.c_uid,
          c_password: this.$auth.c_password,
          c_callerID: this.$auth.c_callerID,
          c_phone: recipients.join(","),
          c_date: "now",
          c_url: audioFileUrl,
          c_audio: audioFileUrl.split(".").pop(),
        },
      });
    },
  },
};

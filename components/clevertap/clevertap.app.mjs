import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "clevertap",
  propDefinitions: {},
  methods: {
    _projectId() {
      return this.$auth.project_id;
    },
    _passCode() {
      return this.$auth.pass_code;
    },
    _region() {
      return this.$auth.region;
    },
    _apiUrl() {
      return `https://${this._region()}.clevertap.com/1`;
    },
    async _makeRequest({
      $ = this, path, ...args
    }) {
      return axios($, {
        url: `${this._apiUrl()}${path}`,
        ...args,
        headers: {
          ...args.headers,
          "X-CleverTap-Account-Id": this._projectId(),
          "X-CleverTap-Passcode": this._passCode(),
        },
      });
    },
    async uploadEvent(args = {}) {
      return this._makeRequest({
        path: "/upload",
        method: "post",
        ...args,
      });
    },
  },
};

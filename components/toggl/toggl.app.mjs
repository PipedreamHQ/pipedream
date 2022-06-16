import TogglClient from "toggl-api";

export default {
  type: "app",
  app: "toggl",
  propDefinitions: {},
  methods: {
    _apiToken() {
      return this.$auth.api_token;
    },
    _client() {
      return new TogglClient({
        apiToken: this._apiToken(),
      });
    },
    async getCurrentTimeEntry() {
      const a = await this._client().getCurrentTimeEntry();

      console.log(a);
      return this._client().getCurrentTimeEntry()
        .promise();
    },
  },
};

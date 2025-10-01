import app from "../../fullenrich.app.mjs";

export default {
  key: "fullenrich-check-if-api-key-is-valid",
  name: "Check If API Key Is Valid",
  description: "Check if the FullEnrich API key is valid. [See the documentation](https://docs.fullenrich.com/checkkey).",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
  },
  methods: {
    checkApiKeyIsValid() {
      return this.app._makeRequest({
        path: "/account/keys/verify",
      });
    },
  },
  async run({ $ }) {
    const response = await this.checkApiKeyIsValid();
    $.export("$summary", "Successfully verified the API key.");
    return response;
  },
};

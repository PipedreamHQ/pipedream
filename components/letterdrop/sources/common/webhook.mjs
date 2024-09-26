import { ConfigurationError } from "@pipedream/platform";
import app from "../../letterdrop.app.mjs";

export default {
  props: {
    app,
    http: "$.interface.http",
  },
  methods: {
    generateMeta() {
      throw new ConfigurationError("generateMeta is not implemented");
    },
    processResource(resource) {
      this.$emit(resource, this.generateMeta(resource));
    },
  },
  async run({
    body, headers,
  }) {
    const {
      app,
      processResource,
    } = this;

    if (app.getApiKey() !== headers["api-key"]) {
      return console.log("Invalid API key");
    }

    processResource(body);
  },
};

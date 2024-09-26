import { ConfigurationError } from "@pipedream/platform";
import app from "../../clicksend.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  props: {
    app,
    db: "$.service.db",
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
  },
  methods: {
    generateMeta() {
      throw new ConfigurationError("generateMeta is not implemented");
    },
    setWebhookId(value) {
      this.db.set(constants.WEBHOOK_ID, value);
    },
    getWebhookId() {
      return this.db.get(constants.WEBHOOK_ID);
    },
    processResource(resource) {
      this.$emit(resource, this.generateMeta(resource));
    },
  },
  async run({ body }) {
    this.http.respond({
      status: 200,
    });
    this.processResource(body);
  },
};

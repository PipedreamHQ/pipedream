import payhip from "../../payhip.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  props: {
    payhip,
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
  },
  methods: {
    isRelevant() {
      return true;
    },
    generateMeta() {
      throw new ConfigurationError("generateMeta is not implemented");
    },
  },
  async run(event) {
    this.http.respond({
      status: 200,
    });

    const { body } = event;
    if (!body) {
      return;
    }

    if (!this.isRelevant(body)) {
      return;
    }

    const meta = this.generateMeta(body);
    this.$emit(body, meta);
  },
};

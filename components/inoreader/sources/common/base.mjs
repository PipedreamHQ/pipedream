import { ConfigurationError } from "@pipedream/platform";
import app from "../../inoreader.app.mjs";

export default {
  props: {
    app,
    db: "$.service.db",
  },
  methods: {
    generateMeta() {
      throw new ConfigurationError("generateMeta is not implemented");
    },
  },
};

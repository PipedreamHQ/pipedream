import app from "../../launch_darkly_oauth.app.mjs";
import common from "../../../launchdarkly/sources/common/webhook.mjs";

export default {
  ...common,
  props: {
    app,
    db: "$.service.db",
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
  },
};

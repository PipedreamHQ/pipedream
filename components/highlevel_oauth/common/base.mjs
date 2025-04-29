import { ConfigurationError } from "@pipedream/platform";
import app from "../highlevel_oauth.app.mjs";

export default {
  props: {
    app: {
      ...app,
      reloadProps: true,
    },
  },
  async additionalProps() {
    const locationId = this.app.getLocationId();
    if (!locationId) {
      throw new ConfigurationError("This component requires you to authenticate as a **location**, not as an agency/company. *(`locationId` field is missing from `$auth`)*");
    }

    return {};
  },
};

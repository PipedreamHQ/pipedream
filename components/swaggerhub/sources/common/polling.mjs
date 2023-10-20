import swaggerhub from "../../swaggerhub.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  props: {
    swaggerhub,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    owner: {
      propDefinition: [
        swaggerhub,
        "owner",
      ],
    },
    api: {
      propDefinition: [
        swaggerhub,
        "api",
        (c) => ({
          owner: c.owner,
        }),
      ],
    },
  },
  async run() {
    const response = await this.swaggerhub.listApiVersions({
      owner: this.owner,
      api: this.api,
    });

    for (const api of response) {
      const version = this.swaggerhub.extractApiVersion(api);
      const ts = this.swaggerhub.extractPropertyValue(api, "X-Created");
      this.$emit(api, {
        id: version,
        summary: `${this.api}: ${version}`,
        ts,
      });
    }
  },
};

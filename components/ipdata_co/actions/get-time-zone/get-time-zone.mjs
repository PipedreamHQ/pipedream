// legacy_hash_id: a_67imr8
import { axios } from "@pipedream/platform";

export default {
  key: "ipdata_co-get-time-zone",
  name: "GET /time_zone/{ip_address}",
  description: "We provide detailed and accurate Timezone data, adjusted for DST where necessary. https://docs.ipdata.co/overview/timezone-detection",
  version: "0.2.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    ipdata_co: {
      type: "app",
      app: "ipdata_co",
    },
    ip_address: {
      type: "string",
    },
  },
  async run({ $ }) {
    const config = {
      url: `https://api.ipdata.co/time_zone/${this.ip_address}?api-key=${this.ipdata_co.$auth.api_key}`,
    };
    return await axios($, config);
  },
};

// legacy_hash_id: a_8KiomM
import { axios } from "@pipedream/platform";

export default {
  key: "ipdata_co-get-carrier",
  name: "GET /carrier/{ip_address}",
  description: "The ipdata API supports looking up the Mobile Carrier of an IP Address. Our database currently consists of over 2500 carriers in 234 countries. https://docs.ipdata.co/overview/mobile-carrier-detection",
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
      url: `https://api.ipdata.co/carrier/${this.ip_address}?api-key=${this.ipdata_co.$auth.api_key}`,
    };
    return await axios($, config);
  },
};

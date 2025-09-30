// legacy_hash_id: a_jQiLKK
import { axios } from "@pipedream/platform";

export default {
  key: "ipdata_co-get-ip-data",
  name: "GET /{ip_address}",
  description: "Lookup a specific IP Address",
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
      url: `https://api.ipdata.co/${this.ip_address}?api-key=${this.ipdata_co.$auth.api_key}`,
    };
    return await axios($, config);
  },
};

// legacy_hash_id: a_nji3N5
import { axios } from "@pipedream/platform";

export default {
  key: "cloudflare_api_key-purge-all-files",
  name: "Purge All Files",
  description: "Remove ALL files from Cloudflare's cache.",
  version: "0.2.2",
  type: "action",
  props: {
    cloudflare_api_key: {
      type: "app",
      app: "cloudflare_api_key",
    },
    zone_id: {
      type: "string",
      description: "The zone ID where the DNS record being modified belongs to.",
    },
  },
  async run({ $ }) {
  //See Quickbooks API docs at: https://api.cloudflare.com/#zone-purge-all-files

    if (!this.zone_id) {
      throw new Error("Must provide zone_id parameter.");
    }

    return await axios($, {
      method: "post",
      url: `https://api.cloudflare.com/client/v4/zones/${this.zone_id}/purge_cache`,
      headers: {
        "X-Auth-Email": `${this.cloudflare_api_key.$auth.Email}`,
        "X-Auth-Key": `${this.cloudflare_api_key.$auth.API_Key}`,
        "Content-Type": "application/json",
      },
      data: {
        purge_everything: true,
      },
    });
  },
};

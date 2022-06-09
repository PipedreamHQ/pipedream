import { axios } from "@pipedream/platform";
import cloudflare_api_key from "../../cloudflare_api_key.app.mjs";

export default {
  key: "cloudflare_api_key-cloudflare-purge-files-by-url",
  type: "action",
  version: "0.0.1",
  name: "Purge Files by URL",
  description: "Granularly remove one or more files from Cloudflare's cache by specifying URLs. [See docs here](https://developers.cloudflare.com/cache/how-to/purge-cache/#purge-by-single-file-by-url)",
  props: {
    cloudflare_api_key,
    zoneId: {
      type: "string",
      label: "Zone ID",
      description: "The Zone ID where the URL(s) being purged belongs to.",
    },
    purgeUrls: {
      type: "string[]",
      label: "URL(s)",
      description: "URL(s) to purge.",
    },
  },
  async run({ $ }) {
    return await axios($, {
      method: "post",
      url: `https://api.cloudflare.com/client/v4/zones/${this.zoneId}/purge_cache`,
      headers: {
        "X-Auth-Email": `${this.cloudflare_api_key.$auth.Email}`,
        "X-Auth-Key": `${this.cloudflare_api_key.$auth.API_Key}`,
        "Content-Type": "application/json",
      },
      data: {
        files: this.purgeUrls,
      },
    });
  },
};

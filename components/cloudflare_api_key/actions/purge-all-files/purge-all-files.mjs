import cloudflare from "../../cloudflare_api_key.app.mjs";

export default {
  key: "cloudflare_api_key-purge-all-files",
  name: "Purge All Files",
  description: "Remove ALL files from Cloudflare's cache. [See the documentation](https://developers.cloudflare.com/api/node/resources/cache/methods/purge/)",
  version: "1.0.1",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    cloudflare,
    zoneId: {
      propDefinition: [
        cloudflare,
        "zoneIdentifier",
      ],
    },
  },
  async run({ $ }) {
    const {
      cloudflare,
      zoneId,
    } = this;

    const response = await cloudflare.purgeCache({
      zone_id: zoneId,
      purge_everything: true,
    });

    $.export("$summary", `Purged all files from zone \`${zoneId}\``);

    return response;
  },
};

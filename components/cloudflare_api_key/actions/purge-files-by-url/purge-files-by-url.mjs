import cloudflare from "../../cloudflare_api_key.app.mjs";

export default {
  key: "cloudflare_api_key-purge-files-by-url",
  type: "action",
  version: "0.1.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  name: "Purge Files by URL",
  description: "Granularly remove one or more files from Cloudflare's cache by specifying URLs. [See the documentation](https://developers.cloudflare.com/api/node/resources/cache/methods/purge/)",
  props: {
    cloudflare,
    zoneId: {
      propDefinition: [
        cloudflare,
        "zoneIdentifier",
      ],
    },
    purgeUrls: {
      type: "string[]",
      label: "URL(s)",
      description: "URL(s) to purge.",
    },
  },
  async run({ $ }) {
    const {
      cloudflare,
      zoneId,
      purgeUrls,
    } = this;

    const response = await cloudflare.purgeCache({
      zone_id: zoneId,
      files: purgeUrls,
    });

    $.export("$summary", `Purged files from zone \`${zoneId}\``);

    return response;
  },
};

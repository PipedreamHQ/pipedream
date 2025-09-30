import cloudflare from "../../cloudflare_api_key.app.mjs";
import { getFileStream } from "@pipedream/platform";

export default {
  key: "cloudflare_api_key-import-dns-records",
  name: "Import DNS Records",
  description: "Import a BIND config into a zone. [See the documentation](https://developers.cloudflare.com/api/resources/dns/subresources/records/methods/import/)",
  version: "1.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    cloudflare,
    zoneIdentifier: {
      propDefinition: [
        cloudflare,
        "zoneIdentifier",
      ],
    },
    proxied: {
      type: "boolean",
      label: "Proxied",
      description: "Whether or not proxiable records should receive the performance and security benefits of Cloudflare",
      optional: true,
    },
    file: {
      type: "string",
      label: "File Path Or Url",
      description: "Provide either a file URL or a path to a file in the `/tmp` directory (for example, `/tmp/bind_config.txt`).",
    },
    syncDir: {
      type: "dir",
      accessMode: "read",
      sync: true,
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      cloudflare,
      zoneIdentifier,
      proxied,
      file,
    } = this;

    const stream = await getFileStream(file);

    const response = await cloudflare.importDnsRecords({
      zone_id: zoneIdentifier,
      file: stream.toString(),
      proxied,
    });
    $.export("$summary", "BIND config file successfully imported");

    return response;
  },
};

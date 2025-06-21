import cloudflare from "../../cloudflare_api_key.app.mjs";
import { getFileStreamAndMetadata } from "@pipedream/platform";
import FormData from "form-data";

export default {
  key: "cloudflare_api_key-import-dns-records",
  name: "Import DNS Records",
  description: "Import a BIND config into a zone. [See the docs here](https://api.cloudflare.com/#dns-records-for-a-zone-import-dns-records)",
  version: "1.0.0",
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
  },
  async run({ $ }) {
    const zoneId = this.zoneIdentifier;
    const { file } = this;

    const form = new FormData();
    if (this.proxied !== undefined) {
      form.append("proxied", this.proxied.toString());
    }

    const {
      stream, metadata,
    } = await getFileStreamAndMetadata(file);
    form.append("file", stream, {
      contentType: metadata.contentType,
      knownLength: metadata.size,
      filename: metadata.name,
    });

    const response = await this.cloudflare.importDnsRecords(zoneId, form);
    $.export("$summary", "BIND config file successfully imported");

    return response;
  },
};

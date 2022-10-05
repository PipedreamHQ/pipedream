import cloudflare from "../../cloudflare_api_key.app.mjs";
import fs from "fs";
import got from "got";
import stream from "stream";
import { promisify } from "util";
import FormData from "form-data";

export default {
  key: "cloudflare_api_key-import-dns-records",
  name: "Import DNS Records",
  description: "Import a BIND config into a zone. [See the docs here](https://api.cloudflare.com/#dns-records-for-a-zone-import-dns-records)",
  version: "0.0.2",
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
    fileUrl: {
      type: "string",
      label: "File URL",
      description: "The URL of the BIND config file you want to import. Must specify either File URL or File Path",
      optional: true,
    },
    filePath: {
      type: "string",
      label: "File Path",
      description: "The path to the file, e.g. /tmp/bind_config.txt. Must specify either File URL or File Path",
      optional: true,
    },
  },
  async run({ $ }) {
    const zoneId = this.zoneIdentifier;
    const {
      fileUrl,
      filePath,
    } = this;

    if (!fileUrl && !filePath) {
      throw new Error("Must specify either File URL or File Path");
    }

    const form = new FormData();
    if (this.proxied !== undefined) {
      form.append("proxied", this.proxied.toString());
    }

    if (filePath) {
      const readStream = fs.createReadStream(filePath);
      form.append("file", readStream);
    } else if (fileUrl) {
      const tempFilePath = "/tmp/temp_bind_config.txt";
      const pipeline = promisify(stream.pipeline);
      await pipeline(
        got.stream(fileUrl),
        fs.createWriteStream(tempFilePath),
      );
      const readStream = fs.createReadStream(tempFilePath);
      form.append("file", readStream);
    }

    const response = await this.cloudflare.importDnsRecords(zoneId, form);
    $.export("$summary", "BIND config file successfully imported");

    return response;
  },
};

import axios from "axios";
import apify from "../../apify.app.mjs";

export default {
  key: "apify-get-kvs-record",
  name: "Get Key-Value Store Record",
  description: "Gets a record from a key-value store.",
  version: "0.0.3",
  type: "action",
  props: {
    apify,
    keyValueStoreId: {
      propDefinition: [
        apify,
        "keyValueStoreId",
      ],
    },
    key: {
      type: "string",
      label: "Record key",
      description: "If the record is a valid JSON object, the output will include all parsed attributes as individual fields. If the record is any other file type (such as PDFs, images, or plain text), the output will instead be a file reference.",
    },
  },

  async run({ $ }) {
    const token = this.apify.getAuthToken();

    // HEAD request to get size and content-type
    const recordUrl = `https://api.apify.com/v2/key-value-stores/${this.keyValueStoreId}/records/${encodeURIComponent(this.key)}`;
    const headResp = await axios({
      url: recordUrl,
      method: "HEAD",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      validateStatus: () => true,
    });

    if (headResp.status === 404) {
      $.export("$summary", "Record not found");
      return {};
    }
    if (headResp.status >= 400) {
      throw new Error(`Error retrieving record: ${headResp.statusText}`);
    }

    const contentType = headResp.headers["content-type"];
    const contentLength = parseInt(headResp.headers["content-length"] || "0");

    const PARSEABLE_MIMES = [
      "application/json",
      "text/plain",
    ];
    const MAX_INLINE_SIZE = 10 * 1000 * 1000;

    // If parseable and small enough, get data via Apify client
    if (PARSEABLE_MIMES.some((pattern) => contentType.includes(pattern))
        && contentLength < MAX_INLINE_SIZE) {
      const record = await this.apify.getKVSRecord(this.keyValueStoreId, this.key);
      const data = record?.value;

      if (typeof data === "object" && !Array.isArray(data) && data !== null) {
        $.export("$summary", "Retrieved JSON record");
        return data;
      } else {
        $.export("$summary", "Retrieved text record");
        return {
          value: data ?? null,
        };
      }
    } else {
      // For large/binary files, return signed URL via Apify client
      const signedUrl = await this.apify.getKVSRecordUrl(this.keyValueStoreId, this.key);

      $.export("$summary", "Retrieved file pointer");
      return {
        contentType,
        value: signedUrl,
      };
    }
  },
};

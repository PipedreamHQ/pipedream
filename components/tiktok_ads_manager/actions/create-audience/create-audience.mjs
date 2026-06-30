import crypto from "crypto";
import { Readable } from "stream";
import {
  getFileStreamAndMetadata, ConfigurationError,
} from "@pipedream/platform";
import FormData from "form-data";
import app from "../../tiktok_ads_manager.app.mjs";

export default {
  key: "tiktok_ads_manager-create-audience",
  name: "Create Audience",
  description:
    "Create a new TikTok custom audience from hashed customer identifiers."
    + " Uploads the identifiers first, then creates the audience — both steps happen in one tool call."
    + " Provide either `identifiers` (a list of SHA256-hashed values passed directly) or `file_path` (a CSV file with one identifier per line)."
    + " `identifier_type` controls the hash format: `EMAIL_SHA256` for hashed emails, `PHONE_SHA256` for hashed phone numbers, `IDFA_SHA256` or `GAID_SHA256` for device IDs."
    + " To add members to an existing audience, use **Update Audience** instead."
    + " [See the documentation](https://business-api.tiktok.com/portal/docs/create-an-audience-by-file/v1.3)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    advertiserId: {
      propDefinition: [
        app,
        "advertiserId",
      ],
    },
    audienceName: {
      type: "string",
      label: "Audience Name",
      description: "Display name for the new custom audience.",
    },
    calculateType: {
      type: "string",
      label: "Identifier Type",
      description: "Hash type and identifier format. `EMAIL_SHA256` for SHA256-hashed email addresses (most common). `PHONE_SHA256` for SHA256-hashed phone numbers. `IDFA_SHA256` / `IDFA_MD5` for Apple device IDs. `GAID_SHA256` / `GAID_MD5` for Android device IDs. `MULTIPLE_TYPES` when the file contains a mix.",
      options: [
        "EMAIL_SHA256",
        "PHONE_SHA256",
        "FIRST_SHA256",
        "FIRST_MD5",
        "IDFA_SHA256",
        "IDFA_MD5",
        "GAID_SHA256",
        "GAID_MD5",
        "MAID_SHA256",
        "MAID_MD5",
        "MULTIPLE_TYPES",
      ],
      default: "EMAIL_SHA256",
    },
    identifiers: {
      type: "string[]",
      label: "Identifiers",
      description: "List of SHA256-hashed identifiers to seed the audience with. Pass these directly instead of a file. Example: `[\"a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3\"]`. Use this when you have the hashed values inline; use `file_path` when the data is in a file.",
      optional: true,
    },
    filePath: {
      type: "string",
      label: "File Path or URL",
      description: "CSV/text file with one SHA256-hashed identifier per line. Provide a `/tmp` file path or a publicly accessible URL. Use `identifiers` instead if you have the values inline.",
      format: "file-ref",
      optional: true,
    },
    retentionDays: {
      type: "integer",
      label: "Retention Days",
      description: "How many days to retain audience members (default: 365, max: 365).",
      optional: true,
      default: 365,
    },
    syncDir: {
      type: "dir",
      accessMode: "read",
      sync: true,
      optional: true,
    },
  },
  async run({ $ }) {
    if (!this.identifiers?.length && !this.filePath) {
      throw new ConfigurationError("Provide either `identifiers` or `file_path`.");
    }

    let fileBuffer;
    let fileName = "audience.csv";

    if (this.identifiers?.length) {
      fileBuffer = Buffer.from(this.identifiers.join("\n"), "utf8");
    } else {
      const {
        stream, metadata,
      } = await getFileStreamAndMetadata(this.filePath);
      const chunks = [];
      for await (const chunk of stream) {
        chunks.push(chunk);
      }
      fileBuffer = Buffer.concat(chunks);
      fileName = metadata.name || fileName;
    }

    const signature = crypto.createHash("md5").update(fileBuffer)
      .digest("hex");

    const form = new FormData();
    form.append("advertiser_id", this.advertiserId);
    form.append("file", Readable.from([
      fileBuffer,
    ]), {
      filename: fileName,
      contentType: "text/plain",
      knownLength: fileBuffer.length,
    });
    form.append("file_signature", signature);
    form.append("calculate_type", this.calculateType);
    if (this.retentionDays) form.append("retention_days", String(this.retentionDays));

    const uploadResponse = await this.app.uploadAudienceFile({
      $,
      data: form,
      headers: form.getHeaders(),
    });

    const uploadedFilePath = uploadResponse?.data?.file_path;

    const createResponse = await this.app.createCustomAudience({
      $,
      data: {
        advertiser_id: this.advertiserId,
        custom_audience_name: this.audienceName,
        calculate_type: this.calculateType,
        file_paths: [
          uploadedFilePath,
        ],
        retention_in_days: this.retentionDays ?? 365,
      },
    });

    const audienceId = createResponse?.data?.audience_id;
    $.export("$summary", `Created audience "${this.audienceName}"${audienceId
      ? ` (ID: ${audienceId})`
      : ""}`);
    return {
      upload: uploadResponse,
      create: createResponse,
    };
  },
};

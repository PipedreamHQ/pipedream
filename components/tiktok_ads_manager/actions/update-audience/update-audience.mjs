import crypto from "crypto";
import { Readable } from "stream";
import { getFileStreamAndMetadata } from "@pipedream/platform";
import FormData from "form-data";
import app from "../../tiktok_ads_manager.app.mjs";

export default {
  key: "tiktok_ads_manager-update-audience",
  name: "Update Audience",
  description:
    "Update a TikTok custom audience — rename it, or add/remove/replace members via a file of hashed identifiers."
    + " To rename only, provide `audience_name` and omit `identifiers`/`file_path`."
    + " To modify members, provide `identifiers` or `file_path` and set `action` (`APPEND`, `REMOVE`, or `REPLACE`)."
    + " The file upload and audience update happen in one tool call."
    + " Audience size must remain ≥ 1,000 after the operation."
    + " Use **List Audiences** to find the `audience_id`."
    + " [See the documentation](https://business-api.tiktok.com/portal/docs/update-an-audience/v1.3)",
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
    audienceId: {
      type: "string",
      label: "Audience ID",
      description: "ID of the custom audience to update. Use **List Audiences** to find the ID.",
    },
    audienceName: {
      type: "string",
      label: "New Audience Name",
      description: "New display name for the audience (max 128 characters). Required if `identifiers` and `file_path` are both omitted.",
      optional: true,
    },
    action: {
      type: "string",
      label: "Action",
      description: "How to modify audience members. `APPEND` adds new identifiers. `REMOVE` removes matching identifiers. `REPLACE` replaces all members. Required when providing `identifiers` or `file_path`. Default: `REPLACE`.",
      optional: true,
      options: [
        "REPLACE",
        "APPEND",
        "REMOVE",
      ],
      default: "REPLACE",
    },
    calculateType: {
      type: "string",
      label: "Identifier Type",
      description: "Hash type of the identifiers in the upload. Must match the type used when the audience was created.",
      optional: true,
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
      description: "List of SHA256-hashed identifiers to add/remove/replace. Pass these directly instead of a file. Example: `[\"a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3\"]`.",
      optional: true,
    },
    filePath: {
      type: "string",
      label: "File Path or URL",
      description: "CSV/text file with one SHA256-hashed identifier per line. Use `identifiers` instead if you have the values inline.",
      format: "file-ref",
      optional: true,
    },
    syncDir: {
      type: "dir",
      accessMode: "read",
      sync: true,
      optional: true,
    },
  },
  async run({ $ }) {
    let filePaths;

    if (this.identifiers?.length || this.filePath) {
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

      const uploadResponse = await this.app.uploadAudienceFile({
        $,
        data: form,
        headers: form.getHeaders(),
      });

      filePaths = [
        uploadResponse?.data?.file_path,
      ];
    }

    const response = await this.app.updateCustomAudience({
      $,
      data: {
        advertiser_id: this.advertiserId,
        custom_audience_id: this.audienceId,
        custom_audience_name: this.audienceName,
        file_paths: filePaths,
        action: filePaths
          ? this.action
          : undefined,
      },
    });

    const action = filePaths
      ? this.action
      : "rename";
    $.export("$summary", `Updated audience ${this.audienceId} (${action})`);
    return response;
  },
};

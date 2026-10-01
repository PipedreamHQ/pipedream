import {
  ConfigurationError, axios, getFileStreamAndMetadata,
} from "@pipedream/platform";
import FormData from "form-data";
import slack from "../../slack_v2.app.mjs";

export default {
  key: "slack_v2-upload-file",
  name: "Upload File",
  description: "Upload a file (document, image, audio, etc.) to a Slack channel, group, or direct message, optionally with a comment."
    + " Use **Send Message** instead for text-only messages with no attachment."
    + " `Content` can be a path to a file in `/tmp` or a URL; if the URL is a signed/presigned link whose path ends in an opaque ID or token rather than the real file name (e.g. a Google Cloud Storage or S3 URL with a `?X-Goog-Signature=...` query string), Slack can't infer the file type from it and will show the upload as an unreadable binary — set `File Name` explicitly in that case."
    + " [See the documentation](https://api.slack.com/messaging/files#uploading_files)",
  version: "0.2.0",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  ai: "optimized",
  props: {
    slack,
    conversation: {
      propDefinition: [
        slack,
        "conversation",
      ],
    },
    content: {
      propDefinition: [
        slack,
        "content",
      ],
      description: "The file to upload. Provide either a file URL or a path to a file in the `/tmp` directory (for example, `/tmp/myFile.txt`). If the URL is a signed/presigned link (e.g. from Google Cloud Storage or S3), also set `File Name` — see this action's description for why.",
    },
    filename: {
      type: "string",
      label: "File Name",
      description: "The name to give the uploaded file, including its extension (e.g. `myFile.pdf`). Defaults to the source file's name. Set this when `Content` is a signed/presigned URL whose path doesn't end in the real file name — otherwise Slack stores the file under whatever opaque ID or token is in the URL and can't tell its type.",
      optional: true,
    },
    initialComment: {
      description: "Message text to post alongside the file, introducing or describing it (e.g. `Weekly sales report attached.`).",
      propDefinition: [
        slack,
        "initial_comment",
      ],
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
    // Accept a channel NAME as well as an ID — agents routinely pass the "#name" they read
    // in the prompt, and completeUpload answers that with invalid_arguments.
    const channelId = await this.slack.resolveChannelId(this.conversation);

    const {
      stream, metadata,
    } = await getFileStreamAndMetadata(this.content);

    const filename = this.filename || metadata.name;

    // Get an upload URL from Slack
    const getUploadUrlResponse = await this.slack.getUploadUrl({
      filename,
      length: metadata.size,
    });

    if (!getUploadUrlResponse.ok) {
      throw new ConfigurationError(`Error getting upload URL: ${JSON.stringify(getUploadUrlResponse)}`);
    }

    const {
      upload_url: uploadUrl, file_id: fileId,
    } = getUploadUrlResponse;

    // Upload the file to the provided URL
    const formData = new FormData();
    formData.append("file", stream, {
      contentType: metadata.contentType,
      knownLength: metadata.size,
      filename: metadata.name,
    });
    formData.append("filename", filename);

    await axios($, {
      url: uploadUrl,
      data: formData,
      method: "POST",
      headers: {
        ...formData.getHeaders(),
      },
    });

    // Complete the file upload process in Slack
    const completeUploadResponse = await this.slack.completeUpload({
      channel_id: channelId,
      initial_comment: this.initialComment,
      files: [
        {
          id: fileId,
        },
      ],
    });

    if (!completeUploadResponse.ok) {
      throw new Error(`Error completing upload: ${JSON.stringify(completeUploadResponse)}`);
    }

    $.export("$summary", `Successfully uploaded "${filename}" to ${this.conversation}`);
    return completeUploadResponse;
  },
};

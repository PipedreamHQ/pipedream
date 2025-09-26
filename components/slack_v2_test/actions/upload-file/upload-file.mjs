import {
  ConfigurationError, axios, getFileStreamAndMetadata,
} from "@pipedream/platform";
import FormData from "form-data";
import slack from "../../slack_v2_test.app.mjs";

export default {
  key: "slack_v2_test-upload-file",
  name: "Upload File",
  description: "Upload a file. [See the documentation](https://api.slack.com/messaging/files#uploading_files)",
  version: "0.1.3",
  type: "action",
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
    },
    initialComment: {
      description: "Will be added as an initial comment before the image",
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
    const {
      stream, metadata,
    } = await getFileStreamAndMetadata(this.content);

    const filename = this.content.split("/").pop();

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
        Authorization: `Bearer ${this.slack.getToken()}`,
      },
    });

    // Complete the file upload process in Slack
    const completeUploadResponse = await this.slack.completeUpload({
      channel_id: this.conversation,
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

    $.export("$summary", "Successfully uploaded file");
    return completeUploadResponse;
  },
};

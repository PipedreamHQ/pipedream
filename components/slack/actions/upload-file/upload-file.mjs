import {
  ConfigurationError, axios,
} from "@pipedream/platform";
import fs from "fs";
import FormData from "form-data";
import slack from "../../slack.app.mjs";

export default {
  key: "slack-upload-file",
  name: "Upload File",
  description: "Upload a file. [See the documentation](https://api.slack.com/messaging/files#uploading_files)",
  version: "0.0.27",
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
  },
  async run({ $ }) {
    if (!fs.existsSync(this.content)) {
      throw new ConfigurationError(`\`${this.content}\` not found, a valid \`/tmp\` path is needed`);
    }

    const filename = this.content.split("/").pop();

    // Get an upload URL from Slack
    const getUploadUrlResponse = await this.slack.getUploadUrl({
      filename,
      length: fs.statSync(this.content).size,
    });

    if (!getUploadUrlResponse.ok) {
      throw new ConfigurationError(`Error getting upload URL: ${JSON.stringify(getUploadUrlResponse)}`);
    }

    const {
      upload_url: uploadUrl, file_id: fileId,
    } = getUploadUrlResponse;

    // Upload the file to the provided URL
    const formData = new FormData();
    formData.append("file", fs.createReadStream(this.content));
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

import linkedin from "../../linkedin.app.mjs";
import { getFileStreamAndMetadata } from "@pipedream/platform";
import FormData from "form-data";

export default {
  key: "linkedin-create-image-post-user",
  name: "Create Image Post (User)",
  description: "Create an image post on LinkedIn. [See the docs here](https://learn.microsoft.com/en-us/linkedin/marketing/integrations/community-management/shares/images-api?view=li-lms-2023-09&tabs=http#uploading-an-image)",
  version: "1.0.0",
  type: "action",
  props: {
    linkedin,
    file: {
      type: "string",
      label: "File Path or URL",
      description: "The path or URL of the image file to post.",
    },
    text: {
      propDefinition: [
        linkedin,
        "text",
      ],
    },
    visibility: {
      propDefinition: [
        linkedin,
        "visibility",
      ],
    },
  },
  methods: {
    initializeUpload({
      data, ...args
    }) {
      data = {
        ...data,
        initializeUploadRequest: {
          owner: `urn:li:person:${this.linkedin.$auth.oauth_uid}`,
        },
      };
      return this.linkedin._makeRequest({
        method: "POST",
        path: "/images?action=initializeUpload",
        data,
        ...args,
      });
    },
    uploadImage(url, data) {
      return this.linkedin._makeRequest({
        url,
        method: "PUT",
        data,
        headers: {
          ...this.linkedin._getHeaders(),
          ...data.getHeaders(),
        },
      });
    },
  },
  async run({ $ }) {
    const {
      value: {
        uploadUrl, image,
      },
    } = await this.initializeUpload({
      $,
    });

    const {
      stream, metadata,
    } = await getFileStreamAndMetadata(this.file);
    const formData = new FormData();
    formData.append("file", stream, {
      filename: metadata.name,
      contentType: metadata.contentType,
      knownLength: metadata.size,
    });

    await this.uploadImage(uploadUrl, formData);

    await this.linkedin.createPost({
      data: {
        commentary: this.text,
        visibility: this.visibility,
        content: {
          media: {
            id: image,
          },
        },
      },
      $,
    });

    $.export("$summary", "Successfully posted image.");

    // nothing to return
  },
};

import linkedin from "../../linkedin.app.mjs";
import fs from "fs";
import FormData from "form-data";

export default {
  key: "linkedin-create-image-post-user",
  name: "Create Image Post (User)",
  description: "Create an image post on LinkedIn. [See the docs here](https://learn.microsoft.com/en-us/linkedin/marketing/integrations/community-management/shares/images-api?view=li-lms-2023-09&tabs=http#uploading-an-image)",
  version: "0.0.1",
  type: "action",
  props: {
    linkedin,
    filePath: {
      type: "string",
      label: "File Path",
      description: "The path to the image file saved to the `/tmp` directory (e.g. `/tmp/image.png`). [See the documentation](https://pipedream.com/docs/workflows/steps/code/nodejs/working-with-files/#the-tmp-directory).",
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

    const filePath = this.filePath.startsWith("/tmp/")
      ? this.filePath
      : `/tmp/${this.filePath}`;
    const formData = new FormData();
    formData.append("file", fs.createReadStream(filePath));

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

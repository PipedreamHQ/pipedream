import vimeo from "../../vimeo.app.mjs";

export default {
  key: "vimeo-upload-video",
  name: "Upload Video",
  description: "Uploads a video to the user's Vimeo account. Ensure you have enough storage quota on your account. [See the documentation](https://developer.vimeo.com/api/reference/videos#upload_video)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    vimeo,
    videoUrl: {
      type: "string",
      label: "Video URL",
      description: "URL of the video file to upload",
    },
    name: {
      type: "string",
      label: "Name",
      description: "The title of the video",
      optional: true,
    },
    description: {
      type: "string",
      label: "Description",
      description: "The description of the video",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.vimeo.uploadVideo({
      $,
      data: {
        upload: {
          approach: "pull",
          link: this.videoUrl,
        },
        name: this.name,
        description: this.description,
      },
    });
    $.export("$summary", `Successfully uploaded video with ID: ${response.uri.split("/").pop()}`);
    return response;
  },
};

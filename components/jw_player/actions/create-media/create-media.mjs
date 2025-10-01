import jwPlayer from "../../jw_player.app.mjs";

export default {
  key: "jw_player-create-media",
  name: "Create Media",
  description: "Creates a new media file in JW Player using fetch or external upload methods. [See the documentation](https://docs.jwplayer.com/platform/reference/post_v2-sites-site-id-media)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    jwPlayer,
    siteId: {
      propDefinition: [
        jwPlayer,
        "siteId",
      ],
    },
    methodType: {
      type: "string",
      label: "Upload Method",
      description: "Method for uploading the media (fetch or external)",
      options: [
        "fetch",
        "external",
      ],
    },
    mediaSource: {
      type: "string",
      label: "Media URL",
      description: "The URL of the media",
    },
    mimeType: {
      type: "string",
      label: "Mime-Type",
      description: "MIME type for the uploaded media, required for the `external` upload method",
      optional: true,
    },
  },
  async run({ $ }) {
    const data = {
      upload: {
        method: this.methodType,
      },
    };
    if (this.methodType === "external") {
      data.upload.source_url = this.mediaSource;
      data.upload.mime_type = this.mimeType;
    } else {
      data.upload.download_url = this.mediaSource;
    }

    const response = await this.jwPlayer.createMedia({
      siteId: this.siteId,
      data,
      $,
    });

    if (response?.id) {
      $.export("$summary", `Successfully created media with ID ${response.id}.`);
    }

    return response;
  },
};

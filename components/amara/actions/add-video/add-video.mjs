import amara from "../../amara.app.mjs";
import utils from "../common/utils.mjs";

export default {
  key: "amara-add-video",
  name: "Add Video",
  description: "Add a video. [See the docs here](https://apidocs.amara.org/#add-a-video)",
  type: "action",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    amara,
    videoUrl: {
      propDefinition: [
        amara,
        "videoUrl",
      ],
    },
    team: {
      description: "Team slug for the video or null to remove it from its team",
      propDefinition: [
        amara,
        "team",
      ],
    },
    primaryAudioLanguageCode: {
      propDefinition: [
        amara,
        "primaryAudioLanguageCode",
      ],
    },
    project: {
      propDefinition: [
        amara,
        "project",
        ({ team }) => ({
          team,
        }),
      ],
    },
    title: {
      type: "string",
      label: "Title",
      description: "Title of the video",
      optional: true,
    },
    description: {
      type: "string",
      label: "Description",
      description: "About this video",
      optional: true,
    },
    duration: {
      type: "integer",
      label: "Duration",
      description: "Duration in seconds, in case it can not be retrieved automatically by Amara",
      optional: true,
    },
    thumbnail: {
      type: "string",
      label: "Thumbnail",
      description: "URL to the video thumbnail",
      optional: true,
    },
    metadata:	{
      type: "object",
      label: "Metadata",
      description: "Dictionary of metadata key/value pairs. These handle extra information about the video. Right now the type keys supported are `speaker-name` and `location`. Values can be any string.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      videoUrl,
      title,
      description,
      primaryAudioLanguageCode,
      thumbnail,
      metadata,
      team,
      project,
    } = this;

    const duration = utils.emptyStrToUndefined(this.duration);

    const data = {
      video_url: videoUrl,
      title,
      description,
      duration,
      primary_audio_language_code: primaryAudioLanguageCode,
      thumbnail,
      metadata,
      team: team || null,
      project,
    };

    const response = await this.amara.addVideo({
      $,
      data,
    });

    $.export("$summary", `Successfully added video, "${response.title}"`);

    return response;
  },
};

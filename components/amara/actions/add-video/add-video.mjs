import common from "../common.mjs";

const { amara } = common.props;

export default {
  ...common,
  key: "amara-add-video",
  name: "Add video",
  description: "Add a video. [See the docs here](https://apidocs.amara.org/#add-a-video).",
  type: "action",
  version: "0.0.1",
  props: {
    ...common.props,
    videoUrl: {
      propDefinition: [
        amara,
        "videoUrl",
      ],
    },
    team: {
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
      ],
    },
    title: {
      type: "string",
      label: "Title",
      description: "Title of the video",
    },
    description: {
      type: "string",
      label: "Description",
      description: "About this video.",
      optional: true,
    },
    duration: {
      type: "integer",
      label: "Duration",
      description: "Duration in seconds, in case it can not be retrieved automatically by Amara.",
    },
    thumbnail: {
      type: "string",
      label: "Thumbnail",
      description: "URL to the video thumbnail.",
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
      duration,
      primaryAudioLanguageCode,
      thumbnail,
      metadata,
      team,
      project,
    } = this;

    const data = {
      video_url: videoUrl,
      title,
      description,
      duration,
      primary_audio_language_code: primaryAudioLanguageCode,
      thumbnail,
      metadata,
      team,
      project,
    };

    return await this.amara.addVideo({
      $,
      data,
    });
  },
};

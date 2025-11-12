import amara from "../../amara.app.mjs";

export default {
  key: "amara-add-new-subtitles",
  name: "Add New Subtitles",
  description: "Add new subtitles. [See the docs here](https://apidocs.amara.org/#add-new-subtitles)",
  type: "action",
  version: "0.0.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    amara,
    team: {
      propDefinition: [
        amara,
        "team",
      ],
    },
    videoId: {
      propDefinition: [
        amara,
        "videoId",
        ({ team }) => ({
          team,
        }),
      ],
    },
    language: {
      label: "Language",
      description: "Language code for the language of the subtitles",
      optional: false,
      propDefinition: [
        amara,
        "primaryAudioLanguageCode",
      ],
    },
    subFormat: {
      description: "The format used to parse the subs. The same formats as for fetching subtitles are accepted. (Defaults to `dfxp`).",
      propDefinition: [
        amara,
        "subFormat",
      ],
    },
    subtitles: {
      propDefinition: [
        amara,
        "subtitles",
      ],
    },
    subtitlesUrl: {
      propDefinition: [
        amara,
        "subtitlesUrl",
      ],
    },
    title: {
      propDefinition: [
        amara,
        "title",
      ],
    },
    description: {
      propDefinition: [
        amara,
        "description",
      ],
    },
    action: {
      propDefinition: [
        amara,
        "action",
        ({
          videoId, language,
        }) => ({
          videoId,
          language,
        }),
      ],
    },
  },
  async run({ $ }) {
    const {
      videoId,
      language,
      subFormat,
      subtitles,
      subtitlesUrl,
      title,
      description,
      action,
    } = this;

    const data = {
      sub_format: subFormat,
      subtitles,
      subtitles_url: subtitlesUrl,
      title,
      description,
      action,
    };

    const response = await this.amara.addNewSubtitles({
      $,
      videoId,
      language,
      data,
    });

    $.export("$summary", `Successfully added ${response.language.name} subtitles for "${response.video_title}"`);

    return response;
  },
};

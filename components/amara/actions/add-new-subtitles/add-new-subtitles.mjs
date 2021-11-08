import amara from "../../amara.app.mjs";

export default {
  key: "amara-add-new-subtitles",
  name: "Add new subtitles",
  description: "Add new subtitles. [See the docs here](https://apidocs.amara.org/#add-new-subtitles)",
  type: "action",
  version: "0.0.1",
  props: {
    amara,
    videoId: {
      propDefinition: [
        amara,
        "videoId",
      ],
    },
    language: {
      propDefinition: [
        amara,
        "language",
        ({ videoId }) => ({
          videoId,
        }),
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

    return await this.amara.createSubtitleLanguage({
      $,
      videoId,
      language,
      data,
    });
  },
};

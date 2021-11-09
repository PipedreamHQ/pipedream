import common from "../common.mjs";

const { amara } = common.props;

export default {
  ...common,
  key: "amara-update-subtitle-language",
  name: "Update subtitle language",
  description: "Update a subtitle language. [See the docs here](https://apidocs.amara.org/#update-a-subtitle-language)",
  type: "action",
  version: "0.0.1",
  props: {
    ...common.props,
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
    isPrimaryAudioLanguage: {
      propDefinition: [
        amara,
        "isPrimaryAudioLanguage",
      ],
    },
    subtitlesComplete: {
      propDefinition: [
        amara,
        "subtitlesComplete",
      ],
    },
    softLimitLines: {
      propDefinition: [
        amara,
        "softLimitLines",
      ],
    },
    softLimitMinDuration: {
      propDefinition: [
        amara,
        "softLimitMinDuration",
      ],
    },
    softLimitMaxDuration: {
      propDefinition: [
        amara,
        "softLimitMaxDuration",
      ],
    },
    softLimitCharactersPerLine: {
      propDefinition: [
        amara,
        "softLimitCharactersPerLine",
      ],
    },
    softLimitCharactersPerSubtitles: {
      propDefinition: [
        amara,
        "softLimitCharactersPerSubtitles",
      ],
    },
  },
  async run({ $ }) {
    const {
      videoId,
      language,
      isPrimaryAudioLanguage,
      subtitlesComplete,
      softLimitLines,
      softLimitMinDuration,
      softLimitMaxDuration,
      softLimitCharactersPerLine,
      softLimitCharactersPerSubtitles,
    } = this;

    const data = {
      is_primary_audio_language: isPrimaryAudioLanguage,
      subtitles_complete: subtitlesComplete,
      soft_limit_lines: softLimitLines,
      soft_limit_min_duration: softLimitMinDuration,
      soft_limit_max_duration: softLimitMaxDuration,
      soft_limit_cpl: softLimitCharactersPerLine,
      soft_limit_cps: softLimitCharactersPerSubtitles,
    };

    return await this.amara.updateSubtitleLanguage({
      $,
      videoId,
      language,
      data,
    });
  },
};

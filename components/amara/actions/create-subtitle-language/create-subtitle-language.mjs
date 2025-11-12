import amara from "../../amara.app.mjs";

export default {
  key: "amara-create-subtitle-language",
  name: "Create Subtitle Language",
  description: "Create a subtitle language. [See the docs here](https://apidocs.amara.org/#create-a-subtitle-language)",
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
    languageCode: {
      label: "Subtitle Language",
      description: "bcp-47 code for the language.",
      optional: false,
      propDefinition: [
        amara,
        "primaryAudioLanguageCode",
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
      languageCode,
      isPrimaryAudioLanguage,
      subtitlesComplete,
      softLimitLines,
      softLimitMinDuration,
      softLimitMaxDuration,
      softLimitCharactersPerLine,
      softLimitCharactersPerSubtitles,
    } = this;

    const data = {
      language_code: languageCode,
      is_primary_audio_language: isPrimaryAudioLanguage,
      subtitles_complete: subtitlesComplete,
      soft_limit_lines: softLimitLines,
      soft_limit_min_duration: softLimitMinDuration,
      soft_limit_max_duration: softLimitMaxDuration,
      soft_limit_cpl: softLimitCharactersPerLine,
      soft_limit_cps: softLimitCharactersPerSubtitles,
    };

    const response = await this.amara.createSubtitleLanguage({
      $,
      videoId,
      data,
    });

    $.export("$summary", `Successfully created ${response.name} subtitle language for "${response.title}"`);

    return response;
  },
};

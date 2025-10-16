import mux from "../../mux.app.mjs";

export default {
  key: "mux-create-asset",
  name: "Create Asset",
  description: "Create a new asset with a track. [See the documentation](https://docs.mux.com/api-reference#video/operation/create-asset)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    mux,
    url: {
      propDefinition: [
        mux,
        "url",
      ],
    },
    type: {
      propDefinition: [
        mux,
        "assetType",
      ],
    },
    languageCode: {
      propDefinition: [
        mux,
        "languageCode",
      ],
      optional: true,
    },
    name: {
      propDefinition: [
        mux,
        "name",
      ],
    },
    closedCaptions: {
      propDefinition: [
        mux,
        "closedCaptions",
      ],
    },
    playbackPolicy: {
      propDefinition: [
        mux,
        "playbackPolicy",
      ],
    },
    mp4Support: {
      propDefinition: [
        mux,
        "mp4Support",
      ],
    },
    normalizeAudio: {
      type: "boolean",
      label: "Normalize Audio",
      description: "Normalize the audio track loudness level. This parameter is only applicable to on-demand (not live) assets.",
      default: false,
      optional: true,
    },
    masterAccess: {
      propDefinition: [
        mux,
        "masterAccess",
      ],
    },
  },
  async run({ $ }) {
    const { data } = await this.mux.createAsset({
      data: {
        input: [
          {
            url: this.url,
            type: this.type,
            text_type: this.type === "text"
              ? "subtitles"
              : undefined,
            language_code: this.languageCode,
            name: this.name,
            closed_captions: this.closedCaptions,
          },
        ],
        playback_policy: [
          this.playbackPolicy,
        ],
        mp4_support: this.mp4Support,
        normalize_audio: this.normalizeAudio,
        master_access: this.masterAccess,
      },
      $,
    });

    if (data) {
      $.export("$summary", `Successfully created a new asset with ID ${data.id}`);
    }

    return data;
  },
};

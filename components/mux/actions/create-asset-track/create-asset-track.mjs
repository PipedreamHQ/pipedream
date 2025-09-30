import mux from "../../mux.app.mjs";

export default {
  key: "mux-create-asset-track",
  name: "Create Asset Track",
  description: "Adds an asset track (for example, subtitles) to an asset. [See the documentation](https://docs.mux.com/api-reference#video/operation/create-asset-track)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    mux,
    assetId: {
      propDefinition: [
        mux,
        "assetId",
      ],
    },
    url: {
      propDefinition: [
        mux,
        "url",
      ],
    },
    languageCode: {
      propDefinition: [
        mux,
        "languageCode",
      ],
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
  },
  async run({ $ }) {
    const { data } = await this.mux.createAssetTrack({
      assetId: this.assetId,
      data: {
        url: this.url,
        type: "text",
        text_type: "subtitles",
        language_code: this.languageCode,
        name: this.name,
        closed_captions: this.closedCaptions,
      },
      $,
    });

    if (data) {
      $.export("$summary", `Successfully created a new asset track with ID ${data.id}`);
    }

    return data;
  },
};

import zenserp from "../../zenserp.app.mjs";

export default {
  key: "zenserp-google-image-search",
  name: "Google Image Search",
  description: "Perform a Google image search using the Zenserp API. [See the documentation](https://app.zenserp.com/documentation#imageSearch)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    zenserp,
    q: {
      propDefinition: [
        zenserp,
        "q",
      ],
    },
    searchEngine: {
      propDefinition: [
        zenserp,
        "searchEngine",
      ],
    },
    country: {
      propDefinition: [
        zenserp,
        "country",
      ],
    },
    language: {
      propDefinition: [
        zenserp,
        "language",
      ],
    },
    device: {
      propDefinition: [
        zenserp,
        "device",
      ],
    },
    timeframe: {
      propDefinition: [
        zenserp,
        "timeframe",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.zenserp.search({
      $,
      params: {
        q: this.q,
        tbm: "isch",
        search_engine: this.searchEngine,
        gl: this.country,
        lr: this.language,
        num: this.num,
        start: this.start,
        device: this.device,
        timeframe: this.timeframe,
      },
    });
    $.export("$summary", `Successfully searched for images with query "${this.q}"`);
    return response;
  },
};

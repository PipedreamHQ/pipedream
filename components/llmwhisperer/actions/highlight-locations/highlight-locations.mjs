import app from "../../llmwhisperer.app.mjs";

export default {
  key: "llmwhisperer-highlight-locations",
  name: "Highlight Locations",
  description: "Generate highlight locations for a search term in the document. [See the documentation](https://docs.unstract.com/llm_whisperer/apis/llm_whisperer_text_extraction_highlight_api)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    whisperHash: {
      propDefinition: [
        app,
        "whisperHash",
      ],
    },
    data: {
      type: "string",
      label: "Search Term",
      description: "The search term to highlight in the document.",
    },
  },
  methods: {
    highlightLocations(args = {}) {
      return this.app.post({
        path: "/highlight-data",
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      highlightLocations,
      whisperHash,
      data,
    } = this;

    const response = await highlightLocations({
      $,
      headers: {
        "Content-Type": "text/plain",
      },
      params: {
        "whisper-hash": whisperHash,
      },
      data,
    });

    $.export("$summary", `Successfully generated highlight locations for the search term: \`${data}\`.`);

    return response;
  },
};

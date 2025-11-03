import app from "../../wolfram_alpha.app.mjs";

export default {
  key: "wolfram_alpha-perform-computation",
  name: "Perform Computation",
  description: "Executes a computation query using the Wolfram Alpha API. [See the documentation](https://products.wolframalpha.com/api/documentation)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    input: {
      type: "string",
      label: "Input",
      description: "Text specifying the input string.",
    },
    width: {
      type: "string",
      label: "Width",
      description: "Specify an approximate width limit for text and tables. Eg. `200`, `500`. This parameter does not affect plots or graphics. Width values are approximate; behavior may vary for different content.",
      optional: true,
    },
    maxWidth: {
      type: "string",
      label: "Max Width",
      description: "Specify an extended maximum width for large objects. Eg. `200`, `500`. This parameter does not affect plots or graphics. Width values are approximate; behavior may vary for different content.",
      optional: true,
    },
    plotWidth: {
      type: "string",
      label: "Plot Width",
      description: "Specify an approximate width limit for plots and graphics. Eg. `100`, `200`. This parameter does not affect text or tables. Width values are approximate; behavior may vary for different content.",
      optional: true,
    },
    mag: {
      type: "string",
      label: "Magnification",
      description: "Specify magnification of objects within a pod. Eg. `0.5`, `1.0`, `2.0`. Changing this parameter does not affect the overall size of pods.",
      optional: true,
    },
    assumption: {
      type: "string",
      label: "Assumption",
      description: "Specifies an assumption, such as the meaning of a word or the value of a formula variable. Eg. `*C.pi-_*Movie`, `DateOrder_**Day.Month.Year--`. Assumptions made implicitly by the API. Values for this parameter are given by the input properties of `<value>` subelements of `<assumption>` elements in XML results.",
      optional: true,
    },
  },
  methods: {
    performComputation(args = {}) {
      return this.app.makeRequest({
        path: "/llm-api",
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      performComputation,
      input,
      width,
      maxWidth,
      plotWidth,
      mag,
      assumption,
    } = this;

    const response = await performComputation({
      $,
      params: {
        input,
        width,
        maxwidth: maxWidth,
        plotwidth: plotWidth,
        mag,
        assumption,
      },
    });

    $.export("$summary", "Computation performed successfully");
    return response;
  },
};

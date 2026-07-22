import app from "../../algodocs.app.mjs";

export default {
  key: "algodocs-list-extractors",
  name: "List Extractors",
  description:
    "Lists all extractors in the authenticated AlgoDocs account (GET /v1/extractors). Each extractor includes at least `id` and `name`. Use this to discover a valid `extractorId` before running **Upload File** or **List Documents**. [See the documentation](https://api.algodocs.com/).",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    algodocs: app,
  },
  async run({ $ }) {
    const extractors = await this.algodocs.listExtractors({
      $,
    });
    $.export("$summary", `Retrieved ${extractors.length} extractor(s)`);
    return extractors;
  },
};

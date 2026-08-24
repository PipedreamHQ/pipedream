// x-pd-ai: optimized
import fireflies from "../../fireflies.app.mjs";

export default {
  key: "fireflies-list-meeting-id-options",
  name: "List Meeting ID Options",
  description: "List recent meetings as ID/title pairs, to discover a valid Meeting ID. Call this first when you know a meeting by name but need its ID for **Find Meeting by ID**, **Update Meeting**, **Share Meeting** or **Ask Question About Meeting**. Results are ordered most-recent-first; increment Page to reach older meetings. [See the documentation](https://docs.fireflies.ai/graphql-api/query/transcripts)",
  version: "0.0.2",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    fireflies,
    page: {
      propDefinition: [
        fireflies,
        "page",
      ],
    },
  },
  async run({ $ }) {
    const options = await fireflies.propDefinitions.meetingId.options.call(this.fireflies, {
      page: this.page,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};

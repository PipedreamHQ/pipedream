// x-pd-ai: optimized
import fireflies from "../../fireflies.app.mjs";
import queries from "../../common/queries.mjs";

export default {
  key: "fireflies-list-askfred-thread-id-options",
  name: "List AskFred Thread ID Options",
  description: "List existing AskFred conversation threads as ID/title pairs, to discover a valid AskFred Thread ID. Call this first when resuming an older conversation with **Continue AskFred Conversation** and you no longer have the `thread_id` that **Ask Question About Meeting** returned. Fireflies returns every thread in a single response, so pagination does not apply. [See the documentation](https://docs.fireflies.ai/graphql-api/query/askfred-threads)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    fireflies,
  },
  async run({ $ }) {
    const { data: { askfred_threads: askfredThreads } } = await this.fireflies.query({
      $,
      data: {
        query: queries.askfredThreads,
      },
    });
    const options = askfredThreads?.map(({
      id: value, title: label,
    }) => ({
      value,
      label: label || value,
    })) || [];
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};

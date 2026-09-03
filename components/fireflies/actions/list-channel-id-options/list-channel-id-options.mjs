import fireflies from "../../fireflies.app.mjs";
import queries from "../../common/queries.mjs";

export default {
  key: "fireflies-list-channel-id-options",
  name: "List Channel ID Options",
  description: "List the channels accessible to the authenticated user as ID/title pairs, to discover a valid Channel ID. Call this first when you know a channel by name but need its ID for **Update Meeting**. Includes public channels on the team plus private channels you belong to. Fireflies returns every channel in a single response, so pagination does not apply. [See the documentation](https://docs.fireflies.ai/graphql-api/query/channels)",
  version: "0.0.2",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    fireflies,
  },
  async run({ $ }) {
    const { data: { channels } } = await this.fireflies.query({
      $,
      data: {
        query: queries.channels,
      },
    });
    const options = channels?.map(({
      id: value, title: label,
    }) => ({
      value,
      label,
    })) || [];
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};

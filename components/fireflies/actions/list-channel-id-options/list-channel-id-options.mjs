// x-pd-ai: optimized
import fireflies from "../../fireflies.app.mjs";

export default {
  key: "fireflies-list-channel-id-options",
  name: "List Channel ID Options",
  description: "List the channels accessible to the authenticated user as ID/title pairs, to discover a valid Channel ID. Call this first when you know a channel by name but need its ID for **Update Meeting**. Includes public channels on the team plus private channels you belong to. Fireflies returns every channel in a single response, so pagination does not apply. [See the documentation](https://docs.fireflies.ai/graphql-api/query/channels)",
  version: "0.0.1",
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
      description: "The page of results to retrieve. The Fireflies `channels` query is not paginated — the full list is always returned on page `0`, and any higher page returns an empty list.",
    },
  },
  async run({ $ }) {
    const options = await fireflies.propDefinitions.channelId.options.call(this.fireflies, {
      page: this.page,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};

import fireflies from "../../fireflies.app.mjs";
import queries from "../../common/queries.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "fireflies-find-clip-by-id",
  name: "Find Clip by ID",
  description: "Retrieve a single meeting clip (a Fireflies \"bite\") by its ID, including its render status and media URLs. Use this to follow up on **Create Meeting Clip**, which returns immediately with `status: pending` and no media. Poll until `status` reaches a terminal `ready` or `error`, and stop on either — `pending` and `processing` mean the clip is still rendering. Once `ready`, the playable media is at `sources[].src`, with `preview` and `thumbnail` also populated; all three are `null` beforehand. Note that `summary_status` tracks the AI-generated summary separately and can finish while `status` is still `pending`, so poll `status` rather than `summary_status`. Use **List Clips** to look up a clip ID. [See the documentation](https://docs.fireflies.ai/graphql-api/query/bite)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  ai: "optimized",
  props: {
    fireflies,
    biteId: {
      type: "string",
      label: "Clip ID",
      description: "The clip to retrieve, e.g. `kwQIMbxsyi1`. Returned as `id` by **Create Meeting Clip**, or use **List Clips** to browse existing clips.",
    },
  },
  async run({ $ }) {
    const { data: { bite } } = await this.fireflies.query({
      $,
      data: {
        query: queries.bite,
        variables: {
          biteId: this.biteId,
        },
      },
    });

    if (!bite) {
      throw new ConfigurationError(`No clip found with ID ${this.biteId}.`);
    }

    $.export("$summary", `Retrieved clip ${this.biteId} — status: ${bite.status}`);
    return bite;
  },
};

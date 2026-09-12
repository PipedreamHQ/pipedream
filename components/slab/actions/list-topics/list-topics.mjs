import slab from "../../slab.app.mjs";
import { LIST_TOPICS_QUERY } from "../../common/queries.mjs";

export default {
  key: "slab-list-topics",
  name: "List Topics",
  description: "List all topics in the Slab organization via the `organization { topics }` GraphQL query, returning an array of topic objects with `id` and `name` (e.g. `[{\"id\":\"abc12def\",\"name\":\"Engineering\"}]`). This is the picker action agents should call to obtain topic IDs for **Create Post**, **Add Topic To Post**, and **Remove Topic From Post**. There is no root topics-listing query, so this reads the organization's topics field. [See the documentation](https://studio.apollographql.com/public/Slab/variant/current/schema/reference/objects/RootQueryType#topics).",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    slab,
  },
  async run({ $ }) {
    const response = await this.slab._makeRequest({
      $,
      data: {
        query: LIST_TOPICS_QUERY,
      },
    });
    const topics = response.organization?.topics || [];
    $.export("$summary", `Successfully retrieved ${topics.length} topic(s)`);
    return topics;
  },
};

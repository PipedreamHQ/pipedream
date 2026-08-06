// x-pd-ai: optimized
import fireflies from "../../fireflies.app.mjs";

export default {
  key: "fireflies-list-user-id-options",
  name: "List User ID Options",
  description: "List the team's users as ID/name pairs, to discover a valid User ID. Call this first when you know a person by name but need their ID for **Find Recent Meeting** or **Set User Role**. Fireflies returns every user in a single response, so pagination does not apply. [See the documentation](https://docs.fireflies.ai/graphql-api/query/users)",
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
      description: "The page of results to retrieve. The Fireflies `users` query is not paginated — the full list is always returned on page `0`, and any higher page returns an empty list.",
    },
  },
  async run({ $ }) {
    const options = await fireflies.propDefinitions.userId.options.call(this.fireflies, {
      page: this.page,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};

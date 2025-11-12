import alegra from "../../alegra.app.mjs";

export default {
  key: "alegra-find-contact",
  name: "Find Contact",
  description: "Search for an existing contact in Alegra based on name or identification. [See the documentation](https://developer.alegra.com/reference/listcontacts-1)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    alegra,
    query: {
      propDefinition: [
        alegra,
        "query",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.alegra.searchContact({
      $,
      params: {
        query: this.query,
      },
    });

    $.export("$summary", `Found ${response.length} contact(s) matching your query`);
    return response;
  },
};

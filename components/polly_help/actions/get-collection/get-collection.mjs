import pollyHelp from "../../polly_help.app.mjs";

export default {
  key: "polly_help-get-collection",
  name: "Get Collection",
  description: "Retrieve a collection by ID. Returns the collection's description, a lightweight article list (id, name, slug), and parent/child collection group relationships for hierarchy navigation. To find a collection ID: run **Search Publication** — each result includes `collections[].id`, or call **Get Article** and extract `collections[].id`. To get full content for a listed article, pass its `id` to **Get Article**. [See the documentation](https://docs.polly.help/integrations/a/publication-api-examples?partition=3iD5jyfMSRprgo2tD)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    pollyHelp,
    collectionId: {
      type: "string",
      label: "Collection ID",
      description: "The ID of the collection to retrieve. To find a collection ID, run **Search Publication** and extract `collections[].id` from any result, or call **Get Article** and extract `collections[].id` from the article.",
    },
  },
  async run({ $ }) {
    const response = await this.pollyHelp.getCollection({
      $,
      variables: {
        id: this.collectionId,
      },
    });
    $.export("$summary", `Successfully retrieved collection with ID ${this.collectionId}`);
    return response?.data?.collection ?? response;
  },
};

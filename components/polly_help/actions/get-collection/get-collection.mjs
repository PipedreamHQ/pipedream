import pollyHelp from "../../polly_help.app.mjs";

export default {
  key: "polly_help-get-collection",
  name: "Get Collection",
  description: "Get a collection. [See the documentation](https://docs.polly.help/integrations/a/publication-api-examples?partition=3iD5jyfMSRprgo2tD)",
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
      description: "The ID of the collection to get. Use the **Search Publication** action to find the collection ID of an article.",
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
    return response;
  },
};

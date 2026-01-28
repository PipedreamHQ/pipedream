import raindrop from "../../raindrop.app.mjs";

export default {
  key: "raindrop-list-collections",
  name: "Retrieve All Collections",
  description: "Retrieves all collections. [See the docs here](https://developer.raindrop.io/v1/collections/methods#get-root-collections)",
  version: "0.0.6",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    raindrop,
  },
  async run({ $ }) {
    const response = await this.raindrop.getCollections($);
    $.export("$summary", `Successfully retrieved ${response.length} collection(s)`);
    return response;
  },
};

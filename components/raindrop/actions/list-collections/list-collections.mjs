import raindrop from "../../raindrop.app.mjs";

export default {
  key: "raindrop-list-collections",
  name: "Retrieve All Collections",
  description: "Retrieves all collections. [See the docs here](https://developer.raindrop.io/v1/collections/methods#get-root-collections)",
  version: "0.0.1",
  type: "action",
  props: {
    raindrop,
  },
  async run({ $ }) {
    return this.raindrop.getCollections($);
  },
};

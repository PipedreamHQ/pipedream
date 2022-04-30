import raindrop from "../../raindrop.app.mjs";

export default {
  key: "raindrop-list-collections",
  name: "Retrieve All Collections",
  description: "Retrieves all collections",
  version: "0.0.1",
  type: "action",
  props: {
    raindrop,
  },
  async run() {
    return this.raindrop.getCollections();
  },
};

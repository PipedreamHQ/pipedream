// legacy_hash_id: a_B0ipOm
import algoliasearch from "algoliasearch";

export default {
  key: "algolia-add-objects-to-index",
  name: "Add Objects to Index",
  description: "Adds an array of JavaScript objects to the given index",
  version: "0.1.1",
  type: "action",
  props: {
    algolia: {
      type: "app",
      app: "algolia",
    },
    index: {
      type: "string",
      description: "The name of your Algolia index",
    },
    objects: {
      type: "any",
      description: "An array of JavaScript objects, each corresponding to a new object in your search index. It's recommended you create this array of objects in a prior code step, then select expression mode and enter a variable reference to that array here.",
    },
    autoGenerateObjectIDIfNotExist: {
      type: "boolean",
      label: "Auto Generate Object ID If Not Present",
      description: "If an objectID property is not present on objects, automatically assign on. Defaults to true.",
      optional: true,
    },
  },
  async run({ $ }) {
    const client = algoliasearch(this.algolia.$auth.application_id, this.algolia.$auth.api_key);
    const index = client.initIndex(this.index);

    $.export("objectIds", await index.saveObjects(this.objects, {
      autoGenerateObjectIDIfNotExist: this.autoGenerateObjectIDIfNotExist || true,
    }));
  },
};

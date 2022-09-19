import algolia from "../../algolia.app.mjs";

export default {
  key: "algolia-create-objects",
  name: "Create Objects",
  description: "Adds an array of JavaScript objects to the given index. [See docs here](https://www.algolia.com/doc/api-reference/api-methods/save-objects/)",
  version: "0.0.1",
  type: "action",
  props: {
    algolia,
    indexName: {
      propDefinition: [
        algolia,
        "indexName",
      ],
    },
    objects: {
      label: "Objects",
      description: "An array of JavaScript objects, each corresponding to a new object in your search index. It's recommended you create this array of objects in a prior code step, then select expression mode and enter a variable reference to that array here",
      type: "string[]",
    },
    autoGenerateObjectIDIfNotExist: {
      type: "boolean",
      label: "Auto Generate Object ID If Not Present",
      description: "If an objectID property is not present on objects, automatically assign on. Defaults to true",
      optional: true,
      default: true,
    },
  },
  async run({ $ }) {
    const parsedObjects = this.objects.length
      ? this.objects.map((object) => JSON.parse(object))
      : JSON.parse(this.objects);

    const response = await this.algolia.createObjects({
      indexName: this.indexName,
      objects: parsedObjects,
      options: {
        autoGenerateObjectIDIfNotExist: this.autoGenerateObjectIDIfNotExist,
      },
    });

    $.export("$summary", "Successfully created objects");

    return response;
  },
};

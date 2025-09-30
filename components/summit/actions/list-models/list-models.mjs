import summit from "../../summit.app.mjs";

export default {
  key: "summit-list-models",
  name: "List Models",
  description: "Returns a list of models from Summit. [See the documentation](https://summit.readme.io/reference/apps)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    summit,
  },
  async run({ $ }) {
    const results = this.summit.paginate({
      resourceFn: this.summit.listModels,
      resourceType: "apps",
      args: {
        $,
      },
    });
    const models = [];
    for await (const model of results) {
      models.push(model);
    }
    $.export("$summary", `Successfully retrieved ${models.length} model${models.length === 1
      ? ""
      : "s"}`);
    return models;
  },
};

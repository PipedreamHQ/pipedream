import kosa8 from "../../kosa8.app.mjs";

export default {
  key: "kosa8-list-templates",
  name: "List Templates",
  description: "List the templates your kosa8 Cloud organization can create sandboxes from. [See the documentation](https://docs.kosa8.com/guides/cloud-openapi/)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    kosa8,
  },
  async run({ $ }) {
    const response = await this.kosa8.listTemplates({
      $,
    });
    const count = response.templates?.length ?? 0;
    $.export("$summary", `Successfully retrieved ${count} template${count === 1
      ? ""
      : "s"}`);
    return response;
  },
};

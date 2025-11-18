import sendoso from "../../sendoso.app.mjs";

export default {
  key: "sendoso-list-templates",
  name: "List Templates",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  description: "Retrieve a list of all custom templates. [See the documentation](https://sendoso.docs.apiary.io/#reference/template-management)",
  type: "action",
  props: {
    sendoso,
  },
  async run({ $ }) {
    const response = await this.sendoso.listTemplates({
      $,
    });

    let count = 0;
    if (typeof response === "string") {
      const result = response.replace(/(},)(?!.*\1)/gs, "}");
      const parsed = JSON.parse(result);
      count = parsed.custom_template?.length || 0;
    } else {
      count = response.custom_template?.length || response.length || 0;
    }

    $.export("$summary", `Successfully retrieved ${count} template(s)`);
    return response;
  },
};

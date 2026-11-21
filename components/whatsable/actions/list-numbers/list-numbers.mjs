import whatsable from "../../whatsable.app.mjs";

export default {
  name: "List Whatsable Numbers",
  description: "Retrieve Whatsable connected phone numbers",
  key: "whatsable-list-numbers",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },

  props: {
    whatsable,
  },

  async run({ $ }) {
    const response = await this.whatsable.listNumbers({
      $,
    });

    $.export("$summary", "Retrieved Whatsable numbers");

    return response;
  },
};

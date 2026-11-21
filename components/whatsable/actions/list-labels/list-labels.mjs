import whatsable from "../../whatsable.app.mjs";

export default {
  name: "List Labels",
  description: "Retrieve labels from Whatsable",
  key: "whatsable-list-labels",
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
    const response = await this.whatsable._makeRequest({
      $,
      method: "GET",
      path: "/labels",
    });

    $.export("$summary", "Retrieved Whatsable labels");

    return response;
  },
};

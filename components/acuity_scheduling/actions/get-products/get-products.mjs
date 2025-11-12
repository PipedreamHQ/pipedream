import acuityScheduling from "../../acuity_scheduling.app.mjs";

export default {
  key: "acuity_scheduling-get-products",
  name: "Get Products",
  description: "Return a list of products and packages. [See the documentation](https://developers.acuityscheduling.com/reference/get-products)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    acuityScheduling,
    deleted: {
      type: "boolean",
      label: "Deleted",
      description: "Retrieve deleted products",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.acuityScheduling.listProducts({
      $,
      params: {
        deleted: this.deleted,
      },
    });
    return response;
  },
};

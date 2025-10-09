import mailbluster from "../../app/mailbluster.app";

export default {
  key: "mailbluster-create-product",
  name: "Create New Product",
  description: "Create a new product. [See the documentation](https://app.mailbluster.com/api-doc/products)",
  type: "action",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    mailbluster,
    id: {
      type: "string",
      label: "Id",
      description: "Unique ID of the product",
    },
    name: {
      type: "string",
      label: "Name",
      description: "Name of the product",
    },
  },
  async run({ $ }) {
    const {
      mailbluster,
      ...data
    } = this;

    const response = await mailbluster.createProduct({
      $,
      data,
    });

    $.export("$summary", `Product ${data.name} was successfully created!`);
    return response;
  },
};

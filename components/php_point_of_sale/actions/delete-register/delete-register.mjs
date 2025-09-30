import app from "../../php_point_of_sale.app.mjs";

export default {
  key: "php_point_of_sale-delete-register",
  name: "Delete a Register",
  description: "Deletes a register from PHP Point of Sale. [See the documentation](https://phppointofsale.com/api.php#/registers/deleteregister)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    registerId: {
      propDefinition: [
        app,
        "registerId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.deleteRegister({
      $,
      register_id: this.registerId,
    });

    $.export("$summary", `Successfully deleted register with ID: ${this.registerId}`);

    return response;
  },
};

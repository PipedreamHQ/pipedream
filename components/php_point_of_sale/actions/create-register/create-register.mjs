import app from "../../php_point_of_sale.app.mjs";

export default {
  key: "php_point_of_sale-create-register",
  name: "Create Register",
  description: "Creates a new register in the store. [See the documentation](https://phppointofsale.com/api.php#/registers/addregister)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    name: {
      propDefinition: [
        app,
        "name",
      ],
    },
    iptranDeviceId: {
      propDefinition: [
        app,
        "iptranDeviceId",
      ],
    },
    emvTerminalId: {
      propDefinition: [
        app,
        "emvTerminalId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.createRegister({
      $,
      data: {
        name: this.name,
        iptran_device_id: this.iptranDeviceId,
        emv_terminal_id: this.emvTerminalId,
      },
    });

    $.export("$summary", "Successfully created a new register");

    return response;
  },
};

import wesupply from "../../wesupply.app.mjs";

export default {
  key: "wesupply-import-order",
  name: "Import Order",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "Orders can be pushed into the WeSupply platform via a JSON containing the order data. [See the docs here](https://documenter.getpostman.com/view/11859344/T17AiAYq#63058bb9-87f1-4fac-8d89-51bd37b194d9)",
  type: "action",
  props: {
    wesupply,
    importType: {
      type: "string",
      label: "Type",
      description: "The type of the data that you want to import.",
      options: [
        "XML",
        "JSON",
      ],
    },
    orderObject: {
      type: "object",
      label: "Order Object",
      description: "It can be an order object or an array of order objects. [XML data format](https://documenter.getpostman.com/view/11859344/T17AiAYq#bb003bce-0588-48cd-9c45-d3974a49e366), [JSON data format](https://documenter.getpostman.com/view/11859344/T17AiAYq#63058bb9-87f1-4fac-8d89-51bd37b194d9).",
    },
  },
  async run({ $ }) {
    const response = await this.wesupply.importOrder({
      $,
      importType: this.importType,
      data: this.orderObject,
    });

    $.export("$summary", "The order was successfully imported!");
    return response;
  },
};

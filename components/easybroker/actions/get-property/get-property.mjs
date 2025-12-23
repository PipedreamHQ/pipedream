import easybroker from "../../easybroker.app.mjs";

export default {
  key: "easybroker-get-property",
  name: "Get Property",
  description: "Get details of a property. [See the documentation](https://dev.easybroker.com/reference/get_properties-property-id)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    easybroker,
    propertyId: {
      propDefinition: [
        easybroker,
        "propertyId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.easybroker.getProperty({
      $,
      propertyId: this.propertyId,
    });
    $.export("$summary", `Successfully retrieved property with ID ${this.propertyId}`);
    return response;
  },
};

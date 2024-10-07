import cliento from "../../cliento.app.mjs";

export default {
  key: "cliento-get-ref-data",
  name: "Get Reference Data",
  description: "Fetch services, resources and mappings for the booking widget",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    cliento,
    fromDate: {
      propDefinition: [
        cliento,
        "fromDate",
      ],
    },
    toDate: {
      propDefinition: [
        cliento,
        "toDate",
      ],
    },
    resourceIds: {
      propDefinition: [
        cliento,
        "resourceIds",
      ],
    },
    serviceIds: {
      propDefinition: [
        cliento,
        "serviceIds",
      ],
    },
  },
  async run({ $ }) {
    const settings = await this.cliento.fetchSettings();
    const refData = await this.cliento.fetchRefData();
    const slots = await this.cliento.fetchSlots({
      fromDate: this.fromDate,
      toDate: this.toDate,
      resourceIds: this.resourceIds,
      serviceIds: this.serviceIds,
    });
    $.export("$summary", "Successfully fetched reference data");
    return {
      settings,
      refData,
      slots,
    };
  },
};

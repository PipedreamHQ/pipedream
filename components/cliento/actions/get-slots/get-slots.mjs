import cliento from "../../cliento.app.mjs";

export default {
  key: "cliento-get-slots",
  name: "Get Slots",
  description: "Fetch available slots for the given service, resource and dates",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    cliento,
    fromDate: {
      ...cliento.propDefinitions.fromDate,
      description: "The start date for the booking period (format: YYYY-MM-DD)",
    },
    toDate: {
      ...cliento.propDefinitions.toDate,
      description: "The end date for the booking period (format: YYYY-MM-DD)",
    },
    resourceIds: {
      ...cliento.propDefinitions.resourceIds,
      description: "The IDs of the resources for the booking",
    },
    serviceIds: {
      ...cliento.propDefinitions.serviceIds,
      description: "The IDs of the services for the booking",
    },
  },
  async run({ $ }) {
    const slots = await this.cliento.fetchSlots({
      fromDate: this.fromDate,
      toDate: this.toDate,
      resourceIds: this.resourceIds,
      serviceIds: this.serviceIds,
    });
    $.export("$summary", `Successfully fetched ${slots.length} slots`);
    return slots;
  },
};

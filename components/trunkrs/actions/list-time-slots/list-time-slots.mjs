import trunkrs from "../../trunkrs.app.mjs";

export default {
  key: "trunkrs-list-time-slots",
  name: "List Time Slots",
  description: "List time slots. [See the documentation](https://docs.trunkrs.nl/docs/v2-api-documentation/5f27080ea3314-list-time-slots)",
  version: "0.0.1",
  type: "action",
  props: {
    trunkrs,
    country: {
      propDefinition: [
        trunkrs,
        "country",
      ],
    },
    postalCode: {
      type: "string",
      label: "Postal Code",
      description: "The postal code of the recipient",
      optional: true,
    },
  },
  async run({ $ }) {
    const { data } = await this.trunkrs.listTimeSlots({
      $,
      params: {
        country: this.country,
        postalCode: this.postalCode,
      },
    });
    $.export("$summary", `Successfully fetched ${data.length} time slots.`);
    return data;
  },
};

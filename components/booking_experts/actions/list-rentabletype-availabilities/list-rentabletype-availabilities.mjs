import { ConfigurationError } from "@pipedream/platform";
import bookingExperts from "../../booking_experts.app.mjs";
import { FIELDS_OPTIONS } from "../../common/constants.mjs";
import { parseObject } from "../../common/utils.mjs";

export default {
  key: "booking_experts-list-rentabletype-availabilities",
  name: "List RentableType Availabilities",
  description: "List availabilities of a RentableType you have access to. [See the documentation](https://developers.bookingexperts.com/reference/channel-rentabletype-availabilities-index)",
  version: "1.0.0",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    bookingExperts,
    info: {
      type: "alert",
      alertType: "warning",
      content: "**The API will only list channels created through the Booking Experts API.**",
    },
    channelId: {
      propDefinition: [
        bookingExperts,
        "channelId",
      ],
      optional: false,
    },
    rentableTypeId: {
      propDefinition: [
        bookingExperts,
        "rentableTypeId",
        ({ channelId }) => ({
          channelId,
        }),
      ],
    },
    startDate: {
      type: "string",
      label: "Start Date",
      description: "The start date of the availability. Yields availability for the given date range. Format: `YYYY-MM-DD`",
      optional: true,
    },
    endDate: {
      type: "string",
      label: "End Date",
      description: "The end date of the availability. Will be capped to 2 years in the future. Max LOS is capped to 30. Format: `YYYY-MM-DD`",
      optional: true,
    },
    fields: {
      type: "string[]",
      label: "Fields",
      description: "Fieldset. A list of attributes to return. [See the documentation](https://developers.bookingexperts.com/reference/channel-rentabletype-availabilities-index)",
      options: FIELDS_OPTIONS,
      optional: true,
    },
    include: {
      type: "string[]",
      label: "Include",
      description: "Includes list. A list of resources to include. [See the documentation](https://developers.bookingexperts.com/reference/channel-rentabletype-availabilities-index)",
      optional: true,
    },
    multibookSafetyMargin: {
      type: "integer",
      label: "Multi-book Safety Margin",
      description: "Specifies a custom multibook safety margin (must be a positive number). A common problem that occurs when dealing with accommodations instead of hotelrooms is that a single accommodation must be available for all consecutive days for a given start date and LOS. The safety margin helps to prevent overbookings by transforming the available stock. When specified, the safety margin is subtracted from the actual stock. It is only applied to RentableType availabilities with capacity of 3 or more, as this issue cannot occur otherwise.",
      optional: true,
    },
  },
  async run({ $ }) {
    if ((!this.startDate && this.endDate) || (this.startDate && !this.endDate)) {
      throw new ConfigurationError("You should provide both the start and end date parameters.");
    }
    const response = await this.bookingExperts.listRentableTypeAvailabilities({
      $,
      channelId: this.channelId,
      rentableTypeId: this.rentableTypeId,
      params: {
        ...(this.startDate && this.endDate
          && {
            "date_range": `${this.startDate}..${this.endDate}`,
          }),
        "fields[rentable_type_availability]": parseObject(this.fields)?.join(","),
        "include": parseObject(this.include)?.join(","),
        "multibook_safety_margin": this.multibookSafetyMargin,
      },
    });
    $.export("$summary", `Found ${response.data.length} rentable type availabilities`);
    return response;
  },
};

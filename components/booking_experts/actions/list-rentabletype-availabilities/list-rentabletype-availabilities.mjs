import { ConfigurationError } from "@pipedream/platform";
import bookingExperts from "../../booking_experts.app.mjs";

export default {
  key: "booking_experts-list-rentabletype-availabilities",
  name: "List RentableType Availabilities",
  description: "List availabilities of a RentableType you have access to. [See the documentation](https://developers.bookingexperts.com/reference/channel-rentabletype-availabilities-index)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    bookingExperts,
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
  },
  async run({ $ }) {
    if ((!this.startDate && this.endDate) || (this.startDate && !this.endDate)) {
      throw new ConfigurationError("You should provide both the start and end date parameters.");
    }
    const { data } = await this.bookingExperts.listRentableTypeAvailabilities({
      $,
      channelId: this.channelId,
      rentableTypeId: this.rentableTypeId,
      params: {
        ...(this.startDate && this.endDate
          && {
            "date_range": `${this.startDate}..${this.endDate}`,
          }),
      },
    });
    $.export("$summary", `Found ${data.length} rentable type availabilities`);
    return data;
  },
};

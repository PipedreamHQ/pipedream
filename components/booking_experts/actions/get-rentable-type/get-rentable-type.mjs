import bookingExperts from "../../booking_experts.app.mjs";
import { formatCommaSeparatedString } from "../../common/utils.mjs";

export default {
  key: "booking_experts-get-rentable-type",
  name: "Get Rentable Type",
  description: "Returns a rentable type. [See the documentation](https://developers.bookingexperts.com/reference/administration-rentabletypes-show)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    bookingExperts,
    administrationId: {
      propDefinition: [
        bookingExperts,
        "administrationId",
      ],
    },
    rentableTypeId: {
      propDefinition: [
        bookingExperts,
        "rentableTypeId",
        ({ administrationId }) => ({
          administrationId,
        }),
      ],
    },
    fields: {
      propDefinition: [
        bookingExperts,
        "fields",
      ],
    },
    include: {
      propDefinition: [
        bookingExperts,
        "include",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.bookingExperts.getRentableType({
      $,
      administrationId: this.administrationId,
      rentableTypeId: this.rentableTypeId,
      params: {
        "fields[rentable_type]": formatCommaSeparatedString(this.fields),
        "include": formatCommaSeparatedString(this.include),
      },
    });
    $.export("$summary", `Successfully retrieved rentable type with ID ${this.rentableTypeId}`);
    return response;
  },
};

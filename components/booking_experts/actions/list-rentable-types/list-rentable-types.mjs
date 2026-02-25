import bookingExperts from "../../booking_experts.app.mjs";
import { parseObject } from "../../common/utils.mjs";

export default {
  key: "booking_experts-list-rentable-types",
  name: "List Rentable Types",
  description: "List all rentable types for a given administration. [See the documentation](https://developers.bookingexperts.com/reference/administration-rentabletypes-index)",
  version: "0.1.0",
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
    page: {
      propDefinition: [
        bookingExperts,
        "page",
      ],
    },
    perPage: {
      propDefinition: [
        bookingExperts,
        "perPage",
      ],
    },
    sort: {
      propDefinition: [
        bookingExperts,
        "sort",
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
    filters: {
      type: "object",
      label: "Filters",
      description: "Additional query params to filter rentable types. Example: `filter[name]=My Rentable Type` [See the documentation](https://developers.bookingexperts.com/reference/administration-rentabletypes-index) for available filters.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.bookingExperts.listRentableTypesForAdmin({
      $,
      administrationId: this.administrationId,
      params: {
        "page[number]": this.page,
        "page[size]": this.perPage,
        "sort": this.sort,
        "fields[rentable_type]": this.fields,
        "include": this.include,
        ...parseObject(this.filters),
      },
    });

    $.export("$summary", `Successfully retrieved ${response.data?.length ?? 0} rentable types for Administration ${this.administrationId}`);

    return response;
  },
};

import bookingExperts from "../../booking_experts.app.mjs";

export default {
  key: "booking_experts-list-rentable-types",
  name: "List Rentable Types",
  description: "List all rentable types for a given administration.",

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

    query: {
      type: "object",
      label: "Query Filters",
      description: "Optional filters passed to the API. Leave empty to fetch everything.",
      optional: true,
    },
  },

  async run({ $ }) {
    const { data } = await this.bookingExperts.listRentableTypesForAdmin({
      $,
      administrationId: this.administrationId,
      params: this.query,
    });

    $.export(
      "$summary",
      `Fetched ${data?.length ?? 0} rentable types for Administration #${this.administrationId}`
    );

    return data;
  },
};

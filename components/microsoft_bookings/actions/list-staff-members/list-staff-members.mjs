import app from "../../microsoft_bookings.app.mjs";

export default {
  key: "microsoft_bookings-list-staff-members",
  name: "List Staff Members",
  description: "Lists all staff members in a Microsoft Bookings business. [See the documentation](https://learn.microsoft.com/en-us/graph/api/bookingbusiness-list-staffmembers?view=graph-rest-1.0)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    app,
    businessId: {
      propDefinition: [
        app,
        "businessId",
      ],
    },
  },
  async run({ $ }) {
    const {
      app,
      businessId,
    } = this;

    const response = await app.listStaffMembers({
      businessId,
    });

    const staffMembers = response.value || [];

    $.export("$summary", `Successfully retrieved ${staffMembers.length} staff member(s)`);

    return response;
  },
};

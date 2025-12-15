import app from "../../microsoft_bookings.app.mjs";

export default {
  key: "microsoft_bookings-list-services",
  name: "List Services",
  description: "Lists all services in a Microsoft Bookings business. [See the documentation](https://learn.microsoft.com/en-us/graph/api/bookingbusiness-list-services?view=graph-rest-1.0)",
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

    const response = await app.listServices({
      businessId,
    });

    const services = response.value || [];

    $.export("$summary", `Successfully retrieved ${services.length} service(s)`);

    return response;
  },
};

import app from "../../upsales.app.mjs";

export default {
  key: "upsales-get-appointment-list",
  name: "Get Appointment List",
  description: "Retrieves a list of appointments from Upsales. [See the documentation](https://api.upsales.com/#1346adbc-3479-45b7-b75c-9a78c4d291e6)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    limit: {
      propDefinition: [
        app,
        "limit",
      ],
    },
    offset: {
      propDefinition: [
        app,
        "offset",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.listAppointments({
      $,
      params: {
        limit: this.limit,
        offset: this.offset,
      },
    });

    $.export("$summary", `Successfully retrieved ${response.data?.length || 0} appointment(s)`);
    return response;
  },
};


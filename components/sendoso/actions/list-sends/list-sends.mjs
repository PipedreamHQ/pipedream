import sendoso from "../../sendoso.app.mjs";

export default {
  key: "sendoso-list-sends",
  name: "List Sends",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  description: "Retrieve a list of all sends/gifts with optional filters. [See the documentation](https://sendoso.docs.apiary.io/#reference/send-management)",
  type: "action",
  props: {
    sendoso,
    limit: {
      propDefinition: [
        sendoso,
        "limit",
      ],
      description: "Maximum number of sends to return.",
    },
    offset: {
      propDefinition: [
        sendoso,
        "offset",
      ],
      description: "Number of sends to skip for pagination.",
    },
    startDate: {
      propDefinition: [
        sendoso,
        "startDate",
      ],
      optional: true,
      description: "Filter sends created after this date (YYYY-MM-DD).",
    },
    endDate: {
      propDefinition: [
        sendoso,
        "endDate",
      ],
      optional: true,
      description: "Filter sends created before this date (YYYY-MM-DD).",
    },
  },
  async run({ $ }) {
    const {
      limit,
      offset,
      startDate,
      endDate,
    } = this;

    const params = {
      limit,
      offset,
    };

    if (startDate) params.start_date = startDate;
    if (endDate) params.end_date = endDate;

    const response = await this.sendoso.listSends({
      $,
      params,
    });

    const count = Array.isArray(response) ?
      response.length :
      (response.data?.length || 0);
    $.export("$summary", `Successfully retrieved ${count} send(s)`);
    return response;
  },
};


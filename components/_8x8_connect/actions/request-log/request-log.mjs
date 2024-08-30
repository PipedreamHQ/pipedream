import app from "../../_8x8_connect.app.mjs";

export default {
  key: "_8x8_connect-request-log",
  name: "Request Log",
  description: "Request an SMS log file. [See the documentation](https://developer.8x8.com/connect/reference/start-log-export-job)",
  version: "0.0.4",
  type: "action",
  props: {
    app,
    destination: {
      propDefinition: [
        app,
        "destination",
      ],
      optional: true,
    },
    from: {
      propDefinition: [
        app,
        "from",
      ],
    },
    to: {
      propDefinition: [
        app,
        "to",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.requestLog({
      $,
      data: {
        phoneNumber: this.destination,
        from: this.from,
        to: this.to,
      },
    });

    $.export("$summary", `Successfully requested SMS log.  You will need the following ID get the request result: '${response.jobId}'`);

    return response;
  },
};

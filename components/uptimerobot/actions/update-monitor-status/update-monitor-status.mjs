import app from "../../uptimerobot.app.mjs";

export default {
  key: "uptimerobot-update-monitor-status",
  name: "Update Monitor Status",
  description: "Update an existing monitor's status to pause or resume monitoring. [See the documentation](https://uptimerobot.com/api/).",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    monitorId: {
      propDefinition: [
        app,
        "monitorId",
      ],
    },
    status: {
      propDefinition: [
        app,
        "status",
      ],
    },
  },
  async run({ $ }) {
    const {
      app,
      monitorId,
      status,
    } = this;

    const response = await app.updateMonitor({
      $,
      data: {
        id: monitorId,
        status,
      },
    });
    $.export("$summary", "Successfully updated the monitor status.");
    return response;
  },
};

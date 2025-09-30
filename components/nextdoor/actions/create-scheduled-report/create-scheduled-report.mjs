import app from "../../nextdoor.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "nextdoor-create-scheduled-report",
  name: "Create Scheduled Report",
  description: "Creates a scheduled report based on the input configuration. Upon a successful request the report will be sent out based on the schedule cadence. [See the documentation](https://developer.nextdoor.com/reference/reporting-scheduled-create).",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    advertiserId: {
      propDefinition: [
        app,
        "advertiserId",
      ],
    },
    name: {
      description: "The name of the report.",
      propDefinition: [
        app,
        "name",
      ],
    },
    schedule: {
      propDefinition: [
        app,
        "schedule",
      ],
    },
    recipientEmails: {
      propDefinition: [
        app,
        "recipientEmails",
      ],
    },
    dimensionGranularity: {
      propDefinition: [
        app,
        "dimensionGranularity",
      ],
    },
    timeGranularity: {
      propDefinition: [
        app,
        "timeGranularity",
      ],
    },
    metrics: {
      propDefinition: [
        app,
        "metrics",
      ],
    },
  },
  methods: {
    createReport(args = {}) {
      return this.app.post({
        path: "/reporting/scheduled/create",
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      createReport,
      advertiserId,
      name,
      schedule,
      recipientEmails,
      dimensionGranularity,
      timeGranularity,
      metrics,
    } = this;

    const response = await createReport({
      $,
      data: {
        advertiser_id: advertiserId,
        name,
        schedule,
        recipient_emails: utils.parseArray(recipientEmails),
        dimension_granularity: utils.parseArray(dimensionGranularity),
        time_granularity: [
          timeGranularity,
        ],
        metrics,
      },
    });

    $.export("$summary", `Successfully created report with ID \`${response.id}\`.`);
    return response;
  },
};

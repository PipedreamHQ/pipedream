import app from "../../zoom.app.mjs";

export default {
  key: "zoom-get-webinar-details",
  name: "Get Webinar Details",
  description: "Gets details of a scheduled webinar. [See the docs here](https://marketplace.zoom.us/docs/api-reference/zoom-api/methods/#operation/webinar).",
  version: "0.3.7",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    webinarId: {
      propDefinition: [
        app,
        "webinarId",
      ],
    },
    occurrenceId: {
      type: "string",
      label: "Occurrence ID",
      description: "Unique Identifier that identifies an occurrence of a recurring webinar.  Recurring webinars can have a maximum of 50 occurrences.",
      optional: true,
    },
  },
  methods: {
    getWebinarDetails({
      webinarId, ...args
    } = {}) {
      return this.app._makeRequest({
        path: `/webinars/${webinarId}`,
        ...args,
      });
    },
  },
  async run({ $: step }) {
    const {
      webinarId,
      occurrenceId,
    } = this;

    const response = await this.getWebinarDetails({
      step,
      webinarId,
      params: {
        occurrence_id: occurrenceId,
      },
    });

    step.export("$summary", `Successfully retrieved webinar details with ID \`${response.id}\``);

    return response;
  },
};

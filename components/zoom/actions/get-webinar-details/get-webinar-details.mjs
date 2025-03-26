import app from "../../zoom.app.mjs";

export default {
  key: "zoom-get-webinar-details",
  name: "Get Webinar Details",
  description: "Gets details of a scheduled webinar. Requires a paid Zoom account. [See the documentation](https://developers.zoom.us/docs/api/meetings/#tag/webinars/GET/webinars/{webinarId}).",
  version: "0.3.4",
  type: "action",
  props: {
    app,
    paidAccountAlert: {
      propDefinition: [
        app,
        "paidAccountAlert",
      ],
    },
    webinarId: {
      propDefinition: [
        app,
        "webinarId",
      ],
    },
    occurrenceId: {
      propDefinition: [
        app,
        "occurrenceIds",
        (c) => ({
          webinarId: c.webinarId,
        }),
      ],
      type: "string",
      label: "Occurence ID",
      description: "Unique Identifier that identifies an occurrence of a recurring webinar",
      optional: true,
    },
    showPreviousOccurrences: {
      type: "boolean",
      label: "Show Previous Occurrences",
      description: "Set the value of this field to true if you would like to view Webinar details of all previous occurrences of a recurring Webinar.",
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
      showPreviousOccurrences,
    } = this;

    const response = await this.getWebinarDetails({
      step,
      webinarId,
      params: {
        occurrence_id: occurrenceId,
        show_previous_occurrences: showPreviousOccurrences,
      },
    });

    step.export("$summary", `Successfully retrieved webinar details with ID \`${response.id}\``);

    return response;
  },
};

import zoom from "../../zoom.app.mjs";

export default {
  key: "zoom-list-past-webinar-qa",
  name: "List Past Webinar Q&A",
  description: "List Q&A of a specific Webinar. Requires a paid Zoom account. [See the documentation](https://developers.zoom.us/docs/api/meetings/#tag/webinars/GET/past_webinars/{webinarId}/qa)",
  version: "0.1.5",
  type: "action",
  props: {
    zoom,
    paidAccountAlert: {
      propDefinition: [
        zoom,
        "paidAccountAlert",
      ],
    },
    webinarId: {
      propDefinition: [
        zoom,
        "webinarId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.listPastWebinarQA({
      $,
      webinarId: this.webinarId,
    });

    $.export("$summary", `Successfully retrieved Q&A for webinar with ID: ${this.webinarId}`);

    return response;
  },
};

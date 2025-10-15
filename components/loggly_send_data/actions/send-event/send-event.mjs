/* eslint-disable camelcase */
import loggly_send_data from "../../loggly_send_data.app.mjs";

export default {
  name: "Send Event",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  key: "loggly_send_data-send-event",
  description: "Send events to Loggly, with tags. [See the docs](https://documentation.solarwinds.com/en/success_center/loggly/content/admin/http-endpoint.htm) for more details",
  props: {
    loggly_send_data,
    tags: {
      propDefinition: [
        loggly_send_data,
        "tags",
      ],
    },
    data: {
      propDefinition: [
        loggly_send_data,
        "eventData",
      ],
    },
    contentType: {
      propDefinition: [
        loggly_send_data,
        "contentType",
      ],
    },
  },
  type: "action",
  methods: {},
  async run({ $ }) {
    const {
      contentType,
      data,
      tags,
    } = this;
    const { response } = await this.loggly_send_data.logData({
      $,
      contentType,
      tags,
      data,
    });
    if (response === "ok") $.export("$summary", "Successfully sent event to Loggly");
  },
};

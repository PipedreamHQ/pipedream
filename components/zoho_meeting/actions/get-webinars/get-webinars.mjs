import app from "../../zoho_meeting.app.mjs";

export default {
  name: "Get Webinars",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  key: "zoho_meeting-get-webinars",
  description: "Get a list of webinars. [See the documentation](https://www.zoho.com/meeting/api-integration/webinar-api/list-of-webinar-api.html)",
  type: "action",
  props: {
    app,
  },
  async run({ $ }) {
    const response = await this.app.getWebinars({
      $,
      params: {
        listtype: "all",
      },
    });

    if (response) {
      $.export("$summary", `Successfully retrieved ${response.webinar.length} webinars`);
    }

    return response;
  },
};

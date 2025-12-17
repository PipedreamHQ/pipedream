import app from "../../upsales.app.mjs";

export default {
  key: "upsales-get-activity",
  name: "Get Activity",
  description: "Retrieves a single activity by ID from Upsales. [See the documentation](https://api.upsales.com/#299df572-5151-4684-b4f4-dea0f9ba192c)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    activityId: {
      propDefinition: [
        app,
        "activityId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.getActivity({
      $,
      activityId: this.activityId,
    });

    $.export("$summary", `Successfully retrieved activity: ${response.data?.id || this.activityId}`);
    return response;
  },
};


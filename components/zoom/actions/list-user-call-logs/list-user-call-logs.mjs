import zoom from "../../zoom.app.mjs";

export default {
  name: "List User's Call Logs",
  description: "Gets a user's Zoom phone call logs. [See the documentation](https://developers.zoom.us/docs/zoom-phone/apis/#operation/phoneUserCallLogs)",
  key: "zoom-list-user-call-logs",
  version: "0.0.8",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    zoom,
    userId: {
      propDefinition: [
        zoom,
        "userId",
      ],
    },
  },
  async run ({ $ }) {
    const data = await this.zoom.getResourcesStream({
      resourceFn: this.zoom.listCallLogs,
      resourceFnArgs: {
        userId: this.userId,
      },
      resourceName: "call_logs",
    });

    $.export("$summary", `Successfully fetched ${data.length} call log(s)`);

    return data;
  },
};

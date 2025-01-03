import zoom from "../../zoom.app.mjs";

export default {
  name: "List User's Call Logs",
  description: "Gets a user's Zoom phone call logs. Requires a paid Zoom account. [See the documentation](https://developers.zoom.us/docs/zoom-phone/apis/#operation/phoneUserCallLogs)",
  key: "zoom-list-user-call-logs",
  version: "0.0.4",
  type: "action",
  props: {
    zoom,
    paidAccountAlert: {
      propDefinition: [
        zoom,
        "paidAccountAlert",
      ],
    },
    userId: {
      propDefinition: [
        zoom,
        "phoneUserId",
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

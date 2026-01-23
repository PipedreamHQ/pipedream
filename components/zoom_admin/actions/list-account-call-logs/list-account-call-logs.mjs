import { paginate } from "../../common/pagination.mjs";
import zoomAdmin from "../../zoom_admin.app.mjs";

export default {
  name: "List Account Call Logs",
  description: "Returns an account's new edition call logs. [See the documentation](https://developers.zoom.us/docs/zoom-phone/apis/#operation/accountCallHistory)",
  key: "zoom_admin-list-account-call-logs",
  version: "0.0.6",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    zoomAdmin,
  },
  async run ({ $ }) {
    const data = await paginate(
      this.zoomAdmin.listAccountCallLogs,
      "call_logs",
    );

    $.export("$summary", `Successfully fetched ${data.length} call log(s)`);

    return data;
  },
};

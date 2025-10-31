import { paginate } from "../../common/pagination.mjs";
import consts from "../../consts.mjs";
import zoomAdmin from "../../zoom_admin.app.mjs";

export default {
  name: "List User Cloud Recordings",
  description: "Search cloud recordings from a user. [See the documentation](https://developers.zoom.us/docs/api/users/#tag/users/GET/users/{userId}/recordings)",
  key: "zoom_admin-list-user-cloud-recordings",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    zoomAdmin,
    userId: {
      type: "string",
      label: "User ID",
      description: "The user ID to get recordings for",
    },
    mc: {
      type: "string",
      label: "MC",
      description: "Query Metadata of Recording if an On-Premise Meeting Connector was used for the meeting.",
      optional: true,
    },
    trash: {
      type: "boolean",
      label: "Trash",
      description: "If `true`, list recordings from trash",
      optional: true,
    },
    trashType: {
      type: "string",
      label: "Trash Type",
      description: "Should be used together with `Trash`. The type of Cloud recording that you would like to retrieve from trash",
      optional: true,
      options: consts.CLOUD_RECORD_TRASH_TYPE_OPTIONS,
    },
    from: {
      type: "string",
      label: "From",
      description: "The start date in `yyyy-mm-dd` UTC format for the date range for which you would like to retrieve recordings. The maximum range can be a month. If no value is provided for this field, the default will be current date.",
      optional: true,
    },
    to: {
      type: "string",
      label: "To",
      description: "End date in `yyyy-mm-dd` UTC format.",
      optional: true,
    },
  },
  async run({ $ }) {
    const params = {
      mc: this.mc,
      trash: this.trash,
      trash_type: this.trashType,
      from: this.from,
      to: this.to,
    };

    const data = await paginate(
      this.zoomAdmin.listUserCloudRecordings,
      "meetings",
      this.userId,
      params,
    );

    $.export("$summary", `${data.length} Cloud record(s) successfully fetched`);

    return data;
  },
};

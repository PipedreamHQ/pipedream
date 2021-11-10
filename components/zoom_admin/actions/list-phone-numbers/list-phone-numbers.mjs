import zoomAdmin from "../../zoom_admin.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  name: "List Phone Numbers",
  description: "List all phone numbers owned by an user. [See the docs here](https://marketplace.zoom.us/docs/api-reference/zoom-phone-api/phone-numbers/listaccountphonenumbers)",
  key: "zoom_admin-action-list-phone-numbers",
  version: "0.0.1",
  type: "action",
  props: {
    zoomAdmin,
    pageSize: {
      propDefinition: [
        zoomAdmin,
        "pageSize",
      ],
    },
    nextPageToken: {
      propDefinition: [
        zoomAdmin,
        "nextPageToken",
      ],
    },
    type: {
      type: "string",
      label: "Type",
      description: "Query response by number assignment.",
      optional: true,
      options: [
        {
          label: "The number has been assigned to either a user, a call queue, an auto-receptionist or a common area phone in an account",
          value: "assigned",
        },
        {
          label: "The number is not assigned to anyone",
          value: "unassigned",
        },
        {
          label: "Include both assigned and unassigned numbers in the response",
          value: "all",
        },
        {
          label: "Include Bring Your Own Carrier (BYOC) numbers only in the response",
          value: "byoc",
        },
      ],
    },
    extensionType: {
      type: "string",
      label: "Extension Type",
      description: "The type of assignee to whom the number is assigned.",
      optional: true,
      options: [
        "user",
        "callQueue",
        "autoReceptionist",
        "commonAreaPhone",
      ],
    },
    numberType: {
      type: "string",
      label: "Number Type",
      description: "The type of phone number",
      optional: true,
      options: [
        "toll",
        "tollfree",
      ],
    },
    pendingNumbers: {
      type: "boolean",
      label: "Pending Numbers",
      description: "Include or exclude pending numbers in the response",
      optional: true,
    },
    siteId: {
      type: "string",
      label: "Site ID",
      description: "Unique identifier of the site. Use this query parameter if you have enabled multiple sites and would like to filter the response of this API call by a specific phone site. See [Managing multiple sites](https://support.zoom.us/hc/en-us/articles/360020809672-Managing-multiple-sites) or [Adding a site](https://support.zoom.us/hc/en-us/articles/360020809672-Managing-multiple-sites#h_05c88e35-1593-491f-b1a8-b7139a75dc15) for details.",
      optional: true,
    },
  },
  async run ({ $ }) {
    const res = await axios($, this.zoomAdmin._getAxiosParams({
      method: "GET",
      path: "/phone/numbers",
      params: {
        page_size: this.pageSize,
        next_page_token: this.nextPageToken,
        type: this.type,
        extension_type: this.extensionType,
        number_type: this.numberType,
        pending_numbers: this.pendingNumbers,
        site_id: this.siteId,
      },
    }));

    $.export("$summary", "Phone numbers successfully fetched");

    return res;
  },
};

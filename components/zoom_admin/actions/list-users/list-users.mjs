import { paginate } from "../../common/pagination.mjs";
import zoomAdmin from "../../zoom_admin.app.mjs";

export default {
  name: "List users",
  description: "List all users. [See the documentation](https://developers.zoom.us/docs/api/users/#tag/users/GET/users)",
  key: "zoom_admin-list-users",
  version: "0.0.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    zoomAdmin,
    status: {
      type: "string",
      label: "Status",
      description: "The user's status",
      optional: true,
      default: "active",
      options: [
        {
          label: "Active",
          value: "active",
        },
        {
          label: "Inactive",
          value: "inactive",
        },
        {
          label: "Pending",
          value: "pending",
        },
      ],
    },
    pageSize: {
      type: "integer",
      label: "Page Size",
      description: "The number of records returned within a single API call",
      optional: true,
      default: 30,
      min: 1,
      max: 2000,
    },
    roleId: {
      type: "string",
      label: "Role ID",
      description: "The role's unique ID to filter users by a specific role",
      optional: true,
    },
    pageNumber: {
      type: "string",
      label: "Page Number",
      description: "The page number of the current page in the returned records",
      optional: true,
    },
    includeFields: {
      type: "string",
      label: "Include Fields",
      description: "Additional fields to include in the response",
      optional: true,
      options: [
        {
          label: "Custom Attributes",
          value: "custom_attributes",
        },
        {
          label: "Host Key",
          value: "host_key",
        },
      ],
    },
    nextPageToken: {
      type: "string",
      label: "Next Page Token",
      description: "Token for paginating through large result sets (expires in 15 minutes)",
      optional: true,
    },
    license: {
      type: "string",
      label: "License",
      description: "Filter users by specific license",
      optional: true,
      options: [
        {
          label: "Zoom Workforce Management",
          value: "zoom_workforce_management",
        },
        {
          label: "Zoom Compliance Management",
          value: "zoom_compliance_management",
        },
      ],
    },
  },
  async run({ $ }) {
    const params = {
      status: this.status,
      page_size: this.pageSize,
      role_id: this.roleId,
      page_number: this.pageNumber,
      include_fields: this.includeFields,
      next_page_token: this.nextPageToken,
      license: this.license,
    };

    const data = await paginate(
      this.zoomAdmin.listUsers,
      "users",
      params,
    );

    $.export("$summary", `Successfully fetched ${data.length} user(s)`);

    return data;
  },
};

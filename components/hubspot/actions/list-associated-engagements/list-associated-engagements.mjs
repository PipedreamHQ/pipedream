import hubspot from "../../hubspot.app.mjs";

export default {
  key: "hubspot-list-associated-engagements",
  name: "List Associated Engagements",
  description:
    "List engagements (notes, tasks, calls, meetings, emails, etc.) associated with a CRM record using HubSpot's legacy Engagements v1 paged API."
    + " This endpoint is documented for **company**, **deal**, and **quote**; other object types may return errors."
    + " Use **Offset** for pagination when `hasMore` is true."
    + " For newer CRM v3 engagement objects, prefer v4 **List CRM Associations** from the record to `notes`, `tasks`, `calls`, etc."
    + " [See the documentation](https://developers.hubspot.com/docs/api-reference/legacy/engagements-v1/engagements/get-engagements-v1-engagements-associated-crm-object-id-paged)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    hubspot,
    objectType: {
      propDefinition: [
        hubspot,
        "objectType",
      ],
      label: "CRM Object Type",
      description:
        "Type of CRM record to load engagements for. Legacy API: typically **company**, **deal**, or **quote**.",
    },
    objectId: {
      propDefinition: [
        hubspot,
        "objectId",
        ({ objectType }) => ({
          objectType,
        }),
      ],
      label: "Object ID",
      description:
        "HubSpot ID of the record. After choosing **CRM Object Type**, pick from the list or enter an ID (for contacts you can search by email).",
    },
    offset: {
      type: "integer",
      label: "Offset",
      description: "Pagination offset from the legacy API (default 0).",
      optional: true,
      default: 0,
      min: 0,
    },
  },
  async run({ $ }) {
    const response = await this.hubspot.getAssociatedEngagementsPaged({
      $,
      objectType: this.objectType,
      objectId: this.objectId,
      offset: this.offset ?? 0,
    });

    const total = response?.results?.length ?? response?.engagements?.length ?? 0;
    const hasMore = response?.hasMore === true;
    $.export(
      "$summary",
      `Retrieved ${total} engagement${total === 1
        ? ""
        : "s"}${hasMore
        ? "; more available with a higher **Offset**"
        : ""}`,
    );
    return response;
  },
};

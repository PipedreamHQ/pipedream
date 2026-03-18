import infusionsoft from "../../app/infusionsoft.app";
import { defineAction } from "@pipedream/types";

export default defineAction({
  name: "List Contacts",
  description:
    "Search for and list all the contacts that match by filters. [See the documentation](https://developer.infusionsoft.com/docs/restv2/#tag/Contact)",
  key: "infusionsoft-list-contacts",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    infusionsoft,
    email: {
      type: "string",
      label: "Email",
      description: "Filter contacts by email.",
      optional: true,
    },
    givenName: {
      type: "string",
      label: "Given Name",
      description: "Filter contacts by first name.",
      optional: true,
    },
    familyName: {
      type: "string",
      label: "Family Name",
      description: "Filter contacts by last name.",
      optional: true,
    },
    companyId: {
      type: "string",
      label: "Company ID",
      description: "Filter contacts by company ID.",
      optional: true,
    },
    contactIds: {
      type: "string",
      label: "Contact IDs",
      description: "Filter by specific contact IDs (comma-separated).",
      optional: true,
    },
    startUpdateTime: {
      type: "string",
      label: "Start Update Time",
      description: "Filter contacts updated after this time (ISO 8601 format).",
      optional: true,
    },
    endUpdateTime: {
      type: "string",
      label: "End Update Time",
      description: "Filter contacts updated before this time (ISO 8601 format).",
      optional: true,
    },
    fields: {
      type: "string",
      label: "Fields",
      description: "Comma-separated contact properties to include.",
      optional: true,
    },
    orderBy: {
      type: "string",
      label: "Order By",
      description: "Field and direction to order results.",
      optional: true,
      options: [
        { label: "ID (Ascending)", value: "id asc" },
        { label: "ID (Descending)", value: "id desc" },
        { label: "Create Time (Ascending)", value: "create_time asc" },
        { label: "Create Time (Descending)", value: "create_time desc" },
        { label: "Email (Ascending)", value: "email asc" },
        { label: "Email (Descending)", value: "email desc" },
      ],
    },
    pageSize: {
      type: "string",
      label: "Page Size",
      description: "Number of results per page (1-1000).",
      optional: true,
    },
    pageToken: {
      type: "string",
      label: "Page Token",
      description: "Token for fetching the next page of results.",
      optional: true,
    },
  },
  async run({ $ }): Promise<object> {
    const result = await this.infusionsoft.listContactsV2({
      $,
      email: this.email,
      givenName: this.givenName,
      familyName: this.familyName,
      companyId: this.companyId,
      contactIds: this.contactIds,
      startUpdateTime: this.startUpdateTime,
      endUpdateTime: this.endUpdateTime,
      fields: this.fields,
      orderBy: this.orderBy,
      pageSize: this.pageSize,
      pageToken: this.pageToken,
    });

    const count = (result as { contacts?: unknown[] }).contacts?.length ?? 0;
    $.export("$summary", `Retrieved ${count} contact(s)`);

    return result;
  },
});

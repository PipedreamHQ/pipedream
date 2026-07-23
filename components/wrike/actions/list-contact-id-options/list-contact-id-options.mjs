// x-pd-ai: optimized
import wrike from "../../wrike.app.mjs";
import {
  CONTACT_TYPE_OPTIONS, CONTACT_FIELD_OPTIONS,
} from "../../common/constants.mjs";
import { stringifyJson } from "../../common/utils.mjs";

export default {
  key: "wrike-list-contact-id-options",
  name: "List Contact ID Options",
  description: "Retrieves available contacts so callers can copy an ID into free-form responsibles or contactId props in other actions. [See the documentation](https://developers.wrike.com/reference/getcontactsempty)",
  version: "0.1.0",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    wrike,
    me: {
      type: "boolean",
      label: "Me Only",
      description: "If true, only the requesting user's contact info is returned.",
      optional: true,
    },
    metadata: {
      type: "object",
      label: "Metadata",
      description: "Metadata filter, exact match for metadata key or key-value pair, e.g. `{ \"key\": \"database-id\" }` (key only) or `{ \"key\": \"database-id\", \"value\": \"42\" }` (key-value pair).",
      optional: true,
    },
    deleted: {
      type: "boolean",
      label: "Deleted",
      description: "Filter by deleted flag.",
      optional: true,
    },
    customFields: {
      type: "object",
      label: "Custom Fields",
      description: "Custom field filter. JSON array of custom field objects, e.g. `[{ \"id\": \"IEAAAAAAJ4AAAAAA\", \"value\": \"High\" }]`.",
      optional: true,
    },
    emails: {
      type: "string[]",
      label: "Emails",
      description: "Filter by email addresses. Limit 100.",
      optional: true,
    },
    active: {
      type: "boolean",
      label: "Active",
      description: "Filter by active status.",
      optional: true,
    },
    name: {
      type: "string",
      label: "Name",
      description: "Filter by contact name.",
      optional: true,
    },
    types: {
      type: "string[]",
      label: "Types",
      description: "Filter by contact type. One or more of: `Group`, `Asset`, `Person`, `Robot`.",
      optional: true,
      options: CONTACT_TYPE_OPTIONS,
    },
    fields: {
      type: "string[]",
      label: "Fields",
      description: "Optional fields to include in the response. One or more of: `metadata`, `currentCostRate`, `customFields`, `currentBillRate`, `jobRoleId`, `workScheduleId`.",
      optional: true,
      options: CONTACT_FIELD_OPTIONS,
    },
  },
  async run({ $ }) {
    const params = {
      me: this.me,
      metadata: stringifyJson(this.metadata),
      deleted: this.deleted,
      customFields: stringifyJson(this.customFields),
      emails: stringifyJson(this.emails),
      active: this.active,
      name: this.name,
      types: stringifyJson(this.types),
      fields: stringifyJson(this.fields),
    };

    const contacts = await this.wrike.listContacts({
      $,
      params,
    });
    $.export("$summary", `Successfully retrieved ${contacts.length} contact${contacts.length === 1
      ? ""
      : "s"}`);
    return contacts;
  },
};

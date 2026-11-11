import wrike from "../../wrike.app.mjs";
import {
  SPACE_ACCESS_TYPE_OPTIONS, SPACE_FIELD_OPTIONS,
} from "../../common/constants.mjs";
import { stringifyJson } from "../../common/utils.mjs";

export default {
  key: "wrike-list-space-id-options",
  name: "List Space ID Options",
  description: "Retrieves available spaces so callers can copy an ID into another action's free-form spaceId or folderId prop. [See the documentation](https://developers.wrike.com/reference/getspacesempty)",
  version: "0.1.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    wrike,
    withArchived: {
      type: "boolean",
      label: "With Archived",
      description: "Include archived spaces. Defaults to `false`.",
      optional: true,
    },
    userIsMember: {
      type: "boolean",
      label: "User Is Member",
      description: "Include only spaces where the requesting user is a member.",
      optional: true,
    },
    withInvitations: {
      type: "boolean",
      label: "With Invitations",
      description: "Include invitations in space members list. Defaults to `false`.",
      optional: true,
    },
    title: {
      type: "string",
      label: "Title",
      description: "Title filter, contains-match (non-blank values only).",
      optional: true,
    },
    accessTypes: {
      type: "string[]",
      label: "Access Types",
      description: "Filter by access type. One or more of: `Locked`, `Personal`, `Private`, `Public`.",
      optional: true,
      options: SPACE_ACCESS_TYPE_OPTIONS,
    },
    fields: {
      type: "string[]",
      label: "Fields",
      description: "Optional fields to include in the response. One or more of: `members`, `workScheduleId`.",
      optional: true,
      options: SPACE_FIELD_OPTIONS,
    },
  },
  async run({ $ }) {
    const params = {
      withArchived: this.withArchived,
      userIsMember: this.userIsMember,
      withInvitations: this.withInvitations,
      title: this.title,
      accessTypes: stringifyJson(this.accessTypes),
      fields: stringifyJson(this.fields),
    };

    const spaces = await this.wrike.listSpaces({
      $,
      params,
    });
    $.export("$summary", `Successfully retrieved ${spaces.length} space${spaces.length === 1
      ? ""
      : "s"}`);
    return spaces;
  },
};

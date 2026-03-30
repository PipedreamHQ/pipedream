import infusionsoft from "../../app/infusionsoft.app";
import { defineAction } from "@pipedream/types";

export default defineAction({
  name: "List Contact Notes",
  description:
    "List notes for a contact in Keap CRM. [See the documentation](https://developer.infusionsoft.com/docs/restv2/#tag/Note/operation/listNotes)",
  key: "infusionsoft-list-contact-notes",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    infusionsoft,
    contactId: {
      propDefinition: [
        infusionsoft,
        "contactId",
      ],
    },
    userId: {
      propDefinition: [
        infusionsoft,
        "userId",
      ],
      optional: true,
    },
    limit: {
      type: "string",
      label: "Limit",
      description: "Maximum number of results to return",
      optional: true,
    },
    offset: {
      type: "string",
      label: "Offset",
      description: "Number of results to skip for pagination",
      optional: true,
    },
  },
  async run({ $ }): Promise<object> {
    const result = await this.infusionsoft.listContactNotes({
      $,
      contactId: String(this.contactId ?? ""),
      userId: this.userId
        ? String(this.userId)
        : undefined,
      limit: this.limit,
      offset: this.offset,
    });

    const count = (result as { notes?: unknown[] }).notes?.length ?? 0;
    $.export("$summary", `Retrieved ${count} note(s) for contact ${this.contactId}`);

    return result;
  },
});

import infusionsoft from "../../app/infusionsoft.app";
import { defineAction } from "@pipedream/types";
import { ApplyTagToContactsParams } from "../../types/requestParams";

export default defineAction({
  name: "Apply Tag to Contacts",
  description:
    "Apply a tag to one or more contacts in Keap CRM. [See the documentation](https://developer.infusionsoft.com/docs/restv2/#tag/Tags/operation/applyTags)",
  key: "infusionsoft-apply-tag-to-contacts",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    infusionsoft,
    tagId: {
      type: "string",
      label: "Tag ID",
      description: "The ID of the tag to apply.",
      optional: false,
    },
    contactIds: {
      type: "string[]",
      label: "Contact IDs",
      description: "List of contact IDs to apply the tag to.",
      optional: false,
    },
  },
  async run({ $ }): Promise<object> {
    const params: ApplyTagToContactsParams = {
      $,
      tagId: this.tagId,
      contactIds: this.contactIds,
    };

    const result = await this.infusionsoft.applyTagToContacts(params);

    $.export(
      "$summary",
      `Successfully applied tag to ${this.contactIds.length} contact(s)`,
    );

    return result;
  },
});

import infusionsoft from "../../app/infusionsoft.app";
import { defineAction } from "@pipedream/types";
import { AddContactToAutomationParams } from "../../common/types/requestParams";

export default defineAction({
  name: "Add Contact to Automation",
  description:
    "Add one or more contacts to an automation sequence in Keap CRM. [See docs here](https://developer.infusionsoft.com/docs/restv2/#tag/Automation/operation/addContactsToAutomationSequence)",
  key: "infusionsoft-add-contact-to-automation",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    infusionsoft,
    automationId: {
      propDefinition: [
        infusionsoft,
        "automationId",
      ],
    },
    sequenceId: {
      propDefinition: [
        infusionsoft,
        "sequenceId",
        ({ automationId }: { automationId: string }) => ({
          automationId,
        }),
      ],
    },
    contactIds: {
      propDefinition: [
        infusionsoft,
        "contactId",
      ],
      type: "string[]",
      label: "Contact IDs",
      description: "List of contact IDs to add to the automation sequence",
    },
  },
  async run({ $ }): Promise<object> {
    const contactIds = (this.contactIds ?? [])
      .map((id) => String(id ?? "").trim())
      .filter((s) => s.length > 0);
    const uniqueIds = [
      ...new Set(contactIds),
    ];

    if (uniqueIds.length === 0) {
      throw new Error("At least one valid contact ID is required");
    }

    const automationId = String(this.automationId ?? "").trim();
    if (!automationId) {
      throw new Error("Automation is required");
    }

    const sequenceId = String(this.sequenceId ?? "").trim();
    if (!sequenceId) {
      throw new Error("Sequence ID is required");
    }

    const params: AddContactToAutomationParams = {
      $,
      automationId,
      sequenceId,
      contactIds: uniqueIds,
    };

    const result = await this.infusionsoft.addContactToAutomation(params);

    $.export(
      "$summary",
      `Successfully added ${uniqueIds.length} contact(s) to automation sequence`,
    );

    return result;
  },
});

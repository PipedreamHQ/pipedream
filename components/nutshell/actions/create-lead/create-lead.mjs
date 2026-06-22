import { ENTITY_KEYS } from "../../common/constants.mjs";
import nutshell from "../../nutshell.app.mjs";

export default {
  key: "nutshell-create-lead",
  name: "Create Lead",
  description: "Create a new lead in Nutshell. [See the documentation](https://developers.nutshell.com/reference/7d9961f8fbd457ba5670721926517135)",
  version: "1.0.0",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    nutshell,
    description: {
      type: "string",
      label: "Description",
      description: "Lead description / title.",
      optional: true,
    },
    companyId: {
      propDefinition: [
        nutshell,
        "companyId",
      ],
      optional: true,
    },
    contactId: {
      propDefinition: [
        nutshell,
        "contactId",
      ],
      optional: true,
    },
    value: {
      type: "string",
      label: "Value",
      description: "Manual lead value as a string amount (maps to `leads/0/manualValue`).",
      optional: true,
    },
    customFields: {
      type: "object",
      label: "Custom Fields",
      description: "Custom field name->value pairs, e.g. `{\"Deal source\":\"Referral\"}`.",
      optional: true,
    },
  },
  async run({ $ }) {
    const links = {
      ...(this.companyId
        ? {
          accounts: [
            this.companyId,
          ],
        }
        : {}),
      ...(this.contactId
        ? {
          contacts: [
            this.contactId,
          ],
        }
        : {}),
    };

    const leadData = {
      description: this.description,
      manualValue: this.value,
      customFields: this.customFields,
      ...(Object.keys(links).length
        ? {
          links,
        }
        : {}),
    };

    const lead = await this.nutshell.createLead({
      $,
      data: {
        [ENTITY_KEYS.LEADS]: [
          leadData,
        ],
      },
    });

    $.export("$summary", `Successfully created lead (ID: ${lead?.id}, status: ${lead?.status ?? "unknown"})`);
    return this.nutshell.formatLead(lead);
  },
};

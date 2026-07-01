import { PATCH_OPS } from "../../common/constants.mjs";
import { ConfigurationError } from "@pipedream/platform";
import nutshell from "../../nutshell.app.mjs";

export default {
  key: "nutshell-update-lead",
  name: "Update Lead",
  description: "Update an existing lead in Nutshell. Use `leads/0/manualValue` for value updates. [See the documentation](https://developers.nutshell.com/reference/5a47a634e21ffbad6a5c268af67a63ae)",
  version: "1.0.0",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    nutshell,
    leadId: {
      propDefinition: [
        nutshell,
        "leadId",
      ],
    },
    description: {
      type: "string",
      label: "Description",
      description: "Updated lead description / title.",
      optional: true,
    },
    value: {
      type: "string",
      label: "Value",
      description: "Updated manual lead value as a string amount (maps to `leads/0/manualValue`).",
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
    const patches = [];

    if (this.description) {
      patches.push({
        op: PATCH_OPS.REPLACE,
        path: "/leads/0/description",
        value: this.description,
      });
    }
    if (this.value) {
      patches.push({
        op: PATCH_OPS.REPLACE,
        path: "/leads/0/manualValue",
        value: this.value,
      });
    }
    if (this.customFields) {
      patches.push({
        op: PATCH_OPS.REPLACE,
        path: "/leads/0/customFields",
        value: this.customFields,
      });
    }

    if (!patches?.length) {
      throw new ConfigurationError("Please provide at least one field to update.");
    }

    const updated = await this.nutshell.updateLead({
      $,
      leadId: this.leadId,
      patches,
    });

    $.export("$summary", `Successfully updated lead (ID: ${updated?.id ?? this.leadId})`);
    return this.nutshell.formatLead(updated);
  },
};

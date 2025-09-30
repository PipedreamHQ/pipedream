import ramp from "../../ramp_sandbox.app.mjs";
import issueVirtualCard from "../../../ramp/actions/issue-virtual-card/issue-virtual-card.mjs";

export default {
  ...issueVirtualCard,
  key: "ramp_sandbox-issue-virtual-card",
  name: "Issue Virtual Card",
  description: "Creates a new virtual card for a given user. [See the documentation](https://docs.ramp.com/developer-api/v1/reference/rest/limits#post-developer-v1-limits-deferred)",
  version: "0.0.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    ramp,
    displayName: {
      type: "string",
      label: "Virtual Card Name",
      description: "The name of the virtual card",
    },
    userId: {
      propDefinition: [
        ramp,
        "userId",
      ],
    },
    linkToSpendProgram: {
      type: "boolean",
      label: "Link to Existing Spend Program",
      description: "Whether to link the card to an existing spend program",
      reloadProps: true,
    },
    spendProgramId: {
      propDefinition: [
        ramp,
        "spendProgramId",
      ],
      hidden: true,
    },
    allowedCategories: {
      propDefinition: [
        ramp,
        "allowedCategories",
      ],
      hidden: true,
    },
    blockedCategories: {
      propDefinition: [
        ramp,
        "blockedCategories",
      ],
      hidden: true,
    },
  },
};

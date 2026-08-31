// x-pd-ai: optimized
import ramp from "../../ramp_sandbox.app.mjs";
import issueVirtualCard from "@pipedream/ramp/actions/issue-virtual-card/issue-virtual-card.mjs";

export default {
  ...issueVirtualCard,
  key: "ramp_sandbox-issue-virtual-card",
  name: "Issue Virtual Card",
  description: "Issue a new Ramp Sandbox virtual card (spend limit) for a user. Run **List Users** to find the user ID. Works two ways: (1) **link to an existing spend program** — set **Link to Existing Spend Program** on and pass a **Spend Program ID** (run **List Spend Programs**), and the program governs the card's restrictions; or (2) **set a custom limit** — leave linking off and pass a **Total Limit per Interval** (e.g. `$500`) and an **Interval** (e.g. `MONTHLY`), optionally a per-transaction cap and allowed/blocked categories. Example: issue a $500/month card by passing the user's ID, `$500`, and `MONTHLY`. [See the documentation](https://docs.ramp.com/developer-api/v1/reference/rest/limits#post-developer-v1-limits-deferred)",
  version: "0.1.0",
  props: {
    ...issueVirtualCard.props,
    ramp,
    userId: {
      propDefinition: [
        ramp,
        "userId",
      ],
    },
    spendProgramId: {
      propDefinition: [
        ramp,
        "spendProgramId",
      ],
      description: "The spend program to link the card to — a Ramp UUID, e.g. `e9d30f12-c73a-463b-bc5f-b200396359d2`. Run the **List Spend Programs** action to find valid IDs. Required when **Link to Existing Spend Program** is on; leave empty to set a custom limit.",
    },
    allowedCategories: {
      propDefinition: [
        ramp,
        "allowedCategories",
      ],
    },
    blockedCategories: {
      propDefinition: [
        ramp,
        "blockedCategories",
      ],
    },
  },
};

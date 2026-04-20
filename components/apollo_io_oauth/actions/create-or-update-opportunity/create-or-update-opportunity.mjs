import app from "../../apollo_io_oauth.app.mjs";

export default {
  key: "apollo_io_oauth-create-or-update-opportunity",
  name: "Create or Update Opportunity",
  description:
    "Creates a new opportunity (deal) or updates an existing"
    + " one in your Apollo CRM. To create, omit `opportunityId`"
    + " and provide `name`, `opportunityStageId`, `closedDate`,"
    + " and `accountId`. To update, provide the `opportunityId`"
    + " and any fields to change."
    + " Use **Get Opportunity** to fetch current details before"
    + " updating."
    + " Use **List Metadata** (type `opportunity_stages`) to"
    + " discover valid stage IDs, and **Search Accounts** to"
    + " find account IDs."
    + " Use **Get Current User** to find owner IDs."
    + " [See the documentation](https://docs.apollo.io/reference"
    + "/create-opportunity)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    opportunityId: {
      type: "string",
      label: "Opportunity ID",
      description:
        "The ID of an existing opportunity to update. Omit this"
        + " to create a new opportunity.",
      optional: true,
    },
    name: {
      type: "string",
      label: "Name",
      description:
        "The name of the opportunity/deal. Required when"
        + " creating.",
      optional: true,
    },
    ownerId: {
      type: "string",
      label: "Owner ID",
      description:
        "The user ID to assign as the deal owner."
        + " Use **Get Current User** or **List Metadata** (type"
        + " `users`) to find user IDs.",
      optional: true,
    },
    amount: {
      type: "integer",
      label: "Amount",
      description:
        "The monetary value of the deal. Example: `50000`.",
      optional: true,
    },
    opportunityStageId: {
      type: "string",
      label: "Opportunity Stage ID",
      description:
        "The pipeline stage for this deal."
        + " Use **List Metadata** (type `opportunity_stages`)"
        + " to discover valid stage IDs. Required when creating.",
      optional: true,
    },
    closedDate: {
      type: "string",
      label: "Closed Date",
      description:
        "The expected or actual close date. Format:"
        + " `YYYY-MM-DD`. Example: `\"2025-06-30\"`."
        + " Required when creating.",
      optional: true,
    },
    accountId: {
      type: "string",
      label: "Account ID",
      description:
        "The account (company) linked to this deal."
        + " Use **Search Accounts** to find account IDs."
        + " Required when creating.",
      optional: true,
    },
  },
  async run({ $ }) {
    const data = {
      owner_id: this.ownerId,
      name: this.name,
      amount: this.amount,
      opportunity_stage_id: this.opportunityStageId,
      closed_date: this.closedDate,
      account_id: this.accountId,
    };

    let opportunity;

    if (this.opportunityId) {
      ({ opportunity } = await this.app.updateOpportunity({
        $,
        opportunityId: this.opportunityId,
        data,
      }));
      $.export(
        "$summary",
        `Updated opportunity ${opportunity.id}: ${opportunity.name}`,
      );
    } else {
      ({ opportunity } = await this.app.createOpportunity({
        $,
        data,
      }));
      $.export(
        "$summary",
        `Created opportunity ${opportunity.id}: ${opportunity.name}`,
      );
    }

    return opportunity;
  },
};

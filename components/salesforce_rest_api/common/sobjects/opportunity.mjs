import { RECORD_SOURCE_OPTIONS } from "../constants-props.mjs";
import commonProps from "../props-async-options.mjs";
import salesforce from "../../salesforce_rest_api.app.mjs";

export default {
  createProps: {
    ContactId: {
      propDefinition: [
        salesforce,
        "recordId",
        () => ({
          objType: "Contact",
          nameField: "Name",
        }),
      ],
      label: "Contact ID",
      description:
        "ID of the contact associated with this opportunity, set as the primary contact.",
      optional: true,
    },
  },
  initialProps: {
    CloseDate: {
      type: "string",
      label: "Close Date",
      description: "Date when the opportunity is expected to close.",
    },
    Description: {
      type: "string",
      label: "Description",
      description:
        "Text description of the opportunity. Limit: 32,000 characters.",
      optional: true,
    },
    Name: {
      type: "string",
      label: "Name",
      description: "A name for this opportunity. Limit: 120 characters",
    },
    StageName: {
      type: "string",
      label: "Stage Name",
      description:
        "Current stage of this record. This controls several other fields on an opportunity.",
      options: [
        "Prospecting",
        "Qualification",
        "Needs Analysis",
        "Value Proposition",
        "Id. Decision Makers",
        "Perception Analysis",
        "Proposal/Price Quote",
        "Negotiation/Review",
        "Closed Won",
        "Closed Lost",
      ],
    },
  },
  extraProps: {
    AccountId: {
      ...commonProps.AccountId,
      description: "ID of the account associated with this opportunity.",
      optional: true,
    },
    CampaignId: {
      ...commonProps.CampaignId,
      description: "ID of a related Campaign.",
      optional: true,
    },
    OwnerId: {
      ...commonProps.UserId,
      description:
        "ID of the User who has been assigned to work this opportunity.",
      optional: true,
    },
    Pricebook2Id: {
      ...commonProps.Pricebook2Id,
      description: "ID of a related Pricebook2 object.",
      optional: true,
    },
    RecordTypeId: {
      ...commonProps.RecordTypeId,
      optional: true,
    },
    Amount: {
      type: "string",
      label: "Amount",
      description:
        "Estimated total sale amount. For opportunities with products, the amount is the sum of the related products.",
      optional: true,
    },
    ForecastCategoryName: {
      type: "string",
      label: "Forecast Category Name",
      description: "The name of the forecast category.",
      optional: true,
      options: [
        "Omitted",
        "Pipeline",
        "Best Case",
        "Commit",
        "Closed",
      ],
    },
    IsExcludedFromTerritory2Filter: {
      type: "boolean",
      label: "Excluded from Filter",
      description:
        "Used for Filter-Based Opportunity Territory Assignment. Indicates whether the opportunity is excluded (`true`) or included (`false`) each time the APEX filter is executed.",
      optional: true,
    },
    LeadSource: {
      type: "string",
      label: "Lead Source",
      description:
        "Source of this opportunity.",
      optional: true,
      options: RECORD_SOURCE_OPTIONS,
    },
    NextStep: {
      type: "string",
      label: "Next Step",
      description:
        "Description of next task in closing opportunity. Limit: 255 characters.",
      optional: true,
    },
    Probability: {
      type: "string",
      label: "Probability (%)",
      description:
        "Percentage of estimated confidence in closing the opportunity.",
      optional: true,
    },
    TotalOpportunityQuantity: {
      type: "integer",
      label: "Quantity",
      description: "Number of items included in this opportunity.",
      optional: true,
    },
    Type: {
      type: "string",
      label: "Opportunity Type",
      description: "Type of opportunity.",
      optional: true,
      options: [
        "Existing Customer - Upgrade",
        "Existing Customer - Replacement",
        "Existing Customer - Downgrade",
        "New Customer",
      ],
    },
  },
};

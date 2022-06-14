export default {
  ActualCost: {
    type: "string",
    label: "Actual Cost",
    description: "Amount of money spent to run the campaign.",
  },
  BudgetedCost: {
    type: "string",
    label: "Budgeted Cost",
    description: "Amount of money budgeted for the campaign.",
  },
  CampaignImageId: {
    type: "string",
    label: "Campaign Image ID",
    description: "ID of the campaign image. Available in API version 42.0 and later.",
  },
  CampaignMemberRecordTypeId: {
    type: "string",
    label: "Campaign Member Record Type ID",
    description: "The record type ID for CampaignMember records associated with the campaign.",
  },
  Description: {
    type: "string",
    label: "Description",
    description: "Description of the campaign. Limit: 32 KB. Only the first 255 characters display in reports.",
  },
};

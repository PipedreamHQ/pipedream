export default {
  ActualCost: {
    type: "string",
    label: "ActualCost",
    description: "Amount of money spent to run the campaign.",
  },
  BudgetedCost: {
    type: "string",
    label: "BudgetedCost",
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
  CurrencyIsoCode: {
    type: "string",
    label: "CurrencyIsoCode",
    description: "Available only for organizations with the multicurrency feature enabled. Contains the ISO code for any currency allowed by the organization.",
  },
  Description: {
    type: "string",
    label: "Description",
    description: "Description of the campaign. Limit: 32 KB. Only the first 255 characters display in reports.",
  },
  EndDate: {
    type: "string",
    label: "EndDate",
    description: "Ending date for the campaign. Responses received after this date are still counted.",
  },
  ExpectedResponse: {
    type: "string",
    label: "ExpectedResponse",
    description: "Percentage of responses you expect to receive for the campaign.",
  },
  ExpectedRevenue: {
    type: "string",
    label: "ExpectedRevenue",
    description: "Amount of money you expect to generate from the campaign.",
  },
  IsActive: {
    type: "boolean",
    label: "IsActive",
    description: "Indicates whether this campaign is active (true) or not (false). Default value is false. Label is Active.",
  },
  NumberSent: {
    type: "integer",
    label: "NumberSent",
    description: "Number of individuals targeted by the campaign. For example, the number of emails sent. Label is Num Sent.",
  },
  OwnerId: {
    type: "string",
    label: "OwnerId",
    description: "ID of the user who owns this campaign. Default value is the user logging in to the API to perform the create.",
  },
  ParentCampaign: {
    type: "string",
    label: "ParentCampaign",
    description: "The campaign above the selected campaign in the campaign hierarchy.",
  },
  ParentId: {
    type: "string",
    label: "Parent ID",
    description: "ID of the parent Campaign record, if any.",
  },
  RecordTypeId: {
    type: "string",
    label: "RecordTypeId",
    description: "ID of the record type assigned to this object.",
  },
  StartDate: {
    type: "string",
    label: "StartDate",
    description: "Starting date for the campaign.",
  },
  Status: {
    type: "string",
    label: "Status",
    description: "Status of the campaign, for example, Planned, In Progress. Limit: 40 characters.",
  },
  Type: {
    type: "string",
    label: "Type",
    description: "Type of campaign, for example, Direct Mail or Referral Program. Limit: 40 characters.",
  },
};

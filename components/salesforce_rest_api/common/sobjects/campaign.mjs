import commonProps from "../props-async-options.mjs";

export default {
  initialProps: {
    Name: {
      type: "string",
      label: "Name",
      description: "Name of the campaign. Max 80 characters.",
    },
    Description: {
      type: "string",
      label: "Description",
      description:
        "Description of the campaign. Limit: 32 KB. Only the first 255 characters display in reports.",
      optional: true,
    },
    Status: {
      type: "string",
      label: "Status",
      description: "Status of the campaign. Max 40 characters.",
      optional: true,
      options: [
        "Planned",
        "In Progress",
        "Completed",
        "Aborted",
      ],
    },
    Type: {
      type: "string",
      label: "Type",
      description: "Type of campaign. Max 40 characters.",
      optional: true,
      options: [
        "Conference",
        "Webinar",
        "Trade Show",
        "Public Relations",
        "Partners",
        "Referral Program",
        "Advertisement",
        "Banner Ads",
        "Direct Mail",
        "Email",
        "Telemarketing",
        "Other",
      ],
    },
  },
  extraProps: {
    OwnerId: {
      ...commonProps.UserId,
      label: "Owner ID",
      description: "The ID of the user who owns this campaign (defaults to the user logged in).",
      optional: true,
    },
    ParentCampaign: {
      ...commonProps.CampaignId,
      label: "Parent Campaign ID",
      description: "The campaign above this one in the campaign hierarchy.",
      optional: true,
    },
    RecordTypeId: {
      ...commonProps.RecordTypeId,
      optional: true,
    },
    StartDate: {
      type: "string",
      label: "Start Date",
      description: "Starting date for the campaign.",
      optional: true,
    },
    EndDate: {
      type: "string",
      label: "End Date",
      description: "Ending date for the campaign. Responses received after this date are still counted.",
      optional: true,
    },
    ActualCost: {
      type: "string",
      label: "Actual Cost",
      description: "Amount of money spent to run the campaign.",
      optional: true,
    },
    BudgetedCost: {
      type: "string",
      label: "Budgeted Cost",
      description: "Amount of money budgeted for the campaign.",
      optional: true,
    },
    CampaignImageId: {
      type: "string",
      label: "Campaign Image ID",
      description: "ID of the campaign image.",
      optional: true,
    },
    CurrencyIsoCode: {
      type: "string",
      label: "Currency ISO Code",
      description:
        "Available only for organizations with the multicurrency feature enabled. Contains the ISO code for any currency allowed by the organization.",
      optional: true,
    },
    ExpectedResponse: {
      type: "string",
      label: "Expected Response (%)",
      description: "Percentage of responses you expect to receive for the campaign.",
      optional: true,
    },
    ExpectedRevenue: {
      type: "string",
      label: "Expected Revenue",
      description: "Amount of money you expect to generate from the campaign.",
      optional: true,
    },
    IsActive: {
      type: "boolean",
      label: "Active",
      description: "Indicates whether this campaign is active (default is `false`).",
      optional: true,
    },
    NumberSent: {
      type: "integer",
      label: "Number Sent",
      description: "Number of individuals targeted by the campaign. For example, the number of emails sent.",
      optional: true,
    },
  },
};

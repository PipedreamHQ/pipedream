// legacy_hash_id: a_52idrP
import { axios } from "@pipedream/platform";

export default {
  key: "salesforce_rest_api-salesforce-create-campaign",
  name: "Create Campaign",
  description: "Creates a marketing campaign, such as a direct mail promotion, webinar, or trade show.",
  version: "0.2.1",
  type: "action",
  props: {
    salesforce_rest_api: {
      type: "app",
      app: "salesforce_rest_api",
    },
    Name: {
      type: "string",
      description: "Required. Name of the campaign. Limit: is 80 characters.",
    },
    ActualCost: {
      type: "string",
      description: "Amount of money spent to run the campaign.",
      optional: true,
    },
    BudgetedCost: {
      type: "string",
      description: "Amount of money budgeted for the campaign.",
      optional: true,
    },
    CampaignImageId: {
      type: "string",
      description: "ID of the campaign image. Available in API version 42.0 and later.",
      optional: true,
    },
    CampaignMemberRecordTypeId: {
      type: "string",
      description: "The record type ID for CampaignMember records associated with the campaign.",
      optional: true,
    },
    CurrencyIsoCode: {
      type: "string",
      description: "Available only for organizations with the multicurrency feature enabled. Contains the ISO code for any currency allowed by the organization.",
      optional: true,
    },
    Description: {
      type: "string",
      description: "Description of the campaign. Limit: 32 KB. Only the first 255 characters display in reports.",
      optional: true,
    },
    EndDate: {
      type: "string",
      description: "Ending date for the campaign. Responses received after this date are still counted.",
      optional: true,
    },
    ExpectedResponse: {
      type: "string",
      description: "Percentage of responses you expect to receive for the campaign.",
      optional: true,
    },
    ExpectedRevenue: {
      type: "string",
      description: "Amount of money you expect to generate from the campaign.",
      optional: true,
    },
    IsActive: {
      type: "boolean",
      description: "Indicates whether this campaign is active (true) or not (false). Default value is false. Label is Active.",
      optional: true,
    },
    NumberSent: {
      type: "integer",
      description: "Number of individuals targeted by the campaign. For example, the number of emails sent. Label is Num Sent.",
      optional: true,
    },
    OwnerId: {
      type: "string",
      description: "ID of the user who owns this campaign. Default value is the user logging in to the API to perform the create.",
      optional: true,
    },
    ParentCampaign: {
      type: "string",
      description: "The campaign above the selected campaign in the campaign hierarchy.",
      optional: true,
    },
    ParentId: {
      type: "string",
      description: "ID of the parent Campaign record, if any.",
      optional: true,
    },
    RecordTypeId: {
      type: "string",
      description: "ID of the record type assigned to this object.",
      optional: true,
    },
    StartDate: {
      type: "string",
      description: "Starting date for the campaign.",
      optional: true,
    },
    Status: {
      type: "string",
      description: "Status of the campaign, for example, Planned, In Progress. Limit: 40 characters.",
      optional: true,
    },
    Type: {
      type: "string",
      description: "Type of campaign, for example, Direct Mail or Referral Program. Limit: 40 characters.",
      optional: true,
    },
  },
  async run({ $ }) {
  // See the API docs here: https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/dome_sobject_create.htm
  // Campaign object: https://developer.salesforce.com/docs/atlas.en-us.api.meta/api/sforce_api_objects_campaign.htm

    if (!this.Name) {
      throw new Error("Must provide Name parameter.");
    }

    return await axios($, {
      "method": "post",
      "url": `${this.salesforce_rest_api.$auth.instance_url}/services/data/v20.0/sobjects/Campaign/`,
      "Content-Type": "application/json",
      "headers": {
        Authorization: `Bearer ${this.salesforce_rest_api.$auth.oauth_access_token}`,
      },
  	"data": {
  		ActualCost: this.ActualCost,
  		BudgetedCost: this.BudgetedCost,
  		CampaignImageId: this.CampaignImageId,
  		CampaignMemberRecordTypeId: this.CampaignMemberRecordTypeId,
  		CurrencyIsoCode: this.CurrencyIsoCode,
  		Description: this.Description,
  		EndDate: this.EndDate,
  		ExpectedResponse: this.ExpectedResponse,
  		ExpectedRevenue: this.ExpectedRevenue,
  		IsActive: this.IsActive,
  		Name: this.Name,
  		NumberSent: this.NumberSent,
  		OwnerId: this.OwnerId,
  		ParentCampaign: this.ParentCampaign,
  		ParentId: this.ParentId,
  		RecordTypeId: this.RecordTypeId,
  		StartDate: this.StartDate,
  		Status: this.Status,
  		Type: this.Type,
  	},
    });
  },
};

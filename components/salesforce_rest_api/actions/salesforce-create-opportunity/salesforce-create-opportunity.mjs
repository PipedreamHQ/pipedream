import salesforce from "../../salesforce_rest_api.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "salesforce_rest_api-salesforce-create-opportunity",
  name: "Create Opportunity",
  description: "Creates an opportunity, which represents an opportunity, which is a sale or pending deal.",
  version: "0.2.1",
  type: "action",
  props: {
    salesforce,
    CloseDate: {
      type: "string",
      label: "CloseDate",
      description: "Date when the opportunity is expected to close.",
    },
    Name: {
      type: "string",
      label: "Name",
      description: "A name for this opportunity. Limit: 120 characters.",
    },
    StageName: {
      type: "string",
      label: "StageName",
      description: "Current stage of this record. The StageName field controls several other fields on an opportunity. Each of the fields can be directly set or implied by changing the StageName field. In addition, the StageName field is a picklist, so it has additional members in the returned describeSObjectResult to indicate how it affects the other fields. To obtain the stage name values in the picklist, query the OpportunityStage object. If the StageName is updated, then the ForecastCategoryName, IsClosed, IsWon, and Probability are automatically updated based on the stage-category mapping.",
    },
    AccountId: {
      type: "string",
      label: "AccountId",
      description: "ID of the account associated with this opportunity.",
      optional: true,
    },
    Amount: {
      type: "string",
      label: "Amount",
      description: "Estimated total sale amount. For opportunities with products, the amount is the sum of the related products. Any attempt to update this field, if the record has products, will be ignored. The update call will not be rejected, and other fields will be updated as specified, but the Amount will be unchanged.",
      optional: true,
    },
    CampaignId: {
      type: "string",
      label: "CampaignId",
      description: "ID of a related Campaign. This field is defined only for those organizations that have the campaign feature Campaigns enabled. The User must have read access rights to the cross-referenced Campaign object in order to create or update that campaign into this field on the opportunity.",
      optional: true,
    },
    ContactId: {
      type: "string",
      label: "ContactId",
      description: "ID of the contact associated with this opportunity, set as the primary contact. Read-only field that is derived from the opportunity contact role, which is created at the same time the opportunity is created. This field can only be populated when it's created, and can't be updated. To update the value in this field, change the IsPrimary flag on the OpportunityContactRole associated with this opportunity. Available in API version 46.0 and later.",
      optional: true,
    },
    ContractId: {
      type: "string",
      label: "ContractId",
      description: "ID of the contract that's associated with this opportunity.",
      optional: true,
    },
    CurrencyIsoCode: {
      type: "string",
      label: "CurrencyIsoCode",
      description: "Available only for organizations with the multicurrency feature enabled. Contains the ISO code for any currency allowed by the organization.",
      optional: true,
    },
    Description: {
      type: "string",
      label: "Description",
      description: "Text description of the opportunity. Limit: 32,000 characters.",
      optional: true,
    },
    ForecastCategoryName: {
      type: "string",
      label: "ForecastCategoryName",
      description: "Available in API version 12.0 and later. The name of the forecast category. It is implied, but not directly controlled, by the StageName field. You can override this field to a different value than is implied by the StageName value.",
      optional: true,
    },
    IsExcludedFromTerritory2Filter: {
      type: "boolean",
      label: "IsExcludedFromTerritory2Filter",
      description: "Used for Filter-Based Opportunity Territory Assignment (Pilot in Spring '15 / API version 33). Indicates whether the opportunity is excluded (True) or included (False) each time the APEX filter is executed.",
      optional: true,
    },
    LeadSource: {
      type: "string",
      label: "LeadSource",
      description: "Source of this opportunity, such as Advertisement or Trade Show.",
      optional: true,
    },
    NextStep: {
      type: "string",
      label: "NextStep",
      description: "Description of next task in closing opportunity. Limit: 255 characters.",
      optional: true,
    },
    OwnerId: {
      type: "string",
      label: "OwnerId",
      description: "ID of the User who has been assigned to work this opportunity.If you update this field, the previous owner's access becomes Read Only or the access specified in your organization-wide default for opportunities, whichever is greater. If you have set up opportunity teams in your organization, updating this field has different consequences depending on your version of the API: For API version 12.0 and later, sharing records are kept, as they are for all objects. For API version before 12.0, sharing records are deleted. For API version 16.0 and later, users must have the Transfer Record permission in order to update (transfer) account ownership using this field.",
      optional: true,
    },
    Pricebook2Id: {
      type: "string",
      label: "Pricebook2Id",
      description: "ID of a related Pricebook2 object. The Pricebook2Id field indicates which Pricebook2 applies to this opportunity. The Pricebook2Id field is defined only for those organizations that have products enabled as a feature. You can specify values for only one field (Pricebook2Id or PricebookId)not both fields. For this reason, both fields are declared nillable.",
      optional: true,
    },
    PricebookId: {
      type: "string",
      label: "PricebookId",
      description: "Unavailable as of version 3.0. As of version 8.0, the Pricebook object is no longer available. Use the Pricebook2Id field instead, specifying the ID of the Pricebook2 record.",
      optional: true,
    },
    Probability: {
      type: "string",
      label: "Probability",
      description: "Percentage of estimated confidence in closing the opportunity. It is implied, but not directly controlled, by the StageName field. You can override this field to a different value than what is implied by the StageName. Note If you're changing the Probability field through the API using a partner WSDL call, or an Apex before trigger, and the value may have several decimal places, we recommend rounding the value to a whole number. For example, the following Apex in a before trigger uses the round method to change the field value: o.probability = o.probability.round();",
      optional: true,
    },
    RecordTypeId: {
      type: "string",
      label: "RecordTypeId",
      description: "ID of the record type assigned to this object.",
      optional: true,
    },
    SyncedQuoteID: {
      type: "string",
      label: "SyncedQuoteID",
      description: "Read only in an Apex trigger. The ID of the Quote that syncs with the opportunity. Setting this field lets you start and stop syncing between the opportunity and a quote. The ID has to be for a quote that is a child of the opportunity.",
      optional: true,
    },
    Territory2Id: {
      type: "string",
      label: "Territory2Id",
      description: "The ID of the territory that is assigned to the opportunity. Available only if Enterprise Territory Management has been enabled for your organization.",
      optional: true,
    },
    TotalOpportunityQuantity: {
      type: "integer",
      label: "TotalOpportunityQuantity",
      description: "Number of items included in this opportunity. Used in quantity-based forecasting.",
      optional: true,
    },
    Type: {
      type: "string",
      label: "Type",
      description: "Type of opportunity. For example, Existing Business or New Business.",
      optional: true,
    },
  },
  async run({ $ }) {
    // See the API docs here: https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/dome_sobject_create.htm
    // Opportunity object: https://developer.salesforce.com/docs/atlas.en-us.api.meta/api/sforce_api_objects_opportunity.htm

    if (!this.CloseDate || !this.Name || !this.StageName) {
      throw new Error("Must provide CloseDate, Name, and StageName parameters.");
    }

    return await axios($, {
      "method": "post",
      "url": `${this.salesforce.$auth.instance_url}/services/data/v20.0/sobjects/Opportunity/`,
      "Content-Type": "application/json",
      "headers": {
        Authorization: `Bearer ${this.salesforce.$auth.oauth_access_token}`,
      },
      "data": {
        AccountId: this.AccountId,
        Amount: this.Amount,
        CampaignId: this.CampaignId,
        CloseDate: this.CloseDate,
        ContactId: this.ContactId,
        ContractId: this.ContractId,
        CurrencyIsoCode: this.CurrencyIsoCode,
        Description: this.Description,
        ForecastCategoryName: this.ForecastCategoryName,
        IsExcludedFromTerritory2Filter: this.IsExcludedFromTerritory2Filter,
        LeadSource: this.LeadSource,
        Name: this.Name,
        NextStep: this.NextStep,
        OwnerId: this.OwnerId,
        Pricebook2Id: this.Pricebook2Id,
        PricebookId: this.PricebookId,
        Probability: this.Probability,
        RecordTypeId: this.RecordTypeId,
        StageName: this.StageName,
        SyncedQuoteID: this.SyncedQuoteID,
        Territory2Id: this.Territory2Id,
        TotalOpportunityQuantity: this.TotalOpportunityQuantity,
        Type: this.Type,
      },
    });
  },
};

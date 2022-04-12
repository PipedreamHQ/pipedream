export default {
  AccountId: {
    type: "string",
    label: "AccountId",
    description: "ID of the account associated with this opportunity.",
  },
  Amount: {
    type: "string",
    label: "Amount",
    description: "Estimated total sale amount. For opportunities with products, the amount is the sum of the related products. Any attempt to update this field, if the record has products, will be ignored. The update call will not be rejected, and other fields will be updated as specified, but the Amount will be unchanged.",
  },
  CampaignId: {
    type: "string",
    label: "CampaignId",
    description: "ID of a related Campaign. This field is defined only for those organizations that have the campaign feature Campaigns enabled. The User must have read access rights to the cross-referenced Campaign object in order to create or update that campaign into this field on the opportunity.",
  },
  ContactId: {
    type: "string",
    label: "ContactId",
    description: "ID of the contact associated with this opportunity, set as the primary contact. Read-only field that is derived from the opportunity contact role, which is created at the same time the opportunity is created. This field can only be populated when it's created, and can't be updated. To update the value in this field, change the IsPrimary flag on the OpportunityContactRole associated with this opportunity. Available in API version 46.0 and later.",
  },
  ContractId: {
    type: "string",
    label: "ContractId",
    description: "ID of the contract that's associated with this opportunity.",
  },
  CurrencyIsoCode: {
    type: "string",
    label: "CurrencyIsoCode",
    description: "Available only for organizations with the multicurrency feature enabled. Contains the ISO code for any currency allowed by the organization.",
  },
  Description: {
    type: "string",
    label: "Description",
    description: "Text description of the opportunity. Limit: 32,000 characters.",
  },
  ForecastCategoryName: {
    type: "string",
    label: "ForecastCategoryName",
    description: "Available in API version 12.0 and later. The name of the forecast category. It is implied, but not directly controlled, by the StageName field. You can override this field to a different value than is implied by the StageName value.",
  },
  IsExcludedFromTerritory2Filter: {
    type: "boolean",
    label: "IsExcludedFromTerritory2Filter",
    description: "Used for Filter-Based Opportunity Territory Assignment (Pilot in Spring '15 / API version 33). Indicates whether the opportunity is excluded (True) or included (False) each time the APEX filter is executed.",
  },
  LeadSource: {
    type: "string",
    label: "LeadSource",
    description: "Source of this opportunity, such as Advertisement or Trade Show.",
  },
  NextStep: {
    type: "string",
    label: "NextStep",
    description: "Description of next task in closing opportunity. Limit: 255 characters.",
  },
  OwnerId: {
    type: "string",
    label: "OwnerId",
    description: "ID of the User who has been assigned to work this opportunity.If you update this field, the previous owner's access becomes Read Only or the access specified in your organization-wide default for opportunities, whichever is greater. If you have set up opportunity teams in your organization, updating this field has different consequences depending on your version of the API: For API version 12.0 and later, sharing records are kept, as they are for all objects. For API version before 12.0, sharing records are deleted. For API version 16.0 and later, users must have the Transfer Record permission in order to update (transfer) account ownership using this field.",
  },
  Pricebook2Id: {
    type: "string",
    label: "Pricebook2Id",
    description: "ID of a related Pricebook2 object. The Pricebook2Id field indicates which Pricebook2 applies to this opportunity. The Pricebook2Id field is defined only for those organizations that have products enabled as a feature. You can specify values for only one field (Pricebook2Id or PricebookId)not both fields. For this reason, both fields are declared nillable.",
  },
  PricebookId: {
    type: "string",
    label: "PricebookId",
    description: "Unavailable as of version 3.0. As of version 8.0, the Pricebook object is no longer available. Use the Pricebook2Id field instead, specifying the ID of the Pricebook2 record.",
  },
  Probability: {
    type: "string",
    label: "Probability",
    description: "Percentage of estimated confidence in closing the opportunity. It is implied, but not directly controlled, by the StageName field. You can override this field to a different value than what is implied by the StageName. Note If you're changing the Probability field through the API using a partner WSDL call, or an Apex before trigger, and the value may have several decimal places, we recommend rounding the value to a whole number. For example, the following Apex in a before trigger uses the round method to change the field value: o.probability = o.probability.round();",
  },
  RecordTypeId: {
    type: "string",
    label: "RecordTypeId",
    description: "ID of the record type assigned to this object.",
  },
  SyncedQuoteID: {
    type: "string",
    label: "SyncedQuoteID",
    description: "Read only in an Apex trigger. The ID of the Quote that syncs with the opportunity. Setting this field lets you start and stop syncing between the opportunity and a quote. The ID has to be for a quote that is a child of the opportunity.",
  },
  Territory2Id: {
    type: "string",
    label: "Territory2Id",
    description: "The ID of the territory that is assigned to the opportunity. Available only if Enterprise Territory Management has been enabled for your organization.",
  },
  TotalOpportunityQuantity: {
    type: "integer",
    label: "TotalOpportunityQuantity",
    description: "Number of items included in this opportunity. Used in quantity-based forecasting.",
  },
  Type: {
    type: "string",
    label: "Type",
    description: "Type of opportunity. For example, Existing Business or New Business.",
  },
};

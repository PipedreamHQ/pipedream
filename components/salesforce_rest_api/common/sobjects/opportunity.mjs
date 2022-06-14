export default {
  AccountId: {
    type: "string",
    label: "Account ID",
    description: "ID of the account associated with this opportunity.",
  },
  Amount: {
    type: "string",
    label: "Amount",
    description: "Estimated total sale amount. For opportunities with products, the amount is the sum of the related products. Any attempt to update this field, if the record has products, will be ignored. The update call will not be rejected, and other fields will be updated as specified, but the Amount will be unchanged.",
  },
  CampaignId: {
    type: "string",
    label: "Campaign ID",
    description: "ID of a related Campaign. This field is defined only for those organizations that have the campaign feature Campaigns enabled. The User must have read access rights to the cross-referenced Campaign object in order to create or update that campaign into this field on the opportunity.",
  },
  ContactId: {
    type: "string",
    label: "Contact ID",
    description: "ID of the contact associated with this opportunity, set as the primary contact. Read-only field that is derived from the opportunity contact role, which is created at the same time the opportunity is created. This field can only be populated when it's created, and can't be updated. To update the value in this field, change the IsPrimary flag on the OpportunityContactRole associated with this opportunity. Available in API version 46.0 and later.",
  },
  ContractId: {
    type: "string",
    label: "Contract ID",
    description: "ID of the contract that's associated with this opportunity.",
  },
};

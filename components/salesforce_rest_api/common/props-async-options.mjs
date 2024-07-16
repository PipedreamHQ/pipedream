export default {
  AccountId: {
    type: "string",
    label: "Account ID",
    description: "The ID of an Account.",
    async options() {
      const items = await this.salesforce.listSObjectTypeIds("Account");
      return items?.map((item) => ({
        label: item.Name,
        value: item.Id,
      }));
    },
  },
  BusinessHoursId: {
    type: "string",
    label: "Business Hours ID",
    description: "The ID of a Business Hours object.",
    async options() {
      const items = await this.salesforce.listSObjectTypeIds("BusinessHours");
      return items?.map((item) => ({
        label: item.Name,
        value: item.Id,
      }));
    },
  },
  CaseId: {
    type: "string",
    label: "Case ID",
    description: "The ID of a Case object.",
    async options() {
      const items = await this.salesforce.listSObjectTypeIds("Case");
      return items?.map((item) => ({
        label: item.Name,
        value: item.Id,
      }));
    },
  },
  CampaignId: {
    type: "string",
    label: "Campaign ID",
    description: "The ID of a Campaign object.",
    async options() {
      const items = await this.salesforce.listSObjectTypeIds("Campaign");
      return items?.map((item) => ({
        label: item.Name,
        value: item.Id,
      }));
    },
  },
  CommunityId: {
    type: "string",
    label: "Community ID",
    description: "The ID of a Community (Zone) object.",
    async options() {
      const items = await this.salesforce.listSObjectTypeIds("Community");
      return items?.map((item) => ({
        label: item.Name,
        value: item.Id,
      }));
    },
  },
  ContactId: {
    type: "string",
    label: "Account ID",
    description: "The ID of a Contact.",
    async options() {
      const items = await this.salesforce.listSObjectTypeIds("Contact");
      return items?.map((item) => ({
        label: item.Name,
        value: item.Id,
      }));
    },
  },
  ContractId: {
    type: "string",
    label: "Contract ID",
    description: "The ID of a Contract.",
    async options() {
      const items = await this.salesforce.listSObjectTypeIds("Contract");
      return items?.map((item) => ({
        label: item.ContractNumber + (item.Description
          ? ` - ${item.Description}`
          : ""),
        value: item.Id,
      }));
    },
  },
  ContactOrLeadIds: {
    type: "string[]",
    label: "Contact or Lead IDs",
    description: "The IDs of Contact or Lead objects.",
    async options() {
      const contacts = await this.salesforce.listSObjectTypeIds("Contact");
      const leads = await this.salesforce.listSObjectTypeIds("Lead");
      return [
        ...(contacts ?? []),
        ...(leads ?? []),
      ]?.map((item) => ({
        label: item.Name,
        value: item.Id,
      }));
    },
  },
  IndividualId: {
    type: "string",
    label: "Individual ID",
    description: "The ID of an Individual object.",
    async options() {
      const items = await this.salesforce.listSObjectTypeIds("Individual");
      return items?.map((item) => ({
        label: item.Name,
        value: item.Id,
      }));
    },
  },
  OperatingHoursId: {
    type: "string",
    label: "Operating Hours ID",
    description: "The ID of an Operating Hours object.",
    async options() {
      const items = await this.salesforce.listSObjectTypeIds("OperatingHours");
      return items?.map((item) => ({
        label: item.Name,
        value: item.Id,
      }));
    },
  },
  OpportunityId: {
    type: "string",
    label: "Opportunity ID",
    description: "The ID of an Opportunity object.",
    async options() {
      const items = await this.salesforce.listSObjectTypeIds("Opportunity");
      return items?.map((item) => ({
        label: item.Name,
        value: item.Id,
      }));
    },
  },
  PartnerNetworkConnectionId: {
    type: "string",
    label: "Partner Network Connection ID",
    description: "The ID of a connection between Salesforce organizations.",
    async options() {
      const items = await this.salesforce.listSObjectTypeIds("PartnerNetworkConnection");
      return items?.map((item) => ({
        label: item.ConnectionName,
        value: item.Id,
      }));
    },
  },
  Pricebook2Id: {
    type: "string",
    label: "Pricebook2 ID",
    description: "The ID of a Pricebook2 object.",
    async options() {
      const items = await this.salesforce.listSObjectTypeIds("Pricebook2");
      return items?.map((item) => ({
        label: item.Name,
        value: item.Id,
      }));
    },
  },
  UserId: {
    type: "string",
    label: "User ID",
    description: "The ID of a user in your organization.",
    async options() {
      const items = await this.salesforce.listSObjectTypeIds("User");
      return items?.map((item) => ({
        label: item.Name,
        value: item.Id,
      }));
    },
  },
  QuestionId: {
    type: "string",
    label: "Question ID",
    description: "The ID of a Question object.",
    async options() {
      const items = await this.salesforce.listSObjectTypeIds("Question");
      return items?.map((item) => ({
        label: item.Title,
        value: item.Id,
      }));
    },
  },
  RecordTypeId: {
    type: "string",
    label: "Record Type ID",
    description: "ID of the record type assigned to this object.",
    async options() {
      const items = await this.salesforce.listSObjectTypeIds("RecordType");
      return items?.map((item) => ({
        label: item.Title,
        value: item.Id,
      }));
    },
  },
};

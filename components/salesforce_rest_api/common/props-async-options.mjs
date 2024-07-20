// Note: the arrow function syntax is required when calling from within additionalProps,
// whereas when using regular props, the standard method syntax is needed instead.
// These props are more commonly used in additionalProps, so all are defined as such,
// and the options method needs to be redefined if used in regular props.
export default {
  AccountId: {
    type: "string",
    label: "Account ID",
    description: "The ID of an Account.",
    options: async () => {
      return this.salesforce.listRecordOptions({
        objType: "Account",
      });
    },
  },
  BusinessHoursId: {
    type: "string",
    label: "Business Hours ID",
    description: "The ID of a Business Hours record.",
    options: async () => {
      return this.salesforce.listRecordOptions({
        objType: "BusinessHours",
      });
    },
  },
  CallCenterId: {
    type: "string",
    label: "Call Center ID",
    description: "The ID of a Call Center.",
    options: async () => {
      return this.salesforce.listRecordOptions({
        objType: "CallCenter",
      });
    },
  },
  CampaignId: {
    type: "string",
    label: "Campaign ID",
    description: "The ID of a Campaign.",
    options: async () => {
      return this.salesforce.listRecordOptions({
        objType: "Campaign",
      });
    },
  },
  CaseId: {
    type: "string",
    label: "Case ID",
    description: "The ID of a Case.",
    options: async () => {
      return this.salesforce.listRecordOptions({
        objType: "Case",
        fields: [
          "Id",
          "CaseNumber",
          "Subject",
          "SuppliedName",
        ],
        getLabel: (item) => item.SuppliedName ?? item.Subject ?? item.CaseNumber,
      });
    },
  },
  CommunityId: {
    type: "string",
    label: "Community ID",
    description: "The ID of a Community (Zone) record.",
    options: async () => {
      return this.salesforce.listRecordOptions({
        objType: "Community",
      });
    },
  },
  ContactId: {
    type: "string",
    label: "Contact ID",
    description: "The ID of a Contact.",
    options: async () => {
      return this.salesforce.listRecordOptions({
        objType: "Contact",
      });
    },
  },
  ContractId: {
    type: "string",
    label: "Contract ID",
    description: "The ID of a Contract.",
    options: async () => {
      return this.salesforce.listRecordOptions({
        objType: "Contract",
        fields: [
          "Id",
          "ContractNumber",
          "Description",
        ],
        getLabel: (item) => item.ContractNumber + (item.Description
          ? ` - ${item.Description}`
          : ""),
      });
    },
  },
  ContactOrLeadIds: {
    type: "string[]",
    label: "Contact or Lead IDs",
    description: "The IDs of Contacts or Leads.",
    options: async () => {
      const contacts = await this.salesforce.listRecordOptions({
        objType: "Contact",
      });
      const leads = await this.salesforce.listRecordOptions({
        objType: "Lead",
      });
      return [
        ...(contacts ?? []),
        ...(leads ?? []),
      ];
    },
  },
  IndividualId: {
    type: "string",
    label: "Individual ID",
    description: "The ID of an Individual.",
    options: async () => {
      return this.salesforce.listRecordOptions({
        objType: "Individual",
      });
    },
  },
  OperatingHoursId: {
    type: "string",
    label: "Operating Hours ID",
    description: "The ID of an Operating Hours record.",
    options: async () => {
      return this.salesforce.listRecordOptions({
        objType: "OperatingHours",
      });
    },
  },
  OpportunityId: {
    type: "string",
    label: "Opportunity ID",
    description: "The ID of an Opportunity.",
    options: async () => {
      return this.salesforce.listRecordOptions({
        objType: "Opportunity",
      });
    },
  },
  Pricebook2Id: {
    type: "string",
    label: "Pricebook2 ID",
    description: "The ID of a Pricebook2 record.",
    options: async () => {
      return this.salesforce.listRecordOptions({
        objType: "Pricebook2",
      });
    },
  },
  ProfileId: {
    type: "string",
    label: "Profile ID",
    description: "The ID of a Profile.",
    options: async () => {
      return this.salesforce.listRecordOptions({
        objType: "Profile",
      });
    },
  },
  ServiceContractId: {
    type: "string",
    label: "ServiceContract ID",
    description: "The ID of a Service Contract record.",
    options: async () => {
      return this.salesforce.listRecordOptions({
        objType: "ServiceContract",
      });
    },
  },
  UserId: {
    type: "string",
    label: "User ID",
    description: "The ID of a User in your organization.",
    options: async () => {
      return this.salesforce.listRecordOptions({
        objType: "User",
      });
    },
  },
  UserRoleId: {
    type: "string",
    label: "User Role ID",
    description: "The ID of a User Role record.",
    options: async () => {
      return this.salesforce.listRecordOptions({
        objType: "UserRole",
      });
    },
  },
  QuestionId: {
    type: "string",
    label: "Question ID",
    description: "The ID of a Question.",
    options: async () => {
      return this.salesforce.listRecordOptions({
        objType: "Question",
      });
    },
  },
  RecordTypeId: {
    type: "string",
    label: "Record Type ID",
    description: "ID of the record type assigned to this record.",
    options: async () => {
      return this.salesforce.listRecordOptions({
        objType: "RecordType",
      });
    },
  },
};

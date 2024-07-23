// Note: the arrow function syntax is required when calling from within additionalProps,
// whereas when using regular props, the standard method syntax is needed instead.
// These props are more commonly used in additionalProps, so all are defined as such,
// and the options method needs to be redefined if used in regular props.

import allSobjects from "./all-sobjects.mjs";

const findSobjectOptions = (objName) => {
  return allSobjects.find(({ name }) => name === objName)?.getRecords;
};

export default {
  AccountId: {
    type: "string",
    label: "Account ID",
    description: "The ID of an Account.",
    options: findSobjectOptions("Account"),
  },
  BusinessHoursId: {
    type: "string",
    label: "Business Hours ID",
    description: "The ID of a Business Hours record.",
    options: findSobjectOptions("BusinessHours"),
  },
  CallCenterId: {
    type: "string",
    label: "Call Center ID",
    description: "The ID of a Call Center.",
    options: findSobjectOptions("CallCenter"),
  },
  CampaignId: {
    type: "string",
    label: "Campaign ID",
    description: "The ID of a Campaign.",
    options: findSobjectOptions("Campaign"),
  },
  CaseId: {
    type: "string",
    label: "Case ID",
    description: "The ID of a Case.",
    options: findSobjectOptions("Case"),
  },
  CommunityId: {
    type: "string",
    label: "Community ID",
    description: "The ID of a Community (Zone) record.",
    options: () =>
      this.salesforce.listRecordOptions({
        objType: "Community",
        nameField: "Name",
      }),
  },
  ContactId: {
    type: "string",
    label: "Contact ID",
    description: "The ID of a Contact.",
    options: findSobjectOptions("Contact"),
  },
  ContractId: {
    type: "string",
    label: "Contract ID",
    description: "The ID of a Contract.",
    options: findSobjectOptions("Contract"),
  },
  ContactOrLeadIds: {
    type: "string[]",
    label: "Contact or Lead IDs",
    description: "The IDs of Contacts or Leads.",
    options: async () => {
      const contacts = await this.salesforce.listRecordOptions({
        objType: "Contact",
        nameField: "Name",
      });
      const leads = await this.salesforce.listRecordOptions({
        objType: "Lead",
        nameField: "Name",
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
    options: findSobjectOptions("Individual"),
  },
  LeadId: {
    type: "string",
    label: "Lead ID",
    description: "The ID of a Lead.",
    options: findSobjectOptions("Lead"),
  },
  OperatingHoursId: {
    type: "string",
    label: "Operating Hours ID",
    description: "The ID of an Operating Hours record.",
    options: findSobjectOptions("OperatingHours"),
  },
  OpportunityId: {
    type: "string",
    label: "Opportunity ID",
    description: "The ID of an Opportunity.",
    options: findSobjectOptions("Opportunity"),
  },
  Pricebook2Id: {
    type: "string",
    label: "Pricebook2 ID",
    description: "The ID of a Pricebook2 record.",
    options: findSobjectOptions("Pricebook2"),
  },
  ProfileId: {
    type: "string",
    label: "Profile ID",
    description: "The ID of a Profile.",
    options: findSobjectOptions("Profile"),
  },
  ServiceContractId: {
    type: "string",
    label: "ServiceContract ID",
    description: "The ID of a Service Contract record.",
    options: findSobjectOptions("ServiceContract"),
  },
  UserId: {
    type: "string",
    label: "User ID",
    description: "The ID of a User in your organization.",
    options: findSobjectOptions("User"),
  },
  UserRoleId: {
    type: "string",
    label: "User Role ID",
    description: "The ID of a User Role record.",
    options: findSobjectOptions("UserRole"),
  },
  QuestionId: {
    type: "string",
    label: "Question ID",
    description: "The ID of a Question.",
    options: () =>
      this.salesforce.listRecordOptions({
        objType: "Question",
        nameField: "Title",
      }),
  },
  RecordTypeId: {
    type: "string",
    label: "Record Type ID",
    description: "ID of the record type assigned to this record.",
    options: findSobjectOptions("RecordType"),
  },
};

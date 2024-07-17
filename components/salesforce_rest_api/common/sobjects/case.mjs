import commonProps from "../props-async-options.mjs";

export default {
  initialProps: {
    ServiceContractId: {
      ...commonProps.ServiceContractId,
      description: "ID of the ServiceContract associated with the entitlement.",
      async options () {
        return this.salesforce.listRecordOptions({
          objType: "ServiceContract",
        });
      },
    },
    Description: {
      type: "string",
      label: "Description",
      description: "A text description of the case. Limit: 32 KB.",
      optional: true,
    },
    Status: {
      type: "string",
      label: "Status",
      description: "The status of the case.",
      optional: true,
      options: [
        "New",
        "Working",
        "Escalated",
        "Closed",
      ],
    },
    SuppliedEmail: {
      type: "string",
      label: "Email",
      description: "The email address associated with the case.",
      optional: true,
    },
    SuppliedName: {
      type: "string",
      label: "Name",
      description: "The name of the case.",
      optional: true,
    },
  },
  extraProps: {
    AccountId: {
      ...commonProps.AccountId,
      description: "ID of the Account associated with this case.",
      optional: true,
    },
    BusinessHoursId: {
      ...commonProps.BusinessHoursId,
      description: "ID of the Business Hours associated with this case.",
      optional: true,
    },
    CommunityId: {
      ...commonProps.CommunityId,
      description:
        "ID of the [Community (Zone)](https://developer.salesforce.com/docs/atlas.en-us.228.0.object_reference.meta/object_reference/sforce_api_objects_community.htm) associated with this case.",
      optional: true,
    },
    ContactId: {
      ...commonProps.ContactId,
      description: "ID of the Contact associated with this case.",
      optional: true,
    },
    FeedItemId: {
      ...commonProps.FeedItemId,
      description: "ID of the question in Chatter associated with the case.",
      optional: true,
    },
    IsEscalated: {
      type: "boolean",
      label: "Escalated",
      description:
        "Indicates whether the case has been escalated. A case's escalated state does not affect how you can use a case, or whether you can query, delete, or update it.",
      optional: true,
    },
    IsStopped: {
      type: "boolean",
      label: "Is Stopped",
      description:
        "Indicates whether an entitlement process on a case is stopped.",
      optional: true,
    },
    Language: {
      type: "string",
      label: "Language",
      description: "The language of the case.",
      optional: true,
    },
    Origin: {
      type: "string",
      label: "Case Origin",
      description: "The source of the case.",
      optional: true,
      options: [
        "Phone",
        "Email",
        "Web",
      ],
    },
    OwnerId: {
      ...commonProps.ContactId,
      description: "ID of the contact who owns the case.",
      optional: true,
    },
    ParentId: {
      ...commonProps.CaseId,
      description: "The ID of the parent case in the hierarchy.",
      optional: true,
    },
    Priority: {
      type: "string",
      label: "Priority",
      description: "The importance or urgency of the case.",
      optional: true,
      options: [
        "High",
        "Medium",
        "Low",
      ],
    },
    QuestionId: {
      ...commonProps.QuestionId,
      description:
        "The question in the answers community that is associated with the case.",
      optional: true,
    },
    Reason: {
      type: "string",
      label: "Reason",
      description: "The reason why the case was created.",
      optional: true,
      options: [
        "Installation",
        "Equipment Complexity",
        "Performance",
        "Breakdown",
        "Equipment Design",
        "Feedback",
        "Other",
      ],
    },
    RecordTypeId: {
      ...commonProps.RecordTypeId,
      optional: true,
    },
    SlaStartDate: {
      type: "string",
      label: "SLA Start Date",
      description: "The time that the case entered an entitlement process.",
      optional: true,
    },
    SourceId: {
      type: "string",
      label: "Source ID",
      description: "The ID of the social post source.",
      optional: true,
    },
    Subject: {
      type: "string",
      label: "Subject",
      description: "The subject of the case. Max 255 characters.",
      optional: true,
    },
    SuppliedCompany: {
      type: "string",
      label: "Company",
      description: "The company name that was entered when the case was created.",
      optional: true,
    },
    SuppliedPhone: {
      type: "string",
      label: "Phone",
      description: "The phone number that was entered when the case was created.",
      optional: true,
    },
    Type: {
      type: "string",
      label: "Type",
      description: "The type of case.",
      optional: true,
      options: [
        "Mechanical",
        "Electrical",
        "Electronic",
        "Structural",
        "Other",
      ],
    },
  },
};

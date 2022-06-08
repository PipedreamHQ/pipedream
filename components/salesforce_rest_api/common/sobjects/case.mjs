export default {
  AccountId: {
    type: "string",
    label: "Account ID",
    description: "ID of the account associated with this case.",
  },
  BusinessHoursId: {
    type: "string",
    label: "Business Hours ID",
    description: "ID of the business hours associated with this case.",
  },
  ContactId: {
    type: "string",
    label: "Contact ID",
    description: "ID of the associated Contact.",
  },
  CommunityId: {
    type: "string",
    label: "Community ID",
    description: "ID of the Community (Zone) associated with this case.",
  },
  Description: {
    type: "string",
    label: "Description",
    description: "A text description of the case. Limit: 32 KB.",
  },
  FeedItemId: {
    type: "string",
    label: "FeedItem ID",
    description: "ID of the question in Chatter associated with the case. This field is available in API version 33.0 and later, and is only accessible in organizations where Question-to-Case is enabled.",
  },
  IsEscalated: {
    type: "boolean",
    label: "Is Escalated?",
    description: "Indicates whether the case has been escalated (true) or not. A case's escalated state does not affect how you can use a case, or whether you can query, delete, or update it. You can set this flag via the API. Label is Escalated.",
  },
  Language: {
    type: "string",
    label: "Language",
    description: "The language of the case. This field is available in all Enterprise, Performance, and Unlimited orgs with the Service Cloud. Out of the box, it's used only by Einstein Case Classification.",
  },
  Origin: {
    type: "string",
    label: "Origin",
    description: "The source of the case, such as Email, Phone, or Web. Label is Case Origin.",
  },
  OwnerId: {
    type: "string",
    label: "Owner ID",
    description: "ID of the contact who owns the case.",
  },
  ParentId: {
    type: "string",
    label: "Parent ID",
    description: "The ID of the parent case in the hierarchy. The label is Parent Case.",
  },
  Priority: {
    type: "string",
    label: "Priority",
    description: "The importance or urgency of the case, such as High, Medium, or Low.",
  },
  QuestionId: {
    type: "string",
    label: "Question ID",
    description: "The question in the answers community that is associated with the case. This field does not appear if you don't have an answers community enabled.",
  },
  Reason: {
    type: "string",
    label: "Reason",
    description: "The reason why the case was created, such as Instructions not clear, or User didn't attend training.",
  },
  RecordTypeId: {
    type: "string",
    label: "RecordType ID",
    description: "ID of the record type assigned to this object.",
  },
  SlaStartDate: {
    type: "string",
    label: "SLA Start Date",
    description: "Shows the time that the case entered an entitlement process. If you have the Edit permission on cases, you can update or reset the time if you have the Edit permission on cases.",
  },
  SourceId: {
    type: "string",
    label: "Source ID",
    description: "The ID of the social post source.",
  },
  Status: {
    type: "string",
    label: "Status",
    description: "The status of the case, such as New, Closed, or Escalated. This field directly controls the IsClosed flag. Each predefined Status value implies an IsClosed flag value. For more information, see CaseStatus.",
  },
  Subject: {
    type: "string",
    label: "Subject",
    description: "The subject of the case. Limit: 255 characters.",
  },
  SuppliedCompany: {
    type: "string",
    label: "Supplied Company",
    description: "The company name that was entered when the case was created. Label is Company.",
  },
  SuppliedName: {
    type: "string",
    label: "Supplied Name",
    description: "The name that was entered when the case was created. Label is Name.",
  },
  SuppliedPhone: {
    type: "string",
    label: "Supplied Phone",
    description: "The phone number that was entered when the case was created. Label is Phone.",
  },
  Type: {
    type: "string",
    label: "Type",
    description: "The type of case, such as Feature Request or Question.",
  },
};

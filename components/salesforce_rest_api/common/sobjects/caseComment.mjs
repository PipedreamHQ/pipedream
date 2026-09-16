export default {
  initialProps: {
    CommentBody: {
      type: "string",
      label: "Body",
      description: "Text of the CaseComment. Max size is 4,000 bytes.",
      optional: true,
    },
    ParentId: {
      type: "string",
      label: "Parent Case ID",
      description: "ID of the parent Case (Salesforce's 15- or 18-character record ID, e.g. `500XX000001SvR2`). Use **SOQL Query** to find the Case ID.",
    },
    IsPublished: {
      type: "boolean",
      label: "Is Published",
      description:
        "Indicates whether the CaseComment is visible to customers in the Self-Service portal.",
      optional: true,
    },
  },
};

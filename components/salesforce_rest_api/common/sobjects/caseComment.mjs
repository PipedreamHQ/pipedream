import salesforce from "../../salesforce_rest_api.app.mjs";

export default {
  initialProps: {
    CommentBody: {
      type: "string",
      label: "Body",
      description: "Text of the CaseComment. Max size is 4,000 bytes.",
      optional: true,
    },
    ParentId: {
      propDefinition: [
        salesforce,
        "recordId",
        () => ({
          objType: "Case",
          nameField: "CaseNumber",
        }),
      ],
      label: "Parent Case ID",
      description: "ID of the parent Case.",
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

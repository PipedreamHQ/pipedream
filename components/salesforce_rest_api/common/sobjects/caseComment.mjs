import commonProps from "../props.mjs";

export default {
  initialProps: {
    CommentBody: {
      type: "string",
      label: "Body",
      description: "Text of the CaseComment. Max size is 4,000 bytes.",
      optional: true,
    },
    ParentId: {
      ...commonProps.CaseId,
      label: "Parent Case ID",
      description: "ID of the parent Case.",
    },
    IsNotificationSelected: {
      type: "boolean",
      label: "Is Notification Selected",
      description: "Indicates whether an email notification is sent to the case contact when a CaseComment is created or updated.",
      optional: true,
    },
  },
};

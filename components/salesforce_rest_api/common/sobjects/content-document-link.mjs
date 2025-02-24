export default {
  initialProps: {
    LinkedEntityId: {
      type: "string",
      label: "Linked Entity ID",
      description: "ID of the linked object. Can include Chatter users, groups, records (any that support Chatter feed tracking including custom objects), and Salesforce CRM Content libraries.",
      optional: true,
    },
    ShareType: {
      type: "string",
      label: "Share Type",
      description: "The permission granted to the user of the shared file in a library. This is determined by the permission the user already has in the library.",
      optional: true,
      default: "I",
      options: [
        {
          label: "Viewer Permission",
          value: "V",
        },
        {
          label: "Collaborator Permission",
          value: "C",
        },
        {
          label: "Inferred Permission",
          value: "I",
        },
      ],
    },
    Visibility: {
      type: "string",
      label: "Visibility",
      description: "Specifies whether this file is available to all users, internal users, or shared users.",
      optional: true,
      options: [
        {
          label: "All Users",
          value: "AllUsers",
        },
        {
          label: "Internal Users",
          value: "InternalUsers",
        },
        {
          label: "Shared Users",
          value: "SharedUsers",
        },
      ],
    },
  },
};

export default {
  AccountId: {
    type: "string",
    label: "Account ID",
    description: "ID of the account associated with this case.",
  },
  Description: {
    type: "string",
    label: "Description",
    description: "A text description of the case. Limit: 32 KB.",
  },
  IsEscalated: {
    type: "boolean",
    label: "Is Escalated?",
    description: "Indicates whether the case has been escalated (true) or not. A case's escalated state does not affect how you can use a case, or whether you can query, delete, or update it. You can set this flag via the API. Label is Escalated.",
  },
};

import app from "../../missive.app.mjs";

export default {
  key: "missive-create-draft",
  name: "Create Draft",
  description: "Create a new draft. [See the Documentation](https://missiveapp.com/help/api-documentation/rest-endpoints#create-draft)",
  type: "action",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    subject: {
      type: "string",
      label: "Subject",
      description: "The subject of the draft.",
    },
    body: {
      type: "string",
      label: "Body",
      description: "The body of the draft.",
    },
    fromEmail: {
      type: "string",
      label: "From Email",
      description: "The email address of the sender.",
    },
    fromName: {
      type: "string",
      label: "From Name",
      description: "The name of the sender.",
    },
    toEmail: {
      type: "string",
      label: "To Email",
      description: "The email address of the recipient.",
    },
    toName: {
      type: "string",
      label: "To Name",
      description: "The name of the recipient.",
    },
    addToInbox: {
      type: "boolean",
      label: "Add to Inbox",
      description: "Whether to add the draft to the inbox.",
      optional: true,
    },
  },
  methods: {
    createDraft(args = {}) {
      return this.app.post({
        path: "/drafts",
        ...args,
      });
    },
  },
  async run({ $: step }) {
    const {
      subject,
      body,
      fromEmail,
      fromName,
      toEmail,
      toName,
      addToInbox,
    } = this;

    const response = await this.createDraft({
      step,
      data: {
        drafts: {
          subject,
          body,
          from_field: {
            address: fromEmail,
            name: fromName,
          },
          to_fields: [
            {
              address: toEmail,
              name: toName,
            },
          ],
          add_to_inbox: addToInbox,
        },
      },
    });

    step.export("$summary", `Successfully created draft with ID ${response.drafts.id}`);

    return response;
  },
};

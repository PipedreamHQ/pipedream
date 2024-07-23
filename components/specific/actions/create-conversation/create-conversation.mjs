import specific from "../../specific.app.mjs";

export default {
  key: "specific-create-conversation",
  name: "Create Conversation",
  description: "Create a new conversation. [See the documentation](https://public-api.specific.app/docs/mutations/createConversation)",
  version: "0.0.1",
  type: "action",
  props: {
    specific,
    content: {
      type: "string",
      label: "Content",
      description: "Conversation content as String or ProseMirror document.",
      reloadProps: true,
    },
    insertedAt: {
      propDefinition: [
        specific,
        "insertedAt",
      ],
      optional: true,
    },
    assignee: {
      type: "string",
      label: "Assignee",
      description: "The user's email.",
      optional: true,
    },
    sourceId: {
      propDefinition: [
        specific,
        "sourceId",
      ],
      optional: true,
    },
    companyId: {
      propDefinition: [
        specific,
        "companyId",
      ],
      optional: true,
    },
    contactId: {
      propDefinition: [
        specific,
        "contactId",
      ],
      optional: true,
    },
    sourceUrl: {
      type: "string",
      label: "Source URL",
      description: "Source url where the conversation was gathered.",
      optional: true,
    },
  },
  async additionalProps() {
    const props = {};
    if (this.content) {
      const { data: { customFields } } = await this.specific.query({
        model: "customFields",
        where: "{type: {equals: conversation }}",
        fields: "name",
      });
      for (const { name } of customFields) {
        props[`customField-${name}`] = {
          type: "string",
          label: name,
          description: `Custom Field: ${name}`,
          optional: true,
        };
      }
    }
    return props;
  },
  async run({ $ }) {
    const {
      specific,
      ...data
    } = this;

    const customFields = this.specific.parseCustomFields(data);

    const response = await specific.mutation({
      $,
      model: "createConversation",
      data: `{
        ${this.assignee
    ? `assignee: { 
            connectOrIgnore: { 
              email: "${this.assignee}"
            }
          }`
    : ""}
        ${this.companyId
    ? `company: {
            connect: {
              id: "${this.companyId}"
            }
          }`
    : ""}
        ${this.contactId
    ? `contact: {
            connect: {
              id: "${this.contactId}"
            }
          }`
    : ""}
        content: "${this.content}"
        ${customFields
    ? `customFields: ${customFields}`
    : ""}
        ${this.insertedAt
    ? `insertedAt: "${this.insertedAt}"`
    : ""}
        ${this.sourceId
    ? `source: {
            connect: {
              id: "${this.sourceId}"
            }
          }`
    : ""}
        ${this.sourceUrl
    ? `sourceUrl: "${this.sourceUrl}"`
    : ""}
      }`,
      fields: `
        customFields
        id
        insertedAt
        name
        plainText
        sourceUrl
        assignee {
          email
          fullName
          id
        }
        company {
          contactsCount
          customFields
          id
          name
          visitorId
        }
        contact {
          customFields
          email
          id
          name
          visitorId
        }
        source {
          id
          name
      }`,
      on: "Conversation",
    });

    if (response.errors) throw new Error(response.errors[0].message);

    $.export("$summary", `Successfully created conversation for user ID: ${response.data?.createConversation?.id}`);
    return response;
  },
};


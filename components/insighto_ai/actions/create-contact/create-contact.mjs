import app from "../../insighto_ai.app.mjs";

export default {
  key: "insighto_ai-create-contact",
  name: "Create Contact",
  description: "Creates a new contact within the system. [See the documentation](https://api.insighto.ai/docs#/contact/create_contact_api_v1_contact_post)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    firstName: {
      type: "string",
      label: "First Name",
      description: "The first name of the contact.",
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "The last name of the contact.",
    },
    email: {
      type: "string",
      label: "Email",
      description: "The email address of the contact.",
    },
    orgId: {
      optional: true,
      propDefinition: [
        app,
        "orgId",
      ],
    },
    firstAssistantId: {
      label: "First Assistant ID",
      description: "The ID of the first assistant.",
      optional: true,
      propDefinition: [
        app,
        "assistantId",
      ],
    },
    lastAssistantId: {
      label: "Last Assistant ID",
      description: "The ID of the last assistant.",
      optional: true,
      propDefinition: [
        app,
        "assistantId",
      ],
    },
    firstWidgetId: {
      label: "First Widget ID",
      description: "The ID of the first widget.",
      optional: true,
      propDefinition: [
        app,
        "widgetId",
      ],
    },
    lastWidgetId: {
      label: "Last Widget ID",
      description: "The ID of the last widget.",
      optional: true,
      propDefinition: [
        app,
        "widgetId",
      ],
    },
  },
  methods: {
    createContact(args = {}) {
      return this.app.post({
        path: "/contact",
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      createContact,
      firstName,
      lastName,
      email,
      orgId,
      firstAssistantId,
      lastAssistantId,
      firstWidgetId,
      lastWidgetId,
    } = this;

    const response = await createContact({
      $,
      data: {
        first_name: firstName,
        last_name: lastName,
        email,
        org_id: orgId,
        first_assistant_id: firstAssistantId,
        last_assistant_id: lastAssistantId,
        first_widget_id: firstWidgetId,
        last_widget_id: lastWidgetId,
      },
    });
    $.export("$summary", `Successfully created contact with ID \`${response.data?.id}\``);
    return response;
  },
};

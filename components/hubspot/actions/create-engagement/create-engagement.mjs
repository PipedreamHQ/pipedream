import common from "../common-create.mjs";

export default {
  ...common,
  key: "hubspot-create-engagement",
  name: "Create Engagement",
  description: "Create a new engagement for a contact. [See the docs here](https://developers.hubspot.com/docs/api/crm/engagements)",
  version: "0.0.5",
  type: "action",
  props: {
    ...common.props,
    engagementType: {
      type: "string",
      label: "Engagement Type",
      description: "The type of engagement to create",
      reloadProps: true,
      options: [
        {
          label: "Note",
          value: "notes",
        },
        {
          label: "Task",
          value: "tasks",
        },
        {
          label: "Meeting",
          value: "meetings",
        },
        {
          label: "Email",
          value: "emails",
        },
        {
          label: "Call",
          value: "calls",
        },
      ],
    },
  },
  methods: {
    ...common.methods,
    getObjectType() {
      return this.engagementType;
    },
  },
  async run({ $ }) {
    const {
      hubspot,
      /* eslint-disable no-unused-vars */
      engagementType,
      $db,
      ...properties
    } = this;
    const objectType = this.getObjectType();

    const engagement = await hubspot.createObject(objectType, properties, $);

    const objectName = hubspot.getObjectTypeName(objectType);
    $.export("$summary", `Successfully created ${objectName} for the contact`);

    return engagement;
  },
};

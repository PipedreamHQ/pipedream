import app from "../../smoove.app.mjs";

export default {
  key: "smoove-create-list",
  name: "Create List",
  description: "Creates a new list. [See the docs](https://rest.smoove.io/#!/Lists/Lists_Post).",
  type: "action",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    name: {
      type: "string",
      label: "Name",
      description: "Name of the list.",
      optional: true,
    },
    description: {
      type: "string",
      label: "Description",
      description: "Description of the list.",
      optional: true,
    },
    allowsUsersToSubscribe: {
      type: "boolean",
      label: "Allows Users To Subscribe",
      description: "Allows users to subscribe.",
      optional: true,
      default: true,
    },
    allowsUsersToUnsubscribe: {
      type: "boolean",
      label: "Allows Users To Unsubscribe",
      description: "Allows users to unsubscribe",
      optional: true,
      default: true,
    },
    isPortal: {
      type: "boolean",
      label: "Is Portal",
      description: "Is portal",
      optional: true,
      default: false,
    },
    isPublic: {
      type: "boolean",
      label: "Is Public",
      description: "Is public",
      optional: true,
      reloadProps: true,
    },
  },
  additionalProps() {
    if (!this.isPublic) {
      return {};
    }

    return {
      publicName: {
        type: "string",
        label: "Public Name",
        description: "Public name of the list.",
        optional: true,
      },
      publicDescription: {
        type: "string",
        label: "Public Description",
        description: "Public description of the list.",
        optional: true,
      },
    };
  },
  methods: {
    createList(args = {}) {
      return this.app.makeRequest({
        method: "post",
        path: "/Lists",
        ...args,
      });
    },
  },
  async run({ $: step }) {
    const {
      name,
      description,
      allowsUsersToSubscribe,
      allowsUsersToUnsubscribe,
      isPortal,
      isPublic,
      publicName,
      publicDescription,
    } = this;

    const response = await this.createList({
      step,
      data: {
        name,
        description,
        publicName,
        publicDescription,
        permissions: {
          allowsUsersToSubscribe,
          allowsUsersToUnsubscribe,
          isPortal,
          isPublic,
        },
      },
    });

    step.export("$summary", `Succesfully created list with ID ${response.id}`);

    return response;
  },
};

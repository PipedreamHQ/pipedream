import app from "../../letterdrop.app.mjs";

export default {
  key: "letterdrop-add-subscriber",
  name: "Add Subscriber",
  description: "Adds a new subscriber to your Letterdrop publication. [See the documentation](https://docs.letterdrop.com/api#add-subscriber)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    email: {
      propDefinition: [
        app,
        "email",
      ],
    },
    welcomeEmail: {
      type: "boolean",
      label: "Send Welcome Email",
      description: "Whether the subscriber should receive a welcome email",
      optional: true,
    },
    name: {
      type: "string",
      label: "Name",
      description: "The name of the subscriber",
      optional: true,
    },
    title: {
      type: "string",
      label: "Title",
      description: "Job title of the subscriber",
      optional: true,
    },
  },
  methods: {
    addSubscriber(args = {}) {
      return this.app.post({
        path: "/subscriber/add",
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      addSubscriber,
      email,
      welcomeEmail,
      name,
      title,
    } = this;

    const additionalData = {
      ...(name && {
        name,
      }),
      ...(title && {
        title,
      }),
    };

    const response = await addSubscriber({
      $,
      data: {
        email,
        welcomeEmail,
        ...(Object.keys(additionalData).length && {
          additionalData,
        }),
      },
    });

    $.export("$summary", `Successfully added subscriber with email \`${response.email}\``);
    return response;
  },
};

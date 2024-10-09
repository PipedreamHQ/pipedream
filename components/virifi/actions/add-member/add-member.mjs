import app from "../../virifi.app.mjs";

export default {
  key: "virifi-add-member",
  name: "Add Member",
  description: "Adds a new member to your organization. [See the documentation](https://virifi.io/open/api-guide).",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    email: {
      type: "string",
      label: "Email",
      description: "The e-mail address of the new member.",
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "The first name of the new member.",
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "The last name of the new member.",
      optional: true,
    },
  },
  methods: {
    addMember(args = {}) {
      return this.app.post({
        path: "/add-member",
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      addMember,
      email,
      firstName,
      lastName,
    } = this;

    const response = await addMember({
      $,
      data: {
        email,
        firstName,
        lastName,
      },
    });
    $.export("$summary", "Successfully sent invitation to the new member.");
    return response;
  },
};

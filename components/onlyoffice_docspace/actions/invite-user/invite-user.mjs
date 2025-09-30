import app from "../../onlyoffice_docspace.app.mjs";

export default {
  key: "onlyoffice_docspace-invite-user",
  name: "Invite User",
  description: "Invites a new user to the portal. [See the documentation](https://api.onlyoffice.com/docspace/method/people/post/api/2.0/people/invite)",
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
      type: "string",
      label: "User Email",
      description: "The email of the user to invite.",
    },
  },
  methods: {
    inviteUser(args = {}) {
      return this.app.post({
        path: "/people/invite",
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      inviteUser,
      email,
    } = this;

    const response = await inviteUser({
      $,
      data: {
        Invitations: [
          {
            email,
          },
        ],
      },
    });

    $.export("$summary", `Successfully invited user with email \`${email}\``);
    return response;
  },
};

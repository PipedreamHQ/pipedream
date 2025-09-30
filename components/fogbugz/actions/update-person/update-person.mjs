import fogbugz from "../../fogbugz.app.mjs";

export default {
  key: "fogbugz-update-person",
  name: "Update Person",
  description: "Edits an existing person in FogBugz. [See the documentation](https://support.fogbugz.com/hc/en-us/articles/360011330733-FogBugz-XML-API-Editing-a-Person)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    fogbugz,
    ixPersonId: {
      propDefinition: [
        fogbugz,
        "ixPersonId",
      ],
    },
    sEmail: {
      type: "string",
      label: "Email",
      description: "The email of the user to update.",
      optional: true,
    },
    sFullName: {
      type: "string",
      label: "Full Name",
      description: "The full name of the user to update.",
      optional: true,
    },
    nType: {
      type: "string",
      label: "Type",
      description: "default 0. Set to 0 for a normal user, 1 for an administrator, 2 for a community user, and 3 for a virtual user.",
      options: [
        "0",
        "1",
        "2",
        "3",
      ],
      optional: true,
    },
    sPassword: {
      type: "string",
      label: "Password",
      description: "Set a new password to the user.",
      secret: true,
      optional: true,
    },
    sPhone: {
      type: "string",
      label: "Phone",
      description: "Set a new phone to the user.",
      optional: true,
    },
    fDeleted: {
      type: "boolean",
      label: "Deleted",
      description: "Set fDeleted to True to mark a user as Inactive (does not delete the user, or their history).",
      optional: true,
    },
  },
  methods: {
    async editPerson({
      data, ...opts
    }) {
      return await this.fogbugz.post({
        data: {
          cmd: "editPerson",
          ...data,
        },
        ...opts,
      });
    },
  },
  async run({ $ }) {
    const response = await this.editPerson({
      $,
      data: {
        ixPerson: this.ixPersonId,
        sEmail: this.sEmail,
        sFullName: this.sFullName,
        nType: this.nType,
        sPassword: this.sPassword,
        sPhone: this.sPhone,
        fDeleted: this.fDeleted,
      },
    });

    $.export("$summary", `Successfully updated user with ID ${this.ixPersonId}`);
    return response;
  },
};

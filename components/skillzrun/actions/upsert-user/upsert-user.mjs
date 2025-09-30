import skillzrun from "../../skillzrun.app.mjs";

export default {
  key: "skillzrun-upsert-user",
  name: "Upsert User",
  description: "Creates or updates a user based on the user email prop. [See the documentation](https://api.skillzrun.com/external/api/swagger/static/index.html#/users/post_external_api_users_upsert)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    skillzrun,
    email: {
      propDefinition: [
        skillzrun,
        "email",
      ],
    },
    name: {
      propDefinition: [
        skillzrun,
        "name",
      ],
    },
    phone: {
      propDefinition: [
        skillzrun,
        "phone",
      ],
    },
    isActive: {
      propDefinition: [
        skillzrun,
        "isActive",
      ],
    },
    seesAllSubjects: {
      propDefinition: [
        skillzrun,
        "seesAllSubjects",
      ],
    },
    ignoreNotOpenLevels: {
      propDefinition: [
        skillzrun,
        "ignoreNotOpenLevels",
      ],
    },
    ignoreStopItems: {
      propDefinition: [
        skillzrun,
        "ignoreStopItems",
      ],
    },
    noteAboutUser: {
      propDefinition: [
        skillzrun,
        "noteAboutUser",
      ],
    },
    isDemoMode: {
      type: "boolean",
      label: "Is Demo Mode",
      description: "Whether the user is in demo mode",
      optional: true,
    },
    aboutMe: {
      type: "string",
      label: "About Me",
      description: "Information about the user",
      optional: true,
    },
    personalLink: {
      type: "string",
      label: "Personal Link",
      description: "The url of the user's personal link",
      optional: true,
    },
    newPassword: {
      type: "string",
      label: "New Password",
      description: "The password of the user",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.skillzrun.upsertUser({
      $,
      data: {
        name: this.name,
        email: this.email,
        phone: this.phone,
        newPassword: this.newPassword,
        isActive: this.isActive,
        isDemoMode: this.isDemoMode,
        seesAllSubjects: this.seesAllSubjects,
        ignoreNotOpenLevels: this.ignoreNotOpenLevels,
        ignoreStopItems: this.ignoreStopItems,
        noteAboutUser: this.noteAboutUser,
        aboutMe: this.aboutMe,
        personalLink: this.personalLink,
      },
    });
    $.export("$summary", `Successfully upserted user ${this.email}`);
    return response;
  },
};

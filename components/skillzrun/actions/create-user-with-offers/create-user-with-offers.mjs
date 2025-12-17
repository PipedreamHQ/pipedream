import skillzrun from "../../skillzrun.app.mjs";

export default {
  key: "skillzrun-create-user-with-offers",
  name: "Create User With Offers",
  description: "Creates a new user with their associated offers in the SkillzRun app. [See the documentation](https://api.skillzrun.com/external/api/swagger/static/index.html#/users/post_external_api_users_create_with_orders)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
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
    offerIds: {
      propDefinition: [
        skillzrun,
        "offerIds",
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
  },
  async run({ $ }) {
    const response = await this.skillzrun.createUserWithOffers({
      $,
      data: {
        name: this.name,
        email: this.email,
        phone: this.phone,
        isActive: this.isActive,
        seesAllSubjects: this.seesAllSubjects,
        ignoreNotOpenLevels: this.ignoreNotOpenLevels,
        ignoreStopItems: this.ignoreStopItems,
        noteAboutUser: this.noteAboutUser,
        offerIds: this.offerIds.map((id) => +id),
      },
    });
    $.export("$summary", `Successfully created user ${this.email}`);
    return response;
  },
};

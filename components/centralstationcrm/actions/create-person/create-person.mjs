import centralstationcrm from "../../centralstationcrm.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "centralstationcrm-create-person",
  name: "Create Person",
  description: "Creates a new person in CentralStationCRM. [See the documentation](https://api.centralstationcrm.net/api-docs/index.html)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    centralstationcrm,
    firstName: {
      type: "string",
      label: "First Name",
      description: "The first name of the person",
      optional: true,
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "The last name of the person",
    },
    title: {
      type: "string",
      label: "Title",
      description: "The title of the person",
      optional: true,
    },
    gender: {
      type: "string",
      label: "Gender",
      description: "The gender of the person",
      options: constants.GENDER,
      optional: true,
    },
    background: {
      type: "string",
      label: "Background",
      description: "Details about the person eg. hobbies",
      optional: true,
    },
    responsibleUserId: {
      propDefinition: [
        centralstationcrm,
        "responsibleUserId",
      ],
    },
  },
  async run({ $ }) {
    const { person } = await this.centralstationcrm.createPerson({
      data: {
        person: {
          first_name: this.firstName,
          name: this.lastName,
          title: this.title,
          gender: this.gender,
          background: this.background,
          user_id: this.responsibleUserId,
        },
      },
      $,
    });

    if (person?.id) {
      $.export("summary", `Successully created person with ID ${person.id}.`);
    }

    return person;
  },
};

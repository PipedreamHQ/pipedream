import workday from "../../workday.app.mjs";

export default {
  key: "workday-get-person-photo",
  name: "Get Person Photo",
  description: "Get photo for a person by ID. [See documentation](https://community.workday.com/sites/default/files/file-hosting/restapi/#person/v4/get-/people/-ID-/photos)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    workday,
    personId: {
      propDefinition: [
        workday,
        "personId",
      ],
      description: "The ID of the person whose photo to retrieve.",
    },
  },
  async run({ $ }) {
    const response = await this.workday.getPersonPhoto({
      id: this.personId,
      $,
    });
    $.export("$summary", `Successfully fetched photo for person ID ${this.personId}`);
    return response;
  },
};

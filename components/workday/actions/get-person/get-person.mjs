import workday from "../../workday.app.mjs";

export default {
  key: "workday-get-person",
  name: "Get Person Details",
  description: "Get details for a specific person by ID. [See documentation](https://community.workday.com/sites/default/files/file-hosting/restapi/#person/v4/get-/people/-ID-)",
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
      description: "The ID of the person to retrieve.",
    },
  },
  async run({ $ }) {
    const response = await this.workday.getPerson({
      id: this.personId,
      $,
    });
    $.export("$summary", `Successfully fetched person details for ID ${this.personId}`);
    return response;
  },
};

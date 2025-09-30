import salesloft from "../../salesloft.app.mjs";

export default {
  key: "salesloft-add-person-to-cadence",
  name: "Add Person to Cadence",
  description: "Adds a person to a cadence in Salesloft. [See the documentation](https://developers.salesloft.com/docs/api/cadence-memberships-create/)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    salesloft,
    personId: {
      propDefinition: [
        salesloft,
        "personId",
      ],
    },
    cadenceId: {
      propDefinition: [
        salesloft,
        "cadenceId",
      ],
    },
    userId: {
      propDefinition: [
        salesloft,
        "userId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.salesloft.addPersonToCadence({
      $,
      data: {
        person_id: this.personId,
        cadence_id: this.cadenceId,
        user_id: this.userId,
      },
    });

    $.export("$summary", `Successfully added person ${this.personId} to cadence ${this.cadenceId}`);

    return response;
  },
};

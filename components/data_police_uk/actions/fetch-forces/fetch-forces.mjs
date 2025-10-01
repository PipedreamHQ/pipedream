import dataPoliceUK from "../../data_police_uk.app.mjs";

export default {
  key: "data_police_uk-fetch-forces",
  name: "Fetch Forces",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  description: "Get a list of police forces and contact information within a particular area. [See the docs here](https://data.police.uk/docs/method/force)",
  type: "action",
  props: {
    dataPoliceUK,
    forceId: {
      propDefinition: [
        dataPoliceUK,
        "forceId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.dataPoliceUK.getForceWithPeople({
      $,
      forceId: this.forceId,
    });

    $.export("$summary", `Force with Id: ${this.forceId} was successfully fetched!`);
    return response;
  },
};

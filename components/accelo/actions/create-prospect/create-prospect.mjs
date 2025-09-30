import accelo from "../../accelo.app.mjs";

export default {
  name: "Create Prospect",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  key: "accelo-create-prospect",
  description: "Creates a prospect. [See docs here](https://api.accelo.com/docs/?_ga=2.136158329.97118171.1674049767-1568937371.1674049767#create-a-prospect)",
  type: "action",
  props: {
    accelo,
    prospectTypeId: {
      propDefinition: [
        accelo,
        "prospectTypeId",
      ],
    },
    affiliationId: {
      propDefinition: [
        accelo,
        "affiliationId",
      ],
      optional: true,
    },
    title: {
      label: "Title",
      description: "The request title",
      type: "string",
    },
  },
  async run({ $ }) {
    const { response } = await this.accelo.createProspect({
      $,
      data: {
        type_id: this.prospectTypeId,
        affiliation_id: this.affiliationId,
        title: this.title,
      },
    });

    if (response) {
      $.export("$summary", `Successfully created prospect with id ${response.id}`);
    }

    return response;
  },
};

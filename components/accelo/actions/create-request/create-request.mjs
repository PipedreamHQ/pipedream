import accelo from "../../accelo.app.mjs";

export default {
  name: "Create Request",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  key: "accelo-create-request",
  description: "Creates a request. [See docs here](https://api.accelo.com/docs/?_ga=2.136158329.97118171.1674049767-1568937371.1674049767#create-a-request)",
  type: "action",
  props: {
    accelo,
    requestTypeId: {
      propDefinition: [
        accelo,
        "requestTypeId",
      ],
    },
    title: {
      label: "Title",
      description: "The request title",
      type: "string",
    },
    body: {
      label: "Body",
      description: "The request body",
      type: "string",
    },
    affiliationId: {
      propDefinition: [
        accelo,
        "affiliationId",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const { response } = await this.accelo.createRequest({
      $,
      data: {
        type_id: this.requestTypeId,
        affiliation_id: this.affiliationId,
        title: this.title,
        body: this.body,
      },
    });

    if (response) {
      $.export("$summary", `Successfully created request with id ${response.id}`);
    }

    return response;
  },
};

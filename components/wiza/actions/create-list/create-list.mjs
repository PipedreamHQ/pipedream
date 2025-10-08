import app from "../../wiza.app.mjs";

export default {
  key: "wiza-create-list",
  name: "Create List",
  description: "Create a list of people to enrich. [See the documentation](https://wiza.co/api-docs#/paths/~1api~1lists/post)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    name: {
      propDefinition: [
        app,
        "name",
      ],
    },
    enrichmentLevel: {
      propDefinition: [
        app,
        "enrichmentLevel",
      ],
    },
    acceptGeneric: {
      propDefinition: [
        app,
        "acceptGeneric",
      ],
    },
    acceptPersonal: {
      propDefinition: [
        app,
        "acceptPersonal",
      ],
    },
    acceptWork: {
      propDefinition: [
        app,
        "acceptWork",
      ],
    },
    fullName: {
      propDefinition: [
        app,
        "fullName",
      ],
    },
    company: {
      propDefinition: [
        app,
        "company",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.createList({
      $,
      data: {
        name: this.description,
        enrichmentLevel: this.enrichmentLevel,
        email_options: {
          accept_generic: this.acceptGeneric,
          accept_personal: this.acceptPersonal,
          accept_work: this.acceptWork,
        },
        items: [
          {
            full_name: this.fullName,
            company: this.company,
          },
        ],
      },
    });

    $.export("$summary", `'${response.status.message}', your list's ID is '${response.data.id}'`);

    return response;
  },
};

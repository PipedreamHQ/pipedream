import klenty from "../../klenty.app.mjs";

export default {
  key: "klenty-start-cadence",
  name: "Start Cadence",
  description: "Starts a cadence in Klenty for a specific prospect. [See the documentation](https://support.klenty.com/en/articles/8193937-klenty-s-post-apis)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    klenty,
    list: {
      propDefinition: [
        klenty,
        "list",
      ],
      withLabel: true,
    },
    cadenceName: {
      propDefinition: [
        klenty,
        "cadenceName",
      ],
    },
    prospectEmail: {
      propDefinition: [
        klenty,
        "prospect",
        ({ list }) => ({
          listName: list.label,
        }),
      ],
      withLabel: true,
    },
  },
  async run({ $ }) {
    const response = await this.klenty.startCadence({
      $,
      data: {
        cadenceName: this.cadenceName,
        Email: this.prospectEmail.label,
      },
    });
    $.export("$summary", "The cadence has been successfully started!");
    return response;
  },
};

import app from "../../bigdatacorp.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "bigdatacorp-get-person-data",
  name: "Get Person Data",
  description: "Returns the available data for a CPF number according to the selected dataset. [See the documentation](https://docs.bigdatacorp.com.br/plataforma/reference/pessoas_registration_data)",
  version: "0.0.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    doc: {
      propDefinition: [
        app,
        "doc",
      ],
      description: "Document Number of the entity you want to search for, i.e.: `128.982.560-21`",
    },
    dataset: {
      propDefinition: [
        app,
        "dataset",
      ],
      options: constants.PERSON_DATASETS,
    },
  },

  async run({ $ }) {
    const response = await this.app.getPersonData({
      $,
      data: {
        Datasets: this.dataset,
        q: `doc{${this.doc}}`,
      },
    });

    const status = response.Status[this.dataset][0].Message;

    if (status === "OK") {
      $.export("$summary", `Successfully sent the request for the '${this.dataset}' dataset. Status: ${status}`);
    } else {
      throw new Error(status);
    }

    return response;
  },
};

import app from "../../cpfcnpj.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "cpfcnpj-consultar-cnpj",
  name: "Consultar CNPJ",
  description: "Returns official, real-time (D+0) registration data for a Brazilian company (CNPJ) according to the selected package. Data is sourced directly from official records, never from leaked or scraped databases, under ISO/IEC 27001, ISO/IEC 27701 and ISO 37301 certifications. [See the documentation](https://www.cpfcnpj.com.br/dev/)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    documento: {
      propDefinition: [
        app,
        "documento",
      ],
      label: "CNPJ",
      description: "The CNPJ of the company you want to look up, i.e.: `27.865.757/0001-02`",
    },
    pacote: {
      type: "string",
      label: "Package",
      description: "The data package that defines which fields are returned",
      options: constants.CNPJ_PACOTES,
      default: "6",
    },
  },

  async run({ $ }) {
    const response = await this.app.consultarCnpj({
      $,
      pacote: this.pacote,
      documento: this.documento,
    });

    if (Number(response.status) === 1) {
      $.export("$summary", `Successfully looked up the CNPJ \`${this.documento}\` using package ${this.pacote}`);
    } else {
      throw new Error(response.erro || `Lookup failed with error code ${response.erroCodigo}`);
    }

    return response;
  },
};

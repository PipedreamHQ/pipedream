import app from "../../cpfcnpj.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "cpfcnpj-consultar-cpf",
  name: "Consultar CPF",
  description: "Returns official, real-time (D+0) registration data for a Brazilian individual (CPF) according to the selected package. Data is sourced directly from official records, never from leaked or scraped databases, under ISO/IEC 27001, ISO/IEC 27701 and ISO 37301 certifications. [See the documentation](https://www.cpfcnpj.com.br/dev/)",
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
      label: "CPF",
      description: "The CPF of the person you want to look up, i.e.: `128.982.560-21`",
    },
    pacote: {
      type: "string",
      label: "Package",
      description: "The data package that defines which fields are returned",
      options: constants.CPF_PACOTES,
      default: "3",
    },
  },

  async run({ $ }) {
    const response = await this.app.consultarCpf({
      $,
      pacote: this.pacote,
      documento: this.documento,
    });

    if (Number(response.status) === 1) {
      $.export("$summary", `Successfully looked up the CPF \`${this.documento}\` using package ${this.pacote}`);
    } else {
      throw new Error(response.erro || `Lookup failed with error code ${response.erroCodigo}`);
    }

    return response;
  },
};

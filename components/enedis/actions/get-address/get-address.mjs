import enedis from "../../enedis.app.mjs";
import common from "../common.mjs";

export default {
  type: "action",
  key: "enedis-get-address",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  name: "Get Address",
  description: "Returns the address of a client. [See the docs here](https://datahub-enedis.fr/data-connect/documentation/customers-v5-adresse/)",
  ...common,
  props: {
    enedis,
    usagePointId: {
      propDefinition: [
        enedis,
        "usagePointId",
      ],
    },
  },
  methods: {
    ...common.methods,
  },
  async run({ $ }) {
    const response = this.enedis.getAddress(
      this.prepareParam(),
    );
    $.export("$summary", "The client address was successfully fetched!");
    return response;
  },
};

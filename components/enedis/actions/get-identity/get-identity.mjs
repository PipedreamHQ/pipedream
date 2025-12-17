import enedis from "../../enedis.app.mjs";
import common from "../common.mjs";

export default {
  type: "action",
  key: "enedis-get-identity",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  name: "Get Identity",
  description: "Returns the identity of a client. [See the docs here](https://datahub-enedis.fr/data-connect/documentation/customers-v5-identite/)",
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
    const response = this.enedis.getIdentity(
      this.prepareParam(),
    );
    $.export("$summary", "The client identity was successfully fetched!");
    return response;
  },
};

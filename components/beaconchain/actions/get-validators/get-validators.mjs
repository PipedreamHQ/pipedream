import app from "../../beaconchain.app.mjs";

export default {
  key: "beaconchain-get-validators",
  name: "Get Validators",
  description: "Returns information for all validators up to 100 by index or public key. [See the documentation](https://beaconcha.in/api/v1/docs/index.html#/Validator/get_api_v1_validator__indexOrPubkey_).",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    indexesOrPubkeys: {
      type: "string[]",
      label: "Validator Indexes Or Public Keys",
      description: "Enter up to 100 validator indices or public keys.",
    },
  },
  methods: {
    getValidators({
      indexOrPubkey, ...args
    } = {}) {
      return this.app._makeRequest({
        path: `/validator/${indexOrPubkey}`,
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      getValidators,
      indexesOrPubkeys,
    } = this;

    const response = await getValidators({
      $,
      indexOrPubkey: Array.isArray(indexesOrPubkeys)
        ? indexesOrPubkeys.map((value) => value.trim()).join(",")
        : indexesOrPubkeys,
    });

    $.export("$summary", "Successfully retrieved validators.");
    return response;
  },
};

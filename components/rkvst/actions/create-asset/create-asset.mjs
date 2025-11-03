import { parseObject } from "../../common/utils.mjs";
import rkvst from "../../rkvst.app.mjs";

export default {
  key: "rkvst-create-asset",
  name: "Create Asset",
  description: "Allows for the addition of a new asset into the RKVST system. [See the documentation](https://docs.datatrails.ai/developers/api-reference/assets-api/)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    rkvst,
    attributes: {
      type: "object",
      label: "Attributes",
      description: "Key value mapping of event attributes.",
      optional: true,
    },
    behaviours: {
      type: "string[]",
      label: "Behaviours",
      description: "List of behaviours enabled for this asset.",
      optional: true,
    },
    chainId: {
      type: "string",
      label: "Chain Id",
      description: "Chain id of the blockchain associated with this asset.",
      optional: true,
    },
    proofMechanism: {
      type: "string",
      label: "Proof Mechanism",
      description: "Specify the mechanism used to provide evidential proof for Events on this Asset.",
      optional: true,
    },
    public: {
      type: "boolean",
      label: "Public",
      description: " A public asset and all its events are visible to the general public.Sharing to specific organisations is not available for public assets.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.rkvst.createAsset({
      $,
      data: {
        attributes: this.attributes && parseObject(this.attributes),
        behaviours: this.behaviours && parseObject(this.behaviours),
        chainId: this.chainId,
        proofMechanism: this.proofMechanism,
        public: this.public,
      },
    });
    $.export("$summary", `Successfully created new asset with ID ${response.identity}`);
    return response;
  },
};

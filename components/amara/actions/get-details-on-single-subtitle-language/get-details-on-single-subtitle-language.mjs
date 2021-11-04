import common from "../common.mjs";

const { amara } = common.props;

export default {
  ...common,
  key: "amara-get-details-on-single-subtitle-language",
  name: "Get details on a single subtitle language",
  description: "Get details on a single subtitle language. [See the docs here](https://apidocs.amara.org/#get-details-on-a-single-subtitle-language)",
  type: "action",
  version: "0.0.1",
  async run({ $ }) {},
};

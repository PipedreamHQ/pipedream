import common from "../common.mjs";

const { amara } = common.props;

export default {
  ...common,
  key: "amara-update-subtitle-language",
  name: "Update subtitle language",
  description: "Update a subtitle language. [See the docs here](https://apidocs.amara.org/#update-a-subtitle-language)",
  type: "action",
  version: "0.0.1",
  async run({ $ }) {},
};

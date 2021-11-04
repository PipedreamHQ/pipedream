import common from "../common.mjs";

const { amara } = common.props;

export default {
  ...common,
  key: "amara-create-subtitle-language",
  name: "Create subtitle language",
  description: "Create a subtitle language. [See the docs here](https://apidocs.amara.org/#create-a-subtitle-language)",
  type: "action",
  version: "0.0.1",
  async run({ $ }) {},
};

import common from "../common.mjs";

const { amara } = common.props;

export default {
  ...common,
  key: "amara-add-new-subtitles",
  name: "Add new subtitles",
  description: "Add new subtitles. [See the docs here](https://apidocs.amara.org/#add-new-subtitles)",
  type: "action",
  version: "0.0.1",
  async run({ $ }) {},
};

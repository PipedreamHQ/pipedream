import common from "../common.mjs";

const { amara } = common.props;

export default {
  ...common,
  key: "amara-delete-subtitles",
  name: "Delete subtitles",
  description: "Delete subtitles. [See the docs here](https://apidocs.amara.org/#delete-subtitles)",
  type: "action",
  version: "0.0.1",
  async run({ $ }) {},
};

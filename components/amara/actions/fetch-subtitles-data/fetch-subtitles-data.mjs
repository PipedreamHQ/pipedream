import common from "../common.mjs";

const { amara } = common.props;

export default {
  ...common,
  key: "amara-fetch-subtitles-data",
  name: "Fetch subtitles data",
  description: "Fetch subtitles data. [See the docs here](https://apidocs.amara.org/#fetch-subtitles-data)",
  type: "action",
  version: "0.0.1",
  async run({ $ }) {},
};

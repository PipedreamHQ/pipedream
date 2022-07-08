import common from "../common.mjs";

const { ghost_org_content_api } = common.props;

export default {
  ...common,
  key: "ghost_org_content_api-find-author",
  name: "Find author",
  description: "Find an author. [See the docs here](https://ghost.org/docs/content-api/#authors).",
  type: "action",
  version: "0.0.1",
  props: {
    ghost_org_content_api,
  },
  async run() {},
};

import app from "../../notion_api_key.app.mjs";
import common from "@pipedream/notion/actions/append-block/append-block.mjs";

import { adjustPropDefinitions } from "../../common/utils.mjs";

const {
  name, description, type, ...others
} = common;
const props = adjustPropDefinitions(others.props, app);

export default {
  ...others,
  key: "notion_api_key-append-block",
  version: "0.0.4",
  name,
  description,
  type,
  props: {
    notion: app,
    ...props,
  },
  async run(ctx) {
    const formatChildBlocks = this.formatChildBlocks;
    // The shared run() only appends the children of each selected block, so a leaf block
    // (paragraph, image, ...) was silently dropped. Append the block itself unless it's a page.
    const self = Object.assign(Object.create(this), {
      formatChildBlocks: (block) => formatChildBlocks.call(this, block.type === "child_page"
        ? block
        : {
          has_children: true,
          children: [
            block,
          ],
        }),
    });
    const response = await others.run.call(self, ctx);
    if (!response) {
      throw new Error("Nothing to append: the selected blocks and content produced no blocks Notion can append (empty pages, uploaded image files and unsupported videos are skipped)");
    }
    return response;
  },
};

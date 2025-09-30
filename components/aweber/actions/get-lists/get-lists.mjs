import aweberApp from "../../aweber.app.mjs";
import constants from "../../common/constants.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "aweber-get-lists",
  name: "Get Lists",
  description: "Get a paginated collection of subscriber lists. [See the docs here](https://api.aweber.com/#tag/Lists/paths/~1accounts~1{accountId}~1lists/get).",
  type: "action",
  version: "0.0.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    aweberApp,
    accountId: {
      propDefinition: [
        aweberApp,
        "accountId",
      ],
    },
    start: {
      propDefinition: [
        aweberApp,
        "wsStart",
      ],
    },
    size: {
      propDefinition: [
        aweberApp,
        "wsSize",
      ],
    },
    max: {
      propDefinition: [
        aweberApp,
        "max",
      ],
    },
  },
  async run({ $ }) {
    const {
      accountId,
      start,
      size,
      max,
    } = this;

    const stream = await this.aweberApp.getResourcesStream({
      resourceFn: this.aweberApp.getLists,
      resourceFnArgs: {
        $,
        accountId,
        params: {
          [constants.PAGINATION.SIZE_PROP]: size,
          [constants.PAGINATION.START_PROP]: start,
        },
      },
      max,
    });
    const lists = await utils.streamIterator(stream);
    const summaryEnd = utils.summaryEnd(lists.length, "list");

    $.export("$summary", `Successfully retrieved ${summaryEnd}.`);

    return lists;
  },
};

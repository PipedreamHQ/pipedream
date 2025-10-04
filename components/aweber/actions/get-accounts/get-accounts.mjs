import aweberApp from "../../aweber.app.mjs";
import constants from "../../common/constants.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "aweber-get-accounts",
  name: "Get Accounts",
  description: "Get a paginated collection of accounts. [See the docs here](https://api.aweber.com/#tag/Accounts/paths/~1accounts/get).",
  type: "action",
  version: "0.0.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    aweberApp,
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
      start,
      size,
      max,
    } = this;

    const stream = await this.aweberApp.getResourcesStream({
      resourceFn: this.aweberApp.getAccounts,
      resourceFnArgs: {
        $,
        params: {
          [constants.PAGINATION.SIZE_PROP]: size,
          [constants.PAGINATION.START_PROP]: start,
        },
      },
      max,
    });
    const accounts = await utils.streamIterator(stream);
    const summaryEnd = utils.summaryEnd(accounts.length, "account");

    $.export("$summary", `Successfully retrieved ${summaryEnd}.`);

    return accounts;
  },
};

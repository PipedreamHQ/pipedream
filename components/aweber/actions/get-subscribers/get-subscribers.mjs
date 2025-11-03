import aweberApp from "../../aweber.app.mjs";
import constants from "../../common/constants.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "aweber-get-subscribers",
  name: "Get Subscribers",
  description: "Get a paginated collection of subscribers under the specified account and list. [See the docs here](https://api.aweber.com/#tag/Subscribers/paths/~1accounts~1{accountId}~1lists~1{listId}~1subscribers/get).",
  type: "action",
  version: "0.0.5",
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
    listId: {
      propDefinition: [
        aweberApp,
        "listId",
        ({ accountId }) => ({
          accountId,
        }),
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
      listId,
      start,
      size,
      max,
    } = this;

    const stream = await this.aweberApp.getResourcesStream({
      resourceFn: this.aweberApp.getSubscribersForList,
      resourceFnArgs: {
        $,
        accountId,
        listId,
        params: {
          [constants.PAGINATION.SIZE_PROP]: size,
          [constants.PAGINATION.START_PROP]: start,
        },
      },
      max,
    });
    const subscribers = await utils.streamIterator(stream);
    const summaryEnd = utils.summaryEnd(subscribers.length, "subscriber");

    $.export("$summary", `Successfully retrieved ${summaryEnd}.`);

    return subscribers;
  },
};

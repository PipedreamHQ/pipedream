import utils from "../../common/utils.mjs";
import common from "../common.mjs";

const { discord } = common.props;
const { emptyStrToUndefined } = utils;

export default {
  ...common,
  key: "discord_bot-list-channel-messages",
  name: "List Channel Messages",
  description: "Return the messages for a channel. [See the docs here](https://discord.com/developers/docs/resources/channel#get-channel-messages)",
  type: "action",
  version: "1.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    ...common.props,
    max: {
      propDefinition: [
        discord,
        "max",
      ],
    },
    limit: {
      description: "Max number of messages to return per page (1-100)",
      propDefinition: [
        discord,
        "limit",
      ],
    },
    after: {
      description: "Get messages after this message ID",
      propDefinition: [
        discord,
        "after",
      ],
    },
    before: {
      propDefinition: [
        discord,
        "before",
      ],
    },
    around: {
      propDefinition: [
        discord,
        "around",
      ],
    },
  },
  async run({ $ }) {
    const limit = emptyStrToUndefined(this.limit);
    const after = emptyStrToUndefined(this.after);
    const before = emptyStrToUndefined(this.before);
    const around = emptyStrToUndefined(this.around);
    const max = emptyStrToUndefined(this.max);

    if (before && after || before && around || after && around) {
      throw new Error("The before, after, and around keys are mutually exclusive, only one may be passed at a time.");
    }

    return this.paginateResources({
      resourceFn: this.discord.getMessages,
      resourceFnArgs: {
        $,
        channelId: this.channelId,
      },
      before,
      after,
      around,
      limit,
      max,
    });
  },
};

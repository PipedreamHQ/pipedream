import surveyMonkey from "../../survey_monkey.app.mjs";
import base from "../common/base-survey.mjs";
import baseListAction from "../common/base-list-action.mjs";
import constants from "../../common/constants.mjs";

export default {
  ...base,
  ...baseListAction,
  key: "survey_monkey-list-invite-messages",
  name: "List Invite Messages",
  description: "Retrieve a collector's invite messages, each with its `id` and `status`. Run this to find a Message ID for **Add Message Recipients**, **Send Invite Message**, or the **Copy From Message** option on **Create Invite Message**. Filter by **Status** `not_sent` to get only the messages that can still be sent. [See the documentation](https://api.surveymonkey.com/v3/docs?javascript#api-endpoints-get-collectors-collector_id-messages)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    ...base.props,
    collectorId: {
      propDefinition: [
        surveyMonkey,
        "collectorId",
        (c) => ({
          surveyId: c.survey,
        }),
      ],
    },
    status: {
      type: "string",
      label: "Status",
      description: "Return only the messages with this status. `not_sent` is the set **Send Invite Message** accepts — it rejects a message that is already `sent` or still `processing`. Omit to return every message on the collector.",
      options: constants.MESSAGE_STATUSES,
      optional: true,
    },
  },
  methods: {
    ...baseListAction.methods,
    getItemName() {
      return "Invite Message";
    },
    async runRequest($) {
      const messages = await this.surveyMonkey.getMessages({
        $,
        collectorId: this.collectorId,
      });

      // The endpoint documents no status query parameter, so the filter is
      // applied here. `_paginatedRequest` has already walked every page, so
      // this still sees the collector's full set of messages.
      return this.status
        ? messages.filter(({ status }) => status === this.status)
        : messages;
    },
  },
};

/* eslint-disable pipedream/required-properties-key, pipedream/required-properties-name,
  pipedream/required-properties-version, pipedream/required-properties-description,
  pipedream/required-properties-type */
import base from "../common/common-webhook.mjs";

export default {
  ...base,
  props: {
    ...base.props,
    board: {
      propDefinition: [
        base.props.trello,
        "board",
      ],
    },
    onlyEventsRelatedWithAuthenticatedUser: {
      label: "Only Events Related With Me",
      description: "Only will emit events from the cards related with the authenticated user",
      type: "boolean",
      default: false,
      optional: true,
    },
  },
  methods: {
    ...base.methods,
    /**
     * Default isRelevant for components that only filter the results by a specified board.
     * @param {object} result - The result item obtained by the component.
     */
    async isRelevant({ result }) {
      if (!this.board || this.board !== result.idBoard) {
        return false;
      }

      const member = await this.trello.getMember("me");

      if (
        this.onlyEventsRelatedWithAuthenticatedUser &&
        result?.idMembers?.length &&
        !result.idMembers.includes(member.id)
      ) {
        return false;
      }

      return true;
    },
  },
};

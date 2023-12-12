import common from "./common.mjs";

export default {
  ...common,
  props: {
    ...common.props,
    http: "$.interface.http",
  },
  hooks: {
    async deploy() {
      const {
        sampleEvents, sortField,
      } = await this.getSampleEvents();
      sampleEvents.sort((a, b) => (Date.parse(a[sortField]) > Date.parse(b[sortField]))
        ? 1
        : -1);
      for (const event of sampleEvents.slice(-25)) {
        this.emitEvent(event);
      }
    },
    async activate() {
      const modelId = await this.getModelId();
      const { id } = await this.trello.createHook({
        id: modelId,
        endpoint: this.http.endpoint,
      });
      this.db.set("hookId", id);
    },
    async deactivate() {
      const hookId = this.db.get("hookId");
      await this.trello.deleteHook({
        hookId,
      });
    },
  },
  methods: {
    ...common.methods,
    /**
     * Returns the ID of the current board selected. If no board is selected, returns
     * the id of the authenticated user.
     */
    async getModelId() {
      if (this.board) return this.board;
      const member = await this.trello.getMember("me");
      return member.id;
    },
    /**
     * Verifies that the event received was sent from Trello.
     * @param {object} event - The event returned from a webhook
     */
    verifyEvent(event) {
      return (
        this.trello.verifyTrelloWebhookRequest(event, this.http.endpoint) &&
        event.body !== undefined
      );
    },
    /**
     * Default isCorrectEventType. Used in components to verify that the event received is
     * of the type that the component is watching for.
     */
    isCorrectEventType() {
      return true;
    },
    /**
     * Default isRelevant. Used in components to verify that the event received matches the
     * board, list and/or card specified in the component's props.
     */
    isRelevant() {
      return true;
    },
    getSampleEvents() {
      throw new Error("getSampleEvents not implemented");
    },
  },
  async run(event) {
    if (!this.verifyEvent(event)) {
      console.log("The event failed the verification. Skipping...");
      return;
    }
    if (!this.isCorrectEventType(event)) return;

    const result = await this.getResult(event);
    if (!(await this.isRelevant({
      result,
      event,
    }))) return;

    this.emitEvent(result);
  },
};

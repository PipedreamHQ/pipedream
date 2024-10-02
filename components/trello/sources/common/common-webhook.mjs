import { createHmac } from "crypto";
import common from "./common.mjs";

export default {
  ...common,
  props: {
    ...common.props,
    http: "$.interface.http",
  },
  hooks: {
    async deploy() {
      let sampleEvents = await this.getSampleEvents();
      const sortField = this.getSortField();
      sampleEvents = this.sortItemsByDate(sampleEvents, sortField);
      for (const event of sampleEvents.slice(-25)) {
        this.emitEvent(event);
      }
    },
    async activate() {
      const modelId = await this.getModelId();
      const { id } = await this.createHook({
        params: {
          idModel: modelId,
          description: "Pipedream Source ID",
          callbackURL: this.http.endpoint,
        },
      });
      this._setHookId(id);
    },
    async deactivate() {
      const hookId = this._getHookId();
      if (hookId) {
        await this.deleteHook({
          hookId,
        });
      }
    },
  },
  methods: {
    ...common.methods,
    _getHookId() {
      return this.db.get("hookId");
    },
    _setHookId(hookId) {
      this.db.set("hookId", hookId);
    },
    getBase64Digest(data) {
      const { secret } = this.app.getToken();
      return createHmac("sha1", secret)
        .update(data)
        .digest("base64");
    },
    // Do not remove the async keyword from this function
    async isValidSignature({
      body, bodyRaw, headers,
    }) {
      const data = bodyRaw + body.webhook?.callbackURL;
      const doubleHash = this.getBase64Digest(data);
      const headerHash = headers["x-trello-webhook"];
      return doubleHash === headerHash;
    },
    createHook(args = {}) {
      return this.app.post({
        ...args,
        path: "/webhooks/",
      });
    },
    deleteHook({
      hookId, ...args
    } = {}) {
      return this.app.delete({
        ...args,
        path: `/webhooks/${hookId}`,
      });
    },
    /**
     * Returns the ID of the current board selected. If no board is selected, returns
     * the id of the authenticated user.
     */
    async getModelId() {
      if (this.board) {
        return this.board;
      }
      const member = await this.app.getMember({
        memberId: "me",
      });
      return member.id;
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
    getResult(action) {
      return action;
    },
    getSampleEvents() {
      throw new Error("getSampleEvents not implemented");
    },
    getSortField() {
      throw new Error("getSortField is not implemented");
    },
  },
  async run(event) {
    if (event.body === undefined) {
      console.log("Event body is undefined. Skipping...");
      return;
    }

    if (!this.isValidSignature(event)) {
      console.log("The event failed the verification. Skipping...");
      return;
    }

    const { action } = event.body;

    if (!this.isCorrectEventType(action)) {
      console.log("The event is not of the correct type. Skipping...");
      return;
    }

    const result = await this.getResult(action);
    const isRelevant = await this.isRelevant({
      result,
      action,
    });

    if (!isRelevant) {
      console.log("The event is not relevant. Skipping...");
      return;
    }

    this.emitEvent(result);
  },
};

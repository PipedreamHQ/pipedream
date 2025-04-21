import moment from "moment";
import common from "./base.mjs";

export default {
  ...common,
  props: {
    ...common.props,
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    folderId: {
      propDefinition: [
        common.props.microsoftExcel,
        "folderId",
      ],
      description: "The ID of the folder to watch for changes",
    },
  },
  hooks: {
    async activate() {
      const response = await this.microsoftExcel.createHook({
        data: {
          changeType: "updated",
          notificationUrl: this.http.endpoint,
          resource: "me/drive/root",
          expirationDateTime: moment().add(30, "days"),
        },
      });

      this._setHookId(response.id);

      const { token } = await this.getDeltaValues(this.path(), "latest");
      this._setDeltaToken(token);
    },
    async deactivate() {
      const id = this._getHookId("hookId");
      await this.microsoftExcel.deleteHook(id);
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
    _getDeltaToken() {
      return this.db.get("deltaToken");
    },
    _setDeltaToken(token) {
      this.db.set("deltaToken", token);
    },
    async updateSubscription() {
      try {
        await this.microsoftExcel.deleteHook(this._getHookId("hookId"));
      } catch {
        // couldn't find webhook
      }

      const { id } = await this.microsoftExcel.createHook({
        data: {
          changeType: "updated",
          notificationUrl: this.http.endpoint,
          resource: "me/drive/root",
          expirationDateTime: moment().add(30, "days"),
        },
      });
      this._setHookId(id);
    },
    path() {
      return this.folderId === "root"
        ? "me/drive/root"
        : `me/drive/items/${this.folderId}`;
    },
    async getDeltaValues(path, token) {
      const delta = await this.microsoftExcel.getDelta({
        path,
        token,
      });
      const deltaLink = delta["@odata.deltaLink"] || delta["@odata.nextLink"];
      return {
        value: delta?.value,
        token: new URL(deltaLink).searchParams.get("token"),
      };
    },
    filterRelevantSpreadsheets(spreadsheets) {
      return spreadsheets;
    },
  },
  async run({ query }) {
    if (query.validationToken) {
      this.http.respond({
        status: 200,
        body: query.validationToken,
        headers: {
          "content-type": "text/plain",
        },
      });
      return;
    }

    let deltaValues;
    try {
      deltaValues = await this.getDeltaValues(this.path(), this._getDeltaToken());
    } catch {
      deltaValues = await this.getDeltaValues(this.path(), "latest");
    }
    const {
      value, token,
    } = deltaValues;

    await this.updateSubscription();
    this._setDeltaToken(token);

    let spreadsheets = value.filter(({ file }) => file?.mimeType === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    spreadsheets = this.filterRelevantSpreadsheets(spreadsheets);

    if (!spreadsheets?.length) {
      return;
    }

    spreadsheets.forEach((item) => this.emitEvent(item));
  },
};

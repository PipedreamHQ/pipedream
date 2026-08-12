import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import common from "./common-new-record.mjs";
import constants from "../../common/constants.mjs";

const {
  DEPLOY_HISTORICAL_LIMIT,
  FIELD_NAME,
} = constants;

export default {
  ...common,
  props: {
    salesforce: common.props.salesforce,
    db: "$.service.db",
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    timer: {
      type: "$.interface.timer",
      description: "The timer is only used as a fallback if instant event delivery (webhook) is not available.",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    parentObjectType: {
      type: "string",
      label: "Parent Object Type",
      description: "Optional. The Salesforce SObject API name of the parent record to filter by, e.g. `Case` or `Opportunity`. When set, appends `AND Parent.Type = '<value>'` to the SOQL WHERE clause (traversal of the polymorphic `ParentId`). Leave blank to emit events on any parent object.",
      optional: true,
    },
    excludeSelf: {
      type: "boolean",
      label: "Exclude Self",
      description: "Optional. When `true`, appends `AND CreatedById != '<authenticatedUserId>'` to filter out events created by the connected user. The user ID is resolved at runtime via the userinfo endpoint and cached in db.",
      optional: true,
    },
  },
  hooks: {
    ...common.hooks,
    async deploy() {
      const objectType = this.getObjectType();
      const nameField = await this.salesforce.getNameFieldForObjectType(objectType);
      this.setNameField(nameField);

      const extraConditions = await this._buildExtraConditions();
      const { records } = await this.query({
        query: `SELECT Id FROM ${objectType} WHERE Id != null ${extraConditions} ORDER BY CreatedDate DESC LIMIT ${DEPLOY_HISTORICAL_LIMIT}`,
      });

      // Emit oldest-first so historical events are delivered chronologically,
      // matching the timer polling path.
      for (const record of [
        ...records,
      ].reverse()) {
        const object = await this.salesforce.getSObject(objectType, record.Id);
        const event = {
          body: {
            "New": object,
            "UserId": record.Id,
          },
        };
        await this.processWebhookEvent(event);
      }
    },
  },
  methods: {
    ...common.methods,
    getMinFields() {
      throw new Error("getMinFields is not implemented");
    },
    _getAuthenticatedUserId() {
      return this.db.get("authenticatedUserId");
    },
    _setAuthenticatedUserId(userId) {
      this.db.set("authenticatedUserId", userId);
    },
    async _resolveAuthenticatedUserId() {
      let userId = this._getAuthenticatedUserId();
      if (!userId) {
        const userInfo = await this.salesforce.getUserInfo(this.salesforce._authToken());
        userId = userInfo.user_id;
        this._setAuthenticatedUserId(userId);
      }
      return userId;
    },
    async _buildExtraConditions() {
      const conditions = [];
      if (this.parentObjectType) {
        conditions.push(`AND Parent.Type = '${this.parentObjectType}'`);
      }
      if (this.excludeSelf) {
        const userId = await this._resolveAuthenticatedUserId();
        conditions.push(`AND CreatedById != '${userId}'`);
      }
      return conditions.join(" ");
    },
    async processWebhookEvent(event) {
      // Instant/webhook deliveries can't filter on Parent.Type (the pushed
      // payload has ParentId but not the parent's object type), so
      // parentObjectType is only enforced on the polling/deploy SOQL queries.
      // excludeSelf is enforced here to prevent self-trigger loops.
      if (this.excludeSelf) {
        const userId = await this._resolveAuthenticatedUserId();
        if (event.body?.New?.CreatedById === userId) {
          return;
        }
      }
      const meta = this.generateWebhookMeta(event);
      this.$emit(event.body, meta);
    },
    async processTimerEvent(eventData) {
      const {
        startTimestamp,
        endTimestamp,
      } = eventData;

      const fieldName = this.getNameField();
      let columns = this.getObjectTypeColumns();
      if (!columns.length) {
        columns = [
          ...this.getMinFields(),
        ];
      }

      const extraConditions = await this._buildExtraConditions();
      const objectType = this.getObjectType();
      const dateFieldName = FIELD_NAME.CREATED_DATE;

      const events = await this.paginate({
        fn: ({
          limit,
          offset,
        }) => this.query({
          query: `
            SELECT ${columns.join(", ")}
              FROM ${objectType}
                WHERE ${dateFieldName} > ${startTimestamp}
                AND ${dateFieldName} <= ${endTimestamp}
                ${extraConditions}
                ORDER BY ${dateFieldName} DESC
                LIMIT ${limit} OFFSET ${offset}
          `,
        }),
      });

      const [
        latestEvent,
      ] = events;

      let latestDateCovered = new Date(latestEvent?.CreatedDate || endTimestamp);
      if (isNaN(latestDateCovered.getMilliseconds())) {
        latestDateCovered = new Date();
      }
      latestDateCovered.setSeconds(0);
      this.setLatestDateCovered(latestDateCovered.toISOString());

      Array.from(events)
        .reverse()
        .forEach((item) => {
          const meta = this.generateTimerMeta(item, fieldName);
          this.$emit(item, meta);
        });
    },
    async timerActivateHook() {
      let columns;
      try {
        const { fields } = await this.getObjectTypeDescription(this.getObjectType());
        columns = fields.map(({ name }) => name);
      } catch (err) {
        console.log(`Error fetching ${this.getObjectType()} description, falling back to minimum fields:`, err);
        columns = [
          ...this.getMinFields(),
        ];
      }
      this.setObjectTypeColumns(columns);
    },
  },
};

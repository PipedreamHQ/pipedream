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
      description: "Optional. Only emit events whose parent record is of this Salesforce SObject API name, e.g. `Case` or `Opportunity`. Enforced on both delivery paths: `AND Parent.Type = '<value>'` in the polling SOQL, and the parent's Salesforce ID key prefix on instant (webhook) deliveries. Leave blank to emit events on any parent object.",
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

      try {
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
      } catch (err) {
        console.log("Error seeding historical records during deploy:", err);
        console.log("The source will still be created and will emit new records going forward.");
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
    _getParentKeyPrefix() {
      return this.db.get("parentKeyPrefix");
    },
    _setParentKeyPrefix(parentKeyPrefix) {
      this.db.set("parentKeyPrefix", parentKeyPrefix);
    },
    async _resolveParentKeyPrefix() {
      const objectType = this.parentObjectType;

      // The cache records which object type it was resolved for, so editing the
      // prop on a deployed source re-resolves instead of reusing a stale prefix.
      const cached = this._getParentKeyPrefix();
      if (cached?.objectType === objectType) {
        return cached.keyPrefix;
      }

      let keyPrefix;
      try {
        ({ keyPrefix } = await this.getObjectTypeDescription(objectType));
      } catch (err) {
        console.log(`Error describing ${objectType} to resolve its ID key prefix:`, err);
      }

      if (!keyPrefix) {
        // Not cached, so a transient describe failure is retried on the next event.
        console.log(`No ID key prefix available for ${objectType}, falling back to a per-event Parent.Type lookup.`);
        return null;
      }

      this._setParentKeyPrefix({
        objectType,
        keyPrefix,
      });
      return keyPrefix;
    },
    async _parentTypeMatches(record) {
      const parentId = record?.ParentId;
      if (!parentId) {
        return false;
      }

      // Salesforce ID key prefixes are stable per SObject (Case = `500`,
      // Account = `001`, ...), so the parent's type is read straight off the
      // pushed ParentId with no extra API call per event.
      const keyPrefix = await this._resolveParentKeyPrefix();
      if (keyPrefix) {
        return parentId.startsWith(keyPrefix);
      }

      // Fallback for an object with no key prefix: one SOQL lookup per event,
      // reusing the same polymorphic traversal as the polling query.
      const { records } = await this.query({
        query: `SELECT Id FROM ${this.getObjectType()} WHERE Id = '${record.Id}' AND Parent.Type = '${this.parentObjectType}'`,
      });
      return !!records?.length;
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
      // Instant/webhook deliveries can't filter on Parent.Type in SOQL (the
      // pushed payload carries ParentId but not the parent's object type), so
      // both props are enforced here to match the polling/deploy queries.
      const record = event.body?.New;
      if (this.parentObjectType && !(await this._parentTypeMatches(record))) {
        return;
      }
      if (this.excludeSelf) {
        const userId = await this._resolveAuthenticatedUserId();
        if (record?.CreatedById === userId) {
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

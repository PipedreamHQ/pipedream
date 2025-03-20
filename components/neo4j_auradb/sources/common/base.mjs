import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import { ORDER_TYPE_OPTIONS } from "../../common/constants.mjs";
import app from "../../neo4j_auradb.app.mjs";

export default {
  props: {
    app,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    orderBy: {
      type: "string",
      label: "Order By",
      description: "Order By property is required for Pipedream source to identify the entity. We recommend to choose the property represent the created time property of your entity with a variable, for example createdAt.",
    },
    orderType: {
      type: "string",
      label: "Order Type",
      description: "The type of the order field.",
      options: ORDER_TYPE_OPTIONS,
      reloadProps: true,
    },
    datetimeFormat: {
      type: "string",
      label: "Datetime Format",
      description: "The format of the datetime field. **E.g. YYYY-MM-DD HH:mm:ss.SSSSZ**",
      hidden: true,
    },
  },
  async additionalProps(props) {
    props.datetimeFormat.hidden = !(this.orderType === "datetime");
    return {};
  },
  methods: {
    _getDefaultValue() {
      switch (this.orderType) {
      case "datetime": return "1970-01-01T00:00:00Z";
      case "sequencial": return 0;
      default: return "";
      }
    },
    _getWhereClause(lastData, type) {
      switch (type) {
      case "datetime": return `WHERE apoc.date.parse(n.${this.orderBy}, "ms", "${this.datetimeFormat}") > ${Date.parse(lastData)}`;
      case "sequencial": return `WHERE n.${this.orderBy} > ${parseInt(lastData)}`;
      default: return "";
      }
    },
    _verifyBreak(item, lastData) {
      const type = this.orderType;
      switch (type) {
      case "datetime":
        if (Date.parse(item[this.orderBy]) <= Date.parse(lastData)) {
          return true;
        }
        break;
      case "sequencial":
        if (item[this.orderBy] <= lastData) {
          return true;
        }
        break;
      case "other":
        if (item[this.orderBy] === lastData) {
          return true;
        }
        break;
      default:
        return false;
      }
    },
    _getLastData() {
      return this.db.get("lastData") || this._getDefaultValue();
    },
    _setLastData(lastData) {
      this.db.set("lastData", lastData);
    },
    async emitEvent(maxResults = false) {
      const lastData = this._getLastData();
      const whereClause = this._getWhereClause(lastData, this.orderType);
      const queryBase = this.getBaseQuery(whereClause);
      const query = `${queryBase} RETURN n ORDER BY n.${this.orderBy} DESC `;

      const response = this.app.paginate({
        query,
        maxResults,
      });

      let responseArray = [];
      for await (const item of response) {
        this._verifyBreak(item, lastData);
        responseArray.push(item);
      }

      if (responseArray.length) {
        if (maxResults && (responseArray.length > maxResults)) {
          responseArray.length = maxResults;
        }

        const lastData = responseArray[0]?.properties?.[this.orderBy]
         || responseArray[0][1].properties[this.orderBy];

        this._setLastData(lastData);
      }

      for (const item of responseArray.reverse()) {
        this.emit(item);
      }
    },
  },
  hooks: {
    async deploy() {
      await this.emitEvent(25);
    },
  },
  async run() {
    await this.emitEvent();
  },
};

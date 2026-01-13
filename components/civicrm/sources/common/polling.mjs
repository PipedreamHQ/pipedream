import {
  ConfigurationError,
  DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
} from "@pipedream/platform";
import app from "../../civicrm.app.mjs";

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
  },
  hooks: {
    async deploy() {
      const {
        getResourceFn,
        _getDateField,
        generateMeta,
      } = this;

      const params = encodeURIComponent(JSON.stringify({
        limit: 25,
        orderBy: {
          [_getDateField()]: "DESC",
        },
      }));

      const resourceFn = getResourceFn();
      const { values } = await resourceFn({
        data: `params=${params}`,
      });

      if (values && values.length > 0) {
        values.reverse().forEach((value) => {
          const meta = generateMeta(value);
          this.$emit(value, meta);
        });
      }
    },
  },
  methods: {
    generateMeta() {
      throw new ConfigurationError("generateMeta is not implemented");
    },
    getResourceFn() {
      throw new ConfigurationError("getResourceFn is not implemented");
    },
    _getDateField() {
      throw new ConfigurationError("getDateField is not implemented");
    },
    _getLastDate() {
      return this.db.get("lastDate");
    },
    _setLastDate(lastDate) {
      this.db.set("lastDate", lastDate);
    },
  },
  async run() {
    const {
      getResourceFn,
      _getDateField,
      generateMeta,
      _getLastDate,
      _setLastDate,
    } = this;

    const lastDate = _getLastDate();

    const params = {
      limit: 100,
      orderBy: {
        [_getDateField()]: "DESC",
      },
    };

    if (lastDate) {
      params.where = [
        [
          _getDateField(),
          ">",
          lastDate,
        ],
      ];
    }

    const resourceFn = getResourceFn();
    const { values } = await resourceFn({
      data: `params=${encodeURIComponent(JSON.stringify(params))}`,
    });

    if (!values || values.length === 0) {
      console.log("No new values found");
      return;
    }

    values.forEach((value) => {
      const meta = generateMeta(value);
      this.$emit(value, meta);
    });

    if (values.length > 0) {
      const lastValue = values[0];
      _setLastDate(lastValue[this._getDateField()]);
    }
  },
};

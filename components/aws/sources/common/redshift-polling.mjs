import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import app from "../../aws.app.mjs";

export default {
  props: {
    app,
    info: {
      propDefinition: [
        app,
        "info",
      ],
    },
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    region: {
      propDefinition: [
        app,
        "region",
      ],
    },
    workgroupName: {
      propDefinition: [
        app,
        "workgroupName",
        ({ region }) => ({
          region,
        }),
      ],
    },
    database: {
      propDefinition: [
        app,
        "database",
        ({
          region,
          workgroupName,
        }) => ({
          region,
          workgroupName,
        }),
      ],
    },
    schema: {
      propDefinition: [
        app,
        "schema",
        ({
          region,
          database,
          workgroupName,
        }) => ({
          region,
          database,
          workgroupName,
        }),
      ],
    },
    table: {
      propDefinition: [
        app,
        "table",
        ({
          region,
          database,
          workgroupName,
          schema,
        }) => ({
          region,
          database,
          workgroupName,
          schema,
        }),
      ],
    },
  },
  methods: {
    getValue(field) {
      if (field.isNull) {
        return null;
      }
      if ("stringValue" in field) {
        return field.stringValue;
      }
      if ("longValue" in field) {
        return field.longValue;
      }
      if ("booleanValue" in field) {
        return field.booleanValue;
      }
      if ("doubleValue" in field) {
        return field.doubleValue;
      }
      if ("blobValue" in field) {
        return Buffer.from(field.blobValue);
      }
      return undefined;
    },
  },
};

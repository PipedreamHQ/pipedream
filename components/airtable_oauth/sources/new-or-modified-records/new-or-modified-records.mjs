import base from "../common/common.mjs";
import sampleEmit from "./test-event.mjs";
import moment from "moment";

export default {
  ...base,
  name: "New or Modified Records",
  key: "airtable_oauth-new-or-modified-records",
  description: "Emit new event for each new or modified record in a table",
  version: "0.0.4",
  type: "source",
  props: {
    ...base.props,
    tableId: {
      propDefinition: [
        base.props.airtable,
        "tableId",
        ({ baseId }) => ({
          baseId,
        }),
      ],
      description: "The table ID to watch for changes.",
    },
    fieldId: {
      propDefinition: [
        base.props.airtable,
        "sortFieldId",
        ({
          baseId, tableId,
        }) => ({
          baseId,
          tableId,
        }),
      ],
      label: "Field ID",
      description: "Identifier of a spedific field/column to watch for updates",
      withLabel: true,
    },
  },
  methods: {
    ...base.methods,
    _getFieldValues() {
      return this.db.get("fieldValues") || {};
    },
    _setFieldValues(fieldValues) {
      this.db.set("fieldValues", fieldValues);
    },
  },
  async run(event) {
    const {
      baseId,
      tableId,
      viewId,
    } = this;

    const lastTimestamp = this._getLastTimestamp();
    const fieldValues = this._getFieldValues();
    const isFirstRunWithField = this.fieldId && Object.keys(fieldValues).length === 0;
    const params = isFirstRunWithField
      ? {}
      : {
        filterByFormula: `LAST_MODIFIED_TIME() > "${lastTimestamp}"`,
      };

    const data = await this.airtable.getRecords({
      baseId,
      tableId,
      params,
    });

    if (!data.records.length) {
      console.log("No new or modified records.");
      return;
    }

    const metadata = {
      baseId,
      tableId,
      viewId,
    };

    let newRecords = 0, modifiedRecords = 0;
    const newFieldValues = {
      ...fieldValues,
    };
    for (const record of data.records) {
      if (!lastTimestamp || moment(record.createdTime) > moment(lastTimestamp)) {
        if (this.fieldId) {
          newFieldValues[record.id] = record.fields[this.fieldId.label];
        }
        record.type = "new_record";
        newRecords++;
      } else {
        if (this.fieldId) {
          newFieldValues[record.id] = record.fields[this.fieldId.label];
          if (
            (record.fields[this.fieldId.label] == fieldValues[record.id])
            || isFirstRunWithField
          ) {
            continue;
          }
        }
        record.type = "record_modified";
        modifiedRecords++;
      }

      record.metadata = metadata;

      this.$emit(record, {
        summary: `${record.type}: ${JSON.stringify(record.fields)}`,
        id: record.id,
        ts: Date.now(),
      });
    }
    this._setFieldValues(newFieldValues);
    console.log(`Emitted ${newRecords} new records(s) and ${modifiedRecords} modified record(s).`);

    // We keep track of the timestamp of the current invocation
    this.updateLastTimestamp(event);
  },
  sampleEmit,
};

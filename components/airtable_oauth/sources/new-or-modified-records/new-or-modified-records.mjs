import base from "../common/common.mjs";
import sampleEmit from "./test-event.mjs";
import moment from "moment";

export default {
  ...base,
  name: "New or Modified Records",
  key: "airtable_oauth-new-or-modified-records",
  description: "Emit new event for each new or modified record in a table",
  version: "0.0.7",
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
    fieldIds: {
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
      type: "string[]",
      label: "Field IDs",
      description: "Identifiers of spedific fields/columns to watch for updates",
      withLabel: true,
    },
    returnFieldsByFieldId: {
      propDefinition: [
        base.props.airtable,
        "returnFieldsByFieldId",
      ],
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
    updateFieldValues(newFieldValues, record) {
      const fieldKey = this.returnFieldsByFieldId
        ? "value"
        : "label";
      for (const fieldId of this.fieldIds) {
        newFieldValues[record.id] = {
          ...newFieldValues[record.id],
          [fieldId.value]: record.fields[fieldId[fieldKey]] || null,
        };
      }
      return newFieldValues;
    },
    isUpdated(fieldValues, fieldIds, record) {
      const fieldKey = this.returnFieldsByFieldId
        ? "value"
        : "label";
      for (const fieldId of fieldIds) {
        if (!record.fields[fieldId[fieldKey]]) {
          record.fields[fieldId[fieldKey]] = null;
        }
        if (fieldValues[record.id]
          && fieldValues[record.id][fieldId.value] !== undefined
          && record.fields[fieldId[fieldKey]] !== fieldValues[record.id][fieldId.value]
        ) {
          return true;
        }
      }
      return false;
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
    const isFirstRunWithFields = this.fieldIds && Object.keys(fieldValues).length === 0;
    const params = {
      returnFieldsByFieldId: this.returnFieldsByFieldId,
    };
    if (!isFirstRunWithFields) {
      params.filterByFormula = `LAST_MODIFIED_TIME() > "${lastTimestamp}"`;
    }

    const data = await this.airtable.listRecords({
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
    let newFieldValues = {
      ...fieldValues,
    };
    for (const record of data.records) {
      if (this.fieldIds) {
        newFieldValues = this.updateFieldValues(newFieldValues, record);
      }
      if (!lastTimestamp || moment(record.createdTime) > moment(lastTimestamp)) {
        record.type = "new_record";
        newRecords++;
      } else {
        if (this.fieldIds
          && (!this.isUpdated(fieldValues, this.fieldIds, record) || isFirstRunWithFields)
        ) {
          continue;
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

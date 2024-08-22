import { defineSource } from "@pipedream/types";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import common from "../../actions/common";
import { Row } from "../../common/types";
import { EventType } from "../../common/constants";

export default defineSource({
  ...common,
  key: "baserow-new-or-updated-row",
  name: "New or Updated Row",
  description:
    "Emit new event when a table row is created, updated or deleted, according to the selected event types",
  version: "0.0.1",
  type: "source",
  props: {
    ...common.props,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    eventTypes: {
      type: "string[]",
      label: "Event Types",
      description:
        "Which events to emit. If not specified, all events will be emitted.",
      optional: true,
      options: [
        EventType.Create,
        EventType.Update,
        EventType.Delete,
      ],
    },
  },
  hooks: {
    async deploy() {
      await this.getAndProcessData();
    },
  },
  methods: {
    _getTableId(): string {
      return this.db.get("tableId");
    },
    _setTableId(value: string) {
      this.db.set("tableId", value);
    },
    _getSavedData(): string[] {
      return JSON.parse(this.db.get("savedData") ?? "{}");
    },
    _setSavedData(data: string[]) {
      this.db.set("savedData", JSON.stringify(data));
    },
    async getAndProcessData() {
      const {
        baserow, tableId, eventTypes,
      } = this;
      const savedTableId = this._getTableId();
      const data: Row[] = await baserow.listRows({
        tableId,
      });
      if (!data) {
        console.log("No data received: ", data);
        return;
      }

      const firstRun = savedTableId !== tableId;
      if (firstRun) {
        this._setTableId(tableId);
      } else {
        const events: EventType[] = eventTypes?.length
          ? eventTypes
          : Object.values(EventType);

        const savedData = this._getSavedData();

        const emitCreate = events.includes(EventType.Create);
        const emitUpdate = events.includes(EventType.Update);
        const emitDelete = events.includes(EventType.Delete);

        if (emitCreate || emitUpdate) {
          data.forEach((row) => {
            const savedRow = savedData[row.id];
            if (emitCreate && !savedRow) {
              this.emitEvent(EventType.Create, row);
            } else if (
              emitUpdate &&
              JSON.stringify(savedRow) !== JSON.stringify(row)
            ) {
              this.emitEvent(EventType.Update, row);
            }
          });
        }

        if (emitDelete) {
          Object.entries(savedData)
            .filter(([
              id,
            ]) => {
              const numId = Number(id);
              return !data.some((row) => row.id === numId);
            })
            .forEach(([
              , savedRow,
            ]) => {
              this.emitEvent(EventType.Delete, savedRow);
            });
        }
      }

      this._setSavedData(
        data.reduce((acc, row) => {
          acc[row.id] = row;
          return acc;
        }, {}),
      );
    },
    emitEvent(eventType: EventType, rowData: Row) {
      const ts = Date.now();
      const { id } = rowData;
      this.$emit({
        eventType,
        rowData,
      }, {
        id,
        summary: `${eventType}: ${id}`,
        ts,
      });
    },
  },
  async run() {
    await this.getAndProcessData();
  },
});

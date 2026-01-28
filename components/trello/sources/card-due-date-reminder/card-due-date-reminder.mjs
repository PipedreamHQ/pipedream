import ms from "ms";
import taskScheduler from "../../../pipedream/sources/new-scheduled-tasks/new-scheduled-tasks.mjs";
import constants from "../../common/constants.mjs";
import trello from "../../trello.app.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  key: "trello-card-due-date-reminder",
  name: "Card Due Date Reminder", /* eslint-disable-line pipedream/source-name */
  description: "Emit new event at a specified time before a card is due.",
  version: "0.1.4",
  type: "source",
  dedupe: "unique",
  props: {
    pipedream: taskScheduler.props.pipedream,
    trello,
    db: "$.service.db",
    http: "$.interface.http",
    board: {
      propDefinition: [
        trello,
        "board",
      ],
    },
    timeBefore: {
      type: "string",
      label: "Time Before",
      description: "How far before the due time the event should trigger. For example, `5 minutes`, `10 minutes`, `1 hour`.",
      default: "5 minutes",
      options: constants.NOTIFICATION_TIMES,
      reloadProps: true,
    },
  },
  async additionalProps() {
    const props = {};
    if (this.timeBefore) {
      props.timer = {
        type: "$.interface.timer",
        description: "Poll the API to schedule alerts for any newly created events",
        default: {
          intervalSeconds: ms(this.timeBefore) / 1000,
        },
      };
    }
    return props;
  },
  hooks: {
    async deactivate() {
      const ids = this._getScheduledEventIds();
      if (!ids?.length) {
        return;
      }
      for (const id of ids) {
        if (await this.deleteEvent({
          body: {
            id,
          },
        })) {
          console.log("Cancelled scheduled event");
        }
      }
      this._setScheduledEventIds();
    },
  },
  methods: {
    ...taskScheduler.methods,
    generateMeta({
      id, name: summary,
    }, now) {
      return {
        id,
        summary,
        ts: now,
      };
    },
    _getScheduledEventIds() {
      return this.db.get("scheduledEventIds");
    },
    _setScheduledEventIds(ids) {
      this.db.set("scheduledEventIds", ids);
    },
    _getScheduledCardIds() {
      return this.db.get("scheduledCardIds");
    },
    _setScheduledCardIds(ids) {
      this.db.set("scheduledCardIds", ids);
    },
    _hasDeployed() {
      const result = this.db.get("hasDeployed");
      this.db.set("hasDeployed", true);
      return result;
    },
    emitEvent(card, now) {
      const meta = this.generateMeta(card, now);
      this.$emit(card, meta);
    },
  },
  async run(event) {
    const now = event.timestamp * 1000;

    // self subscribe only on the first time
    if (!this._hasDeployed()) {
      await this.selfSubscribe();
    }

    let scheduledEventIds = this._getScheduledEventIds() || [];

    // incoming scheduled event
    if (event.$channel === this.selfChannel()) {
      const remainingScheduledEventIds = scheduledEventIds.filter((id) => id !== event["$id"]);
      this._setScheduledEventIds(remainingScheduledEventIds);
      this.emitEvent(event, now);
      return;
    }

    // schedule new events
    const scheduledCardIds = this._getScheduledCardIds() || {};
    const cards = await this.trello.getCards({
      boardId: this.board,
    });

    for (const card of cards) {
      const dueDate = card.due
        ? new Date(card.due)
        : null;
      if (!dueDate || dueDate.getTime() < Date.now()) {
        delete scheduledCardIds[card.id];
        continue;
      }

      const later = new Date(dueDate.getTime() - ms(this.timeBefore));

      if (scheduledCardIds[card.id]) {
        // reschedule if card's due date has changed
        if (card.due !== scheduledCardIds[card.id].dueDate) {
          await this.deleteEvent({
            body: {
              id: scheduledCardIds[card.id].eventId,
            },
          });
          scheduledEventIds = scheduledEventIds
            .filter((id) => id !== scheduledCardIds[card.id].eventId);
        } else {
          continue;
        }
      }

      const scheduledEventId = this.emitScheduleEvent(card, later);
      scheduledEventIds.push(scheduledEventId);
      scheduledCardIds[card.id] = {
        eventId: scheduledEventId,
        dueDate: card.due,
      };
    }
    this._setScheduledEventIds(scheduledEventIds);
    this._setScheduledCardIds(scheduledCardIds);
  },
  sampleEmit,
};

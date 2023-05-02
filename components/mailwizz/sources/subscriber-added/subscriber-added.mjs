import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import moment from "moment";
import mailwizz from "../../mailwizz.app.mjs";

export default {
  key: "mailwizz-subscriber-added",
  name: "New Subscriber Added",
  description: "Emit new event when a new subscriber is created.",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    mailwizz,
    db: "$.service.db",
    timer: {
      label: "Polling interval",
      description: "Pipedream will poll the Mailwizz on this schedule",
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    listId: {
      propDefinition: [
        mailwizz,
        "listId",
      ],
      description: "The list uid.",
    },
  },
  methods: {
    _getLastDate () {
      return this.db.get( "lastDate" ) || 0;
    },
    _setLastDate ( lastDate ) {
      this.db.set( "lastDate", lastDate );
    },
    async startEvent ( maxResults ) {
      const lastDate = this._getLastDate();
      const responseArray = [];
      let tempLastDate = lastDate;

      const items = this.mailwizz.paginate( {
        fn: this.mailwizz.listSubscribers,
        args: {
          listId: this.listId,
        },
        maxResults,
      } );

      for await ( const item of items ) {
        const newLastDate = moment( item.date_added ).format( "YYYY-MM-DD HH:mm:ss" );

        if ( moment( newLastDate ).isAfter( lastDate ) ) {
          if ( moment( newLastDate ).isAfter( tempLastDate ) ) {
            tempLastDate = newLastDate;
          }
          responseArray.push( item );
        } else {
          break;
        }
      }

      if ( lastDate != tempLastDate )
        this._setLastDate( tempLastDate );

      for ( const responseItem of responseArray.reverse() ) {
        this.$emit(
          responseItem,
          {
            id: responseItem.subscriber_uid,
            summary: `A new subscriber with email "${responseItem.EMAIL}" was added!`,
            ts: responseItem.date_added,
          },
        );
      }
    },
  },
  hooks: {
    async deploy () {
      await this.startEvent( 25 );
    },
  },
  async run () {
    await this.startEvent();
  },
};

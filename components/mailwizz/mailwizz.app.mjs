import { axios } from "@pipedream/platform";
import qs from "qs";

export default {
  type: "app",
  app: "mailwizz",
  propDefinitions: {
    campaignId: {
      type: "string",
      label: "Campaign UID",
      description: "The campaign UID.",
      async options ( { page } ) {
        const { data } = await this.listCampaigns( {
          params: {
            page: ++page,
          },
        } );

        return data.records.map( ( {
          campaign_uid: value, name: label,
        } ) => ( {
          label,
          value,
        } ) );
      },
    },
    email: {
      type: "string",
      label: "Email",
      description: "The subscriber's email.",
    },
    fname: {
      type: "string",
      label: "First Name",
      description: "The subscriber's first name.",
    },
    lname: {
      type: "string",
      label: "Last Name",
      description: "The subscriber's last name.",
    },
    listId: {
      type: "string",
      label: "List UID",
      description: "The list uid to which this campaign will be sent.",
      async options ( { page } ) {
        const { data } = await this.listLists( {
          params: {
            page: ++page,
          },
        } );

        return data.records.map( ( {
          general: {
            list_uid: value, name: label,
          },
        } ) => ( {
          label,
          value,
        } ) );
      },
    },
    segmentId: {
      type: "string",
      label: "Segment UID",
      description: "Narrow down the campaign recipients.",
      async options ( {
        page, listId,
      } ) {
        if ( listId ) {
          const { data } = await this.listSegments( {
            listId,
            params: {
              page: ++page,
            },
          } );

          return data.records.map( ( {
            segment_uid: value, name: label,
          } ) => ( {
            label,
            value,
          } ) );
        }

        return [];
      },
    },
    subscriberId: {
      type: "string",
      label: "subscriber UID",
      description: "The subscriber uid to which you want to update.",
      async options ( {
        page, listId,
      } ) {
        const { data } = await this.listSubscribers( {
          listId,
          params: {
            page: ++page,
          },
        } );

        return data.records.map( ( {
          subscriber_uid: value, EMAIL: label,
        } ) => ( {
          label,
          value,
        } ) );
      },
    },
    templateId: {
      type: "string",
      label: "Template UID",
      description: "Template unique id from MailWizz.",
      async options ( { page } ) {
        const { data } = await this.listTemplates( {
          params: {
            page: ++page,
          },
        } );

        return data.records.map( ( {
          template_uid: value, name: label,
        } ) => ( {
          label,
          value,
        } ) );
      },
    },
  },
  methods: {
    _apiUrl () {
      return `https://${this.$auth.url}`;
    },
    _getHeaders () {
      return {
        "X-API-KEY": `${this.$auth.api_key}`,
        "Content-Type": "application/x-www-form-urlencoded",
      };
    },
    async _makeRequest ( {
      $ = this, path, data, ...opts
    } ) {
      const config = {
        url: `${this._apiUrl()}/${path}`,
        headers: this._getHeaders(),
        data: qs.stringify( data, {
          format: "RFC1738",
        } ),
        ...opts,
      };

      return axios( $, config );
    },
    createCampaign ( args = {} ) {
      return this._makeRequest( {
        path: "campaigns",
        method: "POST",
        ...args,
      } );
    },
    createSubscriber ( {
      listId, ...args
    } ) {
      return this._makeRequest( {
        path: `lists/${listId}/subscribers`,
        method: "POST",
        ...args,
      } );
    },
    getCampaign ( {
      id, ...args
    } ) {
      return this._makeRequest( {
        path: `campaigns/${id}`,
        ...args,
      } );
    },
    listCampaigns ( args = {} ) {
      return this._makeRequest( {
        path: "campaigns",
        ...args,
      } );
    },
    listLists ( args = {} ) {
      return this._makeRequest( {
        path: "lists",
        ...args,
      } );
    },
    listSegments ( {
      listId, ...args
    } ) {
      return this._makeRequest( {
        path: `lists/${listId}/segments`,
        ...args,
      } );
    },
    listSubscribers ( {
      listId, ...args
    } ) {
      return this._makeRequest( {
        path: `lists/${listId}/subscribers`,
        ...args,
      } );
    },
    listTemplates ( args = {} ) {
      return this._makeRequest( {
        path: "templates",
        ...args,
      } );
    },
    updateSubscriber ( {
      listId, subscriberId, ...args
    } ) {
      return this._makeRequest( {
        path: `lists/${listId}/subscribers/${subscriberId}`,
        method: "PUT",
        ...args,
      } );
    },
    async *paginate ( {
      fn, args = {}, maxResults = null,
    } ) {
      let lastPage = false;
      let count = 0;
      let page = 0;

      do {
        args.params = {
          page: ++page,
        };
        const {
          data: {
            records,
            current_page,
            total_pages,
          },
        } = await fn( args );
        for ( const d of records ) {
          yield d;

          if ( maxResults && ++count === maxResults ) {
            return count;
          }
        }

        lastPage = current_page === total_pages;

      } while ( !lastPage );
    },
  },
};

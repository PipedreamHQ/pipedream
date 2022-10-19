import { axios } from "@pipedream/platform";
import { parseChannelOptions } from "./common/utils.mjs";

export default {
  type: "app",
  app: "vbout",
  propDefinitions: {
    audiences: {
      type: "string[]",
      label: "Audiences",
      description: "IDs of audience campaign recipients.",
      async options() {
        const { audiences: { items } } = await this.getAudiences();

        return items.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    body: {
      type: "string",
      label: "Body",
      description: "Message body.",
    },
    channel: {
      type: "string",
      label: "Channel",
      description: "The channel which the post will be sent to.",
      withLabel: true,
      async options() {
        const channels = await this.getChannels();
        return parseChannelOptions(channels);
      },
    },
    confirmationEmail: {
      type: "string",
      label: "Confirmation Email",
      description: "Confirmation Email Message.",
    },
    confirmationMessage: {
      type: "string",
      label: "Confirmation Message",
      description: "Confirmation Message.",
    },
    contact: {
      type: "string",
      label: "Contact",
      description: "Select the contact you want to move.",
      withLabel: true,
      async options({ listId }) {
        const { contacts: { items } } = await this.getContacts({
          listid: listId,
        });

        return items.map(({
          id: value, email: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    communications: {
      type: "boolean",
      label: "Communications",
      description: "Turn off Communications?",
    },
    description: {
      type: "string",
      label: "Description",
      description: "The description of the activity",
    },
    doubleOptin: {
      type: "boolean",
      label: "Double Optin",
      description: "Email confirmation required (Double opt-in)?",
    },
    emailSubject: {
      type: "string",
      label: "Email Subject",
      description: "The default subscription subject.",
    },
    errorMessage: {
      type: "string",
      label: "Error Message",
      description: "Subscription Error Message.",
    },
    fromEmail: {
      type: "string",
      label: "From Email",
      description: "The From email of the list.",
    },
    fromName: {
      type: "string",
      label: "From Name",
      description: "The From name of the list.",
    },
    ipaddress: {
      type: "string",
      label: "IP Address",
      description: "The ip of the contact.",
    },
    isDraft: {
      type: "boolean",
      label: "Is Draft",
      description: "The flag to set the campaign to draft.",
    },
    isScheduled: {
      type: "boolean",
      label: "Is Scheduled",
      description: "The flag to schedule the campaign for the future.",
    },
    list: {
      type: "string",
      label: "List",
      description: "Select the list to fetch the contacts.",
      withLabel: true,
      async options() {
        const { lists: { items } } = await this.getLists();

        return items.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    listArray: {
      type: "string[]",
      label: "List",
      description: "Select the list to fetch the contacts.",
      async options() {
        const { lists: { items } } = await this.getLists();

        return items.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    message: {
      type: "string",
      label: "Message",
      description: "The post message to be scheduled/sent.",
    },
    name: {
      type: "string",
      label: "Name",
      description: "The name of the list.",
    },
    notify: {
      type: "string",
      label: "Notify",
      description: "Notify me of new subscribers.",
    },
    notifyEmail: {
      type: "string",
      label: "Notify Email",
      description: "Notification Email.",
    },
    photo: {
      type: "string",
      label: "Photo",
      description: "Link of the photo which will be attached to the post.",
    },
    replyTo: {
      type: "string",
      label: "Reply To",
      description: "The Reply to email of the list.",
    },
    scheduledDatetime: {
      type: "string",
      label: "Scheduled Datetime",
      description: "The date and time to schedule the campaign.",
    },
    status: {
      type: "string",
      label: "Status",
      description: "The status of the contact.",
      options: [
        "Active",
        "Disactive",
      ],
    },
    subject: {
      type: "string",
      label: "Subject",
      description: "The subject line for the campaign.",
    },
    successEmail: {
      type: "string",
      label: "Success Email",
      description: "Subscription Success Email.",
    },
    successMessage: {
      type: "string",
      label: "Success Message",
      description: "Subscription Success Message.",
    },
    trackableLinks: {
      type: "boolean",
      label: "Trackable Links",
      description: "Convert all links inside message to short urls.",
    },
    type: {
      type: "string",
      label: "Type",
      description: "The type of the campaign.",
      options: [
        "standard",
        "automated",
      ],
    },
  },
  methods: {
    _apiUrl() {
      return "https://api.vbout.com/1";
    },
    _apiKey() {
      return this.$auth.api_key;
    },
    _getParams(params) {
      return {
        key: this._apiKey(),
        ...params,
      };
    },
    async _makeRequest({
      $ = this, path, params, ...opts
    }) {
      const config = {
        url: `${this._apiUrl()}/${path}`,
        params: this._getParams(params),
        ...opts,
      };

      return await axios($, config);
    },
    async *paginate({
      fn, params = {}, field,
    }) {
      const { limit } = params;
      let count = 0;
      let lastPage = 0;

      do {
        params.page = ++count;
        const data = await fn(params);
        const {
          count: total, items,
        } = data[field];

        const fetchedItems = await this.fetchItems({
          items,
        });

        for (const d of fetchedItems) {
          yield d;

          if (limit && count === limit) {
            return count;
          }
        }
        lastPage = total;

      } while (lastPage);
    },
    async fetchItems({
      items, func, params,
    }) {
      let it, co;
      if (!items) {
        const {
          items, count,
        } = await func(params);
        it = items;
        co = count;
      } else {
        it = items;
        co = items.length || Object.keys(items).length;
      }

      try {
        return it.reverse();
      } catch (e) {
        const newArray = [];
        let i = co;
        do {
          newArray.push(it[i]);
        } while (it[--i]);

        return newArray.reverse();
      }
    },
    async createEmailList({
      $, ...data
    }) {
      return await this._makeRequest({
        $,
        path: "emailmarketing/addlist",
        method: "POST",
        data,
      });
    },
    async getLists() {
      const { response } = await this._makeRequest({
        path: "emailmarketing/getLists",
        method: "GET",
      });

      return response?.data;
    },
    async getList(params) {
      const { response } = await this._makeRequest({
        path: "emailmarketing/getlist",
        method: "GET",
        params,
      });

      return response?.data;
    },
    async getContacts(params) {
      const { response } = await this._makeRequest({
        path: "emailmarketing/getContacts",
        method: "GET",
        params,
      });

      return response?.data;
    },
    async getContact(params) {
      const { response } = await this._makeRequest({
        path: "emailmarketing/getContact",
        method: "GET",
        params,
      });

      return response?.data;
    },
    async getAudiences(params) {
      const { response } = await this._makeRequest({
        path: "emailmarketing/getaudiences",
        method: "GET",
        params,
      });

      return response?.data;
    },
    async getCampaigns(params) {
      const { response } = await this._makeRequest({
        path: "emailmarketing/campaigns",
        method: "GET",
        params,
      });

      return response?.data;
    },
    async getChannels(params) {
      const { response } = await this._makeRequest({
        path: "socialmedia/channels",
        method: "GET",
        params,
      });

      return response?.data;
    },
    async getCalendar(params) {
      const { response } = await this._makeRequest({
        path: "socialmedia/calendar",
        method: "GET",
        params,
      });

      return response?.data;
    },
    async moveContact({
      $, ...params
    }) {
      return await this._makeRequest({
        $,
        path: "emailmarketing/movecontact",
        method: "POST",
        params,
      });
    },
    async syncContact({
      $, ...params
    }) {
      return await this._makeRequest({
        $,
        path: "emailmarketing/synccontact",
        method: "POST",
        params,
      });
    },
    async updateContact({
      $, ...params
    }) {
      return await this._makeRequest({
        $,
        path: "emailmarketing/editcontact",
        method: "POST",
        params,
      });
    },
    async addActivity({
      $, ...params
    }) {
      return await this._makeRequest({
        $,
        path: "emailmarketing/addactivity",
        method: "POST",
        params,
      });
    },
    async createCampaign({
      $, ...params
    }) {
      return await this._makeRequest({
        $,
        path: "emailmarketing/addcampaign",
        method: "POST",
        params,
      });
    },
    async createPost({
      $, ...params
    }) {
      return await this._makeRequest({
        $,
        path: "socialmedia/addpost",
        method: "POST",
        params,
      });
    },
  },
};

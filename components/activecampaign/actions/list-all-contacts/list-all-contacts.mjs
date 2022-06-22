// legacy_hash_id: a_bKilj2
import { axios } from "@pipedream/platform";

export default {
  key: "activecampaign-list-all-contacts",
  name: "List All Contacts",
  description: "Retrieve all existing contacts.",
  version: "0.1.2",
  type: "action",
  props: {
    activecampaign: {
      type: "app",
      app: "activecampaign",
    },
    ids: {
      type: "string",
      description: "Filter contacts by ID. Can be repeated for multiple IDs. Example: ids[]=1&ids[]=2&ids[]=42",
      optional: true,
    },
    email: {
      type: "string",
      description: "Email address of the contact you want to get",
      optional: true,
    },
    email_like: {
      type: "string",
      description: "Filter contacts that contain the given value in the email address",
      optional: true,
    },
    exclude: {
      type: "string",
      description: "Exclude from the response the contact with the given ID",
      optional: true,
    },
    formid: {
      type: "string",
      description: "Filter contacts associated with the given form",
      optional: true,
    },
    id_greater: {
      type: "string",
      description: "Only include contacts with an ID greater than the given ID",
      optional: true,
    },
    id_less: {
      type: "string",
      description: "Only include contacts with an ID less than the given ID",
      optional: true,
    },
    listid: {
      type: "string",
      description: "Filter contacts associated with the given list",
      optional: true,
    },
    organization: {
      type: "string",
      description: "(Deprecated) Please use Account-Contact end points. Filter contacts associated with the given organization ID",
      optional: true,
    },
    search: {
      type: "string",
      description: "Filter contacts that match the given value in the contact names, organization, phone or email",
      optional: true,
    },
    segmentid: {
      type: "string",
      description: "Return only contacts that match a list segment (this param initially returns segment information, when it is run a second time it will return contacts that match the segment)",
      optional: true,
    },
    seriesid: {
      type: "string",
      description: "Filter contacts associated with the given automation",
      optional: true,
    },
    status: {
      type: "string",
      description: "See [available values](https://developers.activecampaign.com/reference#section-contact-parameters-available-values)",
      optional: true,
    },
    tagid: {
      type: "string",
      description: "Filter contacts associated with the given tag",
      optional: true,
    },
    created_before: {
      type: "string",
      description: "Filter contacts that were created prior to this date",
      optional: true,
    },
    created_after: {
      type: "string",
      description: "Filter contacts that were created after this date",
      optional: true,
    },
    updated_before: {
      type: "string",
      description: "Filter contacts that were updated before this date",
      optional: true,
    },
    updated_after: {
      type: "string",
      description: "Filter contacts that were updated after this date",
      optional: true,
    },
    waitid: {
      type: "string",
      description: "Filter by contacts in the wait queue of an automation block",
      optional: true,
    },
    cdate: {
      type: "string",
      description: "Order contacts by creation date",
      optional: true,
      options: [
        "ASC",
        "DESC",
      ],
    },
    oemail: {
      type: "string",
      description: "Order contacts by email",
      optional: true,
      options: [
        "ASC",
        "DESC",
      ],
    },
    first_name: {
      type: "string",
      description: "Order contacts by first name",
      optional: true,
      options: [
        "ASC",
        "DESC",
      ],
    },
    last_name: {
      type: "string",
      description: "Order contacts by last name",
      optional: true,
      options: [
        "ASC",
        "DESC",
      ],
    },
    name: {
      type: "string",
      description: "Order contacts by full name",
      optional: true,
      options: [
        "ASC",
        "DESC",
      ],
    },
    score: {
      type: "string",
      description: "Order contacts by score",
      optional: true,
      options: [
        "ASC",
        "DESC",
      ],
    },
    in_group_lists: {
      type: "string",
      description: "Set this to `true` in order to return only contacts that the current user has permissions to see.",
      optional: true,
      options: [
        "ASC",
        "DESC",
      ],
    },
  },
  async run({ $ }) {
  //See the API docs: https://developers.activecampaign.com/reference#list-all-contacts

    const config = {
      url: `${this.activecampaign.$auth.base_url}/api/3/contacts`,
      headers: {
        "Api-Token": `${this.activecampaign.$auth.api_key}`,
      },
      params: {
        "ids": this.ids,
        "email": this.email,
        "email_like": this.email_like,
        "exclude": this.exclude,
        "formid": this.formid,
        "id_greater": this.id_greater,
        "id_less": this.id_less,
        "listid": this.listid,
        "organization": this.organization,
        "search": this.search,
        "segmentid": this.segmentid,
        "seriesid": this.seriesid,
        "status": this.status,
        "tagid": this.tagid,
        "filters[created_before]": this.created_before,
        "filters[created_after]": this.created_after,
        "filters[updated_before]": this.updated_before,
        "filters[updated_after]": this.updated_after,
        "waitid": this.waitid,
        "orders[cdate]": this.cdate,
        "orders[email]": this.oemail,
        "orders[first_name]": this.first_name,
        "orders[last_name]": this.last_name,
        "orders[name]": this.name,
        "orders[score]": this.score,
        "in_group_lists": this.in_group_lists,
      },
    };

    return await axios($, config);
  },
};

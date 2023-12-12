import {
  ApiClient, ListsSegments,
} from "klaviyo-sdk";

export default {
  type: "app",
  app: "klaviyo",
  propDefinitions: {
    list: {
      type: "string",
      label: "List",
      description: "The list which will be affected.",
      withLabel: true,
      async options() {
        const lists = await this.getLists();
        return lists.map(({
          list_id: value, list_name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    listName: {
      type: "string",
      label: "List Name",
      description: "The name of the new list.",
    },
    email: {
      type: "string",
      label: "Email",
      description: "The contact's email.",
    },
    phone: {
      type: "string",
      label: "Phone Number",
      description: "The contact's phone number.",
    },
    externalId: {
      type: "string",
      label: "External Id",
      description: "A unique external Id which identifies the profile.",
    },
    title: {
      type: "string",
      label: "Title",
      description: "The member's title.",
    },
    organization: {
      type: "string",
      label: "Organization",
      description: "The member's organization.",
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "The member's first name.",
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "The member's last name.",
    },
    image: {
      type: "string",
      label: "Image",
      description: "A URL image to member's profile.",
    },
    address1: {
      type: "string",
      label: "Address 1",
      description: "The member's address.",
    },
    address2: {
      type: "string",
      label: "Address 2",
      description: "The member's address 2.",
    },
    city: {
      type: "string",
      label: "City",
      description: "The member's city.",
    },
    country: {
      type: "string",
      label: "Country",
      description: "The member's country.",
    },
    latitude: {
      type: "string",
      label: "Latitude",
      description: "The member's latitude.",
    },
    longitude: {
      type: "string",
      label: "Longitude",
      description: "The member's longitude.",
    },
    region: {
      type: "string",
      label: "Region",
      description: "The member's region.",
    },
    zip: {
      type: "string",
      label: "Zip",
      description: "The member's zip.",
    },
    timezone: {
      type: "string",
      label: "Timezone",
      description: "The member's timezone.",
    },
  },
  methods: {
    sdk() {
      // Klaviyo sdk setup
      const defaultClient = ApiClient.instance;
      // Configure API key authorization: ApiKeyAuth
      const ApiKeyAuth = defaultClient.authentications["ApiKeyAuth"];
      ApiKeyAuth.apiKey = this.$auth.api_key;
    },
    async newList(data) {
      this.sdk();
      return await ListsSegments.createList(data);
    },
    async getLists() {
      this.sdk();
      return await ListsSegments.getLists();
    },
    async addMemberToList(listId, body) {
      this.sdk();
      return await ListsSegments.addMembers(listId, body);
    },
  },
};

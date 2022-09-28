import { defineApp } from "@pipedream/types";
import api from "api";
import listCustomers from "../actions/list-customers/list-customers";

export default defineApp({
  type: "app",
  app: "waitwhile",
  propDefinitions: {
    addTag: {
      label: "Add Tag",
      type: "string",
      optional: true,
      description: "Adds specified tag to existing tags",
    },
    customerId: {
      label: "Customer ID",
      type: "string",
      description: "Identifier of customer, automatically derived from visitor contact information if not provided.",
      async options({prevContext}){
        const{prevEndAt} = prevContext
        const {endAt, customers} = await this.listCustomers({startAfter: prevEndAt});
        return {
          options: customers.map((customer) => ({
            label: customer.name,
            value: customer.id,
          })),
          context : {
            prevEndAt: endAt
          }
        };
      },
    },
    customerNoteId: {
      label: "Customer Note ID",
      type: "string",
      description: "Identifier of customer-note",
      async options({customerId}){
        const {notes} = await this.listCustomerNoteEntries({customerId: customerId});
        return {
          options: notes.map((note) => ({
            label: note.createdByName,
            value: note.id,
          })),
        };
      },
    },
    desc: {
      label: "Desc",
      type: "boolean",
      optional: true,
      description: "Show result in descending order",
    },
    email: {
      label: "Email",
      type: "string",
      description: "Email address",
    },
    externalId: {
      label: "External Id",
      type: "string",
      optional: true,
      description: "External identifier, optionally provided by client",
    },
    firstName: {
      label: "First Name",
      type: "string",
      description: "First name of customer",
    },
    fromDate: {
      label: "From Date",
      type: "string",
      optional: true,
      description: "Date in ISO-8601 format",
    },
    fromTime: {
      label: "From Time",
      type: "string",
      optional: true,
      description: "Date in ISO-8601 format",
    },
    inviteId: {
      label: "Invite ID",
      type: "string",
      description: "Unique identifier",
      async options({prevContext}){
        const{prevEndAt} = prevContext
        const {endAt, invites} = await this.listInvites({startAfter: prevEndAt});
        return {
          options: invites.map((invite) => ({
            label: invite.name,
            value: invite.id,
          })),
          context : {
            prevEndAt: endAt
          }
        };
      }
    },
    lastName: {
      label: "Last Name",
      type: "string",
      description: "Last name of customer",
    },
    limit: {
      label: "Limit",
      type: "string",
      description: "Max number of results",
    },
    locationId: {
      label: "Location ID",
      type: "string",
      description: "Identifier of location",
      async options({prevContext}){
        const{prevEndAt} = prevContext
        const {endAt, locationIds} = await this.listLocations({startAfter: prevEndAt});
        return {
          options: locationIds.map((locationId) => ({
            label: locationId.name,
            value: locationId.id,
          })),
          context : {
            prevEndAt: endAt
          }
        };
      },
    },
    name: {
      label: "Name",
      type: "string",
      description: "Name",
    },
    phone: {
      label: "Phone",
      type: "string",
      description: "Phone number in E.164 format",
    },
    resourceId: {
      label: "Resource ID",
      type: "string",
      description: "Identifier of resource",
      async options({prevContext}){
        const{prevEndAt} = prevContext
        const {endAt, resources} = await this.listResources({startAfter: prevEndAt});
        return {
          options: resources.map((resource) => ({
            label: resource.name,
            value: resource.id,
          })),
          context : {
            prevEndAt: endAt
          }
        };
      },

    },
    removeTag: {
      label: "Remove Tag",
      type: "string",
      optional: true,
      description: "Removes specified tag to existing tags",
      
    },
    startAfter: {
      label: "Start After",
      type: "string",
      optional: true,
      description: "Identifier(s) or value(s) to paginate results (comma-separated)",
    },
    tag: {
      label: "Tag",
      type: "string",
      optional: true,
      description: "Tag associated with visit",
    },
    toDate: {
      label: "To Date",
      type: "string",
      optional: true,
      description: "Date in ISO-8601 format",
    },
    visitId: {
      label: "Visit ID",
      type: "string",
      optional: true,
      description: "Identifier of visit",
      async options({prevContext}){
        const{prevEndAt} = prevContext
        const {endAt, visits} = await this.listVisits({startAfter: prevEndAt});
        return {
          options: visits.map((visit) => ({
            label: visit.name,
            value: visit.id,
          })),
          context : {
            prevEndAt: endAt
          }
        };
      },
    },
  },
  methods: {
    // this.$auth contains connected account data
    authKeys() {
      console.log(this.$auth);
    },
    _authToken() {
      return this.$auth.api_key;
    },
    _client() {
      const sdk = api("@waitwhile/v2#5t18rl5qsy3p0");
      sdk.auth(this._authToken());
      return sdk;
    },
    async createCustomers(params: Record<string, unknown>): Promise<any> {
      return await this._client().postCustomers(params);
    },
    async listCustomers(params: Record<string, unknown>): Promise<any> {
      return await this._client().getCustomers(params);
    },
    async exportCustomers(params: Record<string, unknown>): Promise<any> {
      return await this._client().getCustomersExport(params);
    },
    async searchCustomers(params: Record<string, unknown>): Promise<any> {
      return await this._client().getCustomersSearch(params);
    },
    async retrieveCustomer(customerId: string): Promise<any> {
      return await this._client().getCustomersCustomerid(customerId);
    },
    async updateCustomer(params: Record<string, unknown>): Promise<any> {
      return await this._client().postCustomersCustomerid(params);
    },
    async removeCustomer(customerId: string): Promise<any> {
      return await this._client().deleteCustomersCustomerid(customerId);
    },
    async listCustomerNoteEntries(customerId: string): Promise<any> {
      return await this._client().getCustomersCustomeridNote(customerId);
    },
    async addCustomerNoteEntry(options: Record<string, unknown>, params: Record<string, unknown> ): Promise<any> {
      return await this._client().postCustomersCustomeridNotes(options, params);
    },
    async getCustomerNoteById(params: Record<string, unknown>): Promise<any> {
      return await this._client().getCustomersCustomeridNotesCustomernoteid(params);
    },
    async importCustomers(params: Record<string, unknown>): Promise<any> {
      return await this._client().postCustomersImport(params);
    },
    async updateCustomerNoteEntry(params: Record<string, unknown>): Promise<any> {
      return await this._client().postCustomersCustomeridNotesNoteid(params);
    },
    async deleteCustomerNoteEntry(params: Record<string, unknown>): Promise<any> {
      return await this._client().deleteCustomersCustomeridNotesNoteid(params);
    },
    async listUserInvites(params: Record<string, unknown>): Promise<any> {
      return await this._client().getInvites(params);
    },
    async createUserInvite(params: Record<string, unknown>): Promise<any> {
      return await this._client().postInvites(params);
    },
    async retrieveUserInvite(inviteId: string): Promise<any> {
      return await this._client().getInvitesInviteid(inviteId);
    },
    async removeUserInvite(inviteId: string): Promise<any> {
      return await this._client().deleteInvitesInviteid(inviteId);
    },
    async resendUserInvite(inviteId: string): Promise<any> {
      return await this._client().postInvitesInviteidResend(inviteId);
    },
    async listLocations(options: Record<string, unknown>): Promise<any> {
      return await this._client().getLocations(options);
    },
    async listVisits(options: Record<string, unknown>): Promise<any> {
      return await this._client().getVisits(options);
    },
    async listResources(options: Record<string, unknown>): Promise<any> {
      return await this._client().getResources(options);
    },
    async listInvites(options: Record<string, unknown>): Promise<any> {
      return await this._client().getInvites(options);
    }
  },
});

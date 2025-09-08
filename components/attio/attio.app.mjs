import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "attio",
  propDefinitions: {
    firstName: {
      type: "string",
      label: "First Name",
      description: "The person's first name.",
      optional: true,
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "The person's last name.",
      optional: true,
    },
    emailAddress: {
      type: "string",
      label: "Email",
      description: "The contact's email address.",
      optional: true,
    },
    description: {
      type: "string",
      label: "Description",
      description: "A description of the person.",
      optional: true,
    },
    jobTitle: {
      type: "string",
      label: "Job Title",
      description: "The person's job title.",
      optional: true,
    },
    phoneNumber: {
      type: "string",
      label: "Phone Number",
      description: "The person's phone number which is either a) prefixed with a country code (e.g. `+44....`) or b) a local number, where **Phone Number - Country Code** is specified in addition.",
      optional: true,
    },
    phoneNumberCountryCode: {
      type: "string",
      label: "Phone Number - Country Code",
      description: "The country code for the phone number.",
      optional: true,
    },
    linkedin: {
      type: "string",
      label: "LinkedIn",
      description: "The person's LinkedIn profile URL.",
      optional: true,
    },
    twitter: {
      type: "string",
      label: "Twitter",
      description: "The person's Twitter handle.",
      optional: true,
    },
    facebook: {
      type: "string",
      label: "Facebook",
      description: "The person's Facebook profile URL.",
      optional: true,
    },
    instagram: {
      type: "string",
      label: "Instagram",
      description: "The person's Instagram profile URL.",
      optional: true,
    },
    recordId: {
      type: "string",
      label: "Record ID",
      description: "Identifier of a record",
      async options({
        page,
        targetObject = constants.TARGET_OBJECT.COMPANIES,
        sorts = [
          {
            direction: "desc",
            attribute: "created_at",
            field: "value",
          },
        ],
        mapper = ({
          id: { record_id: value },
          values: { name },
        }) => ({
          value,
          label: name[0]?.value || name[0]?.full_name,
        }),
      }) {
        const { data } = await this.listRecords({
          targetObject,
          data: {
            limit: constants.DEFAULT_LIMIT,
            offset: page * constants.DEFAULT_LIMIT,
            sorts,
          },
        });
        return data?.map(mapper);
      },
    },
    workspaceMemberId: {
      type: "string",
      label: "Workspace Member ID",
      description: "The identifier of a workspace member",
      async options({
        mapper = ({
          id: { workspace_member_id: value },
          first_name: firstName,
          last_name: lastName,
        }) => ({
          value,
          label: `${firstName || ""} ${lastName || ""}`.trim(),
        }),
      }) {
        const { data } = await this.listWorkspaceMembers();
        return data?.map(mapper) || [];
      },
    },
    listId: {
      type: "string",
      label: "List ID",
      description: "The identifier of a list",
      async options() {
        const { data } = await this.listLists();
        return data?.map(({
          id: { list_id: value }, name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    entryId: {
      type: "string",
      label: "Entry ID",
      description: "The identifier of a list entry",
      async options({
        listId, page,
      }) {
        const { data } = await this.listEntries({
          listId,
          params: {
            limit: constants.DEFAULT_LIMIT,
            offset: page * constants.DEFAULT_LIMIT,
          },
        });
        return data?.map(({ id: { entry_id: value } }) => value) || [];
      },
    },
    objectId: {
      type: "string",
      label: "Object ID",
      description: "The identifier of an object",
      async options({
        filter = () => true,
        mapper = ({
          id: { object_id: value }, singular_noun: label,
        }) => ({
          value,
          label,
        }),
      }) {
        const { data } = await this.listObjects();
        return data?.filter(filter)?.map(mapper) || [];
      },
    },
    matchingAttribute: {
      type: "string",
      label: "Matching Attribute",
      description: "The ID or slug of the attribute to use to check if a record already exists. The attribute must be unique.",
      async options({
        objectId, page,
      }) {
        const { data } = await this.listAttributes({
          objectId,
          params: {
            limit: constants.DEFAULT_LIMIT,
            offset: page * constants.DEFAULT_LIMIT,
          },
        });
        return data
          ?.filter((attribute) => attribute.is_unique && attribute.api_slug !== "record_id")
          ?.map(({
            api_slug: value, title: label,
          }) => ({
            value,
            label,
          })) || [];
      },
    },
  },
  methods: {
    getUrl(path) {
      return `${constants.BASE_URL}${constants.VERSION_PATH}${path}`;
    },
    getHeaders(headers) {
      return {
        ...headers,
        "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
      };
    },
    _makeRequest({
      $ = this, path, headers, ...args
    }) {
      return axios($, {
        ...args,
        url: this.getUrl(path),
        headers: this.getHeaders(headers),
      });
    },
    post(args = {}) {
      return this._makeRequest({
        method: "POST",
        ...args,
      });
    },
    patch(args = {}) {
      return this._makeRequest({
        method: "PATCH",
        ...args,
      });
    },
    put(args = {}) {
      return this._makeRequest({
        method: "PUT",
        ...args,
      });
    },
    delete(args = {}) {
      return this._makeRequest({
        method: "DELETE",
        ...args,
      });
    },
    listWorkspaceMembers(args = {}) {
      return this._makeRequest({
        path: "/workspace_members",
        ...args,
      });
    },
    listRecords({
      targetObject, ...args
    } = {}) {
      return this.post({
        path: `/objects/${targetObject}/records/query`,
        ...args,
      });
    },
    createRecord({
      targetObject, ...args
    } = {}) {
      return this.post({
        path: `/objects/${targetObject}/records`,
        ...args,
      });
    },
    updateRecord({
      targetObject, recordId, ...args
    } = {}) {
      return this.patch({
        path: `/objects/${targetObject}/records/${recordId}`,
        ...args,
      });
    },
    upsertRecord({
      objectId, ...opts
    }) {
      return this.put({
        path: `/objects/${objectId}/records`,
        ...opts,
      });
    },
    listAttributes({
      objectId, ...args
    } = {}) {
      return this._makeRequest({
        path: `/objects/${objectId}/attributes`,
        ...args,
      });
    },
    listLists(args = {}) {
      return this._makeRequest({
        path: "/lists",
        ...args,
      });
    },
    listEntries({
      listId, ...args
    } = {}) {
      return this.post({
        path: `/lists/${listId}/entries/query`,
        ...args,
      });
    },
    listObjects(args = {}) {
      return this._makeRequest({
        path: "/objects",
        ...args,
      });
    },
    getRecord({
      objectId, recordId, ...args
    }) {
      return this._makeRequest({
        path: `/objects/${objectId}/records/${recordId}`,
        ...args,
      });
    },
  },
};

import {
  Client as PlivoClient,
  Response as PlivoResponse,
  validateSignature,
} from "plivo";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "plivo",
  propDefinitions: {
    phoneNumber: {
      type: "string",
      label: "Phone Number",
      description: "Phone number that you've rented from Plivo.",
      async options({
        prevContext,
        mapper = ({
          alias, number: value,
        }) => ({
          label: alias && `${value} (${alias})` || value,
          value,
        }),
      }) {
        return this.paginateOptions({
          prevContext,
          resourcesFn: this.listAccountPhoneNumbers,
          mapper,
        });
      },
    },
    callUuid: {
      type: "string",
      label: "Call UUID",
      description: "The unique identifier of the call.",
      async options({
        prevContext,
        mapper = ({ callUuid: value }) => value,
      }) {
        return this.paginateOptions({
          prevContext,
          resourcesFn: this.listCalls,
          mapper,
        });
      },
    },
    text: {
      type: "string",
      label: "Text",
      description: "The text of the SMS/MMS message.",
    },
  },
  methods: {
    getAuthId() {
      return this.$auth.auth_id;
    },
    getAuthToken() {
      return this.$auth.auth_token;
    },
    buildXMLMessageResponse(body) {
      const response = PlivoResponse();
      response.addMessage(body);
      return response.toXML();
    },
    isSignatureValid({
      url, nonce, signature,
    }) {
      const authToken = this.getAuthToken();
      return validateSignature(url, nonce, signature, authToken);
    },
    client() {
      return new PlivoClient(this.getAuthId(), this.getAuthToken());
    },
    async makeRequest({
      path = "", args = [],
    } = {}) {
      const props = path.split(".");

      const sdk = props.reduce((reduction, prop, idx) => {
        if (idx === props.length - 1) {
          return reduction[prop](...args);
        }
        return reduction[prop];
      }, this.client());

      try {
        return await sdk;
      } catch (error) {
        console.log(`Error calling ${path}`, error);
        throw error;
      }
    },
    listCalls(args = []) {
      return this.makeRequest({
        path: "calls.list",
        args,
      });
    },
    makeOutboundCall(args = []) {
      return this.makeRequest({
        path: "calls.create",
        args,
      });
    },
    sendMessage(args = []) {
      return this.makeRequest({
        path: "messages.create",
        args,
      });
    },
    listAccountPhoneNumbers(args = []) {
      return this.makeRequest({
        path: "numbers.list",
        args,
      });
    },
    async paginateOptions({
      prevContext, resourcesFn, mapper,
    }) {
      const offset = prevContext?.offset || 0;
      const resources =
        await resourcesFn([
          {
            limit: constants.DEFAULT_LIMIT,
            offset,
          },
        ]);

      const options = resources?.map(mapper);

      return {
        options,
        context: {
          offset: offset + resources?.length,
        },
      };
    },
    async *getResourcesStream({
      resourcesFn,
      resourcesFnArgs,
      max = constants.MAX_RESOURCES,
    }) {
      let offset = 0;
      let resourcesCount = 0;

      while (true) {
        const nextResources =
          await resourcesFn([
            {
              offset,
              ...resourcesFnArgs,
            },
          ]);

        if (!nextResources?.length) {
          console.log("No more resources");
          return;
        }

        for (const resource of nextResources) {
          yield resource;
          resourcesCount += 1;

          if (resourcesCount >= max) {
            return;
          }
        }

        offset += nextResources.length;
      }
    },
  },
};

import { defineApp } from "@pipedream/types";
import constants from "./common/constants";
import {
  Configuration,
  AddressesApi,
  Address,
  AddressEditable,
  PostcardsApi,
  Postcard,
  PostcardEditable,
} from "@lob/lob-typescript-sdk";

export default defineApp({
  type: "app",
  app: "lob",
  propDefinitions: {
    postcardId: {
      type: "string",
      label: "Postcard",
      async options() {
        const postcards = await this.listAllPostcards();
        return postcards.map(({
          id, description,
        }) => ({
          label: description,
          value: id,
        }));
      },
    },
  },
  methods: {
    _authConfig(): Configuration {
      return new Configuration({
        username: this.$auth.secret_api_key,
      });
    },
    _postcardsApi(): PostcardsApi {
      return new PostcardsApi(this._authConfig());
    },
    _addressApi(): AddressesApi {
      return new AddressesApi(this._authConfig());
    },
    async listAllAddresses(): Promise<Array<Address>> {
      return this.paginate(this._addressApi());
    },
    async createAddress(opts = {}): Promise<Address> {
      const addressApi: AddressesApi = this._addressApi();
      const addressCreate = new AddressEditable(opts);
      return addressApi.create(addressCreate);
    },
    async listAllPostcards(): Promise<Array<Postcard>> {
      return this.paginate(this._postcardsApi());
    },
    async createPostcard(opts = {}) {
      const postCardApi: PostcardsApi = this._postcardsApi();
      const postcard = new PostcardEditable(opts);
      return postCardApi.create(postcard);
    },
    async retrievePostcard(id: string) {
      const postCardApi: PostcardsApi = this._postcardsApi();
      return postCardApi.get(id);
    },
    async cancelPostcard(id: string) {
      const postCardApi: PostcardsApi = this._postcardsApi();
      return postCardApi.cancel(id);
    },
    async paginate(api) {
      let nextPageToken: string;
      const list = [];
      do {
        const response = await api.list(constants.MAX_LIMIT, undefined, nextPageToken);
        list.push(...response.data);
        nextPageToken = response.nextPageToken;
      } while (nextPageToken);
      return list;
    },
  },
});

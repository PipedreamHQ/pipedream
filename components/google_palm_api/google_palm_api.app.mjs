import {
  ModelServiceClient,
  TextServiceClient,
  DiscussServiceClient,
} from "@google-ai/generativelanguage";
import { GoogleAuth } from "google-auth-library";

export default {
  type: "app",
  app: "google_palm_api",
  propDefinitions: {},
  methods: {
    authClient() {
      return {
        authClient: new GoogleAuth().fromAPIKey(this.$auth.palm_api_key),
      };
    },
    modelClient() {
      return new ModelServiceClient(this.authClient());
    },
    textClient() {
      return new TextServiceClient(this.authClient());
    },
    discussClient() {
      return new DiscussServiceClient(this.authClient());
    },
    async generateText(text) {
      return this.textClient()
        .generateText({
          model: "models/text-bison-001",
          prompt: {
            text,
          },
        });
    },
    async embedText(text) {
      return this.textClient()
        .embedText({
          model: "models/embedding-gecko-001",
          text,
        });
    },
    async chat(opts) {
      return this.discussClient()
        .generateMessage({
          ...opts,
          model: "models/chat-bison-001",
        });
    },
  },
};

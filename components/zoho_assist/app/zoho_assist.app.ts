import { defineApp } from "@pipedream/types";

export default defineApp({
  type: "app",
  app: "zoho_assist",
  propDefinitions: {},
  methods: {
    async uploadMedia(args: UploadMediaParams): Promise<object> {
      return this._httpRequest({
        baseURL: "https://upload.twitter.com/1.1",
        url: "/media/upload.json",
        method: "POST",
        headers: {
          "Content-Type": `multipart/form-data; boundary=${args.data.getBoundary()}`,
        },
        specialAuth: true,
        ...args,
      });
    },
  },
});
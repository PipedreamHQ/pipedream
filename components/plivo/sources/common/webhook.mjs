import common from "./base.mjs";
import utils from "../../common/utils.mjs";

export default {
  ...common,
  props: {
    ...common.props,
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
  },
  methods: {
    ...common.methods,
    createApplication(args = []) {
      return this.app.makeRequest({
        path: "applications.create",
        args,
      });
    },
    deleteApplication(args = []) {
      return this.app.makeRequest({
        path: "applications.delete",
        args,
      });
    },
    updatePhoneNumber(args = []) {
      return this.app.makeRequest({
        path: "numbers.update",
        args,
      });
    },
  },
  hooks: {
    async deploy() {
      console.log("Retrieving historical events...");
      const stream = this.app.getResourcesStream({
        resourcesFn: this.getResourcesFn(),
        resourcesFnArgs: this.getResourcesFnArgs(),
      });

      const resources = await utils.streamIterator(stream);

      const [
        lastResource,
      ] = resources;

      if (lastResource?.messageTime) {
        this.setLastMessageTime(lastResource.messageTime);
      }

      resources
        .filter(this.isResourceRelevant)
        .reverse()
        .forEach((resource) =>
          this.$emit(resource, this.generateMeta(resource)));
    },
    async activate() {
      const { endpoint: url } = this.http;

      const { appId } =
        await this.createApplication([
          this.getApplicationName(),
          {
            message_url: url,
          },
        ]);

      await this.updatePhoneNumber([
        this.getPhoneNumber(),
        {
          app_id: appId,
        },
      ]);

      this.setAppId(appId);
    },
    async deactivate() {
      const appId = this.getAppId();
      if (appId) {
        await this.deleteApplication([
          appId,
        ]);
        this.setAppId(null);
      }
    },
  },
  async run({
    headers, body,
  }) {
    const {
      host,
      ["x-plivo-signature-v2"]: signature,
      ["x-plivo-signature-v2-nonce"]: nonce,
    } = headers;

    const isValid = this.app.isSignatureValid({
      url: `https://${host}`,
      nonce,
      signature,
    });

    if (!isValid) {
      console.log("Invalid signature");
      return this.http.respond({
        status: 410,
        headers: {
          "Content-Type": "text/xml",
        },
        body: this.app.buildXMLMessageResponse("Pipedream invalid signature"),
      });
    }

    this.http.respond({
      status: 200,
      headers: {
        "Content-Type": "text/xml",
      },
      body: this.app.buildXMLMessageResponse("Pipedream message received"),
    });

    this.$emit(body, this.generateMeta(body));
  },
};

import {
  NETWORK_OPTIONS, TECHNOLOGY_OPTIONS,
} from "../../common/constants.mjs";
import overledger from "../../overledger.app.mjs";

export default {
  props: {
    overledger,
    environment: {
      propDefinition: [
        overledger,
        "environment",
      ],
    },
    db: "$.service.db",
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    locationTechnology: {
      type: "string",
      label: "Location Technology",
      description: "The technology of the blockchain that the transaction will be submitted to",
      options: TECHNOLOGY_OPTIONS,
      reloadProps: true,
    },
  },
  async additionalProps() {
    const props = {};
    if (this.locationTechnology) {
      props.locationNetwork = {
        type: "string",
        label: "Location Network",
        description: "The blockchain network the transaction will be submitted to.",
        options: NETWORK_OPTIONS[this.locationTechnology],
      };
    }
    return props;
  },
  hooks: {
    async activate() {
      const response = await this.overledger.createHook({
        path: this.getPath(),
        environment: this.environment,
        data: {
          location: {
            technology: this.locationTechnology,
            network: this.locationNetwork,
          },
          callbackUrl: this.http.endpoint,
          ...this.additionalData(),
        },
      });
      this.db.set("webhookId", response.webhookId);
    },
    async deactivate() {
      const webhookId = this.db.get("webhookId");
      await this.overledger.deleteHook({
        path: this.getPath(),
        webhookId,
        environment: this.environment,
      });
    },
  },
  async run(event) {
    const { body } = event;

    this.$emit(body, {
      id: body.transactionId || body?.smartContractEventUpdateDetails?.nativeData?.transactionHash,
      summary: this.getSummary(body),
      ts: Date.now(),
    });
  },
};

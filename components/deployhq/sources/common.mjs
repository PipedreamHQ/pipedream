import deployHq from "../deployhq.app.mjs";
import { createVerify } from "crypto";

export const STATUS_RUNNING = "running";
export const STATUS_COMPLETE = "completed";
export const STATUS_FAILED = "failed";

const DEPLOYHQ_KEY = `
-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDXJcP2N6NtcN26Q8nVaidXOA0w
RxWK2HQTblIaQdGRDjqTvhrSlFuV5N4jz7w/w8uskP20G7ZQ+CkHwIXrWk76KZJn
pdoOHPO6AqRmEFgV5Q6Y1CR77mvnT9O21hTnfzfyyiAdQC2oO8M9/jeLRPTAqmkG
xdQa8iepUz4BwrrHmwIDAQAB
-----END PUBLIC KEY-----`;

export default {
  props: {
    deployHq,
    http: "$.interface.http",
  },
  methods: {
    validateRequest({ body }) {
      const { payload } = body;
      if (!this.verifySignature(payload, body.signature)) {
        throw new Error("Invalid signature");
      }

      return {
        payload: JSON.parse(payload),
      };
    },
    verifySignature(data, signature) {
      const v = createVerify("sha1");
      v.update(data);

      return v.verify(DEPLOYHQ_KEY, signature, "base64");
    },
  },
};

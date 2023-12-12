import ringcentral from "../../ringcentral.app.mjs";

export default {
  props: {
    ringcentral,
    db: "$.service.db",
  },
  methods: {
    /**
     * Given a phone number, return a masked version of it. The purpose of a
     * masked number is to avoid exposing it to an unintended audience.
     *
     * Example:
     *
     * - Input: +16505551234
     * - Output: ########1234
     *
     * @param {string}  number The phone number to mask
     * @return {string} The masked phone number
     */
    getMaskedNumber(number) {
      if (!number) {
        return "####";
      }
      const { length: numberLength } = number;
      return number
        .slice(numberLength - 4)
        .padStart(numberLength, "#");
    },
    generateMeta() {
      throw new Error("generateMeta is not implemented");
    },
    processEvent() {
      throw new Error("processEvent is not implemented");
    },
  },
};

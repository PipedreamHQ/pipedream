import pipedream_utils from "../../pipedream_utils.app.mjs";
export default {
  props: {
    pipedream_utils,
  },
  methods: {
    getRegExp() {
      throw new Error("RegExp not implemented for this action!");
    },
    getResult(input) {
      return input.match(this.getRegExp())?.[0];
    },
    getType() {
      throw new Error("Type not implemented for this action!");
    },
  },
  async run({ $ }) {
    const input = this.input;
    const result = this.getResult(input);
    $.export("$summary", result
      ? `Successfully found ${this.getType()} "${result}"`
      : `No ${this.getType()} found`);
    return result;
  },
};

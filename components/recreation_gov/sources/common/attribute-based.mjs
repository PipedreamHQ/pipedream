import base from "./base.mjs";

export default {
  ...base,
  methods: {
    ...base.methods,
    setAttribute(attribute) {
      this.db.set("attribute", attribute);
    },
    getAttribute() {
      return this.db.get("attribute");
    },
    getAttributeKey() {
      throw new Error("getAttributeKey() is not implemented!");
    },
    compareFn() {
      throw new Error("compareFn() is not implemented!");
    },
  },
  async run() {
    const item = await this.getResourceFnConfig().resourceFn({
      ...this.getResourceFnConfig().params,
    });
    if (this.compareFn(item[0])) { //the API always returns an array with a single element
      this.$emit(item[0], this.getMeta(item[0]));
      this.setAttribute(item[0][this.getAttributeKey()]);
    }
  },
};

import productboard from "../../productboard.app.mjs";

export function getParentProp() {
  return {
    ...productboard.propDefinitions[this.parentType],
    options: async ({ prevContext }) => {
      if (this.parentType === "feature") {
        return this.productboard.getPaginatedOptions(
          prevContext?.next,
          this.productboard.listFeatures,
        );
      }
      if (this.parentType === "component") {
        return this.productboard.getPaginatedOptions(
          prevContext?.next,
          this.productboard.listComponents,
        );
      }
      if (this.parentType === "product") {
        return this.productboard.getPaginatedOptions(
          prevContext?.next,
          this.productboard.listProducts,
        );
      }
    },
  };
}

export default getParentProp;

export default {
  name: "Shopify",
  version: "0.0.1",
  props: {
    shopify: "$.service.shopify"
  },
  actions: {
    getDiscountCode: {
      name: "Get Discount Code",
      description: "Fetch a discount code",
      type: "action",
      props: {
        priceRuleId: {
          type: "string",
          label: "Price Rule ID"
        },
        discountCodeId: {
          type: "string",
          label: "Discount Code ID"
        }
      },
      async run() {
        return await this.shopify.get(`price_rules/${this.priceRuleId}/discount_codes/${this.discountCodeId}.json`)
      }
    },
    updateDiscountCode: {
      name: "Update Discount Code",
      description: "Update a discount code",
      type: "action",
      props: {
        priceRuleId: {
          type: "string",
          label: "Price Rule ID"
        },
        discountCodeId: {
          type: "string",
          label: "Discount Code ID"
        },
        code: {
          type: "string",
          label: "Discount Code"
        }
      },
      async run() {
        return await this.shopify.put(`price_rules/${this.priceRuleId}/discount_codes/${this.discountCodeId}.json`, {
          discount_code: {
            code: this.code
          }
        })
      }
    },
    deleteDiscountCode: {
      name: "Delete Discount Code",
      description: "Delete a discount code",
      type: "action",
      props: {
        priceRuleId: {
          type: "string",
          label: "Price Rule ID"
        },
        discountCodeId: {
          type: "string",
          label: "Discount Code ID"
        }
      },
      async run() {
        return await this.shopify.delete(`price_rules/${this.priceRuleId}/discount_codes/${this.discountCodeId}.json`)
      }
    },
    createDiscountCodes: {
      name: "Create Discount Codes",
      description: "Create discount codes in bulk",
      type: "action",
      props: {
        priceRuleId: {
          type: "string",
          label: "Price Rule ID"
        },
        codes: {
          type: "array",
          label: "Discount Codes"
        }
      },
      async run() {
        return await this.shopify.post(`price_rules/${this.priceRuleId}/batch.json`, {
          discount_codes: this.codes
        })
      }
    }
  }
}
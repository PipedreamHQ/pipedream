const shopify = require("../../shopify.app.js");
const Bottleneck = require("bottleneck");
const { dateToISOStringWithoutMs } = require("../common/utils");
// limiting requests to 1 per 4 seconds
// the GraphQL Admin API standard limit (avg) is about 50 points/second,
// the orders query uses between about 130 and 950 points, and typically closer to 150
// https://shopify.dev/concepts/about-apis/rate-limits
const limiter = new Bottleneck({
  minTime: 5000,
});

module.exports = {
  props: {
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15,
      },
    },
    shopify,
  },
  methods: {
    _getCursor() {
      return this.db.get("cursor") || null;
    },
    _setCursor(cursor) {
      this.db.set("cursor", cursor);
    },
    async getOrders(params = {}) {
      const {
        first = 3,
        after = null,
        updatedAfter = null,
        query: queryString = "",
        sortKey = "UPDATED_AT",
      } = params;

      // let query = `"financial_status:paid${
      let query = `"${queryString}${
        updatedAfter ? ` updated_at:>${updatedAfter}` : ""
      }"`;
      return this.shopify.makeGraphQLRequest(
        `
        query orders($first: Int, $after: String, $sortKey: OrderSortKeys) {
          orders(first: $first, query:${query}, sortKey: $sortKey, after: $after) {
            pageInfo {
              hasNextPage
            }
            edges {
              cursor
              node {
                customerAcceptsMarketing
                cancelReason
                cancelledAt
                closedAt
                confirmed
                createdAt
                currencyCode
                currentSubtotalPriceSet {
                  presentmentMoney {
                    amount
                    currencyCode
                  }
                  shopMoney {
                    amount
                    currencyCode
                  }
                }
                currentTotalDiscountsSet {
                  presentmentMoney {
                    amount
                    currencyCode
                  }
                  shopMoney {
                    amount
                    currencyCode
                  }
                }
                currentTotalDutiesSet {
                  presentmentMoney {
                    amount
                    currencyCode
                  }
                  shopMoney {
                    amount
                    currencyCode
                  }
                }
                currentTotalPriceSet {
                  presentmentMoney {
                    amount
                    currencyCode
                  }
                  shopMoney {
                    amount
                    currencyCode
                  }
                }
                currentTotalTaxSet {
                  presentmentMoney {
                    amount
                    currencyCode
                  }
                  shopMoney {
                    amount
                    currencyCode
                  }
                }
                customerLocale
                discountApplications(first: 10) {
                  edges {
                    node {
                      allocationMethod
                      index
                      targetType
                      targetSelection
                    }
                  }
                }
                discountCode
                email
                displayFinancialStatus
                displayFulfillmentStatus
                fulfillments {
                  createdAt
                  id
                  status
                  trackingInfo {
                    company
                    number
                    url
                  }
                  updatedAt
                }
                paymentGatewayNames
                id
                lineItems(first: 10) {
                  edges {
                    node {
                      fulfillableQuantity
                      fulfillmentService {
                        serviceName
                        handle
                        type
                      }
                      fulfillmentStatus
                      id
                      originalUnitPriceSet {
                        presentmentMoney {
                          amount
                          currencyCode
                        }
                        shopMoney {
                          amount
                          currencyCode
                        }
                      }
                      customAttributes {
                        key
                        value
                      }
                      taxable
                      taxLines {
                        title
                        priceSet {
                          presentmentMoney {
                            amount
                            currencyCode
                          }
                          shopMoney {
                            amount
                            currencyCode
                          }
                        }
                        rate
                      }
                      totalDiscountSet {
                        presentmentMoney {
                          amount
                          currencyCode
                        }
                        shopMoney {
                          amount
                          currencyCode
                        }
                      }
                      discountAllocations {
                        allocatedAmountSet {
                          presentmentMoney {
                            amount
                            currencyCode
                          }
                          shopMoney {
                            amount
                            currencyCode
                          }
                        }
                        discountApplication {
                          index
                        }
                      }
                      vendor
                      duties {
                        id
                        harmonizedSystemCode
                        countryCodeOfOrigin
                        price {
                          presentmentMoney {
                            amount
                            currencyCode
                          }
                          shopMoney {
                            amount
                            currencyCode
                          }
                        }
                        taxLines {
                          title
                          priceSet {
                            presentmentMoney {
                              amount
                              currencyCode
                            }
                            shopMoney {
                              amount
                              currencyCode
                            }
                          }
                          rate
                          ratePercentage
                        }
                      }
                      product {
                        id
                        options {
                          name
                          values
                        }
                      }
                    }
                  }
                }
                physicalLocation {
                  id
                }
                name
                note
                originalTotalDutiesSet {
                  presentmentMoney {
                    amount
                    currencyCode
                  }
                  shopMoney {
                    amount
                    currencyCode
                  }
                }
                paymentGatewayNames
                phone
                presentmentCurrencyCode
                processedAt
                refunds {
                  id
                  createdAt
                  note
                  refundLineItems(first: 10) {
                    edges {
                      node {
                        lineItem {
                          id
                          name
                          quantity
                        }
                      }
                    }
                  }
                  transactions(first: 10) {
                    edges {
                      node {
                        id
                        kind
                        amountSet {
                          presentmentMoney {
                            amount
                            currencyCode
                          }
                          shopMoney {
                            amount
                            currencyCode
                          }
                        }
                        createdAt
                        status
                      }
                    }
                  }
                }
                shippingAddress {
                  address1
                  address2
                  city
                  company
                  country
                  firstName
                  lastName
                  latitude
                  longitude
                  phone
                  province
                  zip
                  name
                  countryCodeV2
                  provinceCode
                }
                shippingLines(first: 10) {
                  edges {
                    node {
                      code
                      originalPriceSet {
                        presentmentMoney {
                          amount
                          currencyCode
                        }
                        shopMoney {
                          amount
                          currencyCode
                        }
                      }
                      discountedPriceSet {
                        presentmentMoney {
                          amount
                          currencyCode
                        }
                        shopMoney {
                          amount
                          currencyCode
                        }
                      }
                      source
                      title
                      taxLines {
                        priceSet {
                          presentmentMoney {
                            amount
                            currencyCode
                          }
                          shopMoney {
                            amount
                            currencyCode
                          }
                        }
                        rate
                        ratePercentage
                        title
                      }
                      carrierIdentifier
                      requestedFulfillmentService {
                        id
                        serviceName
                      }
                    }
                  }
                }
                subtotalPriceSet {
                  presentmentMoney {
                    amount
                    currencyCode
                  }
                  shopMoney {
                    amount
                    currencyCode
                  }
                }
                tags
                taxLines {
                  priceSet {
                    presentmentMoney {
                      amount
                      currencyCode
                    }
                    shopMoney {
                      amount
                      currencyCode
                    }
                  }
                  rate
                  ratePercentage
                  title
                }
                taxesIncluded
                test
                totalDiscountsSet {
                  presentmentMoney {
                    amount
                    currencyCode
                  }
                  shopMoney {
                    amount
                    currencyCode
                  }
                }
                subtotalLineItemsQuantity
                totalOutstandingSet {
                  presentmentMoney {
                    amount
                    currencyCode
                  }
                  shopMoney {
                    amount
                    currencyCode
                  }
                }
                totalPriceSet {
                  presentmentMoney {
                    amount
                    currencyCode
                  }
                  shopMoney {
                    amount
                    currencyCode
                  }
                }
                totalShippingPriceSet {
                  presentmentMoney {
                    amount
                    currencyCode
                  }
                  shopMoney {
                    amount
                    currencyCode
                  }
                }
                totalTaxSet {
                  presentmentMoney {
                    amount
                    currencyCode
                  }
                  shopMoney {
                    amount
                    currencyCode
                  }
                }
                totalTipReceivedSet {
                  presentmentMoney {
                    amount
                    currencyCode
                  }
                  shopMoney {
                    amount
                    currencyCode
                  }
                }
                totalWeight
                updatedAt
                customer {
                  id
                }
                
                fullyPaid
                transactions(first: 10) {
                  createdAt
                  kind
                  status
                  processedAt
                  id
                }
              }
            }
          }
        }
      `,
        { first, after, sortKey }
      );
    },

    isRelevant(_order) {
      return true;
    },

    generateMeta(order) {
      return {
        id: order.id,
        summary: `Order ${order.name}`,
        ts: Date.parse(order.updatedAt),
      };
    },

    getParams() {
      return {};
    },
  },

  async run() {
    const cursor = this._getCursor();

    // If there is no cursor yet, get orders updated_at after 1 day ago
    // The Shopify GraphQL Admin API does not accept date ISO strings that include milliseconds
    const updatedAfter = cursor
      ? null
      : dateToISOStringWithoutMs(this.shopify.dayAgo());

    // Paginate orders
    const throttledGetOrders = limiter.wrap(this.getOrders);
    let after = cursor;
    let hasNextPage = true;
    while (hasNextPage) {
      const data = await throttledGetOrders({
        after,
        updatedAfter,
        ...this.getParams(),
      });
      for (const edge of data.orders.edges) {
        const { node: order } = edge;
        if (!this.isRelevant(order)) {
          console.log("Event not relevant. Skipping...");
          continue;
        }
        this.$emit(order, this.generateMeta(order));
        after = edge.cursor;
      }
      hasNextPage = data.orders.pageInfo.hasNextPage;
      // Set cursor in db after each request in case execution time is exceeded
      if (cursor !== after) {
        this._setCursor(after);
      }
    }
  },
};

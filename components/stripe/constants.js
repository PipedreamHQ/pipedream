/**
 * @typedef {string} PriceType - a type of price as defined in the [Stripe API
 * docs]{@link https://stripe.com/docs/api/prices/object}
 */

/**
 * The price is for a one-time purchase
 *
 * @type {PriceType}
 */
const STRIPE_PRICE_ONE_TIME = "one_time";

/**
 * The price is for a recurring (subscription) purchase
 *
 * @type {PriceType}
 */
const STRIPE_PRICE_RECURRING = "recurring";

const STRIPE_PRICE_TYPE = {
  ONE_TIME: STRIPE_PRICE_ONE_TIME,
  RECURRING: STRIPE_PRICE_RECURRING,
};

module.exports = {
  STRIPE_PRICE_TYPE,
};

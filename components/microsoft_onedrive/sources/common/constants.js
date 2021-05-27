module.exports = {

  // Defaulting to 15 days. The maximum allowed expiration time is 30 days,
  // according to their API response message: "Subscription expiration can only
  // be 43200 minutes in the future".
  //
  // More information can be found in the official API docs:
  // https://docs.microsoft.com/en-us/onedrive/developer/rest-api/concepts/using-webhooks?view=odsp-graph-online#expiration
  WEBHOOK_SUBSCRIPTION_RENEWAL_SECONDS: 43200 * 60 / 2,

  // The maximum amount of events sent during the initialization of the event
  // source. The number of emitted events might be lower than this, depending on
  // whether there's enough data to emit them or not.
  MAX_INITIAL_EVENT_COUNT: 10,

};

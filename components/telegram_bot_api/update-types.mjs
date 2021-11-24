/**
 * Based on the Telegram Bot API docs for the getUpdates endpoint.
 * {@see {@link https://core.telegram.org/bots/api#update Telegram Bot API Update object}}
 */
export default [
  {
    label: "Message",
    value: "message",
  },
  {
    label: "Edited Message",
    value: "edited_message",
  },
  {
    label: "Channel Post",
    value: "channel_post",
  },
  {
    label: "Edited Channel Post",
    value: "edited_channel_post",
  },
  {
    label: "Inline Query",
    value: "inline_query",
  },
  {
    label: "Chosen Inline Result",
    value: "chosen_inline_result",
  },
  {
    label: "Callback Query",
    value: "callback_query",
  },
  {
    label: "Shipping Query",
    value: "shipping_query",
  },
  {
    label: "Pre Checkout Query",
    value: "pre_checkout_query",
  },
  {
    label: "Poll",
    value: "poll",
  },
  {
    label: "Poll Answer",
    value: "poll_answer",
  },
];

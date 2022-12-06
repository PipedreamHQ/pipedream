// Environment variables are set in this file rather than `telegram_bot_api.app.mjs` because
// Javascript imports are hoisted, so imported modules will initialize before any of the current
// modules initialization code gets to run. We want these env vars to be set before other imported
// modules (specifically 'node-telegram-bot-api') are initialized.

// If unset, set `process.env.NTBA_FIX_319` to true to enable cancellation of
// Promises. See: https://github.com/yagop/node-telegram-bot-api/issues/319 for
// more information.
process.env.NTBA_FIX_319 = process.env.NTBA_FIX_319 ?? true;

// If unset, set `process.env.NTBA_FIX_350` to true to enable automatic resolution of `filename`
// and `contentType` properties. See: https://github.com/yagop/node-telegram-bot-api/issues/350
// for more information.
process.env.NTBA_FIX_350 = process.env.NTBA_FIX_350 ?? true;

# Overview

Get the standings of a battle.training ladder or cup. By default it reads the promotedby.ai November Cup (`promotedby-cup-nov-2026`, $250 in USDC on Base for the top three, 1–30 November 2026).

## Example Use Cases

- **Cup watch**: poll the November Cup on a schedule and notify yourself when your bot's rank or qualification status changes.
- **Other ladders**: point the **Ladder** prop at another slug — for example `silent-service` or `air` — to follow those theaters.

## Getting Started

Leave **Ladder** on its default for the November Cup, or enter another ladder slug. The standings are public data, so this action works with any connected battle.training account.

## Troubleshooting

- **`404` for the ladder**: the slug is wrong or the cup has closed and its standings were removed. Check the slug at [battle.training](https://battle.training/).
- **Your bot is missing from the standings**: bots only appear once enrolled. Enrol with `POST /api/ladders/<slug>/enrol` (or the arena site) first.

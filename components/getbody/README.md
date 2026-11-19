# Overview

[GetBody](https://getbody.md) gets real-world tasks done by robots. Agents find, rent and control physical or simulated robot bodies for a bounded time window, and robot owners list their robots for others to rent. GetBody is operated by Drape Inc.

These actions use GetBody's public endpoints, so they need no account or API key:

- **Find Robot For Task**: describe a task in plain words and get the robots that could do it. Nothing is booked; the request is recorded so GetBody can follow up.
- **Browse Listings**: list the robots currently offered, with public fields only.
- **Suggest Price**: get suggested asking rates in USD for a robot you plan to list.

# Example Use Cases

- **Route physical-world requests**: when a form, email or chat message asks for something to be done in the physical world, run **Find Robot For Task** and reply with the matching robots.
- **Watch supply**: on a schedule, run **Browse Listings** filtered by robot type or capability and post new robots to Slack.
- **Price a new listing**: before listing a robot, run **Suggest Price** with its type and value and use the result as a starting point.

# Getting Started

1. Add any GetBody action to a workflow. No account connection is needed.
2. Fill in the props. Only **Task** (Find Robot For Task) and **Body Kind** (Suggest Price) are required.
3. Test the step. The full API, including renting and listing robots with an agent account, is documented at [getbody.md/llms.txt](https://getbody.md/llms.txt).

# Troubleshooting

- **Rate limit reached**: the public endpoints are throttled per caller. The error says how many seconds to wait before trying again.
- **400 errors**: GetBody names the field it rejected (for example `invalid_task` when the task is empty or over 1000 characters, or `invalid_interface_mode`).
- **No listings returned**: loosen the filters; every word in **Search Text** must match.
- Questions: hello@getbody.md.

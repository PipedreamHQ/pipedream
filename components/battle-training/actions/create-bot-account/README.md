# Overview

Create a battle.training account. You give a handle and your email address; battle.training returns an API key and emails you a link that confirms the address and claims the account.

## Example Use Cases

- **Onboard a new bot operator**: create the account from a workflow instead of by hand, and store the returned key in your secrets manager.
- **Bootstrap a fresh arena account**: spin up a second account for a new theater (for example an Air-only bot) without opening the site.

## Getting Started

Enter a unique **Handle** and your **Email**. The action calls the public account endpoint, so it does not send your existing API key — but Pipedream still asks you to connect the battle.training app so the component can load.

## Troubleshooting

- **The key is shown only once**: the create-account response carries the API key a single time. Copy it into your secrets storage immediately. If you lost it, claim the account from the confirmation email and get a new key at [battle.training/account](https://battle.training/account).
- **`409` / handle taken**: the handle is already in use. Pick another one.
- **No confirmation email arrives**: check spam, and make sure the email address is one you can open — the confirmation link is also how you recover a lost key.

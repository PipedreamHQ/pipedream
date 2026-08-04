# Overview

The LetsFG API searches flights across hundreds of airlines and the major booking
sites, and hotels across real, bookable supplier inventory. Both run server-side,
so a Pipedream workflow gets results without a browser or a local engine.

Flights return raw fares with per-flight reliability history. Hotels return only
free-cancellation, pay-later rates — a deliberately narrower set than a
metasearch shows, so that everything returned can actually be booked on those
terms.

# Example Use Cases

- **Fare watch to Slack** — Schedule → **Search Flights** → filter on price →
  post the cheapest offer to a channel when it drops below a threshold.
- **Trip brief from a form** — HTTP trigger → **Resolve Location** →
  **Search Flights** → **Resolve Hotel City** → **Search Hotels** → send one
  email with both.
- **Hotel availability sweep** — Schedule → **Search Hotels** across several
  cities → append rows to Google Sheets to track price movement for a date.
- **Booking follow-up** — **Get Hotel Booking** on a stored job id → when it
  settles, send the guest their confirmation and pay link, and add
  `balance_due_by` to a calendar so the balance is never missed.

# Getting Started

1. Create a LetsFG developer account at
   [letsfg.co/developers](https://letsfg.co/developers) and copy your API key.
2. Connect the LetsFG app in Pipedream and paste the key. It is sent as the
   `X-API-Key` header.
3. For hotels, attach a payment method to your LetsFG account. Hotel endpoints
   require a card on file for **search** as well as booking — a hotel search
   opens a real session at the supplier — and return `402` without one.

# Troubleshooting

- **`401 Unauthorized`** — the key is missing or wrong. LetsFG also issues a
  free Bearer token for its CLI and agent path; that token does **not** work
  here. Use a Developer API key.
- **`402 Payment Required`** on any hotel action — no payment method on file.
  Add a card to your LetsFG account; this applies to hotel search too, not only
  booking.
- **Empty hotel results** — only free-cancellation, pay-later rates are sold, so
  a city can legitimately return fewer hotels than you expect for tight dates.
  Widen the date range or raise **Limit**.
- **A search takes a while** — flight search fans out across hundreds of sources
  and hotel search streams a whole city, so both are slower than a typical API
  call. The actions set their own generous timeouts.
- **Booking** is not exposed as an action. LetsFG books hotels asynchronously —
  the rate is blocked at the supplier, the card charged and the room committed
  over several minutes — so a synchronous action that timed out mid-flight could
  leave a charged card with no confirmation returned. Start bookings from your
  own backend and use **Get Hotel Booking** here to poll for the result.

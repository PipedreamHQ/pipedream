# Overview

The [Google Health API](https://developers.google.com/health) is the successor to the Fitbit Web API. It exposes health and fitness data from Fitbit trackers, Pixel Watches, Health Connect, and third-party apps through one interface: a collection of typed data points per user, with aggregation built in. Steps, distance, calories, heart rate, sleep stages, weight, body composition, nutrition, and hydration are all reachable, along with roughly three dozen further metrics such as SpO2, heart rate variability, respiratory rate, and VO2 max.

Because the API aggregates server-side, a "how did I sleep last week" or "what were my daily steps this month" question is a single call that returns a handful of numbers rather than thousands of raw samples.

# Migrating from Fitbit

Google Health is a separate service from the Fitbit Web API: a different OAuth provider, a different base URL, and different data schemas. Access and refresh tokens **cannot** be transferred, so every connected user has to authorize the Google Health app afresh. Existing workflows using `fitbit-*` actions need their steps swapped for the equivalents here — workflows do not migrate between apps automatically.

Use **Get Identity** to map a user across the two systems: it returns both `legacyUserId` (the six-character Fitbit ID) and `healthUserId`.

See Google's [migration guide](https://developers.google.com/health/migration) for the full picture.

# Example Use Cases

- **Daily activity digest**: Roll up steps, distance, calories, and active minutes each morning and post the summary to Slack or email it, so a day's training load lands somewhere you'll actually read it.

- **Sleep tracking spreadsheet**: Append last night's sleep session — time asleep, stage breakdown, efficiency — to a Google Sheet on a schedule, building a long-run record that the app itself doesn't keep.

- **Weight trend alerts**: Watch weight and body-fat logs and notify when a rolling average crosses a threshold, using the computed BMI that **Get Body Measurements** derives from the user's height.

- **Correlate health with anything else**: Pull heart rate or sleep quality alongside calendar events, workout logs, or nutrition data to answer questions the Fitbit app can't — such as whether late meetings track with worse sleep.

# Notes

- Every data type belongs to a scope group (activity and fitness, health metrics and measurements, sleep, nutrition), and each is a Google **restricted** scope. Production use requires OAuth app verification and an annual CASA security assessment.
- **Aggregated** queries cap the date range: **14 days** for heart rate, active minutes, and total calories; **90 days** for everything else. That limit applies to the roll-up endpoints only — Daily Step Count, Daily Activity Summary, Heart Rate, and the totals half of Nutrition and Hydration Logs. Actions that read raw logs (Sleep Data, Body Measurements, List Data Points, and the entries half of Nutrition and Hydration Logs) have no date cap; they are bounded by a per-call record ceiling and set `truncated: true` when there was more to fetch.
- Dates default to **today in UTC** when omitted, which can differ from the user's local date late at night. Pass explicit dates when the exact day matters; every response echoes the dates it actually used.
- Values arrive in metric base units (grams, millimetres, kilocalories, millilitres). These actions return human-scale conversions alongside them, in both metric and imperial, so no unit setting has to be guessed.
- The API has no BMI field and no sleep score. BMI is computed here from weight and height; there is no sleep-score equivalent to return.

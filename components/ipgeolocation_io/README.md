# Overview

[IPGeolocation.io](https://ipgeolocation.io) provides a suite of real-time IP intelligence APIs. With a single API key, you can look up geolocation data, security threats, ASN details, abuse contacts, timezone information, astronomy data, and user-agent details for any IPv4/IPv6 address, domain, or coordinates.

## Available APIs

- **IP Geolocation API** — Location, timezone, currency, ASN, and network data for any IP or domain
- **IP Security API** — Threat intelligence including VPN, proxy, Tor, bot, and spam detection
- **ASN API** — Detailed ASN information including peers, upstreams, routes, and WHOIS data
- **Abuse Contact API** — Abuse contact emails, phone numbers, and organization info for any IP
- **Timezone API** — Timezone lookup and conversion by IP, coordinates, city, IATA, ICAO, or UN/LOCODE
- **User Agent API** — Browser, device, OS, and engine details parsed from a user agent string
- **Astronomy API** — Sunrise, sunset, moon phase, and sun/moon position for any location or date range

## Limitations

- The free plan provides generous 1,000 lookups per day 
- Bulk lookups, security data, abuse contacts, ASN details, and multi-language responses require a paid plan
- The Astronomy Time Series endpoint supports a maximum date range of 90 days
- The Bulk IP Geolocation and Bulk IP Security endpoints support a maximum of 50,000 IPs per request

# Example Use Cases

- **Fraud Detection Pipeline** — On every new user signup, use the **Get IP Security** action to check if the registration IP is a known VPN, proxy, or Tor exit node. If the threat score exceeds a threshold, flag the account in your database or trigger a Slack alert for manual review.

- **Geo-targeted Notifications** — Use **Get IP Geolocation** to detect a visitor's country and timezone from their IP address, then send personalized notifications or emails at the correct local time using Pipedream's scheduler.

- **Automated Abuse Reporting** — When your server logs detect suspicious traffic, use **Get Abuse Contact** to automatically retrieve the responsible organization's contact details and send a formatted abuse report via email.

- **Timezone-aware Scheduling** — Use **Get Timezone** or **Convert Timezone** to resolve and convert timezones for users across regions, then schedule reminders and workflow triggers at the right local time.

- **Photography & Outdoor Event Planning** — Use **Get Astronomy Time Series** to pull sunrise, sunset, golden hour, and moon phase data for a 30-day window for any location, and send a weekly digest to subscribers.

- **Network Inventory Enrichment** — Use **Get ASN Details** to enrich a list of IP addresses in a Google Sheet with ASN organization, routing, and WHOIS data in bulk.

# Getting Started

## Creating an Account

1. Sign up for a free account at [ipgeolocation.io](https://ipgeolocation.io)
2. Verify your email address to activate your account

## Generating an API Key

1. Log in to your [IPGeolocation.io dashboard](https://app.ipgeolocation.io)
2. Your API key is displayed on the dashboard home page
3. Copy the API key

## Connecting to Pipedream

1. In any IPGeolocation.io action on Pipedream, click **Connect Account**
2. Paste your API key when prompted
3. Click **Save** — your account is now connected and ready to use

# Troubleshooting

## 401 Unauthorized

This error means your API key is invalid, missing, or your account subscription has expired. Double-check your API key in the [IPGeolocation.io dashboard](https://app.ipgeolocation.io) and ensure your subscription is active.

## 400 Bad Request
This typically means an invalid IP address, malformed date format, or an unsupported parameter value was passed. Ensure:
- IP addresses are valid IPv4 or IPv6 format
- Dates are in `YYYY-MM-DD` format
- Date ranges do not exceed 90 days (for Astronomy Time Series)

## 403 Forbidden / Feature Not Available

Some actions (bulk lookups, IP security, abuse contact, ASN details, and multi-language responses) require a paid plan. Upgrade your subscription at [ipgeolocation.io/pricing](https://ipgeolocation.io/pricing.html) to access these features.

Moreover, If you're having trouble connecting to IPGeolocation.io, please [contact support](mailto:support@ipgeolocation.io).
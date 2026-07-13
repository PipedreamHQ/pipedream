# Overview

[APIFreaks](https://apifreaks.com) is a single API hub for data enrichment and validation: IP geolocation & threat intelligence, WHOIS/DNS/SSL, geocoding & GeoDB, currency & commodity rates, financial validation (VAT/IBAN/SWIFT), weather, timezones, PDF tooling, screenshots, OCR, web scraping, and more.

This app exposes **112 actions** across **24 categories** so you can enrich, validate, and convert data inside any Pipedream workflow — no manual HTTP requests required.

# Example Use Cases

- **Fraud & network vetting:** On a new order, run *IP Security Lookup* to check proxy/VPN and threat score, then *IP WHOIS* for the network owner, and branch on the result.
- **Lead hygiene:** *Validate Email* and *Validate Phone Number* before a contact is written to your CRM or spreadsheet.
- **Domain due diligence:** *Bulk Domain WHOIS Lookup* over a list of domains, writing registrar and expiry dates back to a sheet.
- **Localized delivery:** *IP Geolocation Lookup* → *Timezone Lookup* → *Convert Timezone* to send messages at the recipient's local time.
- **Finance automations:** Pull *Latest Exchange Rates* or *Commodity Prices* on a schedule and post to Slack.

# Getting Started

## Generating an API Key

1. [Sign up](https://apifreaks.com/signup) for a free APIFreaks account (or [log in](https://apifreaks.com/login)).
2. Open your [dashboard](https://apifreaks.com/dashboard) and copy your key from **API Keys**.
3. In Pipedream, add any APIFreaks action, click **Connect account**, and paste the key.

The key is sent as the `X-apiKey` header on every request. One connected account works across every APIFreaks action.

# Available Actions

## Commodity (5)

- Get All Supported Commodity Symbols
- Get Commodity Price Fluctuations
- Get Commodity Price Time Series
- Get Historical Commodity Prices
- Get Latest Commodity Prices

## Currency (10)

- Convert Currency Based on IP Geolocation
- Convert Currency With Historical Rates
- Convert Currency With Latest Rates
- Get All Currency Symbols
- Get All Supported Currencies
- Get Exchange Rate Fluctuations
- Get Historical Data Availability Limits
- Get Historical Exchange Rates
- Get the Latest Exchange Rates
- Get Time Series of Exchange Rates

## DNS (4)

- Bulk DNS Lookup
- DNS History Lookup
- DNS Lookup
- Reverse DNS Lookup

## Domain (4)

- Bulk Domain Availability Check
- Check Domain Availability
- Domain Availability With Suggestions
- Subdomains Lookup

## Email Validation (2)

- Validate a Single Email
- Validate Multiple Email Addresses

## Financial (8)

- Bulk VAT Lookup by Country
- Find SWIFT Codes
- Get Supported Countries
- Get VAT Rate by Country Code
- Get VAT Rate by IP Address
- Lookup SWIFT Code Details
- Validate EU and UK VAT Number
- Validate IBAN

## General (1)

- Get Credits Usage Information

## GeoDB (10)

- Get Administrative Units by Country
- Get Administrative Units for a Country
- Get Cities by Country and Admin Unit
- Get Flag for Country
- Get GeoDB Admin Unit Details
- Get GeoDB Country Details
- Get GeoDB Regions
- Get List of Countries
- Get Subregions by Region
- Supported Flags

## Geocoding (2)

- Forward Geocoding (Address to Coordinates)
- Reverse Geocoding (Coordinates to Address)

## IP Geolocation (6)

- Bulk IP Geolocation Lookup
- Bulk IP Geolocation Lookup (V2.0)
- Bulk IP Security Lookup
- IP Geolocation Lookup
- IP Geolocation Lookup (V2.0)
- Retrieve Security Information for an IP Address

## OCR (1)

- Extract Text From Images and PDFs Using OCR

## Other (2)

- Astronomy Lookup (V2.0)
- Astronomy Lookup by IP or Coordinates

## PDF (17)

- Check File Status
- Combine Multiple PDF Files Into One
- Compress a PDF File
- Convert a PDF File Into a Sequence of TIFF Images
- Convert PDF to BMP
- Convert PDF to GIF
- Convert PDF to JPG
- Convert PDF to PNG
- Delete Specific Pages From a PDF
- Download PDF Resource
- Extract Pages From a PDF
- Get List of PDF Files
- Linearize a PDF
- Rotate Pages in a PDF
- Split a PDF Into Smaller Files
- Upload a PDF in Binary Format
- Upload Multiple PDFs and Get File IDs

## PDF File (1)

- List PDF Files

## Phone Validation (2)

- Bulk Validate Phone Numbers
- Validate a Single Phone Number

## Readability (4)

- Calculate Readability Score
- Correct Grammar
- Detect Grammar Errors
- Detect Weak Words

## SSL (2)

- SSL Certificate Chain Lookup
- SSL Certificate Lookup

## Screenshot (2)

- Capture a Website Screenshot
- Capture Screenshots of Multiple Websites

## Timezone (3)

- Convert Time Between Timezones
- Timezone Lookup
- Timezone Lookup (V2.0)

## User Agent (2)

- Bulk User Agent Lookup
- User Agent Lookup

## WHOIS (8)

- ASN WHOIS Lookup
- Bulk Domain WHOIS Lookup
- Bulk Domain WHOIS Lookup (V2.0)
- Domain WHOIS Lookup
- Domain WHOIS Lookup (V2.0)
- IP WHOIS Lookup
- Reverse WHOIS Lookup
- WHOIS History Lookup

## Weather (8)

- Get Air Quality Data
- Get Current Weather
- Get Current Weather for Multiple Locations
- Get Flood Risk Forecast
- Get Historical Weather
- Get Historical Weather Time Series
- Get Marine Weather Forecast
- Get Weather Forecast

## Web Scraping (1)

- Perform Web Scraping With Custom Instructions

## ZIP Code (7)

- Bulk Lookup Zip/Postal Codes
- Find Zip/Postal Codes Within a Radius
- Get Distance Between Postal Codes
- Get Matching Zip/Postal Code Pairs Within a Distance
- Lookup Zip/Postal Codes
- Search ZIP Codes by Region
- Search Zip/Postal Codes by City

# Troubleshooting

- **401 / authentication errors** — confirm the API key is active in your [dashboard](https://apifreaks.com/dashboard) and was pasted without extra spaces.
- **403 / plan errors** — the endpoint may not be included in your current plan; see [pricing](https://apifreaks.com).
- **Credit errors** — a depleted balance causes actions to fail. Use the *Get Credits Usage Info* action to monitor consumption.

For API details see the [docs](https://apifreaks.com/docs) and [Swagger reference](https://apifreaks.com/api/swagger), or email support@apifreaks.com.

# Enrich Layer Pipedream Integration

## Overview

[Enrich Layer](https://enrichlayer.com) is a data enrichment API that provides structured data from professional networks. Enrich company profiles, person profiles, find employees, search for people and companies, look up work emails, and more.

## Connecting Your Account

1. Sign up at [enrichlayer.com](https://enrichlayer.com) and obtain your API key from the dashboard.
2. In Pipedream, add a new Enrich Layer connection and paste your API key.
3. All API requests are authenticated via Bearer token.

## Available Actions

| Action | Endpoint | Credit Cost |
|--------|----------|-------------|
| Get Company Profile | `/api/v2/company` | 1 credit |
| Get Person Profile | `/api/v2/profile` | 1 credit |
| Get School Profile | `/api/v2/school` | 1 credit |
| Get Employee Listing | `/api/v2/company/employees/` | 3 credits/employee |
| Get Employee Count | `/api/v2/company/employees/count` | 1 credit |
| Get Person Profile Picture | `/api/v2/person/profile-picture` | 0 credits |
| Get Company Profile Picture | `/api/v2/company/profile-picture` | 0 credits |
| Get Person Lookup | `/api/v2/profile/resolve` | 2 credits |
| Get Role Lookup | `/api/v2/find/company/role/` | 3 credits |
| Get Company Lookup | `/api/v2/company/resolve` | 2 credits |
| Get Company ID Lookup | `/api/v2/company/resolve-id` | 0 credits |
| Get Employee Search | `/api/v2/company/employee/search/` | 10 credits + 3/employee |
| Get Student Listing | `/api/v2/school/students/` | 3 credits/student |
| Get Reverse Email Lookup | `/api/v2/profile/resolve/email` | 3 credits |
| Get Reverse Contact Number Lookup | `/api/v2/resolve/phone` | 3 credits |
| Get Work Email Lookup | `/api/v2/profile/email` | 3 credits |
| Get Job Profile | `/api/v2/job` | 2 credits |
| Get Job Search | `/api/v2/company/job` | 2 credits |
| Get Job Listing Count | `/api/v2/company/job/count` | 2 credits |
| Search Companies | `/api/v2/search/company` | 3 credits/result |
| Search People | `/api/v2/search/person` | 3 credits/result |
| Get Credit Balance | `/api/v2/credit-balance` | 0 credits |
| Check Disposable Email | `/api/v2/disposable-email` | 0 credits |
| Get Personal Contact Number | `/api/v2/contact-api/personal-contact` | 1 credit/number |
| Get Personal Email | `/api/v2/contact-api/personal-email` | 1 credit/email |

## Additional Credit Costs

Many actions support optional enrichment parameters that incur additional credit charges:

- **Cache Strategy (`use_cache=if-recent`)**: +1 credit for fresh data (max 29 days old)
- **Live Fetch (`live_fetch=force`)**: +9 credits for a real-time fresh fetch
- **Enrich Profiles (`enrich_profiles=enrich`)**: +1 credit per enriched result
- **Extra Data (`extra=include`)**: +1 credit for extended profile data
- **Country Filter**: +3 credits per result on employee/student listings

## Documentation

- [Enrich Layer API Documentation](https://enrichlayer.com/docs)
- [Pipedream Documentation](https://pipedream.com/docs)

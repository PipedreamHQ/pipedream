# Overview

Get LinkedIn Profile uses the [FastAF REST API](https://fastaf.co/docs/#linkedin).

## Example Use Cases

Retrieve public professional profile data with appropriate authorization for the workflow use case.

# Getting Started

Connect a FastAF account using a managed API key, then configure the action.

Use the public person-profile slug from `/in/<id>/`, not a full URL. This endpoint does not retrieve company pages or private profile content.

## Output and Credits

Returns the API public-profile array. Both normal and premium mode cost 60 FastAF credits. Summaries do not include the profile name or identifier.

# Troubleshooting

Check the [FastAF error reference](https://fastaf.co/docs/#errors) for invalid
inputs, account/credit issues, rate limits or unavailable source data. Do not
log keys or raw Axios request objects. A network timeout may require checking
account usage before retrying.

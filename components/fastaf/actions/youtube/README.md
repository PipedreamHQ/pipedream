# Overview

Get YouTube Data uses the [FastAF REST API](https://fastaf.co/docs/#youtube).

## Example Use Cases

Process public captions or a page of video search results.

# Getting Started

Connect a FastAF account using a managed API key, then configure the action.

For transcript, provide a video ID rather than a full URL. For search, provide a query and optionally an `sp` filter or page token. Fields belonging to the other resource are not sent.

## Output and Credits

Transcript costs 1 credit; search costs 5 per execution. Returns the original structured response. Captions must be available; translation is not guaranteed.

# Troubleshooting

Check the [FastAF error reference](https://fastaf.co/docs/#errors) for invalid
inputs, account/credit issues, rate limits or unavailable source data. Do not
log keys or raw Axios request objects. A network timeout may require checking
account usage before retrying.

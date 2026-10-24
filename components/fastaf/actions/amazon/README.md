# Overview

Get Amazon Data uses the [FastAF REST API](https://fastaf.co/docs/#amazon).

## Example Use Cases

Retrieve public product details or one page of product search results.

# Getting Started

Connect a FastAF account using a managed API key, then configure the action.

Choose search, product, offers or bestsellers. Search needs a query; product/offers need an ASIN. Only fields applicable to the chosen resource are sent. Use a domain suffix such as `com`, not a hostname.

## Output and Credits

Search/product cost 1 credit; offers/bestsellers cost 5. Product data is a flat object, while search and ranked lists have their own shapes. Page starts at 1; full-list applies only to bestsellers.

# Troubleshooting

Check the [FastAF error reference](https://fastaf.co/docs/#errors) for invalid
inputs, account/credit issues, rate limits or unavailable source data. Do not
log keys or raw Axios request objects. A network timeout may require checking
account usage before retrying.

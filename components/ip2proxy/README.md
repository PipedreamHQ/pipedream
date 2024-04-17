# Overview

The IP2Proxy API helps you detect and prevent fraud by identifying proxy and VPN traffic. With this API, you can programmatically check IP addresses and uncover whether they're originating from known data centers, residential proxies, or public VPNs. This is crucial for maintaining the integrity of your web services and preventing abuse. By integrating IP2Proxy with Pipedream, you can automate actions based on the traffic’s legitimacy, enrich data streams with proxy detection, and enhance security measures within your digital ecosystem.

# Example Use Cases

- **Automated Fraud Detection**: Create a Pipedream workflow that triggers whenever a new user signs up on your platform. The workflow uses the IP2Proxy API to check if the IP address is from a proxy or VPN. If it is, the workflow can automatically flag the account for review or restrict certain actions to prevent potential fraud.

- **Dynamic Content Delivery**: Develop a Pipedream workflow that detects the type of IP address accessing your service and tailors content delivery accordingly. For instance, if IP2Proxy indicates a regular residential IP, provide full access, but for proxy IPs, limit access or serve different content to protect digital assets.

- **Security Log Enrichment**: Construct a Pipedream workflow that receives logs from your security system. Each log entry containing an IP address is processed through the IP2Proxy API. The enriched logs then include data on whether the IP is associated with a proxy or VPN, which can be crucial for in-depth security analysis and threat hunting.

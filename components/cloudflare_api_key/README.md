# Overview

The Cloudflare API empowers you to automate, extend, and combine Cloudflare’s suite of security, performance, and reliability features with your apps. On Pipedream, you can build serverless workflows that leverage the Cloudflare (API key) API to manage DNS records, purge caches, adjust security settings, and more. These automations can streamline your operations, bolster your infrastructure's responsiveness, and integrate seamlessly with other services you use.

# Example Use Cases

- **Automate DNS Updates**: Automatically update DNS records on Cloudflare when changes occur in another part of your infrastructure, like a new EC2 instance being spun up in AWS, ensuring your domains always resolve to the correct IP addresses.

- **Dynamic Content Caching**: Purge the cache of specific URLs on Cloudflare whenever you deploy new versions of your site or app, maintaining up-to-date content without manual intervention. Integrate with GitHub to trigger this on every push to the main branch.

- **Security Setting Adjustments Based on Threats**: Monitor threat report logs from a security tool like Fail2Ban, and use the Cloudflare API to adjust security settings, like IP access rules or the security level of your site, in real-time based on the severity of threats detected.

# Overview

The Cloudflare R2 API lets you interact with Cloudflare's object storage service, providing a cost-effective way to store large amounts of data with no egress fees. On Pipedream, you can harness this API to build automated workflows that can store, retrieve, and manage data within your R2 buckets. By combining Cloudflare R2 with Pipedream’s capabilities, you can create serverless workflows that trigger on various events, process data in-flight, and integrate with over 3,000+ apps available on the platform.

# Example Use Cases

- **Automated Backup to R2**: Create a workflow on Pipedream that listens for new files in your Dropbox or Google Drive and automatically backs them up to an R2 bucket for secure and cost-effective long-term storage.

- **Website Asset Delivery**: Build a pipeline that optimizes images or other static assets uploaded to Cloudflare R2 and serves them efficiently to your website, leveraging Pipedream’s ability to process the data and Cloudflare’s global delivery network.

- **Event-Driven Data Archival**: Set up a system where logs or data from your application, received through webhooks or other triggers on Pipedream, are automatically archived to an R2 bucket for compliance, analysis, or backup purposes, potentially integrating with database services like Airtable for metadata management.

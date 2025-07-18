# Overview

The Google Search Console API opens a treasure trove of data and insights about your website's presence in Google Search results. You can get detailed reports on your site's search traffic, manage and test your site's sitemaps and robots.txt files, and see which queries bring users to your site. On Pipedream, utilize this API to automate checks on site performance, integrate with other tools for deeper analysis, or keep tabs on your SEO strategy's effectiveness.

## Working with Domain Properties and Subdomains

Google Search Console distinguishes between URL properties and Domain properties:

- **URL properties** are specific site URLs (e.g., `https://example.com` or `https://www.example.com`)
- **Domain properties** include all subdomains and protocols (e.g., `sc-domain:example.com`)

When working with subdomains:

1. Select the domain property from the dropdown (e.g., `sc-domain:example.com`)
2. Enter the subdomain URL in the "Subdomain Filter" field (e.g., `https://mcp.example.com`)
3. By default, this will filter for pages containing that subdomain URL, including all subpages like `https://mcp.example.com/app/slack`

This approach ensures you can access subdomain data even if the subdomain isn't individually verified in Search Console.

### Important: Getting Data for Individual Pages

To see data broken down by individual pages (rather than just aggregate data):

- Add "page" to your dimensions list
- This will return separate rows for each page, rather than a single aggregated row

For advanced filtering needs, you can also:

- Change the filter dimension (page, query, country, etc.)
- Change the filter operator (contains, equals, etc.)
- Or use the advanced filters for complete customization

## Example Use Cases

- **SEO Performance Report to Slack**: Automate daily or weekly SEO performance reports. Use the Google Search Console API to fetch search analytics data, then send a summary report to a Slack channel, keeping the team informed about trends, keyword rankings, and click-through rates.

- **Sync Search Results with Google Sheets**: Create a workflow that periodically pulls data from the Google Search Console API and adds it to a Google Sheet. This is useful for maintaining an evolving dataset for deeper analysis, historical reference, or sharing insights across teams without giving direct access to the Search Console.

- **Automatic Sitemap Submission**: Set up a Pipedream workflow that triggers whenever a new sitemap is generated in your content management system (CMS). The workflow can then automatically submit the sitemap to Google Search Console via API, ensuring Google has the latest structure of your site for crawling and indexing.

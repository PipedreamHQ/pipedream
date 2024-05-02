# Overview

The 2markdown API on Pipedream enables you to convert HTML content into Markdown format seamlessly. This functionality is pivotal for content creators, developers, and marketers who often need to transition between web content and Markdown for various platforms like GitHub, blogs, or documentation sites. By leveraging Pipedream's robust integration and automation capabilities, you can set up workflows that trigger the API to process content dynamically, connect with other services for enhanced automation, or even archive and manage your Markdown conversions systematically.

# Example Use Cases

- **HTML to Markdown for Documentation**: Automatically convert HTML documentation to Markdown when updating repository README files or wiki pages on code hosting platforms like GitHub or GitLab. Use the GitHub or GitLab app on Pipedream to listen for changes to HTML files, then pass the content through 2markdown API and commit the converted Markdown back to the repository.

- **Blog Content Syndication**: Syndicate blog content across multiple platforms by automatically converting blog posts from HTML to Markdown. When a new post is published in a CMS like WordPress (hooked via Webhook on Pipedream), trigger a workflow that uses 2markdown to format the post, then distribute the Markdown to platforms like Medium or Dev.to using their respective APIs.

- **Email to Markdown Archiving**: Convert HTML emails to Markdown to create a searchable archive. When a new email is received in services like Gmail (accessible via the Gmail app on Pipedream), trigger the 2markdown API to convert the email content and store it in a markdown format in a database or a service like Dropbox or Google Drive for easy reference and searchability.

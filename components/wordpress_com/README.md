# Overview

The Wordpress.com API empowers developers to extend and integrate their website's capabilities with custom automations and connections to a multitude of apps. Through Pipedream's serverless platform, you have the ability to automate content management tasks such as posting new articles, managing comments, and synchronizing users. This can streamline content workflows, enhance user engagement, and keep your site's data in sync with other services like social media, email marketing platforms, and analytics tools.

# Example Use Cases

- **Automated Content Distribution**: When a new post is published on Wordpress.com, trigger a Pipedream workflow to share the post across various social media platforms like Twitter, Facebook, and LinkedIn. This workflow can grab the post's title, excerpt, and link, then use platform-specific APIs to create new social media posts, maximizing the reach of your content without manual effort.

- **Comment Moderation Alerts**: Set up a Pipedream workflow that monitors Wordpress.com for new comments. When a comment is detected, analyze its content for specific keywords or sentiment using a service like Google's Natural Language API. If the comment requires attention (e.g., contains flagged words or negative sentiment), send an immediate alert to a Slack channel or via email to prompt review and moderation, keeping your community healthy and engaged.

- **User Synchronization and Engagement**: Create a workflow that triggers when a new user registers on your Wordpress.com site. This workflow can add the user to a CRM like HubSpot or Salesforce, subscribe them to a Mailchimp email list, and even send a personalized welcome email via SendGrid. This ensures your user data is consistent across platforms and kickstarts the user engagement process from the moment they sign up.


# Available Event Sources

Trigger workflows automatically when specific Wordpress.com events occur:

    New Post: Emit a new event when a post, page, or media attachment is published.
    Required props: site ID or URL. Optional: post type (post, page, attachment).

    New Comment: Emit a new event when a comment is added to any post or page.
    Required props: site ID or URL. Optional: post ID to filter comments.

    New Follower: Emit a new event when someone subscribes to the site's blog.
    Required props: site ID or URL.

Each source manages its own database cursor to ensure only new data is processed each time it runs — no duplicates, no missed updates.
Available Actions

Perform direct operations on your Wordpress.com site:

    Create Post: Create a new post on the site.
    Required props: site ID or URL, post title, post content.
    Optional props: post status (draft, published), categories, and tags.

    Upload Media: Upload a media file (image, video, etc.) to the site's library.
    Required props: site ID or URL, media file (binary or URL).
    Optional props: media title and description.

    Delete Post: Delete an existing post from the site.
    Required props: site ID or URL, post ID.
# Overview

The SFTP (password-based auth) API on Pipedream allows you to interact with an SFTP server to perform a variety of file operations securely. This includes uploading, downloading, and managing files and directories over an encrypted connection. By incorporating SFTP API within Pipedream workflows, you can automate file transfers, synchronize directories, process data, and integrate with other services seamlessly.

# Example Use Cases

- **Automated Backup to SFTP Server**: Create a workflow that regularly backs up local or cloud-stored files to an SFTP server. After files are backed up, you could trigger a notification via email or chat app to confirm completion.

- **Data Ingestion and Processing**: Set up a Pipedream workflow to listen for new files on an SFTP server, download them, process the data (e.g., parsing CSV, processing images with AI), and then push the results to a database like PostgreSQL or to a service like Google Sheets for further analysis.

- **Website Asset Synchronization**: Craft a workflow that watches for changes in your website's asset directory on services like GitHub, and upon detecting changes, automatically synchronizes the updated assets to the SFTP server where your website is hosted.

---
short_description: Store and read files with Bash in workflows.
thumbnail: https://res.cloudinary.com/pipedreamin/image/upload/v1646763737/docs/icons/icons8-opened-folder_y60u9l.svg
---

# File storage

If you need to download and store files, you can place them in the `/tmp` directory.

## Writing a file to /tmp

For example, to download a file to `/tmp` using `curl`

```bash
# Download the current weather in Cleveland in PNG format
curl --silent https://wttr.in/Cleveland.png --output /tmp/weather.png

# Output the contents of /tmp to confirm the file is there
ls /tmp
```

:::warning
The `/tmp` directory does not have unlimited storage. Please refer to the [disk limits](/limits/#disk) for details.
:::

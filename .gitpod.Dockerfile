# You can find the new timestamped tags here: https://hub.docker.com/r/gitpod/workspace-full/tags
FROM gitpod/workspace-full:2022-05-08-14-31-53

# Install custom tools, runtime, etc.
RUN apk add g++ make py3-pip
# You can find the new timestamped tags here: https://hub.docker.com/r/gitpod/workspace-full/tags
FROM gitpod/workspace-full:2022-05-08-14-31-53

USER gitpod
RUN echo $PD_API_KEY
# Install the PD CLI
RUN  curl https://cli.pipedream.com/linux/amd64/latest/pd.zip --output pd.zip && \
      unzip pd.zip -d pd && \
      sudo mv pd/pd /usr/local/bin/ && \
      rm -r pd && rm pd.zip && \
      mkdir ~/.config/pipedream && \
      touch ~/.config/pipedream/config && \
      echo "api_key = ${PD_API_KEY}" >> ~/.config/pipedream/config
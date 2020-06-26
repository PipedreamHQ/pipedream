//const github = require("https://github.com/PipedreamHQ/pipedream/components/github/github.app.js");
const github = require("./github.app.js");

module.exports = {
  name: "New Releases",
  description: "Triggers on new releases.",
  version: "0.0.1",
  props: {
    db: "$.service.db",
    github,
    repoFullName: { propDefinition: [github, "repoFullName"] },
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 5,
      },
    },
  },
  //dedupe: "greatest",
  async run(event) {
    console.log(this.repoFullName)
    const releases = await this.github.getReleases({
      repoFullName: `angular/angular`,
      ifModifiedSince: this.db.get('lastModified'),
    })
    console.log(releases)
    this.db.set('lastModified', releases.headers['last-modified'])
    /*
    for (let i = 0; i < releases.length; i++) {
      releases[i].commit = await this.github.getUrl({
        url: releases[i].commit.url
        since: 'deea6da0e00e8a0fca681670d65cf13d149dc482',
      })
      this.$emit(releases[i])
      console.log(releases[i])
    }
    
    /*
    releases.reverse().forEach(release => {
      if(release.published_at) {
        this.$emit(release, {
          summary: `${release.name} ${release.body}`,
          id: `${release.id}`
        })
      }
    })
    */
  },
};
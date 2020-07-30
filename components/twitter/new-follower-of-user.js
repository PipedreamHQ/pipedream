const twitter = require('https://github.com/PipedreamHQ/pipedream/components/twitter/twitter.app.js')

module.exports = { 
  name: "New Follower of User",
  description: "Emit an event when a specific user gains a follower",  
  version: "0.0.1",
  props: {
    db: "$.service.db",
    twitter,
    screen_name: { propDefinition: [twitter, "screen_name"] },
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15,
      },
    },
  },
  async run(event) {     
    const cached = this.db.get("followers") || []
    const activation = this.db.get("activation") || true
    let newFollowers = []
    const followers = (await this.twitter.getFollowers(this.screen_name))
    const latest = [...followers]
    if (JSON.stringify(latest) === JSON.stringify(cached)) {
      console.log('No new followers')
    } else {
      let lastDeleted
      let lastGapIndex
      for (let i = 0; i < cached.length; i++) {
        if(latest.includes(cached[i])) {
          delete latest[latest.indexOf(cached[i])]
          if (i - 1 !== lastDeleted) {
            //new gap detected
            lastGapIndex = i
          }
          lastDeleted = i
        }
      }

      if (lastGapIndex >= 0) {
        latest.length = lastGapIndex + 1
      }

      // filter out any deleted elements
      newFollowers = latest.filter(() => true)

      // emit up to the most recent 100 followers on the first execution to use for test events
      if (activation && newFollowers.length > 100) {
        newFollowers = newFollowers.slice(0, 100)
      }

      if (newFollowers.length > 0) {
        (await this.twitter.lookupUsers(newFollowers)).reverse().forEach(user => {
          this.$emit(user,{
            summary: user.screen_name,
            id: user.id_str,
          })
        })
      } else {
        console.log('No new followers')
      }

      // set the checkpoint to the full set of followers from the last step
      this.db.set("followers", followers)
      this.db.set("activation", false)
    }
  },
}
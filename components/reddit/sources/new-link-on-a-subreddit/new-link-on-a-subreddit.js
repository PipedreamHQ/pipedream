<<<<<<< HEAD
<<<<<<< HEAD
const reddit = require("../../reddit.app.js");
=======
const uservoice = require("../../reddit.app.js");
>>>>>>> f27aed4... PR for initial feedback
=======
const reddit = require("../../reddit.app.js");
>>>>>>> 64ff950... Fixed as per comments.

module.exports = {
    key: "new-link-on-a-subreddit",
    name: "New Link on a subreddit",
    description: "Emmits a new link submitted to a subreddit",
<<<<<<< HEAD
    version: "0.0.2",
=======
    version: "0.0.1",	
>>>>>>> f27aed4... PR for initial feedback
    props: {
        reddit,
        timer: {
            label: "Polling schedule",
            description: "Pipedream poll for new links and emit accordingly with this schedule.",
            type: "$.interface.timer",
            default: {
            intervalSeconds: 60, // by default, run every 1 minute
<<<<<<< HEAD
            },
        },
        subreddit: {
            type: "string",
            label: "Subreddit",
            description: "Enter subreddit name to listen for new links.",
        },
        db: "$.service.db"
     },
=======
        },
    },
    db: "$.service.db",
    },
>>>>>>> f27aed4... PR for initial feedback
    hooks: {
    async deploy() {

        // Emmits all existing events for the first time.
<<<<<<< HEAD

        do{
            const reddit_things = await this.getNewSubredditLinks(null, this.subreddit);
=======
        this.emitMeInfo(me_info);

        do{   
            const reddit_things = await this.getNewSubredditLinks(null);
>>>>>>> f27aed4... PR for initial feedback
            var after = reddit_things.data.data.after;
            if(after){
                last = reddit_things.data.data.children[reddit_things.data.data.children.length-1].data.name;
            }
            if(reddit_things.data.data.children.length>0){
                reddit_things.data.data.children.forEach(reddit_link => {
                    this.emitMeInfo(reddit_link);
                });
<<<<<<< HEAD
        }
        }while(after);
			this.db.set("after",after);
=======
        }		    
        }while(after);
<<<<<<< HEAD
			this.db.set("after",response.data.data.after);		
>>>>>>> f27aed4... PR for initial feedback
=======
			this.db.set("after",after);		
>>>>>>> 64ff950... Fixed as per comments.
        },
    },
    methods: {
        emitMeInfo(reddit_link) {
<<<<<<< HEAD
=======
                    
>>>>>>> f27aed4... PR for initial feedback
            this.$emit(reddit_link, {
                summary: reddit_link.data.name,
            });

        },
    },
    async run() {

<<<<<<< HEAD
<<<<<<< HEAD
        let current_after = this.db.get("after");
        const reddit_things = await this.getNewSubredditLinks(current_after,this.subreddit);
        var new_after = reddit_things.data.data.after;
        if(new_after){
=======
        let after = this.db.get("after");
        const reddit_things = await this.getNewSubredditLinks(after);
        var after = reddit_things.data.data.after;
        if(after){
>>>>>>> f27aed4... PR for initial feedback
=======
        let current_after = this.db.get("after");
        const reddit_things = await this.getNewSubredditLinks(current_after);
        var new_after = reddit_things.data.data.after;
        if(new_after){
>>>>>>> 64ff950... Fixed as per comments.
            if(reddit_things.data.data.children.length>0){
                reddit_things.data.data.children.forEach(reddit_link => {
                    this.emitMeInfo(reddit_link);
                });
<<<<<<< HEAD
<<<<<<< HEAD
                this.db.set("after",new_after);
            }
        }
=======
                this.db.set("after",after);
=======
                this.db.set("after",new_after);
>>>>>>> 64ff950... Fixed as per comments.
            }                        
        }                		
>>>>>>> f27aed4... PR for initial feedback
    },
};

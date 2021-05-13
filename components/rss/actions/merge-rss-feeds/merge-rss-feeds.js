const Parser = require('rss-parser');

module.exports = {
  name: "Merge RSS Feeds",
  description: "Retrieve multiple RSS feeds and return a merged array of items sorted by date.",
  key: "rss-merge-rss-feeds",
  version: "0.2.1",
  type: "action",
  props: {
	feeds: {
		type:"string[]",
		label:"Feeds",
		description:"The list of RSS feeds you want to parse."
	},
	merge: {
		type:"boolean",
		optional:true,
		default:true,
		description:"If true, all items are returned in a date sorted array. If false, each feed is returned as one result in the array."
	},
	rss: {
		type: "app",
		app: "rss"
	}
  },
  async run() {

	const getFeeds = async function(url) {
		return new Promise((resolve, reject) => {
			let parser = new Parser();
			resolve(parser.parseURL(url));
		})
	}

	/*
	If merge is true, its an array of feed items where each item has a .feed
	property with info on the feed. A bit repititve. It's sorted by date.

	If merge is false, each array item is an object with:

		{
			feed: info on feed
			items: items
		}
	*/
	let result = [];

	let requests = [];
	for(let i=0; i < this.feeds.length; i++) {
		requests.push(getFeeds(this.feeds[i]));
	}

	let results = await Promise.all(requests);

	for(let i=0; i < results.length; i++) {
		let feedResult = results[i];
		let feed = {
			title: feedResult.title, 
			description: feedResult.description, 
			lastBuildDate: feedResult.lastBuildDate, 
			link: feedResult.link, 
			feedUrl: feedResult.feedUrl
		};

		if(this.merge) {
			feedResult.items.forEach(f => {
				let newItem = f;
				newItem.feed = feed;
				result.push(newItem);
			});
		} else {
			result.push({
				feed, 
				items: feedResult.items
			})

		}
		
	}

	// now sort by pubDate, if merging of course
	if(this.merge) {
		result = result.sort((a,b) => {
			let aDate = new Date(a.isoDate);
			let bDate = new Date(b.isoDate);
			if(aDate < bDate) return 1;
			if(aDate > bDate) return -1;
			return 0;
		});
	} 

	return result;
  },
}
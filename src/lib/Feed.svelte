<script lang="ts" module>
	import Post from "./Post.svelte";
	import { getFeed, getMyPosts, getPost } from "./request.ts";

	let feedLoaded: boolean = $state(false);
	let feed: {
		id: string;
		content: string;
		author: string;
		userID?: string;
		time: string;
		updated: string;
		upvotes: number;
		replyingTo: string;
		replyCount: number;
	}[] = $state([]);

	/**
	 * Finds the post by its CUID
	 * @param postID
	 */
	export async function findPost(postID: string) {
		feedLoaded = false;
		feed = [];
		let result = await getPost(postID);
		//check for error
		if (typeof result == "number") {
			console.error(`Getting the post: ${result}`);

			return result;
		}
		feedLoaded = true;
		feed.push(result.posts);
		console.log("Post received: 200");
		return 200;
	}

	/**
	 * Get all current users posts.
	 */
	export async function myPosts() {
		feedLoaded = false;
		let result = await getMyPosts();
		//check for error
		if (typeof result == "number") {
			console.error(`Getting my posts: ${result}`);

			return result;
		}
		feedLoaded = true;
		feed = result.posts;
		console.log("My posts received: 200");
		return 200;
	}

	/**
	 * Refreshes the feed
	 */
	export async function updateFeed() {
		feedLoaded = false;
		let result = await getFeed();
		//check for error
		if (typeof result == "number") {
			console.error(`Getting feed: ${result}`);

			return result;
		}
		feedLoaded = true;
		feed = result.posts;
		// console.log(`Feed received: ${JSON.stringify(result.posts)}`);
		console.log(`Feed received: 200`);
		return 200;
	}
</script>

<div class="refresh">
	<button onclick={updateFeed}>Refresh feed</button>
</div>

<div>
	<!-- check if feed has been loaded empty -->
	{#if feed.length == 0 && feedLoaded}
		<div>
			<p>No Posts yet, maybe you could be the first.</p>
		</div>
		<!-- if the feed tried to load once more and failed -->
	{:else if !feedLoaded && feed.length > 0}
		<div>
			<p>Failed to refresh page, try again later.</p>
		</div>
	{/if}

	<!-- load the feed -->
	{#each feed as post (post.id)}
		<Post {...post} />
		<hr />
	{/each}
</div>

<style>
	.refresh {
		width: fit-content;
		padding: 2px;
		margin: 2px;
		margin-top: 20px;
		border: 1px solid black;
	}
</style>

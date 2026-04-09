<script>
	import Post from "./Post.svelte";
	import { getFeed } from "./request";

	let posts = $state();

	async function loadPosts() {
		let feed = await getFeed();
		posts = feed;
	}
</script>

{#each posts as post}
	<Post />
{/each}

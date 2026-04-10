<script lang="ts">
	import { myPosts } from "./Feed.svelte";
	import { logOut } from "./request.ts";
	import SignInPopup from "./SignInPopup.svelte";

	let visible = $state(false); // is the logout message visible

	async function handleLogOut() {
		const result = await logOut(); //make the request
		console.log(`Logging Out: ${result}`);
		// show that the user has logged out for 3 seconds
		visible = true;
		setTimeout(() => {
			visible = false;
		}, 3000);
	}
</script>

<!-- The Sidebar -->
<div class="sidebar">
	<SignInPopup />

	<button id="logout" onclick={handleLogOut} class="button"> LogOut </button>
	{#if visible}
		<p style="color: red; background-color: darkslategrey;">
			You have been logged out
		</p>
	{/if}
</div>

<style>
	@import "./src/app.css";
</style>

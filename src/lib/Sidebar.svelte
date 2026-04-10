<script lang="ts">
	import { myPosts } from "./Feed.svelte";
	import { logOut } from "./request.ts";
	import SignInPopup from "./SignInPopup.svelte";
</script>

<!-- The Sidebar -->
<div class="sidebar"><SignInPopup /></div>

<style>
	.sidebar {
		grid-area: sidebar;
		position: fixed;
		height: 100vh;
		width: 200px;
		background-color: rgb(181, 181, 181);
		border-right: 2px solid black;
	}
</style>

<script lang="ts" module>
	import { onMount } from "svelte";
	import { myPosts } from "./Feed.svelte";

	//TODO implement user
	import { getMyUser, getUser, getUserFull } from "./request.ts";

	let user: {
		userId: string;
		username: string;
		status: string;
		bio: string;
		settings: {
			dark: boolean;
			anon: boolean;
		};
		flagged: [string];
		active: number;
	} = $state({
		userId: "",
		username: "",
		status: "",
		bio: "",
		settings: {
			dark: false,
			anon: false
		},
		flagged: [""],
		active: 0
	});

	export async function loadMyUser() {
		const response = await getMyUser();
		if (typeof response == "number") {
			console.error(`Cannot get user:${response}`);
			return;
		}
		user = response;
		console.log("Successfully obtained user data");
		return 200;
	}

	export async function clearUser() {
		user = {
			userId: "",
			username: "",
			status: "",
			bio: "",
			settings: {
				dark: false,
				anon: false
			},
			flagged: [""],
			active: 0
		};
	}
</script>

<button class="button" onclick={loadMyUser}>Refresh User</button>
{#if !(user.username == "")}
	<div class="user">
		<h3 id="user-name">Name: {user.username}</h3>
		<p id="user-status">Status: {user.status}</p>
		<p id="user-bio">Bio: {user.bio}</p>
		<button id="getMyPosts" onclick={myPosts} class="button"
			>My Posts</button>
	</div>
{/if}

<style>
	@import "./src/app.css";
</style>

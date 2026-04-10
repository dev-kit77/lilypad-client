<script lang="ts" module>
	//TODO implement user
	import { getMyUser, getUser, getUserFull } from "./request.ts";

	export let user = {};

	async function loadUser() {
		const response = await getMyUser();
		if (typeof response == "number") {
			console.error(`Cannot get user:${response}`);
			return;
		}
		user = response;
		console.log("Successfully obtained user data");
		return 200;
	}
</script>

<style>
	@import "./src/app.css";
</style>

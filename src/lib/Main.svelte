<!-- User Page -->
<script lang="ts">
	import Feed from "$lib/Feed.svelte";
	import ReportPopup from "$lib/ReportPopup.svelte";
	import SendBox from "$lib/SendBox.svelte";
	import SettingsPopup from "$lib/SettingsPopup.svelte";
	import Sidebar from "$lib/Sidebar.svelte";
	import SignInPopup from "$lib/SignInPopup.svelte";

	// let user;
</script>

<div class="container">
	<Sidebar />
	<div class="main">
		<SendBox />

		<Feed />
	</div>
</div>

<style>
	@import "./src/app.css";
</style>

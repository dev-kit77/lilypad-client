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
	.container {
		width: 100%;
		display: grid;
		grid-template-areas: "sidebar main";
		grid-template-columns: 200px auto;
	}
	.main {
		grid-area: main;
		height: 100%;
		background-color: gray;
	}
</style>

<script>
	import Sidebar from "./lib/Sidebar.svelte";
	import SendBox from "./lib/SendBox.svelte";
	import ReportPopup from "./lib/ReportPopup.svelte";
	import Feed from "./lib/Feed.svelte";
	import SignIn from "./lib/SignIn.svelte";
	import { checkSession } from "./lib/request";

	let currentUser = null;
	let postFeed = [];
	let replyToId = null;
	let selectedPost = null;

	//Attempt to load
	window.addEventListener("DOMContentLoaded", async () => {
		const hasSession = await checkSession();
		if (hasSession) {
			await loadUser();
		}
	});

	//LOAD USER DATA
	function loadUser() {
		throw new Error("Function not implemented.");
	}
</script>

<!-- Signing in popup -->
<SignIn />

<!-- navbar -->
<aside>
	<nav>
		<Sidebar />
	</nav>
</aside>

<!-- page content -->
<Feed />

<!-- Make post field -->
<SendBox />

<!-- popup to report someone -->
<ReportPopup />

<style>
</style>

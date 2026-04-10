<script lang="ts">
	import { signUp, logIn } from "./request.ts";
	let signingIn: boolean = $state(true);
	async function signup() {
		const username = <HTMLInputElement>(
			document.getElementById("usernamesign")
		);
		const email = <HTMLInputElement>document.getElementById("emailsign");
		const password = <HTMLInputElement>(
			document.getElementById("passwordsign")
		);
		// check for empty
		if (username.value == "" || email.value == "" || password.value == "") {
			alert("All fields must be filled to sign up");
			return;
		}
		signUp(email.value, password.value, username.value);
		return 200;
	}
	async function login() {
		const email = <HTMLInputElement>document.getElementById("emaillog");
		const password = <HTMLInputElement>(
			document.getElementById("passwordlog")
		);
		if (email.value == "" || password.value == "") {
			alert("All fields must be filled to log in");
			return;
		}
		logIn(email.value, password.value);
		return 200;
	}
</script>

<div id="auth-card">
	<div id="authSelector">
		<button
			onclick={() => {
				signingIn = !signingIn;
			}}>Sign Up</button>

		<button
			onclick={() => {
				signingIn = !signingIn;
			}}>Log In</button>
	</div>
	<div>
		<form id="signIn" onsubmit={signup} class={signingIn ? "" : "hidden"}>
			<input type="text" id="usernamesign" placeholder="Username" />
			<br />
			<input type="text" id="emailsign" placeholder="Email" /> <br />
			<input type="text" id="passwordsign" placeholder="Password" />
			<br />
			<input type="submit" value="Sign In" />
		</form>
		<form id="logIn" onsubmit={login} class={signingIn ? "hidden" : ""}>
			<input type="text" id="emaillog" placeholder="Email" /><br />
			<input type="text" id="passwordlog" placeholder="Password" /><br />
			<input type="submit" value="Log In" />
		</form>
	</div>
</div>

<style>
	.hidden {
		display: none;
	}
</style>

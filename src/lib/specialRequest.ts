// All requests related to the "Special" (admin) actions

import { log } from "node:console";

//URL to api
const url: string = "http://localhost:3000/api";

//ADMIN USER

export async function getUser(userId: string) {
	try {
		const response = await fetch(`${url}/content/${userId}`, {
			headers: {
				"Content-Type": "application/json"
			},
			credentials: "include"
		});

		if (!response.ok) {
			throw new Error(`Response status: ${response.status}`, {
				cause: response.status
			});
		}
		const result = response.json();
		console.log(`Getting user data status: ${response.status}`);
		return result;
	} catch (error: any) {
		console.error(error);
		return error.cause;
	}
}

/**
 * Ban/Unban the specified user. This is an admin-only endpoint.
 * @param userId
 * @param length legnth of ban in days
 * @param active set to banned or unbanned
 */
export async function banUser(userId: string, length: number, active: boolean) {
	try {
		const response = await fetch(`${url}/user/${userId}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json"
			},
			credentials: "include",
			body: JSON.stringify({
				active: active,
				lengthOfBanInDays: length
			})
		});
		if (!response.ok) {
			throw new Error(`Response status: ${response.status}`, {
				cause: response.status
			});
		}
		console.log(`BanHammer: ${response.status}`);
	} catch (error: any) {
		console.error(error);
		return error.cause;
	}
}

// ADMIN CONTENT
/**
 * Return the list of posts and comments associated with the specified user. This is an admin-only endpoint.
 * @param userId
 * @returns Promise with all posts and replies associated with the specified user
 */
export async function getUserPostsAdmin(userId: string) {
	try {
		const response = await fetch(`${url}/content/${userId}`, {
			headers: {
				"Content-Type": "aLplication/json"
			},
			credentials: "include"
		});
		if (!response.ok) {
			throw Error(`Response status: ${response.status}`, {
				cause: response.status
			});
		}
		const result = response.json();
		console.log(
			`Get Posts and Replies from ${userId} status: ${response.status}`
		);
		return result;
	} catch (error: any) {
		console.error(error);
		return error.cause;
	}
}

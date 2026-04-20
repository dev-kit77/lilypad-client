import { getPosition } from "./geodude.ts";

var lat: number;
var lon: number;
let location: NominatimLatLon | null;
//URL to api
const url: string = "http://localhost:3000/api";

//getting POSITION
/**
 * Gets the users location
 * @returns True if it successfully got the users location, False otherwise
 */
async function getLocation() {
  let currLocation: NominatimLatLon | null;

  let res = await getPosition();

  currLocation = await retrieveGeoLocation(
    res.coords.latitude,
    res.coords.longitude,
  );

  if (!currLocation) {
    location = null;
    throw new Error("Location is null");
  }

  return currLocation;
}

//CHECK SESSION
/**
 * Refreshes the session token
 * @returns true if the session is active, false if it was unable to refresh the token
 */
export async function checkSession() {
  try {
    const res = await fetch(`${url}/auth/get-session`, {
      credentials: "include",
    });
    return res.ok;
  } catch {
    return false;
  }
}

//LOGGING OUT
/**
 * Logs the user out
 */
export async function logOut() {
  try {
    const res = await fetch(`${url}/auth/sign-out`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    return res.status;
  } catch (e: any) {
    console.error(e);
    return e;
  }
}

//LOGGING IN
/**
 * @param email
 * @param password
 * @returns data of the user
 */
export async function logIn(email: string, password: string) {
  try {
    const res = await fetch(`${url}/auth/sign-in/email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ email: email, password: password }),
    });

    if (!res.ok) {
      throw new Error(`Response status: ${res.status}`, {
        cause: res.statusText,
      });
    }

    return await res.json();
  } catch (e: any) {
    console.error(e.cause);
    return e;
  }
}

//SIGNING UP
/**
 *
 * @param email string
 * @param password string
 * @param username string
 * @returns data of the user
 */
export async function signUp(
  email: string,
  password: string,
  username: string,
) {
  try {
    const res = await fetch(`${url}/auth/sign-up/email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        email: email,
        password: password,
        name: username,
      }),
    });

    if (!res.ok) {
      throw new Error(`Response status: ${res.statusText}`, {
        cause: res.status,
      });
    }

    document.cookie = res.headers.get("set-cookie") ?? "";
    return await res.status;
  } catch (e: any) {
    console.error(e);
    return e.status;
  }
}

// PING the api
/**
 * pings the api and logs the status code (like ok: 200)
 */
export async function ping() {
  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Response status: ${res.status}`, {
        cause: res.status,
      });
    }
    const result = await res.json();
    console.log(result);
    return res.json;
  } catch (e: any) {
    console.error(e);
    return e.cause;
  }
}

//FEED request
/**
 *Return a list of posts filtered by locality.
 * @returns json Promise containing an array of Posts or status code
 */
export async function getFeed() {
  try {
    if (location === null) {
      try {
        location = await getLocation();
      } catch (e: any) {
        console.error(e);
        return e.cause;
      }
    }
    const res = await fetch(
      `${url}/feed-spatial?lat=${location.lat}&lon=${location.lon}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      },
    );

    if (!res.ok) {
      throw new Error(`Response status: ${res.status}`, {
        cause: res.status,
      });
    }
    console.log(`Retreiving Feed`);

    const result = await res.json();
    return result;
  } catch (e: any) {
    console.error(e);
    return e.cause;
  }
}

//USER requests
/**
 *
 * @returns current user's profile and settings
 */
export async function getMyUser() {
  try {
    const res = await fetch(`${url}/user`, {
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!res.ok) {
      throw new Error(`Response status: ${res.status}`, {
        cause: res.status,
      });
    }
    const result = await res.json();
    return result;
  } catch (e: any) {
    console.error(e);
    return e.cause;
  }
}

/**
 * Export personal data for the authenticated user (GDPR SAR).
 * @returns all data associated with the current user
 */
export async function getUserFull() {
  try {
    const res = await fetch(`${url}/user/gdpr-sar`, {
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    if (!res.ok) {
      throw new Error(`Response status: ${res.status}`, {
        cause: res.status,
      });
    }
    const result = await res.json();
    console.log(`GDPR get all data status: ${res.status}`);

    return result;
  } catch (e: any) {
    console.error(e);
    return e.cause;
  }
}

/**
 *Update the current user's profile and settings
 * @param Object containing user settings to be updated (each setting is optional): {username: string, bio: string, status: string , settings: {dark:bool, anon:bool}}
 */
export async function updateUser(params: {
  username?: string;
  bio?: string;
  status?: string;
  settings?: { dark?: boolean; anon?: boolean };
}) {
  try {
    const res = await fetch(`${url}/user`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(params),
    });

    if (!res.ok) {
      throw new Error(`Response status: ${res.status}`, {
        cause: res.status,
      });
    }
    const result = await res.json();
    console.log(result);
    // return result;
    return res.status;
  } catch (e: any) {
    console.error(e);
    return e.cause;
  }
}

/**
 * Delete the current user account by anonymising identity while preserving authored content.
 */
export async function deleteUser() {
  try {
    const res = await fetch(`${url}/user`, {
      method: "DELETE",
      credentials: "include",
    });
    if (!res.ok) {
      throw new Error(`Response status: ${res.status}`, {
        cause: res.status,
      });
    }
    const result = await res.json();
    console.log(result);
    return res.status;
  } catch (e: any) {
    console.error(e);
    return e.cause;
  }
}

//REPORTING
/**
 * File a report about the post specified in the path parameter {postId}.
 * @param postId
 * @param reason Reason for the report
 * @param content Detailed explanation of teh reason for the report
 * @param action Optional:
 */
export async function reportPost(
  postId: string,
  params: {
    content: string;
    reason: string;
    action?: string;
  },
) {
  try {
    const res = await fetch(`${url}/content/post/${postId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(params),
    });
    if (!res.ok) {
      throw new Error(`Response status: ${res.status}`, {
        cause: res.status,
      });
    }
    console.log(`Report: ${res.status}`);
    return res.status;
  } catch (e: any) {
    console.error(e);
    return e.cause;
  }
}

/**
 * File a report against the user specified in the path parameter {userId}.
 * @param userId
 * @param reason Reason for reporting
 * @param content The detailed explanation of the reason
 * @param action Optional:
 */
export async function reportUser(
  userId: string,
  param: {
    reason: string;
    content: string;
    action?: string;
  },
) {
  try {
    const res = await fetch(`${url}/user/${userId}/report`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(param),
    });
    if (!res.ok) {
      throw new Error(`Response status: ${res.status}`, {
        cause: res.status,
      });
    }
    console.log(`Report: ${res.status}`);
    return res.status;
  } catch (e: any) {
    console.error(e);
    return e.cause;
  }
}

/**
 * Return the specified user’s profile.
 * @param userId
 * @return the specified user's data
 */
export async function getUser(userId: string) {
  try {
    const res = await fetch(`${url}/user/${userId}`, {
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    if (!res.ok) {
      throw new Error(`Response status: ${res.status}`, {
        cause: res.status,
      });
    }
    console.log(`Fetch user: ${res.status}`);
    return res.status;
  } catch (e: any) {
    console.error(e);
    return e.cause;
  }
}

//CONTENT requests

/**
 * Returns a specified post by its CUID
 *@param postId CUID of the post
 *@returns JSON promise with data on the specified post
 */
export async function getPost(postId: string) {
  try {
    const res = await fetch(`${url}/content/${postId}`, {
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    if (!res.ok) {
      throw new Error(`Response status: ${res.status}`, {
        cause: res.status,
      });
    }
    const result = await res.json();
    console.log(`Getting post status: ${res.status}`);
    return result;
  } catch (e: any) {
    console.error(e);
    return e.cause;
  }
}

/**
 * Delete a Post.
 * @param postId
 */
export async function deletePost(postId: string) {
  try {
    const res = await fetch(`${url}/content/post/${postId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    if (!res.ok) {
      throw new Error(`Response status: ${res.status}`, {
        cause: res.status,
      });
    }
    console.log(`Getting post status: ${res.status}`);
    return res.status;
  } catch (e: any) {
    console.error(e);
    return e.cause;
  }
}

/**
 * Returns the list of posts and comments associated with the current user.
 * @returns Promise of list of posts and comments of current user
 */
export async function getMyPosts() {
  try {
    const res = await fetch(`${url}/content`, {
      credentials: "include",
    });
    if (!res.ok) {
      throw new Error(`Response status: ${res.status}`, {
        cause: res.status,
      });
    }
    const result = await res.json();
    console.log(`Get my posts: ${res.status}`);

    return result;
  } catch (e: any) {
    console.error(e);
    return e.cause;
  }
}

/**
 * Create a new post
 * @param content Text in the post
 * @returns status code
 */
export async function makePost(content: string) {
  try {
    if (location === null) {
      try {
        location = await getLocation();
      } catch (e: any) {
        console.error(e);
        return e.cause;
      }
    }

    const res = await fetch(`${url}/content/post`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        content: content,
        locality: {
          lat: location.lat,
          lon: location.lon,
        },
      }),
    });

    if (!res.ok) {
      throw new Error(`Response status: ${res.status}`, {
        cause: res.status,
      });
    }
    console.log(`Post: ${res.status}`);
    return res.status;
  } catch (e: any) {
    console.error(e);
    return e.cause;
  }
}

/**
 * Update a previously made Post.
 * @param content content of the Post
 * @param postId ID of the Post
 */
export async function updatePost(content: string, postId: string) {
  try {
    const res = await fetch(`${url}/content/post/${postId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        content: content,
      }),
    });

    if (!res.ok) {
      throw new Error(`Response status: ${res.status}`, {
        cause: res.status,
      });
    }
    console.log(`Updating post status: ${res.status}`);
    return res.status;
  } catch (e: any) {
    console.error(e);
    return e.cause;
  }
}

/**
 * Create a new reply to a post object.
 * @param content Text of the reply
 */
export async function reply(content: string, postId: string) {
  try {
    const res = await fetch(`${url}/content/post/${postId}/reply`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        content: content,
      }),
    });

    if (!res.ok) {
      throw new Error(`Response status: ${res.status}`, {
        cause: res.status,
      });
    }
    console.log(`Reply: ${res.status}`);
    return res.status;
  } catch (e: any) {
    console.error(e);
    return e.cause;
  }
}

/**
 * Return all replies to a post object.
 * @param postId
 * @returns Promise with all replies from the specified post
 */
export async function getReply(postId: string) {
  try {
    const res = await fetch(`${url}/content/post/${postId}/reply`, {
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    if (!res.ok) {
      throw new Error(`Response status: ${res.status}`, {
        cause: res.status,
      });
    }
    const result = await res.json();
    console.log(`Get Replies to ${postId} status: ${res.status}`);
    return result;
  } catch (e: any) {
    console.error(e);
    return e.cause;
  }
}

/**
 * Upvote a Post.
 * @param postId
 * @returns status code
 */
export async function makeUpvote(postId: string) {
  try {
    const res = await fetch(`${url}/content/post/${postId}/upvote`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    if (!res.ok) {
      throw new Error(`Response status: ${res.statusText}`, {
        cause: res.status,
      });
    }
    // const result = await res.json();
    console.log(`Make Upvote to ${postId} status: ${res.status}`);
    return res.status;
  } catch (e: any) {
    console.error(e);
    return e.cause;
  }
}

const NOMINATIM_REVERSE_ENDPOINT =
  "https://nominatim.openstreetmap.org/reverse";

export type NominatimLatLon = {
  lat: number;
  lon: number;
};

/**
 * Retrieve geolocation coordinates through the Nominatim API and returns latitude and longitude.
 * API docs: https://nominatim.org/release-docs/latest/api/Reverse/
 */
export async function retrieveGeoLocation(
  lat: number,
  lon: number,
): Promise<NominatimLatLon | null> {
  // This makes it possible to retrieve location information
  //  only up to the village / suburb level
  // This makes it possible to retrieve location information
  //  only up to the village / suburb level
  const zoom = 13;
  const params = new URLSearchParams({
    format: "json",
    lat: String(lat),
    lon: String(lon),
    zoom: String(zoom),
  });

  try {
    const res = await fetch(`${NOMINATIM_REVERSE_ENDPOINT}?${params}`, {
      headers: {
        Accept: "application/json",
        "User-Agent": "Lilypad-client/1.0 (contact: coursework)",
      },
    });
    if (!res.ok) {
      return null;
    }
    const data = (await res.json()) as {
      e?: string;
      lat?: string;
      lon?: string;
    };
    if (data.e != null || data.lat == null || data.lon == null) {
      return null;
    }
    // console.log(`Location: ${data.lat}, ${data.lon}`);

    return {
      lat: Number.parseFloat(data.lat),
      lon: Number.parseFloat(data.lon),
    };
  } catch (e: any) {
    console.error(`NOMINATIM ERROR${e}`);
    return null;
  }
}

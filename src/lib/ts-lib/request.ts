import { getPosition } from "./geodude.ts";

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
  const res = await fetch(`${url}/auth/get-session`, {
    credentials: "include",
  });

  if (!res.ok) {
    console.error(`Failed to get session: ${res.status} ${res.statusText}`);
  }

  return res.ok;
}

//LOGGING OUT
/**
 * Logs the user out
 */
export async function logOut() {
  const res = await fetch(`${url}/auth/sign-out`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error(`${res.statusText}`, {
      cause: res.status,
    });
  }

  return await res.json();
}

//LOGGING IN
/**
 * @param email
 * @param password
 * @returns json response
 */
export async function logIn(email: string, password: string) {
  const res = await fetch(`${url}/auth/sign-in/email`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ email: email, password: password }),
  });

  if (!res.ok) {
    throw new Error(`${res.statusText}`, {
      cause: res.status,
    });
  }

  return await res.json();
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
    throw new Error(`${res.statusText}`, {
      cause: res.status,
    });
  }

  return res.json();
}

// PING the api
/**
 * pings the api and logs the status code (like ok: 200)
 */
export async function ping() {
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`${res.statusText}`, {
      cause: res.status,
    });
  }

  return await res.json();
}

//FEED request
/**
 *Return a list of posts filtered by locality.
 * @returns json Promise containing an array of Posts or status code
 */
export async function getFeed() {
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
    throw new Error(`${res.statusText}`, {
      cause: res.status,
    });
  }

  return await res.json();
}

//USER requests
/**
 *
 * @returns current user's profile and settings
 */
export async function getMyUser() {
  const res = await fetch(`${url}/user`, {
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error(`${res.statusText}`, {
      cause: res.status,
    });
  }

  return await res.json();
}

/**
 * Export personal data for the authenticated user (GDPR SAR).
 * @returns all data associated with the current user
 */
export async function getUserFull() {
  const res = await fetch(`${url}/user/gdpr-sar`, {
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error(`${res.statusText}`, {
      cause: res.status,
    });
  }

  return await res.json();
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

  return await res.json();
}

/**
 * Delete the current user account by anonymising identity while preserving authored content.
 */
export async function deleteUser() {
  const res = await fetch(`${url}/user`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error(`${res.statusText}`, {
      cause: res.status,
    });
  }

  return await res.json();
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
  const res = await fetch(`${url}/content/post/${postId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(params),
  });

  if (!res.ok) {
    throw new Error(`${res.statusText}`, {
      cause: res.status,
    });
  }

  return await res.json();
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
  const res = await fetch(`${url}/user/${userId}/report`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(param),
  });

  if (!res.ok) {
    throw new Error(`${res.statusText}`, {
      cause: res.status,
    });
  }

  return await res.json();
}

/**
 * Return the specified user’s profile.
 * @param userId
 * @return the specified user's data
 */
export async function getUser(userId: string) {
  const res = await fetch(`${url}/user/${userId}`, {
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error(`${res.statusText}`, {
      cause: res.status,
    });
  }

  return await res.json();
}

//CONTENT requests

/**
 * Returns a specified post by its CUID
 *@param postId CUID of the post
 *@returns JSON promise with data on the specified post
 */
export async function getPost(postId: string) {
  const res = await fetch(`${url}/content/${postId}`, {
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error(`${res.statusText}`, {
      cause: res.status,
    });
  }

  return await res.json();
}

/**
 * Delete a Post.
 * @param postId
 */
export async function deletePost(postId: string) {
  const res = await fetch(`${url}/content/post/${postId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error(`${res.statusText}`, {
      cause: res.status,
    });
  }

  return await res.json();
}

/**
 * Returns the list of posts and comments associated with the current user.
 * @returns Promise of list of posts and comments of current user
 */
export async function getMyPosts() {
  const res = await fetch(`${url}/content`, {
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error(`${res.statusText}`, {
      cause: res.status,
    });
  }

  return await res.json();
}

/**
 * Create a new post
 * @param content Text in the post
 * @returns status code
 */
export async function makePost(content: string) {
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
    throw new Error(`${res.statusText}`, {
      cause: res.status,
    });
  }

  return res.json();
}

/**
 * Update a previously made Post.
 * @param content content of the Post
 * @param postId ID of the Post
 */
export async function updatePost(content: string, postId: string) {
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
    throw new Error(`${res.statusText}`, {
      cause: res.status,
    });
  }

  return res.json();
}

/**
 * Create a new reply to a post object.
 * @param content Text of the reply
 */
export async function reply(content: string, postId: string) {
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
    throw new Error(`${res.statusText}`, {
      cause: res.status,
    });
  }

  return res.json();
}

/**
 * Return all replies to a post object.
 * @param postId
 * @returns Promise with all replies from the specified post
 */
export async function getReply(postId: string) {
  const res = await fetch(`${url}/content/post/${postId}/reply`, {
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error(`${res.statusText}`, {
      cause: res.status,
    });
  }

  return res.json();
}

/**
 * Upvote a Post.
 * @param postId
 * @returns status code
 */
export async function makeUpvote(postId: string) {
  const res = await fetch(`${url}/content/post/${postId}/upvote`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error(`${res.statusText}`, {
      cause: res.status,
    });
  }

  return res.json();
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

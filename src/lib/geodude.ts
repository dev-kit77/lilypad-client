/**
 *
 * @returns Promise containing the geolocationof the user
 */
export function getPosition(): Promise<GeolocationPosition> {
	// Simple wrapper
	return new Promise((res, rej) => {
		navigator.geolocation.getCurrentPosition(res, rej);
	});
}

import { useAuth0 } from "@auth0/auth0-react";
import { useCallback } from "react";
import axios from "axios";

export const useAuthorizedApi = ( base_url ) => {
	// const { isAuthenticated } = useAuth0();
	const { getAccessTokenSilently } = useAuth0();

	const get = useCallback( async ( url, params = {} ) => {

		const accessToken = await getAccessTokenSilently();

		return await axios.get( `${base_url}${url}`, {
			headers: {
				Authorization: `Bearer ${accessToken}`,
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'Access-Control-Allow-Origin': '*'
			}, params
		} )
	}, [ base_url, getAccessTokenSilently ] )

	return { get }
}

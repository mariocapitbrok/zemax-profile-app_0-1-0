import { useAuth0 } from "@auth0/auth0-react";
import { useCallback } from "react";
import axios from "axios";

export const usePostApi = ( base_url ) => {
	// const { isAuthenticated } = useAuth0();
	const { getAccessTokenSilently } = useAuth0();
	const post = useCallback( async ( url, params, data = {} ) => {

		const accessToken = await getAccessTokenSilently()

		return await axios.post( `${base_url}${url}`, { data }, {
			headers: {
				Authorization: `Bearer ${accessToken}`,
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'Access-Control-Allow-Origin': '*'
			}, params
		} )
	}, [ base_url, getAccessTokenSilently ] )

	return { post }
}

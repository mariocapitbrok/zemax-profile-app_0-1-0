import Link from "./Link";
import { FormattedMessage } from "react-intl";
import React, { useEffect, useState } from "react";
import { useAuthorizedApi } from "../api/useAuthorizedApi";

export default function LinkToInsided ( auth0_id ) {
	const baseUrl = process.env.REACT_APP_AZURE_BASE_URL;
	// const baseUrl = "http://localhost:7071/api/";
	const { get } = useAuthorizedApi( baseUrl );
	const [ userLink, setUserLink ] = useState( '' );

	useEffect( () => {
		get( 'insided_get_user_link', {
		   auth0_id: auth0_id.auth0_id
	   } ).then( ( { data: value } ) => {

		   //console.warn( value );
		   setUserLink( 'https://community.zemax.com/ssoproxy/login?ssoType=openidconnect&returnUrl='+ value.link )
		   // setLoaded( true )
	   } );
		setUserLink('https://community.zemax.com/');
   }, [ ] );

	return (
		<>
			{userLink && <Link href={userLink} target="_blank" rel="noreferrer">
				<FormattedMessage id="myAccount.forumButton"
								  defaultMessage="Forum Profile & Activity" /></Link>}
		</>
	)
}

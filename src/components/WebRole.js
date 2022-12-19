import React, { useEffect, useState } from "react";
import { Card, Spinner } from "@shopify/polaris";
import { useAuth0 } from "@auth0/auth0-react";
import { useAuthorizedApi } from '../api/useAuthorizedApi';
import {
	contactidValue,
	userDetailsState,
	webRoleAdministrator,
	webRolesState,
	webRoleTemp,
	webRoleStudent,
	preferredLanguageValue, zendeskidValue, getRolesState, unsupportedUserState
} from "../atoms/profileAtom";
import { useRecoilState, useSetRecoilState } from 'recoil'
import { preferredLangPicklist } from "../helpers/preferredLangPicklist";
import { webRolesEN } from "../locales/enWebroles"
import { webRolesJa } from "../locales/jaWebroles";
import { webRolesZh } from "../locales/zhWebroles";
import getLocal from "../helpers/getLocal";
import { FormattedMessage } from "react-intl";

let rows = [];
let webRoles;
const local = getLocal() || 'en';
switch ( local ) {
	case "ja":
		webRoles = webRolesJa;
		break;
	case "zh-TW":
		webRoles = webRolesZh;
		break;
	case "zh-CN":
		webRoles = webRolesZh;
		break;
	default:
		webRoles = webRolesEN;
		break;
}

const getRole = function ( adx_webroleid ) {

	if ( webRoles.find( role => role.roleid === adx_webroleid ) ) {
		return webRoles.find( role => role.roleid === adx_webroleid );
	} else {
		return {
			display: adx_webroleid,
			description: adx_webroleid
		}
	}
}

const getLang = ( id_lang ) => {
	if ( preferredLangPicklist.find( lang => lang.id === id_lang ) ) {
		return preferredLangPicklist.find( lang => lang.id === id_lang );
	} else {
		return {
			lang: 'EN'
		}
	}
}

export default function WebRole () {
	const { user } = useAuth0();
	const [ rolesData, setRolesData ] = useRecoilState( webRolesState );
	const [ contactid, setContactid ] = useRecoilState( contactidValue );
	// const contactid = window.localStorage.getItem( 'contactid' ) || '';
	// const rolesData = window.localStorage.getItem( 'rolesData' ) || [];
	const [ zendeskid, setZendeskid ] = useRecoilState( zendeskidValue );
	const [ getRoles, setGetRoles ] = useRecoilState( getRolesState );
	const setUserDetails = useSetRecoilState( userDetailsState );
	const setIsAdmin = useSetRecoilState( webRoleAdministrator );
	const setIsTemp = useSetRecoilState( webRoleTemp );
	const setIsStudent = useSetRecoilState( webRoleStudent );
	const setUnsupportedUser = useSetRecoilState( unsupportedUserState );
	const setPreferredLanguage = useSetRecoilState( preferredLanguageValue );
	const [ isLoadedRoles, setIsLoadedRoles ] = useState( false );
	const [ changeUser, setChangeUser ] = useState( false );
	const baseUrl = process.env.REACT_APP_AZURE_BASE_URL;
	// const baseUrl = "http://localhost:7071/api/";
	const { get } = useAuthorizedApi( baseUrl );
	let local_auth0_id = window.localStorage.getItem( 'auth0_id' );

	useEffect( () => {
		if ( local_auth0_id !== user.sub ) {
			setChangeUser( changeUser => !changeUser )
			window.localStorage.setItem( 'auth0_id', user.sub );
			window.localStorage.setItem( 'webroles', '' );
			window.localStorage.setItem( 'contactid', '' );
			window.localStorage.setItem( 'zemax_zendeskid', '' );
			console.log( 'changed' );

		}
		if ( window.localStorage.getItem( 'webroles' ) ) {
			setRolesData( JSON.parse( window.localStorage.getItem( 'webroles' ) ) );
		}
	}, [ user.sub ] )

	function checkIsAdmin ( rolesData ) {
		// Admin users
		// Customer Self Service Admin
		// 'Super Admin'
		const maped = rolesData.map( ( row ) => {
			if ( row.adx_webroleid === 'afb83f89-e3f0-e811-a961-000d3a378f36' || row.adx_webroleid === '33d05187-37a1-eb11-b1ac-0022480897c8' ) {
				setIsAdmin( true );
			}
		} )
	}

	function checkIsTemp ( rolesData ) {
		//'Temp Supported Users'
		const maped = rolesData.map( ( row ) => {
			if ( row.adx_webroleid === 'd271ea1f-aeec-e811-a961-000d3a37870e' ) {
				setIsTemp( true );
			}
		} )
	}

	function checkIsStudent ( rolesData ) {
		// Student user
		const maped = rolesData.map( ( row ) => {
			if ( row.adx_webroleid === 'f2db1fe1-d74f-e911-a972-000d3a37870e' ) {
				setIsStudent( true );
				setUnsupportedUser( true );
			}
		} )
	}

	function getUserInfo() {
		// console.log(user.sub)
		get( 'dynamics_get_webrole', { auth0_id: user.sub } )
			.then( ( { data: value } ) => {
				if (value !== 0) {
					window.localStorage.setItem( 'auth0_id', user.sub );
					window.localStorage.setItem( 'webroles', JSON.stringify( value.webroles ) || '' );
					window.localStorage.setItem( 'contactid', value.contactid || '');
					window.localStorage.setItem( 'zemax_zendeskid', value.zemax_zendeskid || '');
					setZendeskid(  value.zemax_zendeskid );
					setContactid(  value.contactid );
					setUserDetails( value.userdetails );
					// console.warn( 'webrole ' );
					console.warn( value );
					if (window.localStorage.getItem( 'webroles' ) !== 'undefined') {
						setRolesData( JSON.parse( window.localStorage.getItem( 'webroles' ) ) );
					}

					try {
						checkIsAdmin( value.webroles );
						checkIsTemp( value.webroles );
						checkIsStudent( value.webroles );
					} catch ( e ) {}
				} else {
					getUserInfo()
				}

		} ).finally( () => {
			// console.log(window.localStorage.getItem( 'contactid' ));
			setIsLoadedRoles( true );
			setGetRoles( true );
		} );
	}

	useEffect( () => {
		// console.log(!contactid)
		if ( !contactid && !isLoadedRoles) {
			getUserInfo()
		}
	}, [ changeUser, contactid ] );

	if ( rolesData && rolesData.length ) {
		rows = rolesData.map( row => ([
			<Card key={row.adx_name} title={getRole( row.adx_webroleid ).display} sectioned>
				<p>{getRole( row.adx_webroleid ).description}</p>
			</Card>
		]) );
	} else if ( isLoadedRoles ) {
		rows = [
			<Card key={0} title={<FormattedMessage id="webRoles.unsupportedTitle"
												   defaultMessage="You are unsupported" />} sectioned>
				<p><FormattedMessage id="webRoles.unsupportedMessage"
									 defaultMessage="This means you have limited access to our Knowledgebase articles and Zemax community forums and will not be able to open new tickets. To become a supported customer, you must either extend the support contract or subscription period of a license for which you are the License Administrator or End User or you need to be added as an End User of an existing supported license." />
				</p>
			</Card>
		]
		setUnsupportedUser( true );
	}

	return (
		<>
			{rolesData ? rows : <Spinner size='small' />}
		</>
	)
}

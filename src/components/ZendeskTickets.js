import React, { useState, useEffect, useCallback, useRef } from "react";
import {
	DisplayText,
	Link,
	Spinner,
} from '@shopify/polaris';
import { useAuth0 } from "@auth0/auth0-react";
import { useAuthorizedApi } from '../api/useAuthorizedApi';
import StyledLink from "./StyledLink"
import StyledLinkSolid from "./StyledLinkSolid"
import usePagination from "./usePagination"
import slicer from "../helpers/slicer";
import { FormattedMessage } from "react-intl";
import { useRecoilState, useRecoilValue } from "recoil";
import { preferredLanguageValue, ticketDataState, unsupportedUserState, zendeskidValue } from "../atoms/profileAtom";
import humanityDate from "../helpers/humanityDate";
import copyArr from "../helpers/copyArr";
import StyledLinkDisabled from "./StyledLinkDisabled";
import ZendeskTable from "./ZendeskTable";

const zendeskURL = 'https://zemax.zendesk.com/agent/tickets/';

const adapterTickets = ( raw ) => {
	return raw.map( r => {

		if ( r.is_public ) {
			return ([
					r.id,
					r.subject,
					r.status,
					r.created_at,
					r.updated_at
				]
			)
		}
		return false
	} )
}

function sortTable ( rows, index, direction ) {
	let tempArray = copyArr( rows );

	// sort number
	if ( index === 0 ) {
		return tempArray.sort( ( rowA, rowB ) => {
			const amountA = rowA[ index ];
			const amountB = rowB[ index ];

			if ( direction === 'ascending' ) {
				return amountA - amountB
			} else {
				return amountB - amountA
			}
		} );
	}

	return tempArray.sort( ( rowA, rowB ) => {
		const amountA = rowA[ index ].toLowerCase();
		const amountB = rowB[ index ].toLowerCase();

		if ( amountB < amountA ) {
			return direction === 'descending' ? -1 : 1;
		}
		if ( amountB > amountA ) {
			return direction === 'ascending' ? -1 : 1;
		}

		return 0
	} );
}

function getGeo () {
	const html = document.getElementsByTagName( 'html' )[ 0 ];
	//console.log(locale);
	// ip_others

	return html.getAttribute( 'id' );
}

function getLang () {
	const html = document.getElementsByTagName( 'html' )[ 0 ];
	//console.log(locale);
	// ip_others

	return html.getAttribute( 'lang' );
}

export default function ZendeskTickets () {
	const { user } = useAuth0();
	const azureBaseURL = process.env.REACT_APP_AZURE_BASE_URL;
	// const azureBaseURL = "http://localhost:7071/api/";
	// const userName = 'auth0|5f974066b41d7d006ead46dd'; // Aaron user
	const [ zemax_zendeskid, setZemax_zendeskid ] = useRecoilState( zendeskidValue );
	const local = useRecoilValue( preferredLanguageValue );
	const unsupportedUser = useRecoilValue( unsupportedUserState );
	const { get } = useAuthorizedApi( azureBaseURL );
	// const [ ticketData, setTicketData ] = useState( [] );
	const [ ticketData, setTicketData ] = useRecoilState( ticketDataState );
	const [ adaptedTicketData, setAdaptedTicketData ] = useState( [] );
	const ticketsRef = useRef();
	const [ loaded, setLoaded ] = useState( false );
	const [ isAsia, setIsAsia ] = useState( true );
	// let zemax_zendeskid = window.localStorage.getItem( 'zemax_zendeskid' )
	// let zemax_zendeskid = '';
	// console.log(zemax_zendeskid)

	const [ rows, setRows ] = useState( [
		[
			<Spinner accessibilityLabel="Small spinner" size="small" />
		]
	] )

	const handleSort = useCallback(
		( index, direction ) => setAdaptedTicketData( adaptedTicketData => sortTable( adaptedTicketData, index, direction ) ),
		[ adaptedTicketData ],
	);

	useEffect( () => {
		// zemax_zendeskid = window.localStorage.getItem( 'zemax_zendeskid' ) || '';
		// console.log( zemax_zendeskid );
		if ( zemax_zendeskid ) {
			get( 'zendesk_tickets_by_id', {
				user_email: user.email,
				zemax_zendeskid: zemax_zendeskid,
				auth0_id: user.sub
			} ).then( ( { data: value } ) => {
				let tickets = [];
				value.forEach( item => {
					if ( item.is_public ) {
						tickets.push( item )
					}
				} )
				setTicketData( tickets );
				console.warn( value );
				setLoaded( true )
			} ).finally(()=>{
				setLoaded( true )
			});
		}

	}, [ zemax_zendeskid ] );

	const { paged, handlePagination, page, maxPages, handleViewAll } = usePagination( rows, 4 )

	useEffect( () => {
		setAdaptedTicketData( sortTable( adapterTickets( ticketData ), 4, 'descending' ) );
		// console.log( ticketData );
	}, [ ticketData ] )

	useEffect( () => {
		setRows( adaptedTicketData.map( row => ([
				<Link
					key={row[ 0 ]}
					url={zendeskURL + row[ 0 ]}
					external={true}
				>{row[ 0 ]}</Link>,
				slicer( row[ 1 ], 64 ),
				<span style={{ textTransform: "capitalize", fontFamily: "MyriadPro-Semibold" }}>{row[ 2 ]}</span>,
				humanityDate( row[ 3 ] ),
				humanityDate( row[ 4 ] )
			]
		) ) );
		if ( window.location.hash === '#support-tickets' && ticketsRef.current ) {

			setTimeout( () => {
				const { offsetTop } = ticketsRef.current || 0
				window.scrollTo( 0, offsetTop - 78 );
			}, 1000 )
		}
		// setLoaded( true )
		// console.log( JSON.stringify(ticketData) );
		// console.log( adaptedTicketData );
	}, [ adaptedTicketData ] )

	let geo = getGeo();

	useEffect( () => {
		if ( geo !== 'ip_other' ) {
			setIsAsia( false )
		}
	}, [ geo ] )


	return (
		<div id="support-tickets" ref={ticketsRef}>
			<DisplayText size="large">
				<FormattedMessage id="supportTicket.titleSection"
								  defaultMessage="Support Tickets" />
			</DisplayText>
			<div className="support-links">
				{!unsupportedUser ? <StyledLink href="https://support.zemax.com/hc/requests/new" target="_blank">
					<FormattedMessage id="supportTicket.newTicket"
									  defaultMessage="Open a New Ticket" />
				</StyledLink> : <StyledLinkDisabled disabled="disabled">
					<FormattedMessage id="supportTicket.newTicket"
									  defaultMessage="Open a New Ticket" />
				</StyledLinkDisabled>}
				{local === 'en' &&
				<>
					{!unsupportedUser ?
						<StyledLink href="https://support.zemax.com/hc/requests/new?scheduled-calls=true" target="_blank">
							<FormattedMessage id="supportTicket.newCall"
											  defaultMessage="Schedule a Call" />
						</StyledLink> : <StyledLinkDisabled disabled="disabled">
							<FormattedMessage id="supportTicket.newCall"
											  defaultMessage="Schedule a Call" />
						</StyledLinkDisabled>
					}
				</>}
				<StyledLinkSolid href="https://community.zemax.com/ssoproxy/login?ssoType=openidconnect" target="_blank">
					<FormattedMessage id="supportTicket.askCommunity"
									  defaultMessage="Ask the Community" />
				</StyledLinkSolid>
			</div>

			{!loaded && !unsupportedUser && <Spinner size="small" />}
			{loaded &&
			<ZendeskTable loaded={loaded} adaptedTicketData={adaptedTicketData} handleSort={handleSort} rows={paged} page={page} maxPages={maxPages} handlePagination={handlePagination} handleViewAll={handleViewAll}/>}
			{!loaded && unsupportedUser &&
			<DisplayText size="small">
				<FormattedMessage id="supportTicket.noTickets"
								  defaultMessage="There are currently no Support Tickets associated with this account." />
			</DisplayText>}
		</div>
	)
}
;

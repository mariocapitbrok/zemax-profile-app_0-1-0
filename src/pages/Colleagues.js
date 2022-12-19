import { useCallback, useEffect, useState } from "react";
import { DataTable, Card, Spinner, DisplayText } from "@shopify/polaris";
import React from "react";
import { useAuthorizedApi } from "../api/useAuthorizedApi";
import { useAuth0 } from "@auth0/auth0-react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { activeComponentAtom, colleaguesDataState } from "../atoms/profileAtom";
import copyArr from "../helpers/copyArr";
import adapterColleaguesManage from "../helpers/adapterColleaguesManage";
import usePagination from "../components/usePagination";
import ColleaguesTableView from "../components/ColleaguesTableView";
import { FormattedMessage } from "react-intl";

function sortTable ( rows, index, direction ) {
	let tempArray = copyArr( rows );

	return tempArray.sort( ( rowA, rowB ) => {
		const amountA = rowA[ index ];
		const amountB = rowB[ index ];

		if ( amountB < amountA ) {
			return direction === 'descending' ? -1 : 1;
		}
		if ( amountB > amountA ) {
			return direction === 'ascending' ? -1 : 1;
		}

		return 0
	} );
}

export default function Colleagues () {
	const { user } = useAuth0();
	const azureBaseURL = process.env.REACT_APP_AZURE_BASE_URL;
	// const azureBaseURL = 'http://localhost:7071/api/';
	const [ adaptedColleaguesData, setAdaptedColleaguesData ] = useState( [] );
	const [ colleaguesData, setColleaguesData ] = useRecoilState( colleaguesDataState );
	const [ jobFunctionData, setJobFunctionData ] = useState( {} );
	const [ accountManagerData, setAccountManagerData ] = useState( [] );
	const setActiveComponent = useSetRecoilState( activeComponentAtom );
	const { get } = useAuthorizedApi( azureBaseURL );
	const [ rows, setRows ] = useState( [] );
	const [ loadingPage, setLoadingPage ] = useState( true );

	const handleSort = useCallback(
		( index, direction ) => setAdaptedColleaguesData( adaptedColleaguesData => sortTable( adaptedColleaguesData, index, direction ) ),
		[ adaptedColleaguesData ],
	);

	useEffect( () => {
		if (colleaguesData) {
			setAdaptedColleaguesData( sortTable( adapterColleaguesManage( colleaguesData ), 0, 'descending' ) );
		}
	}, [ colleaguesData ] )

	const
		{ paged, handlePagination, page, maxPages, handleViewAll }
			= usePagination( rows, 10 )


	useEffect( () => {
		// console.log( colleaguesData )
		setRows( adaptedColleaguesData.map( row => ([
			row[ 0 ],
			row[ 1 ],
			row[ 2 ],
			row[ 3 ],
			row[ 4 ],
		]) ) )
	}, [ colleaguesData, adaptedColleaguesData ] )

	useEffect( () => {
		get( 'dynamics_get_colleagues_view', { auth0_id: user.sub } ).then( ( { data: val } ) => {
			// console.warn( val );
			setColleaguesData( val.colleagues );
			setJobFunctionData( val.new_jobfunction );
			setAccountManagerData( val.account_manager );
			window.scrollTo( 0, 0 );
			setLoadingPage( false );
		} );
	}, [] )

	useEffect( () => {
		window.history.replaceState( { page: 2 }, 'view colleagues page' );
	}, [] )

	window.onpopstate = function ( event ) {
		event.preventDefault();
		window.history.replaceState( { page: 1 }, 'to main' );
		setActiveComponent( "mainPage" );
	}

	if ( jobFunctionData === 100000007 && !loadingPage) {

		const acc_manager = accountManagerData.map( row => ([
			row[ 'systemuser1.firstname' ] + ' ' + row[ 'systemuser1.lastname' ],
			row[ 'systemuser1.internalemailaddress' ],
			row[ 'systemuser1.address1_telephone1' ]
		]) )

		return (
			<>
				<DisplayText size="medium">
					<FormattedMessage id="viewColleague.notPermitted" defaultMessage="You are not permitted to view this content. Our records show you are a student and are therefore not permitted to view general contact lists. If you are not a student and wish to see this content please contact your institutions account manager:" />
				</DisplayText>
				<Card>
					<DataTable rows={acc_manager}
							   columnContentTypes={[
								   'text',
								   'text',
								   'text' ]}
							   headings={[
								   <FormattedMessage id="fullName" defaultMessage="Name"/>,
								   <FormattedMessage id="email" defaultMessage="Email"/>,
								   <FormattedMessage id="phone" defaultMessage="Phone"/>,
								   ]}
					/>
				</Card>
			</>
		)
	}

	if (!loadingPage && jobFunctionData !== 100000007 && colleaguesData && colleaguesData.length ) {

		return (
			<Card>
				<ColleaguesTableView adaptedColleaguesData={adaptedColleaguesData} rows={paged} handleSort={handleSort} page={page} maxPages={maxPages} handlePagination={handlePagination} handleViewAll={handleViewAll}/>
			</Card>
		)
	}

	return (
		<>
			{loadingPage && <Spinner size="small" />}
		</>
	)
}

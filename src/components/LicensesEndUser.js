import { useAuth0 } from "@auth0/auth0-react";
import { useAuthorizedApi } from "../api/useAuthorizedApi";
import { useRecoilState } from "recoil";
import { editColleagueValue, updateLicensesTable } from "../atoms/profileAtom";
import React, { useCallback, useEffect, useState } from "react";
import getStatusLicense from "../helpers/getStatusLicense";
import humanityDate from "../helpers/humanityDate";
import { Card, DisplayText, Spinner } from "@shopify/polaris";
import LicenseEndUserTable from "./LicenseEndUserTable";
import usePagination from "./usePagination";
import adapterLicencesEndUser from "../helpers/adapterLicencesEndUser";
import { FormattedMessage } from "react-intl";
import sortingLicensesTableEndUser from "../helpers/sortingLicensesTableEndUser";

export default function LicensesEndUser () {
	const { user } = useAuth0();
	const azureBaseURL = process.env.REACT_APP_AZURE_BASE_URL;
	// const azureBaseURL = 'http://localhost:7071/api/';
	// const userName = 'auth0|5f974066b41d7d006ead46dd'; // Aaron user
	const { get } = useAuthorizedApi( azureBaseURL );
	const [ editColleagueId, setEditColleagueId ] = useRecoilState( editColleagueValue );
	const [ updateLicenses, setUpdateLicenses ] = useRecoilState( updateLicensesTable );
	const [ colleaguesLicensesEndUser, setColleaguesLicensesEndUser ] = useState( [] );
	const [ adaptedColleaguesLicensesEndUser, setAdaptedColleaguesLicensesEndUser ] = useState( [] );
	const [ rows, setRows ] = useState( [] );
	const [ isEndUserLoaded, setIsEndUserLoaded ] = useState( false );
	// console.log( colleaguesLicensesEndUser )

	const handleSort = useCallback(
		( index, direction ) => setAdaptedColleaguesLicensesEndUser( adaptedColleaguesLicensesEndUser => sortingLicensesTableEndUser( adaptedColleaguesLicensesEndUser, index, direction ) ),
		[ adaptedColleaguesLicensesEndUser ],
	);

	useEffect( () => {
		setIsEndUserLoaded( false )
		get( 'dynamics_get_enduser_licenses_by_accountid', { auth0_id: user.sub, contactid: editColleagueId } ).then( ( { data: val } ) => {
			// console.warn( '--==>' );
			// console.warn( val );
			// setLicensesObject( val );
			setColleaguesLicensesEndUser( val );
		} ).finally( () => {
			setIsEndUserLoaded( true );
		} );
	}, [ editColleagueId, updateLicenses ] );

	useEffect( () => {
		if (colleaguesLicensesEndUser && colleaguesLicensesEndUser.length) {
			setAdaptedColleaguesLicensesEndUser( sortingLicensesTableEndUser( adapterLicencesEndUser( colleaguesLicensesEndUser ), 2, 'descending' ) );
		}
		// console.log( adaptedColleaguesLicensesEndUser )

	}, [ colleaguesLicensesEndUser ] )

	const
		{ paged, handlePagination, page, maxPages, handleViewAll }
			= usePagination( rows, 10 );

	useEffect( () => {
		if ( adaptedColleaguesLicensesEndUser && adaptedColleaguesLicensesEndUser.length ) {
			setRows( adaptedColleaguesLicensesEndUser.map( row => ([
				row[ 0 ],
				getStatusLicense(row[ 1 ]),
				humanityDate( row[ 2 ] ),
				row[ 3 ],
				row[ 4 ],
				row[ 5 ],
				row[ 6 ],
				row[ 7 ],
				humanityDate( row[ 8 ] )
			]
			) ) )
		}
		//console.log('adaptedColleaguesLicensesEndUser '+ adaptedColleaguesLicensesEndUser);
	}, [ isEndUserLoaded, adaptedColleaguesLicensesEndUser ] )


	return (
		<div style={{
			paddingBottom: "40px"
		}}>

			{!isEndUserLoaded && <Spinner size="small" />}
			{isEndUserLoaded && !colleaguesLicensesEndUser.length && <p>
				<FormattedMessage id="noRecords"
								  defaultMessage="There are no records to display." />
			</p>}
			<Card>
				{isEndUserLoaded &&
				<LicenseEndUserTable
					page={page}
					maxPages={maxPages}
					rows={paged}
					adaptedColleaguesLicensesEndUser={adaptedColleaguesLicensesEndUser}
					handlePagination={handlePagination}
					handleSort={handleSort}
					handleViewAll={handleViewAll}
				/>}
			</Card>
		</div>
	)
}

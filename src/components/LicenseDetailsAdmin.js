import { useAuth0 } from "@auth0/auth0-react";
import { useAuthorizedApi } from "../api/useAuthorizedApi";
import { useRecoilValue } from "recoil";
import { editColleagueValue } from "../atoms/profileAtom";
import React, { useCallback, useEffect, useState } from "react";
import usePagination from "./usePagination";
import getStatusLicense from "../helpers/getStatusLicense";
import humanityDate from "../helpers/humanityDate";
import { Card, Spinner, DisplayText } from "@shopify/polaris";
import adapterLicenseManageAdmin from "../helpers/adapterLicenceManagerAdmin";
import sortingLicensesTableAdmin from "../helpers/sortingLicensesTableAdmin";
import LicenseDetailsAdminTable from "./LicenseDetailsAdminTable";
import { FormattedMessage } from "react-intl";

export default function LicenseDetailsAdmin () {
	const { user } = useAuth0();
	const azureBaseURL = process.env.REACT_APP_AZURE_BASE_URL;
	// const azureBaseURL = 'http://localhost:7071/api/';
	const { get } = useAuthorizedApi( azureBaseURL );
	const editColleagueId = useRecoilValue( editColleagueValue );
	const [ adaptedColleaguesLicenses, setAdaptedColleaguesLicenses ] = useState( [] );
	const [ colleaguesLicenses, setColleaguesLicenses ] = useState( [] );
	const [ rows, setRows ] = useState( [] );
	const [ isLicenseDetailsLoaded, setIsLicenseDetailsLoaded ] = useState( false );
	// const [ updateTable, setUpdateTable ] = useRecoilState( updateTableState );
	// console.log( editColleagueId )

	const handleSort = useCallback(
		( index, direction ) => setAdaptedColleaguesLicenses( adaptedColleaguesLicenses => sortingLicensesTableAdmin( adaptedColleaguesLicenses, index, direction ) ),
		[ adaptedColleaguesLicenses ],
	);

	useEffect( () => {
		setIsLicenseDetailsLoaded( false );
		get( 'dynamics_get_licenses_by_contactid', { auth0_id: user.sub, contactid: editColleagueId } ).then( ( { data: val } ) => {
			console.warn( val );
			// console.log( value['new_jobfunction'] );
			// setLicensesObject( val );
			setColleaguesLicenses( val );
		} ).finally( () => {
			setIsLicenseDetailsLoaded( true );
		} );
	}, [ editColleagueId ] );

	useEffect( () => {
		if ( colleaguesLicenses && colleaguesLicenses.length ) {
			setAdaptedColleaguesLicenses( sortingLicensesTableAdmin( adapterLicenseManageAdmin( colleaguesLicenses ), 2, 'descending' ) );
		}
		console.log( adaptedColleaguesLicenses )

	}, [ colleaguesLicenses ] )

	const
		{ paged, handlePagination, page, maxPages, handleViewAll }
			= usePagination( rows, 10 )

	useEffect( () => {
		if ( adaptedColleaguesLicenses && adaptedColleaguesLicenses.length ) {
			setRows( adaptedColleaguesLicenses.map( row => ([
					row[ 0 ],
					getStatusLicense( row[ 1 ] ),
					humanityDate( row[ 2 ] ),
					row[ 3 ],
					row[ 4 ],
					row[ 5 ],
					row[ 6 ],
					row[ 7 ]
				]
			) ) );
		}
		//console.log( JSON.stringify(rows) );

	}, [ isLicenseDetailsLoaded, colleaguesLicenses, adaptedColleaguesLicenses ] )

	return (
		<div style={{
			paddingBottom: "60px",
			paddingTop: "20px"
		}}>
			{!isLicenseDetailsLoaded && <Spinner size="small" />}
			{isLicenseDetailsLoaded && !colleaguesLicenses.length && <p>
				<FormattedMessage id="noRecords"
								  defaultMessage="There are no records to display." />
			</p>}
			<Card>
				{isLicenseDetailsLoaded &&
				<LicenseDetailsAdminTable
					page={page}
					maxPages={maxPages}
					rows={paged}
					adaptedColleaguesLicenses={adaptedColleaguesLicenses}
					handlePagination={handlePagination}
					handleSort={handleSort}
					handleViewAll={handleViewAll}
				/>}
			</Card>
		</div>
	)
}

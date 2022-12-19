import React, { useEffect, useState, useCallback } from "react";
import humanityDate from "../helpers/humanityDate";
import getStatusLicense from "../helpers/getStatusLicense";
import { useRecoilState, useRecoilValue } from "recoil";
import { licensesObjectAtom, webRoleAdministrator } from "../atoms/profileAtom";
import usePagination from "./usePagination";
import adapterLicenseStudent from "../helpers/adapterLicenceStudent";
import LicenseTableStudent from "./LicenseTableStudent";
import sortingLicensesTableShort from "../helpers/sortingLicensesTableShort";
import { getButtonLicense } from "./getButtonsLicense";

export default function TableAcademicLicenses () {
	const [ adaptedLicensesData, setAdaptedLicensesData ] = useState( [] );
	const [ rows, setRows ] = useState( [] );
	const licensesObject = useRecoilValue( licensesObjectAtom );
	const isAdmin = useRecoilValue( webRoleAdministrator );

	const handleSort = useCallback(
		( index, direction ) => setAdaptedLicensesData( adaptedLicensesData => sortingLicensesTableShort( adaptedLicensesData, index, direction ) ),
		[ adaptedLicensesData ],
	);
	// console.log( licensesData );

	useEffect( () => {
		setAdaptedLicensesData( sortingLicensesTableShort( adapterLicenseStudent( licensesObject.academic_licenses ), 2, 'descending' ) );
		// console.log( adaptedLicensesData )

	}, [] )

	const
		{ paged, handlePagination, page, maxPages, handleViewAll }
			= usePagination( rows, 10 )

	useEffect( () => {
		setRows( adaptedLicensesData.map( row => ([
				getStatusLicense( row[ 1 ] ),
				humanityDate( row[ 1 ] ),
				row[ 2 ],
				row[ 3 ],
				row[ 4 ],
				row[ 6 ],
				row[ 6 ],
			]
		) ) );

		//console.log( JSON.stringify(rows) );

	}, [ adaptedLicensesData ] )


	return (
		<LicenseTableStudent adaptedLicensesData={adaptedLicensesData} handleSort={handleSort} rows={paged} page={page} maxPages={maxPages} handlePagination={handlePagination} handleViewAll={handleViewAll} />
	)
}


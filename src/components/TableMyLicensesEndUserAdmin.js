import React, { useCallback, useEffect, useState } from "react";
import humanityDate from "../helpers/humanityDate";
import getStatusLicense from "../helpers/getStatusLicense";
import { useRecoilState, useRecoilValue } from "recoil";
import { licensesObjectAtom, webRoleAdministrator } from "../atoms/profileAtom";
import usePagination from "./usePagination";
import adapterLicenseManage from "../helpers/adapterLicenceManager";
import LicenseTableBase from "./LicenseTableBase"
import sortingLicensesTableFull from "../helpers/sortingLicensesTableFull";
import { getButtonLicense, getLinkLicense } from "./getButtonsLicense";

export default function TableMyLicensesEndUserAdmin () {
	const [ adaptedLicensesData, setAdaptedLicensesData ] = useState( [] );
	const [ rows, setRows ] = useState( [] );
	const licensesObject = useRecoilValue( licensesObjectAtom );
	const isAdmin = useRecoilValue( webRoleAdministrator );

	const handleSort = useCallback(
		( index, direction ) => setAdaptedLicensesData( adaptedLicensesData => sortingLicensesTableFull( adaptedLicensesData, index, direction ) ),
		[ adaptedLicensesData ],
	);
	// console.log( licensesData );

	useEffect( () => {
		setAdaptedLicensesData( sortingLicensesTableFull( adapterLicenseManage( licensesObject.my_licenses ), 2, 'descending' ) );
		// console.log( adaptedLicensesData )

	}, [] )

	const
		{ paged, handlePagination, page, maxPages, handleViewAll }
			= usePagination( rows, 10 )

	useEffect( () => {
		setRows( adaptedLicensesData.map( row => ([
				getButtonLicense( row, isAdmin )
				,
				getStatusLicense( row[ 1 ] ),
				humanityDate( row[ 1 ] ),
				getLinkLicense( row, isAdmin )
				,
				row[ 4 ],
				row[ 5 ],
				row[ 6 ],
				row[ 7 ],
				row[ 8 ],
				row[ 10 ],
			]
		) ) );

		//console.log( JSON.stringify(rows) );

	}, [ adaptedLicensesData ] )


	return (
		<LicenseTableBase adaptedLicensesData={adaptedLicensesData} handleSort={handleSort} rows={paged} page={page} maxPages={maxPages} handlePagination={handlePagination} handleViewAll={handleViewAll} />
	)
}

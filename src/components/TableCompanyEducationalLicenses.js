import React, { useEffect, useState, useCallback } from "react";
import humanityDate from "../helpers/humanityDate";
import getStatusLicense from "../helpers/getStatusLicense";
import LinkToLicenseDetail from "./LinkToLicenseDetail";
import ManageButton from "./ManageButton";
import { useRecoilValue } from "recoil";
import { licensesObjectAtom } from "../atoms/profileAtom";
import usePagination from "./usePagination";
import adapterLicenseManage from "../helpers/adapterLicenceManager";
import LicenseTableBase from "./LicenseTableBase";
import sortingLicensesTableFull from "../helpers/sortingLicensesTableFull";

export default function TableCompanyEducationalLicenses () {
	const [ adaptedLicensesData, setAdaptedLicensesData ] = useState( [] ), [ rows, setRows ] = useState( [] ),
		licensesObject = useRecoilValue( licensesObjectAtom ), handleSort = useCallback(
		( index, direction ) => setAdaptedLicensesData( adaptedLicensesData => sortingLicensesTableFull( adaptedLicensesData, index, direction ) ),
		[ adaptedLicensesData ],
		);
		// console.log( licensesData );

	useEffect( () => {
		setAdaptedLicensesData( sortingLicensesTableFull( adapterLicenseManage( licensesObject.company_licenses ), 2, 'descending' ) );
		// console.log( adaptedLicensesData )

	}, [] )

	const
		{ paged, handlePagination, page, maxPages, handleViewAll }
			= usePagination( rows, 10 )

	useEffect( () => {
		setRows( adaptedLicensesData.map( row => ([
				<ManageButton id={row[ 3 ] || row[ 9 ]} />
				,
				getStatusLicense( row[ 1 ] ),
				humanityDate( row[ 1 ] ),
				<LinkToLicenseDetail id={row[ 3 ] || row[ 9 ]} name={row[ 0 ]} />
				,
				row[ 4 ],
				row[ 5 ],
				row[ 6 ],
				row[ 7 ],
				row[ 8 ],
			]
		) ) );

		//console.log( JSON.stringify(rows) );

	}, [ adaptedLicensesData ] )


	return (
		<LicenseTableBase adaptedLicensesData={adaptedLicensesData} handleSort={handleSort} rows={paged} page={page} maxPages={maxPages} handlePagination={handlePagination} handleViewAll={handleViewAll} />
	)
}


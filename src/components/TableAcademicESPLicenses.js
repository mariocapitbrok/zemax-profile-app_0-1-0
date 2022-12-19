import React, { useEffect, useState, useCallback, useMemo } from "react";
import humanityDate from "../helpers/humanityDate";
import getStatusLicense from "../helpers/getStatusLicense";
import LinkToLicenseDetail from "./LinkToLicenseDetail";
import ManageButton from "./ManageButton";
import { useRecoilValue } from "recoil";
import { licensesObjectAtom, webRoleAdministrator } from "../atoms/profileAtom";
import adapterLicenseManage from "../helpers/adapterLicenceManager";
import usePagination from "./usePagination";
import LicenseTableBase from "./LicenseTableBase";
import sortingLicensesTableFull from "../helpers/sortingLicensesTableFull";
import { getButtonLicense, getLinkLicense } from "./getButtonsLicense";
import LicenseTableStudent from "./LicenseTableStudent";
import LicenseTableESP from "./LicenseTableESP";

export default function TableAcademicESPLicenses () {
	const [ adaptedLicensesData, setAdaptedLicensesData ] = useState( [] );
	const [ rows, setRows ] = useState( [] );
	const licensesObject = useRecoilValue( licensesObjectAtom );
	const isAdmin = useRecoilValue( webRoleAdministrator );

	const handleSort = useCallback(
		( index, direction ) => setAdaptedLicensesData( adaptedLicensesData => sortingLicensesTableFull( adaptedLicensesData, index, direction ) ),
		[ adaptedLicensesData ],
	);
	// console.log( licensesData );

	useMemo( () => {
		setAdaptedLicensesData( sortingLicensesTableFull( adapterLicenseManage( licensesObject.academic_esp_licenses ), 2, 'descending' ) );
		// console.log( adaptedLicensesData )
	}, [licensesObject.academic_esp_licenses] )

	const
		{ paged, handlePagination, page, maxPages, handleViewAll }
			= usePagination( rows, 10 )

	useEffect( () => {
		setRows( adaptedLicensesData.map( row => ([
				getButtonLicense( row, isAdmin ),
				getStatusLicense( row[ 1 ] ),
				humanityDate( row[ 1 ] ),
				getLinkLicense( row, isAdmin ),
				row[ 4 ],
				row[ 5 ],
				row[ 6 ],
				row[ 7 ],
				row[ 8 ],
				row[ 10 ],
			]
		) ) );

	}, [ adaptedLicensesData ] )

	return (
		<LicenseTableESP adaptedLicensesData={adaptedLicensesData} handleSort={handleSort} rows={paged} page={page} maxPages={maxPages} handlePagination={handlePagination} handleViewAll={handleViewAll} />
	)
}


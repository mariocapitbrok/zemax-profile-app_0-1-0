import React, { useEffect, useState, useCallback } from "react";
import humanityDate from "../helpers/humanityDate";
import getStatusLicense from "../helpers/getStatusLicense";
import LinkToLicenseDetail from "./LinkToLicenseDetail";
import ManageButton from "./ManageButton";
import { useRecoilState, useRecoilValue } from "recoil";
import { licensesObjectAtom } from "../atoms/profileAtom";
import adapterLicenseManage from "../helpers/adapterLicenceManager";
import usePagination from "./usePagination";
import LicenseTableBase from "./LicenseTableBase";
import sortingLicensesTableFull from "../helpers/sortingLicensesTableFull";

export default function TableMyEducationalLicenses () {
	const [ adaptedLicensesData, setAdaptedLicensesData ] = useState( [] );
	const [ rows, setRows ] = useState( [] );
	const licensesObject = useRecoilValue( licensesObjectAtom );

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
				''
			]
		) ) );

		//console.log( JSON.stringify(rows) );

	}, [ adaptedLicensesData ] )


	return (
		<LicenseTableBase adaptedLicensesData={adaptedLicensesData} handleSort={handleSort} rows={paged} page={page} maxPages={maxPages} handlePagination={handlePagination} handleViewAll={handleViewAll} />
	)
}

/*export default function TableMyEducationalLicenses () {
	const [ licensesData, setLicensesData ] = useState( {} );
	const [ licensesObject, setLicensesObject ] = useRecoilState( licensesObjectAtom );

	//console.log(value.licensesObject);
	console.log( licensesObject );

	useEffect( () => {
		setLicensesData( licensesObject.my_licenses );

	}, [] )


	if ( licensesData && licensesData.length ) {
		const rowsLicense = licensesData.map( row => ([
			<ManageButton id={row.new_licensesid || row['_new_product_value']} />,
			getStatusLicense( row.new_supportexpires ),
			humanityDate( row.new_supportexpires ),
			<LinkToLicenseDetail  id={row.new_licensesid || row['_new_product_value']} name={row.new_licenseid}/>,
			row[ 'zemax_nickname' ],
			row[ '_new_product_value@OData.Community.Display.V1.FormattedValue' ],
			row[ 'zemax_seattype@OData.Community.Display.V1.FormattedValue' ],
			row.new_usercount
		]) )
		return (
			<DataTable title="Tile"
					   hideScrollIndicator="true"
					   columnContentTypes={[
						   'text',
						   'text',
						   'text',
						   'text',
						   'text',
						   'text',
						   'text',
						   'numeric'
					   ]}
					   headings={[
						   'Actions',
						   'Status',
						   'Support Expiry',
						   'License #',
						   'Nickname',
						   'Product',
						   'License Type',
						   'Seat Count'
					   ]} rows={rowsLicense}
			/>
		)
	}

	return <></>

}
*/

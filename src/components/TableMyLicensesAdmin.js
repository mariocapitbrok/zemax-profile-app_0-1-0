import { Tooltip } from "@shopify/polaris";
import React, { useCallback, useEffect, useState } from "react";
import humanityDate from "../helpers/humanityDate";
import getStatusLicense from "../helpers/getStatusLicense";
import LinkToLicenseDetailAdmin from "./LinkToLicenseDetailAdmin";
import ManageButtonAdmin from "./ManageButtonAdmin";
import { useRecoilState, useRecoilValue } from "recoil";
import { licensesObjectAtom } from "../atoms/profileAtom";
import adapterLicenseManage from "../helpers/adapterLicenceManager";
import usePagination from "./usePagination";
import LicenseTableBase from "./LicenseTableBase";
import slicer from "../helpers/slicer";
import copyArr from "../helpers/copyArr"

function sortTable ( rows, index, direction ) {
	let tempArray = copyArr( rows );

	// console.log(index)

	// sort number
	if ( index === 7 || index === 8 ) {
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

	if ( index === 3 ) {
		index = 0; //sorting by licenseid not by licensesid
	}
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

export default function TableMyLicensesAdmin () {
	const [ adaptedLicensesData, setAdaptedLicensesData ] = useState( [] );
	const [ rows, setRows ] = useState( [] );
	const licensesObject = useRecoilValue( licensesObjectAtom );

	const handleSort = useCallback(
		( index, direction ) => setAdaptedLicensesData( adaptedLicensesData => sortTable( adaptedLicensesData, index, direction ) ),
		[ adaptedLicensesData ],
	);
	// console.log( licensesData );

	useEffect( () => {
		setAdaptedLicensesData( sortTable( adapterLicenseManage( licensesObject.my_licenses_admin ), 2, 'descending' ) );
		// console.log( adaptedLicensesData )

	}, [] )

	const
		{ paged, handlePagination, page, maxPages, handleViewAll }
			= usePagination( rows, 10 )

	useEffect( () => {
		setRows( adaptedLicensesData.map( row => ([
				<ManageButtonAdmin id={row[ 3 ] || row[ 9 ]} />
				,
				getStatusLicense( row[ 1 ] ),
				humanityDate( row[ 1 ] ),
				<LinkToLicenseDetailAdmin id={row[ 3 ] || row[ 9 ]} name={row[ 0 ]} />
				,
				<Tooltip content={row[ 4 ]}>{slicer( row[ 4 ], 20 )} </Tooltip>,
				<Tooltip content={row[ 5 ]}>{slicer( row[ 5 ], 40 )} </Tooltip>,
				row[ 6 ],
				row[ 7 ],
				row[ 8 ],
				row[ 10 ],
			]
		) ) );

		//console.log( JSON.stringify(rows) );

	}, [ adaptedLicensesData ] )


	return (
		<LicenseTableBase adaptedLicensesData={adaptedLicensesData} handleSort={handleSort} rows={paged} page={page} maxPages={maxPages} handlePagination={handlePagination} handleViewAll={handleViewAll}/>
	)
}

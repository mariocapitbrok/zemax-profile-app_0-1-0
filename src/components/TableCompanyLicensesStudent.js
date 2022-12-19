import { DataTable } from "@shopify/polaris";
import React, { useEffect, useState } from "react";
import humanityDate from "../helpers/humanityDate";
import getStatusLicense from "../helpers/getStatusLicense";
import { useRecoilState } from "recoil";
import { licensesObjectAtom } from "../atoms/profileAtom";

export default function TableCompanyLicensesStudent () {
	const [ licensesData, setLicensesData ] = useState( {} );
	const [ licensesObject, setLicensesObject ] = useRecoilState( licensesObjectAtom );
	//console.log( value.licensesObject );

	useEffect( () => {
		setLicensesData( licensesObject.company_licenses );

	}, [] )

	if ( licensesData && licensesData.length ) {
		const rowsLicense = licensesData.map( row => ([
			getStatusLicense( row.new_supportexpires ),
			humanityDate( row.new_supportexpires ),
			row.new_licenseid,
			row[ 'zemax_nickname' ],
			row[ '_new_product_value@OData.Community.Display.V1.FormattedValue' ],
			row[ 'zemax_seattype@OData.Community.Display.V1.FormattedValue' ],
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
					   ]}
					   headings={[
						   'Status',
						   'Support Expiry',
						   'License #',
						   'Nickname',
						   'Product',
						   'License Type',
					   ]} rows={rowsLicense}
			/>
		)
	}

	return <></>

}

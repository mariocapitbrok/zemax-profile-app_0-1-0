import { DataTable } from "@shopify/polaris";
import React, { useEffect, useState } from "react";
import humanityDate from "../helpers/humanityDate";
import getStatusLicense from "../helpers/getStatusLicense";
import LinkToLicenseDetail from "./LinkToLicenseDetail";
import ManageButton from "./ManageButton";
import { useRecoilValue } from "recoil";
import { licensesObjectAtom } from "../atoms/profileAtom";

export default function TableMyCommercialLicenses () {
	const [ licensesData, setLicensesData ] = useState( {} );
	const licensesObject = useRecoilValue( licensesObjectAtom );

	// console.log( licensesObject );

	useEffect( () => {
		setLicensesData( licensesObject.my_licenses_commercial );

	}, [] )

	if ( licensesData && licensesData.length ) {
		const rowsLicense = licensesData.map( row => ([
			<ManageButton id={row.new_licensesid} />,
			getStatusLicense( row.new_supportexpires ),
			humanityDate( row.new_supportexpires ),
			<LinkToLicenseDetail  id={row.new_licensesid} name={row.new_licenseid}/>,
			row[ 'zemax_nickname' ],
			row[ '_new_product_value@OData.Community.Display.V1.FormattedValue' ],
			row[ 'zemax_seattype@OData.Community.Display.V1.FormattedValue' ],
			row.new_usercount,
			row.new_endusercount
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
						   'numeric',
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
						   'Seat Count',
						   'End User Count',
					   ]} rows={rowsLicense}
			/>
		)
	}

	return <></>

}

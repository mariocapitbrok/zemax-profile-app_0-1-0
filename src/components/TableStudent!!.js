import { DataTable, Button, Link, Spinner } from "@shopify/polaris";
import React, { useEffect, useState } from "react";
import humanityDate from "../helpers/humanityDate";
import getStatusLicense from "../helpers/getStatusLicense";
import ManageButton from "./ManageButton";
import { useRecoilState } from "recoil";
import { licensesObjectAtom } from "../atoms/profileAtom";

export default function TableStudent () {
	const [ licensesData, setLicensesData ] = useState( {} );
	const [ licensesObject, setLicensesObject ] = useRecoilState( licensesObjectAtom );

	//console.log(value.licensesObject);
	console.log( licensesObject );

	useEffect( () => {
		setLicensesData( licensesObject.my_licenses );

	}, [] )


	if ( licensesData && licensesData.length ) {
		const rowsLicense = licensesData.map( row => ([
			<ManageButton id={row.new_licensesid} />,
			getStatusLicense( row.new_supportexpires ),
			humanityDate( row.new_supportexpires ),
			<Link
				removeUnderline
			>{row.new_licenseid}</Link>,
			row[ '_new_registereduser_value@OData.Community.Display.V1.FormattedValue' ],
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
					   ]} rows={rowsLicense}
			/>
		)
	}

	return <></>

}

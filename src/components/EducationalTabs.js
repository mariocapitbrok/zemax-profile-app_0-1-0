import React, { useCallback, useMemo, useState } from "react";
import { Button, Card, DataTable, Link, Tabs } from "@shopify/polaris";
import humanityDate from "../helpers/humanityDate";
import getStatusLicense from "../helpers/getStatusLicense";
import LinkToLicenseDetail from "./LinkToLicenseDetail";

function EducationalTabs () {
	const [ selected, setSelected ] = useState( 0 );
	const handleTabChange = useCallback(
		( selectedTabIndex ) => setSelected( selectedTabIndex ),
		[],
	);

	const tabs = [
		{
			id: 'all-customers-1',
			content: 'All',
			title: 'All',
			accessibilityLabel: 'All licenses',
			panelID: 'all-customers-content-1',
		},
		{
			id: 'accepts-marketing-1',
			content: 'My organization licenses',
			title: 'My organization licenses',
			panelID: 'accepts-marketing-content-1',
		},
		{
			id: 'repeat-customers-1',
			content: 'Assigned to me',
			title: 'Assigned to me',
			panelID: 'repeat-customers-content-1',
		},
	];

	const [ sortCriteria, setSortCriteria ] = useState( null )

	const sortedRows = useMemo( () => {
		let tabData = licensesData;
		if ( selected > 0 ) {
			tabData = licensesData.filter( row => row.status === { '1': 'Accepted', '2': 'Expired' }[ selected ] )
		}

		if ( !sortCriteria ) return tabData;
		return tabData.sort( ( a, b ) => a[ sortCriteria ] - b[ sortCriteria ] )
	}, [ sortCriteria, selected ] )

	const rows = licensesData.map( row => ([
		<div>
			<Button primary>Manage</Button>
		</div>,
		getStatusLicense( row.new_supportexpires ),
		humanityDate( row.new_supportexpires ),
		<LinkToLicenseDetail  id={row.new_licensesid} name={row.new_licenseid}/>,
		row[ 'zemax_nickname' ],
		row[ '_new_product_value@OData.Community.Display.V1.FormattedValue' ],
		row[ 'zemax_seattype@OData.Community.Display.V1.FormattedValue' ],
		row.new_usercount,
		row.new_endusercount
	]) )

	const handleSort = useCallback(
		( index, direction ) => setSortCriteria( [ null, 'status', 'date', 'link', 'name', 'product', 'type', null, null ][ index ] ),
		[ rows ],
	);

	return (
		<Card>
			<Tabs tabs={tabs} selected={selected} onSelect={handleTabChange}>
				<DataTable
					hideScrollIndicator="true"
					title={tabs[ selected ].title}
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
					]}
					rows={rows}
					sortable={[
						false,
						false,
						false,
						false,
						false,
						false,
						false,
						false
					]}
					defaultSortDirection="descending"
					initialSortColumnIndex={4}
					onSort={handleSort}
				/>
			</Tabs>
		</Card>
	);
}

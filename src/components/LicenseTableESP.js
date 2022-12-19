import { DataTable } from "@shopify/polaris";
import React from "react";
import Paginator from "./Paginator";
import { FormattedMessage } from "react-intl";

export default function LicenseTableESP ( { adaptedLicensesData, rows, handleSort, handlePagination, page, maxPages, handleViewAll } ) {

	if ( adaptedLicensesData && adaptedLicensesData.length ) {

		return (
			<>
				<DataTable title="Tile"
						   hideScrollIndicator="true"
						   verticalAlign="middle"
						   columnContentTypes={[
							   'text',
							   'text',
							   'text',
							   'text',
							   'text',
							   'text',
							   'text',
							   'text',
							   'text',
							   'text',
						   ]}
						   headings={[
						   		<></>,
							   <FormattedMessage id="status"
												 defaultMessage="Status" />,
							   <FormattedMessage id="supportExpiry"
												 defaultMessage="Support Expiry" />,
							   <FormattedMessage id="licenseNumber"
												 defaultMessage="License #" />,
							   <FormattedMessage id="nickname"
												 defaultMessage="Nickname" />,
							   <FormattedMessage id="product"
												 defaultMessage="Product" />,
							   <FormattedMessage id="licenseType"
												 defaultMessage="License Type" />,
							   <FormattedMessage id="seatCount"
												 defaultMessage="Seat Count" />,
							   <FormattedMessage id="endUserCount"
												 defaultMessage="End User Count" />,
							   <FormattedMessage id="licenseAdmin"
												 defaultMessage="Administrator" />
						   ]} rows={rows}
						   defaultSortDirection="descending"
						   sortable={[
							   false, true, true, true, true, true, true, true, true, true
						   ]}
						   onSort={handleSort}
				/>
				<Paginator handlePagination={handlePagination} maxPages={maxPages} page={page} handleViewAll={handleViewAll}/>
			</>
		)
	}

	return <></>
};

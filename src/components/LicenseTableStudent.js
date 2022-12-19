import { DataTable } from "@shopify/polaris";
import React from "react";
import Paginator from "./Paginator";
import { FormattedMessage } from "react-intl";

export default function LicenseTableStudent ( { adaptedLicensesData, rows, handleSort, handlePagination, page, maxPages, handleViewAll } ) {

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
						   ]}
						   headings={[
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
							   <FormattedMessage id="licenseAdmin"
												 defaultMessage="Administrator" />,
							   <FormattedMessage id="endUsers"
												 defaultMessage="End User" />
						   ]} rows={rows}
						   defaultSortDirection="descending"
						   sortable={[
							   true, true, true, true, true, true, true
						   ]}
						   onSort={handleSort}
				/>
				<Paginator handlePagination={handlePagination} maxPages={maxPages} page={page} handleViewAll={handleViewAll} />
			</>
		)
	}

	return <></>
};

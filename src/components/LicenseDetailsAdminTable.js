import { DataTable } from "@shopify/polaris";
import { FormattedMessage } from "react-intl";
import Paginator from "./Paginator";
import React from "react";

export default function LicenseDetailsAdminTable ( { adaptedColleaguesLicenses, rows, handleSort, handlePagination, page, maxPages, handleViewAll } ) {

	if ( adaptedColleaguesLicenses && adaptedColleaguesLicenses.length ) {
		return (
			<>
				<DataTable
					columnContentTypes={[
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
						<FormattedMessage id="licenseNumber"
										  defaultMessage="License #"
						/>,
						<FormattedMessage id="status"
										  defaultMessage="Status"
						/>,
						<FormattedMessage id="supportExpiry"
										  defaultMessage="Support Expiry"
						/>,
						<FormattedMessage id="product"
										  defaultMessage="Product"
						/>,
						<FormattedMessage id="nickname"
										  defaultMessage="Nickname"
						/>,
						<FormattedMessage id="licenseType"
										  defaultMessage="License Type"
						/>,
						<FormattedMessage id="seatCount"
										  defaultMessage="Seat Count"
						/>,
						<FormattedMessage id="endUserCount"
										  defaultMessage="End User Count"
						/>,
					]}
					rows={rows}
					onSort={handleSort}
					sortable={[ true, true, true, true, true, true, true, true ]}
				/>
				<Paginator handlePagination={handlePagination} page={page} maxPages={maxPages} handleViewAll={handleViewAll}/>
			</>
		)
	}

	return null
}

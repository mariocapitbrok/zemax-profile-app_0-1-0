import { FormattedMessage } from "react-intl";
import { DataTable, Card } from "@shopify/polaris";
import React from "react";
import Paginator from "./Paginator";

export default function LicenseEndUserTable ( { adaptedColleaguesLicensesEndUser, rows, handleSort, handlePagination, page, maxPages, handleViewAll } ) {

	if ( adaptedColleaguesLicensesEndUser && adaptedColleaguesLicensesEndUser.length ) {
		return (
			<div style={{
				marginTop: "25px"
			}}>
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
						'text',
					]}
					onSort={handleSort}
					sortable={[ true, true, true, true, true, true, true, true, true ]}
					headings={[
						<FormattedMessage id="licenseNumber"
										  defaultMessage="License #" />,
						<FormattedMessage id="status"
										  defaultMessage="Status" />,
						<FormattedMessage id="supportExpiry"
										  defaultMessage="Support Expiry" />,
						<FormattedMessage id="product"
										  defaultMessage="Product" />,
						<FormattedMessage id="registeredUser"
										  defaultMessage="Registered User" />,
						<FormattedMessage id="registeredUser"
										  defaultMessage="License Type" />,
						<FormattedMessage id="seatCount"
										  defaultMessage="Seat Count" />,
						<FormattedMessage id="endUserCount"
										  defaultMessage="End User Count" />,
						<FormattedMessage id="dateAdded"
										  defaultMessage="Date added" />,
					]}
					rows={rows}
				/>
				<Paginator maxPages={maxPages} page={page} handlePagination={handlePagination} handleViewAll={handleViewAll} />
			</div>
		)
	}

	return null
}

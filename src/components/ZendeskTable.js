import { Card, DataTable, DisplayText } from "@shopify/polaris";
import { FormattedMessage } from "react-intl";
import Paginator from "./Paginator";
import React from "react";

export default function ZendeskTable ( { ticketData, rows, handleSort, handlePagination, page, maxPages, loaded, handleViewAll } ) {
	// console.warn(JSON.stringify(ticketData));

	// console.log( rows )
	if ( rows && rows.length && loaded ) {
		return (
			<>
				<Card style={{ marginBottom: "10px" }}>
					<DataTable
						hideScrollIndicator="true"
						columnContentTypes={[
							'text',
							'text',
							'text',
							'text',
							'text'
						]}
						headings={[
							<FormattedMessage id="supportTicket.caseNumber"
											  defaultMessage="Case Number" />,
							<FormattedMessage id="supportTicket.caseTitle"
											  defaultMessage="Case Title" />,
							<FormattedMessage id="supportTicket.caseStatus"
											  defaultMessage="Status" />,
							<FormattedMessage id="created"
											  defaultMessage="Created" />,
							<FormattedMessage id="lastUpdated"
											  defaultMessage="Last Updated" />,
						]}
						sortable={[
							true,
							true,
							true,
							true,
							true,
						]}
						rows={rows}
						defaultSortDirection="descending"
						onSort={handleSort}
						initialSortColumnIndex={3}
					/>
					<Paginator maxPages={maxPages} handlePagination={handlePagination} page={page} handleViewAll={handleViewAll}/>
				</Card>
			</>
		)
	} else {
		return (
			<>
				<DisplayText size="small">
					<FormattedMessage id="supportTicket.noTickets"
									  defaultMessage="There are currently no Support Tickets associated with this account." />
				</DisplayText>
			</>
		)
	}

}

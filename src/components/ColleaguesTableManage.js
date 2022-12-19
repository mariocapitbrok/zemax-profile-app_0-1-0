import { DataTable } from "@shopify/polaris";
import React from "react";
import Paginator from "./Paginator";
import { FormattedMessage } from "react-intl";

export default function ColleaguesTableManage ( { rows, handleSort, handlePagination, page, maxPages, handleViewAll } ) {
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
					'text',
				]}
				headings={[
					<FormattedMessage id="firstName" defaultMessage="Firstname" />,
					<FormattedMessage id="lastName" defaultMessage="Lastname" />,
					<FormattedMessage id="jobTitle" defaultMessage="Job Title" />,
					<FormattedMessage id="email" defaultMessage="Email" />,
					<FormattedMessage id="phone" defaultMessage="Phone" />,
					'',
					'',
					<FormattedMessage id="status" defaultMessage="User Status" />,
					'',
				]} rows={rows}
				sortable={[
					true, true, true, true, false, false, false, false, false
				]}
				onSort={handleSort}
			/>
			<Paginator maxPages={maxPages} page={page} handlePagination={handlePagination} handleViewAll={handleViewAll}/>
		</>
	)
}

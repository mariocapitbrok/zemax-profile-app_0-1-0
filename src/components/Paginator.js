import { Pagination, Button } from "@shopify/polaris";
import React from "react";
import { FormattedMessage } from "react-intl";

export default function Paginator( { maxPages, handlePagination, page, handleViewAll } ) {

	return (
		<>
			{maxPages > 1 &&
			<>
				<div style={{ height: "1px", background: "#e1e3e5", width: "100%", marginBottom: "10px" }} />
				<div style={{ marginRight: "15px", paddingBottom: "10px", display: "flex", justifyContent: "flex-end" }}>
					<div style={{ display: "flex", alignItems: "center", marginRight: "15px", fontFamily: "MyriadPro-Semibold" }}>
						<FormattedMessage id="page"
										  defaultMessage="Page" /> {page} <FormattedMessage id="of"
																							defaultMessage="of" /> {maxPages}</div>
					<Pagination
						label={'...'}
						hasPrevious={page !== 1}
						onPrevious={() => {
							handlePagination( 'prev' )
						}}
						hasNext={page !== maxPages}
						onNext={() => {
							handlePagination( 'next' )
						}}
					/>
					<div style={{paddingLeft: "15px"}}>
						<Button onClick={()=> handleViewAll(true) }><FormattedMessage id="viewAll" defaultMessage="View all" /></Button>
					</div>
				</div>
			</>
			}
		</>
	)
}

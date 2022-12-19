import { TextStyle } from "@shopify/polaris";
import React from "react";
import { FormattedMessage } from "react-intl";

export default function getStatusLicense ( date ) {
	// date = '2021-07-23';
	let dateD = new Date( date );
	let dateNow = new Date();
	let diffDays = Math.ceil( (dateD - dateNow) / (60 * 60 * 1000 * 24) )
	if ( diffDays > 0 && diffDays < 90 ) {
		return <TextStyle variation="negative">
			<FormattedMessage id="renew"
							  defaultMessage="Active" /><br />
			<FormattedMessage id="renew"
							  defaultMessage="Renew soon!" /></TextStyle>;
	} else if ( diffDays > 0 ) {
		return <TextStyle variation="positive">
			<FormattedMessage id="active"
							  defaultMessage="Active" />
		</TextStyle>;
	}
	return <TextStyle variation="subdued">
		<FormattedMessage id="expired"
						  defaultMessage="Expired" />
	</TextStyle>;
}

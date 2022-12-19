import LinkToLicenseDetailAdmin from "./LinkToLicenseDetailAdmin";
import LinkToLicenseDetail from "./LinkToLicenseDetail";
import ManageButtonAdmin from "./ManageButtonAdmin";
import ManageButton from "./ManageButton";
import React from "react";

export function getLinkLicense ( row, isAdmin ) {
	return isAdmin ? <LinkToLicenseDetailAdmin id={row[ 3 ] || row[ 9 ]} name={row[ 0 ]} /> :
		<LinkToLicenseDetail id={row[ 3 ] || row[ 9 ]} name={row[ 0 ]} />
}

export function getButtonLicense ( row, isAdmin ) {
	return isAdmin ? <ManageButtonAdmin id={row[ 3 ] || row[ 9 ]} /> : <ManageButton id={row[ 3 ] || row[ 9 ]} />
}

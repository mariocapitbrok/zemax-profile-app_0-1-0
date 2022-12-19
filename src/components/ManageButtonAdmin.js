import React from "react";
import { Button } from "@shopify/polaris";
import { activeComponentAtom, idLicense } from "../atoms/profileAtom";
import { useSetRecoilState } from "recoil";
import { FormattedMessage } from "react-intl";

export default function LinkToLicenseDetail ( { id } ) {
	const setActiveComponent = useSetRecoilState( activeComponentAtom )
	const setIdlic = useSetRecoilState( idLicense )

	function handleClick ( e ) {
		e.preventDefault();
		window.location.hash = '';
		setActiveComponent( 'LicenseDetailAdmin' );
		setIdlic( id );
	}

	return (
		<div style={{ color: '#0070c0' }}>
			<Button size="slime" monochrome outline onClick={( e ) => {handleClick( e )}}>
				<FormattedMessage id="manage"
								  defaultMessage="Manage" />
			</Button>
		</div>
	)
}

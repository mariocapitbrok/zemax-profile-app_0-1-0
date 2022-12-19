import React from "react";
import { useSetRecoilState } from "recoil";
import { activeComponentAtom, idLicense } from "../atoms/profileAtom";

export default function LinkToLicenseDetail ( { id, name } ) {
	const setActiveComponent = useSetRecoilState( activeComponentAtom )
	const setIdlic = useSetRecoilState( idLicense )

	function handleClick(e) {
		e.preventDefault();
		setActiveComponent( 'LicenseDetail' );
		setIdlic( id );
	}

	return (
		<a href="#"
		   style={{
			   fontWeight: "bold",
			   color: "#0070C0",
			   borderBottom: "none",
			   textDecoration: "none",
			   "&:hover": {
				   textDecoration: "underline"
			   }
		   }}
		   onClick={(e) => {
			   handleClick(e)
		   }}
		>{name}</a>
	)
}

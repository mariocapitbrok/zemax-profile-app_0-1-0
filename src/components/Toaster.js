import { Toast } from "@shopify/polaris";
import React from "react";
import { useRecoilState } from "recoil";
import { toastShowDuration, toastState } from "../atoms/profileAtom";
import { toastErrorState } from "../atoms/profileAtom";
import { toastApiMessageState } from "../atoms/profileAtom";

export default function Toaster () {
	const [ apiMessage, setApiMessage ] = useRecoilState( toastApiMessageState );
	const [ toastActive, setToastActive ] = useRecoilState( toastState );
	const [ toastError, setToastError ] = useRecoilState( toastErrorState );
	const [ showDuration, setShowDuration ] = useRecoilState( toastShowDuration );

	const handleClose = () => {
		setApiMessage( '' );
		setToastError( false );
		setToastActive( false );
		setShowDuration(4200);
	}

	const toastMarkup = toastActive ?
		<Toast
			duration={showDuration}
			content={apiMessage}
			onDismiss={handleClose}
			error={toastError}
		/> : null;

	return <div>
		{toastMarkup}
	</div>;
}

import { useRecoilValue } from "recoil";
import { dateLockBannerState, lockTransferState, seatTypeValue, showLockBannerState } from "../atoms/profileAtom";
import { Banner } from "@shopify/polaris";
import React from "react";
import { FormattedMessage } from "react-intl";

export function BannerLock () {
	const seatType = useRecoilValue( seatTypeValue );
	const showLockBanner = useRecoilValue( showLockBannerState );
	const dateLockBanner = useRecoilValue( dateLockBannerState );
	const lockTransfer = useRecoilValue( lockTransferState );
	// console.log(seatType);
	// const dateLock = 'Jun 29, 2021';

	if ( seatType === 555030000 && showLockBanner && lockTransfer ) {
		return (
			<div style={{
				display: "flex",
				marginTop: "20px"
			}}>
				<Banner>
					<FormattedMessage id="lockDate" defaultMessage="This license is locked against the current end user and will not be available to reassign until " />
					{dateLockBanner}</Banner>
			</div>
		)
	}
	return (<></>)
}

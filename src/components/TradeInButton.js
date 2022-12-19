import React from "react";
import { FormattedMessage } from "react-intl";
import styled from 'styled-components'

const TradeInOuter = styled.div`
	width: 100%;
	margin-top: 12px;
	margin-bottom: 12px;
	transition: .3s;
	&:hover {
		opacity: .8;
	}
`

export default function TradeInButton () {

	return (
		<TradeInOuter>
			<a style={{
				backgroundColor: "#0070c0",
				color: "white",
				display: "flex",
				alignItems: "center",
				width: "100%",
				justifyContent: "center",
				textAlign: "center",
				textDecoration: "none",
				padding: "8px",
				fontWeight: "bold",
				borderRadius: "4px",
				fontSize: "18px"
			}} href="/pages/trade-in-offer" target="_blank">
				<FormattedMessage id="tradeInBannerText"
								  defaultMessage="One or more of your licenses is eligible for our Trade-in Upgrade offer, available for a limited time."
				/>
			</a>
		</TradeInOuter>
	);
}

import React from "react";
import { AppProvider, DisplayText } from "@shopify/polaris";
import enTranslations from '@shopify/polaris/locales/en.json';
import Link from "./Link";

export default function SoftwareDownloads () {
	function DownloadsList () {
		const downloadList = [
			{
				link: 'https://zemaxstore.myshopify.com/pages/opticstudio-downloads',
				img: 'https://cdn.shopify.com/s/files/1/0539/4959/5825/files/Bitmap_Copy_5.png?v=1615815616',
				titleBtn: 'Download current version 21.1'
			},
			{
				link: 'https://zemaxstore.myshopify.com/pages/opticsbuilder-downloads',
				img: 'https://cdn.shopify.com/s/files/1/0539/4959/5825/files/OpticsBuilder_Logo.png?v=1615815894',
				titleBtn: 'Download current version 21.1'
			},
			{
				link: 'https://zemaxstore.myshopify.com/pages/opticsviewer-downloads',
				img: 'https://cdn.shopify.com/s/files/1/0539/4959/5825/files/OpticsViewer_Logo.png?v=1615815909',
				titleBtn: 'Download current version 21.1'
			},

		]
		const downloads = downloadList.map( ( item, index ) => (
			<div style={{
				display: 'flex',
				justifyContent: "space-between",
				alignItems: "center",
				flexDirection: "column",
				textAlign: "center"
			}}
				 key={index}
			>
				<img style={{ marginBottom: "30px" }} src={item.img} alt={item.titleBtn} />
				<Link style={{marginRight: "auto"}}
					  href={item.link}
				>
					{item.titleBtn}
				</Link>
			</div>
		) );

		return (
			<div style={{
				display: "flex",
				justifyContent: "space-between",
				marginTop: "30px",
				marginBottom: "40px"
			}}
			>
				{downloads}
			</div>
		)
	}

	return (
		<div style={{marginTop: "80px"}} id="software-downloads">
			<AppProvider i18n={enTranslations}>
				<DisplayText size="large">Software Downloads</DisplayText>
				<DownloadsList />
			</AppProvider>
		</div>
	)
}

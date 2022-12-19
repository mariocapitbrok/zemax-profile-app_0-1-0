import { AppProvider, DisplayText, Layout } from "@shopify/polaris";
import WebRole from "./WebRole";
import React from "react";
import enTranslations from '@shopify/polaris/locales/en.json';
import { useAuth0 } from "@auth0/auth0-react";
import { FormattedMessage } from "react-intl";
import LinkToInsided from "./LinkToInsided";

export default function ProfileInfo () {
	const { user } = useAuth0();

	return (
		<AppProvider i18n={enTranslations}>
			<div className="custom-layout">
				<div className="column profile-info">
					<DisplayText size="large">
						<FormattedMessage id="myAccount.aboutMe"
										  defaultMessage="About Me" />
					</DisplayText>
					<DisplayText size="small"><b>{user.name}</b></DisplayText>
					<DisplayText size="small">{user.email}</DisplayText>
					<LinkToInsided auth0_id={user.sub} />
				</div>
				<div className="column permissions">
					<Layout.Section>
						<DisplayText size="medium"><FormattedMessage id="myAccount.rolesTitle"
																	 defaultMessage="Your Current Roles & Permissions" /></DisplayText>
						<DisplayText size="small">
							<FormattedMessage id="myAccount.rolesDescription"
											  defaultMessage="Please note that the access level descriptions below are additive, so where you have multiple access levels you will gain the access of the most permissive role." /></DisplayText>
					</Layout.Section>
					<WebRole />
					<Layout.Section>
						<a href="https://support.zemax.com/hc/sections/1500001481281" target="_blank" rel="noreferrer">
							<FormattedMessage id="myAccount.rolesMoreInfo"
											  defaultMessage="More information about access" /></a>
					</Layout.Section>
				</div>
			</div>
		</AppProvider>
	)
}

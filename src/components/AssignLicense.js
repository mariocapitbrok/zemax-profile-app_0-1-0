import { Button, IndexTable, Modal, TextContainer, DataTable } from "@shopify/polaris";
import React, { useCallback, useEffect, useState } from "react";
import {
	editColleagueValue,
	licensesObjectAssignValue,
	modalAssignLicenseState, toastApiMessageState, toastErrorState, toastState,
	updateLicensesTable
} from "../atoms/profileAtom";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { useAuth0 } from "@auth0/auth0-react";
import { useAuthorizedApi } from "../api/useAuthorizedApi";
import { usePostApi } from "../api/usePostApi";
import { FormattedMessage } from "react-intl";
import copyArr from "../helpers/copyArr";
import usePagination from "./usePagination";
import Paginator from "./Paginator";
import IntToasterMessage from "../helpers/IntlToasterMessage";
import AssignLicenseModalTable from "./AssignLicenseModalTable";



export default function AssignLicense () {
	const setModalAssignLicenseActive = useSetRecoilState( modalAssignLicenseState )

	return (
		<div style={{
			color: "#0070c0",
			display: "flex",
			justifyContent: 'flex-end',
			position: "absolute",
			top: "5px",
			left: "auto",
			right: "0px"
		}}>
			<Button
				size="slime"
				monochrome
				outline
				onClick={() => setModalAssignLicenseActive( true )}
				loading={false}
			>
				<FormattedMessage id="assignLicense"
								  defaultMessage="Assign License"
				/>
			</Button>
			<AssignLicenseModalTable />
		</div>
	)
}

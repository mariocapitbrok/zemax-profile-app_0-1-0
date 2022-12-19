import React from "react";
import getLocal from "./getLocal";
import { jaMonthName } from "../locales/ja.shortMonths";
import { zhMonthName } from "../locales/zh.shortMonths";

export default function humanityDate ( date ) {
	const locale = getLocal() || 'en';
	let monthName;
	switch ( locale ) {
		case "ja":
			monthName = jaMonthName;
			break;
		case "zh-TW":
			monthName = zhMonthName;
			break;
		default:
			monthName = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun",
				"Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
			];
			break;
	}

	let dateD = new Date( date );
	let year = dateD.getFullYear();
	let month = monthName[ dateD.getMonth() ];
	let day = dateD.getDate().toString().padStart( 2, '0' );

	return month + ' ' + day + ', ' + year;
}

import messages_ja from "../locales/ja.json";
import messages_en from "../locales/en.json";
import messages_zh from "../locales/zh-TW.json";
import { FormattedMessage, IntlProvider } from "react-intl";
import React, { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
// import { preferredLanguageValue } from "../atoms/profileAtom";
import getLocal from "./getLocal";

export default function IntToasterMessage ( { id, message } ) {
	//let preferredLanguage = useRecoilValue( preferredLanguageValue );
	let [ lang, setLang ] = useState( 'en' );
	let messages = {
		'ja': messages_ja,
		'en': messages_en,
		'zh-TW': messages_zh
	};
	useEffect( () => {
		setLang( getLocal() );
	}, [] )
	if ( !id && !message ) {return false}

	return <>
		<IntlProvider
			locale={lang}
			messages={messages[ lang ]}
			defaultLocale="en"
		>
			<FormattedMessage
				id={id}
				defaultMessage={message}
			/>
		</IntlProvider>
	</>;
}

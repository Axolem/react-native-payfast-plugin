import React from 'react'
import WebView, { WebViewMessageEvent, WebViewNavigation } from 'react-native-webview'
import { UpdateCardProps } from './utils/interfaces'

const UpdateCard = (data: UpdateCardProps) => {
    const { token, onComplete, styles, sandbox } = data

    const uri = sandbox ?
        `https://sandbox.payfast.co.za/eng/recurring/update/${token}?return=#finish`
        : `https://www.payfast.co.za/eng/recurring/update/${token}?return=#finish`

    return (
        <WebView
            scalesPageToFit
            javaScriptEnabled
            domStorageEnabled
            startInLoadingState
            thirdPartyCookiesEnabled
            mixedContentMode="always"
            style={[{ flex: 1 }, styles]}
            source={{ uri }}

            onMessage={(event: WebViewMessageEvent) => {
                onComplete?.(event.nativeEvent.data)
            }}

            onNavigationStateChange={(event: WebViewNavigation) => {
                if (event.url.includes("finish")) {
                    onComplete?.(event.url.split("/").pop() || null)
                }
            }}
        />
    )
}

export default UpdateCard;


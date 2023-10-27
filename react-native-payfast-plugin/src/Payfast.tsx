import React from 'react';
import { PayFastProps } from './utils/interfaces';
import { clearNullValues } from './utils/funtions';
import WebView, { WebViewMessageEvent, WebViewNavigation } from 'react-native-webview';


const PayFast = (props: PayFastProps) => {
    const { data, onSuccess, onCancel, styles, paymentMethod, sandbox, passphrase, onClose, onMessage } = props

    // Defaults to sandbox
    const uri = sandbox
        ? "https://sandbox.payfast.co.za/eng/process"
        : "https://www.payfast.co.za/eng/process";

    const [transactionId, setTransactionId] = React.useState<string>("");

    const orderedData = new Map();
    orderedData.set('merchant_id', data.merchantDetails.merchant_id);
    orderedData.set('merchant_key', data.merchantDetails.merchant_key);
    orderedData.set('return_url', "https://payfast.io#success");
    orderedData.set('cancel_url', "https://payfast.io#cancel");
    orderedData.set('notify_url', data.merchantDetails?.notify_url || "https://payfast.io/");
    orderedData.set('fica_idnumber', data.merchantDetails?.fica_idnumber || "");

    orderedData.set('name_first', data.customerDetails.name_first || "");
    orderedData.set('name_last', data.customerDetails.name_last || "");
    orderedData.set('email_address', data.customerDetails.email_address || "");
    orderedData.set('cell_number', data.customerDetails.cell_number || "");

    orderedData.set('m_payment_id', data.transactionDetails.m_payment_id);
    orderedData.set('amount', data.transactionDetails.amount);
    orderedData.set('item_name', data.transactionDetails.item_name);
    orderedData.set('item_description', data.transactionDetails.item_description || "");

    orderedData.set('email_confirmation', data.transactionOptions?.email_confirmation || 0);
    orderedData.set('confirmation_address', data.transactionOptions?.confirmation_address || "");

    orderedData.set('payment_method', paymentMethod || "");

    // Recurring billing
    if (data.recurringBilling?.subscription_type) {
        orderedData.set('subscription_type', data.recurringBilling?.subscription_type || "");
        orderedData.set('billing_date', data.recurringBilling?.billing_date || "");
        orderedData.set('recurring_amount', data.recurringBilling?.recurring_amount || "");
        orderedData.set('frequency', data.recurringBilling?.frequency || "");
        orderedData.set('cycles', data.recurringBilling?.cycles?.toString() || "0");
        orderedData.set('subscription_notify_email', data.recurringBilling?.subscription_notify_email || false);
        orderedData.set('subscription_notify_webhook', data.recurringBilling?.subscription_notify_webhook || false);
        orderedData.set('subscription_notify_buyer', data.recurringBilling?.subscription_notify_buyer || false);
    }

    const newMap = clearNullValues(orderedData, passphrase);

    const fullData = JSON.stringify(Object.fromEntries(newMap));

    // Inject JavaScript code to perform the POST request on initial page load
    const injectedJavaScript = `
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = '${uri}';
        const fullData = ${fullData};
        for (const key in fullData) {
            if (fullData.hasOwnProperty(key)) {
                const input = document.createElement('input');
                input.type = 'hidden';
                input.name = key;
                input.value = fullData[key];
                form.appendChild(input);
            }
        }
        document.body.appendChild(form);
        form.submit();
    `;

    return (
        <WebView
            scalesPageToFit
            javaScriptEnabled
            domStorageEnabled
            startInLoadingState
            thirdPartyCookiesEnabled
            mixedContentMode="always"
            style={[{ flex: 1 }, styles]}
            source={{ html: `<html><body><h1>Loading...</h1><script>${injectedJavaScript}</script></body></html>` }}

            onMessage={(event: WebViewMessageEvent) => {
                if (event.nativeEvent.data === "PRESSED_GO_BACK") {
                    return onClose?.({ data: JSON.parse(fullData), transaction_id: null })
                }

                onMessage?.(event.nativeEvent.data)
            }}

            onNavigationStateChange={(event: WebViewNavigation) => {
                if (event.url.includes("finish") && !transactionId) {
                    setTransactionId(event.url.split("/").pop() || "")
                }
                else if (event.url.includes("#success") && transactionId) {
                    onSuccess?.({ data: JSON.parse(fullData), transaction_id: transactionId })
                }
                else if (event.url.includes("#cancel") && transactionId) {
                    onCancel?.({ data: JSON.parse(fullData), transaction_id: transactionId })
                }
            }}
        />
    )
}

export default PayFast
import { DataProps } from "./utils/interfaces";
import { clearNullValues } from "./utils/funtions";

class LinkPayment {
    private data: DataProps;
    private passphrase: string = "";
    private sandbox: boolean;
    private paymentMethod: string = "";
    return_url: string = "https://payfast.io#success";
    cancel_url: string = "https://payfast.io#cancel";

    constructor(data: DataProps, sandbox: boolean = false, passphrase?: string, paymentMethod?: string) {
        this.data = data;
        this.sandbox = sandbox;
        if (passphrase) {
            this.passphrase = passphrase;
        }

        if (paymentMethod) {
            this.paymentMethod = paymentMethod;
        }
    }

    public async getLink() {
        try {
            const { uri, data } = this.formartRequest();
            const { url } = await fetch(uri, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: data
            });
            return url;
        } catch (error) {
            throw error;
        }
    }

    private formartRequest(): { uri: string, data: any } {
        // Defaults to sandbox
        const uri = this.sandbox
            ? "https://sandbox.payfast.co.za/eng/process"
            : "https://www.payfast.co.za/eng/process";


        const orderedData = new Map();
        orderedData.set('merchant_id', this.data.merchantDetails.merchant_id);
        orderedData.set('merchant_key', this.data.merchantDetails.merchant_key);
        orderedData.set('return_url', this.return_url);
        orderedData.set('cancel_url', this.cancel_url);
        orderedData.set('notify_url', this.data.merchantDetails?.notify_url || "https://payfast.io/");
        orderedData.set('fica_idnumber', this.data.merchantDetails?.fica_idnumber || "");

        orderedData.set('name_first', this.data.customerDetails.name_first || "");
        orderedData.set('name_last', this.data.customerDetails.name_last || "");
        orderedData.set('email_address', this.data.customerDetails.email_address || "");
        orderedData.set('cell_number', this.data.customerDetails.cell_number || "");

        orderedData.set('m_payment_id', this.data.transactionDetails.m_payment_id);
        orderedData.set('amount', this.data.transactionDetails.amount);
        orderedData.set('item_name', this.data.transactionDetails.item_name);
        orderedData.set('item_description', this.data.transactionDetails.item_description || "");

        orderedData.set('email_confirmation', this.data.transactionOptions?.email_confirmation || 0);
        orderedData.set('confirmation_address', this.data.transactionOptions?.confirmation_address || "");

        orderedData.set('payment_method', this.paymentMethod || "");

        // Recurring billing
        if (this.data.recurringBilling?.subscription_type) {
            orderedData.set('subscription_type', this.data.recurringBilling?.subscription_type || "");
            orderedData.set('billing_date', this.data.recurringBilling?.billing_date || "");
            orderedData.set('recurring_amount', this.data.recurringBilling?.recurring_amount || "");
            orderedData.set('frequency', this.data.recurringBilling?.frequency || "");
            orderedData.set('cycles', this.data.recurringBilling?.cycles?.toString() || "0");
            orderedData.set('subscription_notify_email', this.data.recurringBilling?.subscription_notify_email || false);
            orderedData.set('subscription_notify_webhook', this.data.recurringBilling?.subscription_notify_webhook || false);
            orderedData.set('subscription_notify_buyer', this.data.recurringBilling?.subscription_notify_buyer || false);
        }

        const newMap = clearNullValues(orderedData, this.passphrase);

        const fullData = JSON.stringify(Object.fromEntries(newMap));

        return {
            uri,
            data: fullData
        }
    }
}
export default LinkPayment;
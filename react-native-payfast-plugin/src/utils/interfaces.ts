import { ViewStyle } from 'react-native';

interface MerchantDetails {
    /**
     * The merchant ID allocated to you by PayFast.
     * This is NOT your PayFast username. . This can be found on the merchant’s settings page.
     */
    merchant_id: string,

    /**
     * The merchant key allocated to you by PayFast.
     * This is NOT your PayFast password. This can be found on the merchant’s settings page.
     */
    merchant_key: string,

    /**
     * The URL where PayFast will send the payment result to.
     */
    //return_url?: string,

    /**
     * The URL where PayFast will send the payment result to if the payment is cancelled.
     */
    //cancel_url?: string,

    /**
     * The URL where PayFast will send the payment result to if the payment is successful.
     * @see https://developers.payfast.co.za/docs#step_4_confirm_payment
     */
    notify_url?: string

    /**
     *  The Fica ID Number provided of the buyer must be a valid South African ID Number.
     */
    fica_idnumber?: string,
}

interface CustomerDetails {
    /**
     * The first name of the buyer.
     */
    name_first?: string,

    /**
     * The last name of the buyer.
     */
    name_last?: string,

    /**
     * The email address of the buyer.
     */
    email_address?: string,

    /**
     * The mobile number of the buyer.
     */
    cell_number?: string
}

interface TransactionDetails {
    /**
     * Unique payment ID on the merchant’s system.
     */
    m_payment_id?: string,

    /**
     * The amount which the payer must pay in ZAR.
     * This amount will be displayed to the payer on the PayFast payment page.
     * This amount can include VAT if applicable.
     */
    amount: string,

    /**
     * The name of the item being charged for, or in the case of multiple items the order number.
     */
    item_name: string

    /**
     * The description of the item being charged for, or in the case of multiple items the order description.
     */
    item_description?: string,
}

interface TransactionOptions {
    /**
     * The email address to which the payment confirmation email will be sent.
     * @default 0
     */
    email_confirmation?: 1 | 0,

    /**
     * The email address to which the payment confirmation email will be sent.
     * @property email_confirmation should be set to 1 for this to work.
     */
    confirmation_address?: string
}


interface TransactionData extends MerchantDetails, CustomerDetails, TransactionDetails, TransactionOptions { }

interface ResponseData {
    data: TransactionData,

    /**
     * The transaction id returned by PayFast.
     * 
     * @returns NULL if the user abandoned the payment process without cancelling.
     */
    transaction_id: string | null,
}

interface DataProps {
    merchantDetails: MerchantDetails,
    customerDetails: CustomerDetails,
    transactionDetails: TransactionDetails,
    transactionOptions: TransactionOptions,
    recurringBilling?: RecurringBilling
}

type PaymentMethods = "eft" | "cc" | "dc" | "mp" | "mc" | "sc" | "zp" | "ss" | "mt" | "rcs";

interface PayFastProps {
    data: DataProps, 
    
    /**
     * The styles to be applied to underlying WebView.
     */
    styles: ViewStyle,

    /**
     * The URL where PayFast will send the payment result to.
     */
    sandbox: boolean,

    /**
     * This function is called when the payment is successful.
     * @param data The data returned by PayFast.
     */
    onSuccess: (data: ResponseData) => {},

    /**
     * This function is called when the payment is cancelled.
     * @param data The data returned by PayFast.
     */
    onCancel: (data: ResponseData) => {},

    /**
     * This function is called when the payment page is loaded.
     * @param data The data returned by PayFast.
     */
    onMessage: (data: any) => {},

    /**
     * This function is called when the payment page is closed.
     * @param data The data returned by PayFast.
     */
    onClose: (data: any) => {},

    /**
     * The payment method to be used.
     * @default to all available payment methods if not specified.
     */
    paymentMethod?: PaymentMethods

    /**
     * TThe passphrase is an extra security feature, used as a ‘salt’, and is set by the Merchant in the Settings section of their Payfast Dashboard.
     * @see https://developers.payfast.co.za/docs#step_2_signature
     */
    passphrase?: string
}

interface RecurringBilling {
    /**
     * The type of subscription. 
     * @default 0
     * 
     * @example 0 = sets type to a once-off payment.
     * @example 1 = sets type to a subscription.
     * @example 2 = sets type to a tokenization payment.
     * @requires notify_url to be set to a valid URL if set to 1 or 2.
     * 
     * @see https://developers.payfast.co.za/docs#quickstart
     */
    subscription_type?: "2" | "1",


    /**
     * The date from which future subscription payments will be made. 
     * @example 2020-01-01
     * 
     * @default "to current date if not set".
     */
    billing_date?: string,


    /**
     * The frequency of the subscription payments. 
     * @default "no default value."
     * 
     * @example 1 = daily
     *  2 = weekly
     *  3 = monthly
     *  4 = quarterly
     *  5 = biannually
     *  6 = annually
     */
    frequency: Frequency,

    /**
     * The number of times the subscription payment will be made. Set to 0 for indefinite subscription.
     * @default 0
     */
    cycles?: string,

    /**
     * Future recurring amount for the subscription in ZAR. There is a minimum value of 5.00.
     * @default  ‘amount’ value if not set. 
     * 
     * @example 100.00
     * @see https://developers.payfast.co.za/docs#subscriptions:~:text=Future%20recurring%20amount
     */
    recurring_amount?: number,

    /** @see https://developers.payfast.co.za/docs#subscriptions:~:text=for%20indefinite%20subscription.-,subscription_notify_email */
    subscription_notify_email?: boolean,

    /** @see https://developers.payfast.co.za/docs#subscriptions:~:text=for%20indefinite%20subscription.-,subscription_notify_webhook */
    subscription_notify_webhook?: boolean,

    /** @see https://developers.payfast.co.za/docs#subscriptions:~:text=for%20indefinite%20subscription.-,subscription_notify_buyer */
    subscription_notify_buyer?: boolean,
}

interface UpdateCardProps {
    token: string
    onComplete: (transaction_id: string) => void
    styles?: ViewStyle
    sandbox?: boolean
}

enum Frequency {
    DAILY = "1",
    WEEKLY = "2",
    MONTHLY = "3",
    QUARTERLY = "4",
    BIANNUALLY = "5",
    ANNUALLY = "6"
}

export {
    PayFastProps,
    PaymentMethods,
    DataProps,
    MerchantDetails,
    CustomerDetails,
    TransactionDetails,
    TransactionOptions,
    TransactionData,
    ResponseData,
    Frequency,
    UpdateCardProps
}
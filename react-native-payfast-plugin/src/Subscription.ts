import { clearNullValuesFunc, generateAPISignature } from "./utils/funtions";

class Subsciption {
    private merchant_id: string;
    private url: string = 'https://api.payfast.co.za/subscriptions/';
    private token: string = '';
    private passphrase: string;
    private testMode: boolean = false;

    constructor(merchant_id: string, token: string, passphrase: string, testMode: boolean = false) {
        this.merchant_id = merchant_id;
        if (testMode) {
            this.testMode = testMode;
        }
        this.token = token;
        this.passphrase = passphrase || '';
        this.url = `${this.url + token}/`;
    }

    /**
        * @description Charge a tokenization payment based on the token provided.
        When receiving the API call to charge a customer's credit card via a token, Payfast will attempt to charge the card immediately. If the credit card is out of funds a failed response will be returned.
        * @param transactionDetails
        * @returns Promise<ChargeResponse>
        * @example
        * const payfast = new Payfast(merchant_id, token, passphrase, true);
        *
        *   const transactionDetails = {
        *       amount: 100,
        *       item_name: "Test Item",
        *       item_description: "Test Item Description",
        *       itn: true,
        *       m_payment_id: "123456789"
        *   }
        *
        *   payfast.chargeTokenizedCard(transactionDetails).then(response => {
        *       console.log(response)
        *   }).catch(error => {
        *       console.log(error)
        *   })
    **/
    public async chargeTokenizedCard(transactionDetails: TransactionData): Promise<ChargeResponse> {

        try {
            const timestamp = new Date().toISOString().split('.')[0];
            const data = {
                ...transactionDetails,
                'merchant-id': this.merchant_id,
                'version': 'v1',
                'timestamp': timestamp,
                token: this.token
            }
            const Hash = generateAPISignature(data, this.passphrase)

            const body = clearNullValuesFunc(transactionDetails)


            const response = await fetch(`${this.url}adhoc?testing=${this.testMode}`, {
                method: 'POST',
                headers: {
                    'merchant-id': this.merchant_id,
                    'version': 'v1',
                    'timestamp': timestamp,
                    'signature': Hash
                },
                body: JSON.stringify(body)
            })

            return await response.json() as ChargeResponse
        } catch (error: any) {
            return {
                code: 400,
                status: "failed",
                data: {
                    response: 4,
                    message: error.message
                }
            }
        }
    }


    /**
     * @description This will cancel a subscription entirely. When a subscription is cancelled the customer will be notified of this via email.
     * @param TransactionData
     * @returns 
     * @example
     * const payfast = new Payfast(merchant_id, token, passphrase, true);
     * 
     * const transactionDetails = {
     *      amount: 100,
     *      item_name: "Test Item",
     *      item_description: "Test Item Description",
     *      itn: true,
     *      m_payment_id: "123456789"
     * }
     * 
     * payfast.cancelSubscription(transactionDetails).then(response => {
     *    console.log(response)
     * }).catch(error => {
     *   console.log(error)
     * })
     */
    public cancelSubscription = async (transactionDetails: TransactionData): Promise<ChargeResponse> => {
        try {
            const timestamp = new Date().toISOString().split('.')[0];
            const response = await fetch(`${this.url}cancel?testing=${this.testMode}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'merchant-id': this.merchant_id,
                    'version': 'v1',
                    'timestamp': timestamp,
                    'signature': generateAPISignature({
                        ...transactionDetails,
                        'merchant-id': this.merchant_id,
                        'version': 'v1',
                        'timestamp': timestamp,
                        token: this.token
                    }, this.passphrase)
                },
                body: JSON.stringify(clearNullValuesFunc(transactionDetails))
            })
            return await response.json() as ChargeResponse
        } catch (error: any) {
            return {
                code: 400,
                status: "failed",
                data: {
                    response: 4,
                    message: error.message
                }
            }
        }
    }

    /**
     * @description This will pause a subscription. When a subscription is paused the customer will be notified of this via email.
     * @param TransactionData
     * @returns 
     * @example
     * const payfast = new Payfast(merchant_id, token, passphrase, true);
     * 
     * const transactionDetails = {
     *      amount: 100,
     *      item_name: "Test Item",
     *      item_description: "Test Item Description",
     *      itn: true,
     *      m_payment_id: "123456789"
     * }
     * 
     * payfast.pauseSubscription(transactionDetails).then(response => {
     *    console.log(response)
     * }).catch(error => {
     *   console.log(error)
     * })
     */
    public pauseSubscription = async (cycles: number = 1): Promise<ChargeResponse> => {
        try {
            const timestamp = new Date().toISOString().split('.')[0];

            const response = await fetch(`${this.url}pause?testing=${this.testMode}`, {
                method: 'PUT',
                headers: {
                    'merchant-id': this.merchant_id,
                    'version': 'v1',
                    'timestamp': timestamp,
                    'signature': generateAPISignature({
                        cycles,
                        'merchant-id': this.merchant_id,
                        'version': 'v1',
                        'timestamp': timestamp,
                        token: this.token
                    }, this.passphrase)
                },
                body: JSON.stringify(clearNullValuesFunc({ cycles }))
            })
            return await response.json() as ChargeResponse
        } catch (error: any) {
            return {
                code: 400,
                status: "failed",
                data: {
                    response: 4,
                    message: error.message
                }
            }
        }
    }

    /**
     * @description This will resume a subscription. When a subscription is resumed the customer will be notified of this via email.
     * @param TransactionData
     * @returns
     * @example
     * const payfast = new Payfast(merchant_id, token, passphrase, true);
     * 
     * const transactionDetails = {
     *      amount: 100,
     *      item_name: "Test Item",
     *      item_description: "Test Item Description",
     *      itn: true,
     *      m_payment_id: "123456789"
     * }
     * payfast.resumeSubscription(transactionDetails).then(response => {
     *      console.log(response)
     * }).catch(error => {
     *      console.log(error)
     * })
     * 
    */
    public resumeSubscription = async (): Promise<ChargeResponse> => {
        try {
            const timestamp = new Date().toISOString().split('.')[0];

            const response = await fetch(`${this.url}/unpause?testing=${this.testMode}`, {
                method: 'PUT',
                headers: {
                    'merchant-id': this.merchant_id,
                    'version': 'v1',
                    'timestamp': timestamp,
                    'signature': generateAPISignature({
                        'merchant-id': this.merchant_id,
                        'version': 'v1',
                        'timestamp': timestamp,
                        token: this.token
                    }, this.passphrase)
                }
            })
            return await response.json() as ChargeResponse
        } catch (error: any) {
            return {
                code: 400,
                status: "failed",
                data: {
                    response: 4,
                    message: error.message
                }
            }
        }
    }

    public getSubscription = async (): Promise<ChargeResponse> => {
        try {
            const timestamp = new Date().toISOString().split('.')[0];

            const response = await fetch(`${this.url}fetch?testing=${this.testMode}`, {
                method: 'GET',
                headers: {
                    'merchant-id': this.merchant_id,
                    'version': 'v1',
                    'timestamp': timestamp,
                    'signature': generateAPISignature({
                        'merchant-id': this.merchant_id,
                        'version': 'v1',
                        'timestamp': timestamp,
                        token: this.token
                    }, this.passphrase)
                }
            })
            return await response.json() as ChargeResponse
        } catch (error: any) {
            return {
                code: 400,
                status: "failed",
                data: {
                    response: 4,
                    message: error.message
                }
            }
        }

    }

}

export default Subsciption;

type ChargeResponseData = {
    response: number | boolean;
    message: string;
    pf_payment_id?: string;
}

type ChargeResponse = {
    code: 200 | 400;
    status: "success" | "failed";
    data: ChargeResponseData;
}

type TransactionData = {
    amount: number,
    item_name: string,
    item_description?: string,
    itn?: boolean,
    m_payment_id?: string,
    cc_ccv?: number,
}
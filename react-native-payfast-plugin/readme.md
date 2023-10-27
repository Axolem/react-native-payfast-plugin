# React Native Payfast Plugin

React Native Payfast Plugin is a React Native library for Payfast payment gateway integration. It allows you to integrate Payfast payment gateway in your React Native app with ease. It provides a simple interface to generate payment link, update card details and tokenize card details.

#### This is not a Payfast official library. It is a community driven library.

[![npm](https://img.shields.io/npm/v/react-native-payfast-plugin.svg)](https://www.npmjs.com/package/react-native-payfast-plugin)
[![npm](https://img.shields.io/npm/dm/react-native-payfast-plugin.svg)](https://www.npmjs.com/package/react-native-payfast-plugin)
[![GitHub issues](https://img.shields.io/github/issues/axolem/react-native-payfast-plugin.svg)](https://github.com/Axolem/react-native-payfast-plugin/issues)
[![GitHub stars](https://img.shields.io/github/stars/axolem/react-native-payfast-plugin.svg)]
[![GitHub license](https://img.shields.io/github/license/axolem/react-native-payfast-plugin.svg)]
[![Twitter](https://img.shields.io/twitter/url/https/github.com/axolem/react-native-payfast-plugin.svg?style=social)](https://twitter.com/intent/tweet?text=Checkout%20React%20Native%20Payfast%20Plugin!%20https://github.com/axolem/react-native-payfast-plugin%20via%20@axole_ma)
[![GitHub contributors](https://img.shields.io/github/contributors/axolem/react-native-payfast-plugin.svg)]
[![GitHub last commit](https://img.shields.io/github/last-commit/axolem/react-native-payfast-plugin.svg)]
[![GitHub pull requests](https://img.shields.io/github/issues-pr/axolem/react-native-payfast-plugin.svg)]
[![GitHub pull requests](https://img.shields.io/github/issues-pr-closed/axolem/react-native-payfast-plugin.svg)]
[![GitHub forks](https://img.shields.io/github/forks/axolem/react-native-payfast-plugin.svg?style=social&label=Fork)]
[![GitHub stars](https://img.shields.io/github/stars/axolem/react-native-payfast-plugin.svg?style=social&label=Stars)]
[![GitHub watchers](https://img.shields.io/github/watchers/axolem/react-native-payfast-plugin.svg?style=social&label=Watch)]


## Table of contents

  - [Supported platforms](#supported-platforms)
  - [Getting started](#getting-started)
    - [Installation](#installation)
    - [Supported transactions:](#supported-transactions)
    - [Features:](#features)
    - [Usage](#usage)
      - [In-app payment](#in-app-payment)
      - [Generate payment link](#generate-payment-link)
      - [Update card details](#update-card-details)
      - [Tokenize card details](#tokenize-card-details)
    - [Props](#props)
      - [PayFast](#payfast)
        - [data](#data)
      - [LinkPayment](#linkpayment)
      - [UpdateCard](#updatecard)
  - [License](#license)
  - [Author](#author)
  - [Help Wanted!](#help-wanted)
  - [Credits](#credits)
  - [Support](#support)

## Supported platforms

- [x] Android
- [x] iOS

## Getting started

### Installation

```bash
npm install react-native-payfast-plugin
```

Expo?

```bash
expo install react-native-payfast-plugin
```

### Supported transactions:

- [x] Once of payment
- [x] Recurring payment
- [x] Tokenization

### Features:

- In-app payment
- Generate payment link
- Update card details (for tokenized cards)
- Slit payment (coming soon)

### Usage

#### In-app payment

```javascript
import Payfast from 'react-native-payfast-plugin';

...
        <PayFast
            data={{
                merchantDetails: {
                    merchant_id: "10031584",
                    merchant_key: "5n52c1qu5501c",
                    notify_url: "https://webhook.site/f30e4b32-15b5-44e6-ae0b-c75486b8797d",
                },
                customerDetails: {
                    name_first: "First Name",
                    name_last: "Last Name",
                    email_address: "firstname@gmail.com",
                    cell_number: "0885....",
                },
                transactionDetails: {
                    m_payment_id: "1234",
                    amount: "10.00",
                    item_name: "Item Name",
                    item_description: "Item Description",
                },
                transactionOptions: {
                    email_confirmation: 0,
                    confirmation_address: "firstname@gmail.com",
                },
            }}

            sandbox={true}
            passphrase="thisisatestforthe"

            onCancel={(data) => {
                console.log("Payment cancelled: ", data.transaction_id);
            }}

            onMessage={(message) => {
                console.log(message);
            }}

            onSuccess={({ data, transaction_id }) => {
                console.log(transaction_id);
            }}

            onClose={() => {
                console.log("Payment closed");
            }}
        />
        ...

```

#### Generate payment link

```javascript
import { LinkPayment } from "react-native-payfast-plugin";

const link = new LinkPayment(
  {
    merchantDetails: {
      merchant_id: "10031584",
      merchant_key: "5n52c1qu5501c",
      notify_url: "https://webhook.site/f30e4b32-15b5-44e6-ae0b-c75486b8797d",
    },
    customerDetails: {
      name_first: "First Name",
      name_last: "Last Name",
      email_address: "firstname@gmail.com",
      cell_number: "088...",
    },
    transactionDetails: {
      m_payment_id: "1234",
      amount: "10.00",
      item_name: "Item Name",
      item_description: "Item Description",
    },
    transactionOptions: {
      email_confirmation: 0,
      confirmation_address: "firstname4@gmail.com",
    },
  },
  true,
  "thisisatestforthe"
);

// Optional - change to your own urls defaults to https://payfast.io/
link.cancel_url = "https://www.google.com/search?q=cancel";
link.return_url = "https://www.google.com/search?q=success";

const handleLink = async () => {
  link.getLink().then((link) => {
    setLink(link);
  });
};


// In your render function

...
  <Button title="Generate Link" onPress={handleLink} />
  <Text>{link}</Text>
...
```

#### Update card details

```javascript
import { UpdateCard } from "react-native-payfast-plugin";

...
    <UpdateCard
        token="...e90c2-....-....-9ccb-...."
        onComplete={(data) => console.log(data)}
        sandbox={true}
    />
....

```

#### Tokenize card details

```javascript

// Use the same PayFast component as in-app payment on the data prop add the following

    recurringBilling: {
        subscription_type: "2",
    },

```

### Props

#### PayFast

| Prop       | Type     | Description                                    |
| ---------- | -------- | ---------------------------------------------- |
| data       | object   | Data object for in-app payment                 |
| sandbox    | boolean  | Set to true for sandbox mode                   |
| passphrase | string   | Passphrase for sandbox mode                    |
| onCancel   | function | Callback function when payment is cancelled    |
| onMessage  | function | Callback function when payment is in progress  |
| onSuccess  | function | Callback function when payment is successful   |
| onClose    | function | Callback function when payment is closed       |
| onComplete | function | Callback function when card update is complete |

##### data

| Prop               | Type   | Description                                                                                                                            |
| ------------------ | ------ | -------------------------------------------------------------------------------------------------------------------------------------- |
| merchantDetails    | object | Merchant details. [See](https://developers.payfast.co.za/docs#step_1_form_fields:~:text=Payfast%20Payment%20page.-,Merchant%20details) |
| customerDetails    | object | Customer details [See](https://developers.payfast.co.za/docs#step_1_form_fields:~:text=notify%22%3E-,Customer%20details,-name_first)   |
| transactionDetails | object | Transaction details [See](https://developers.payfast.co.za/docs#step_1_form_fields:~:text=0823456789%22%3E-,Transaction%20details)     |
| transactionOptions | object | Transaction options [See](https://developers.payfast.co.za/docs#step_1_form_fields:~:text=information%22%3E-,Transaction%20options)    |
| recurringBilling   | object | Recurring billing options [See](https://developers.payfast.co.za/docs#subscriptions:~:text=Additional%20subscription%20form%20fields)  |

#### LinkPayment

Same as PayFast [data](./readme.md#PayFast)

#### UpdateCard

| Prop       | Type     | Description                                    |
| ---------- | -------- | ---------------------------------------------- |
| token      | string   | Token for card to be updated                   |
| sandbox    | boolean  | Set to true for sandbox mode                   |
| onComplete | function | Callback function when card update is complete |


## License

MIT

## Author

Axole Maranjana

[![Twitter Follow](https://img.shields.io/twitter/follow/iamraphson.svg?style=social&label=Follow)](https://twitter.com/axole_ma)
[![GitHub followers](https://img.shields.io/github/followers/axolem.svg?style=social&label=Follow)](https://github.com/AxoleM)
[![Instagram](https://img.shields.io/badge/Instagram-E4405F?style=social&logo=instagram)](https://www.instagram.com/axole_mar/)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=social&logo=linkedin)](https://www.linkedin.com/in/axolemaranjana/)

## Help Wanted!

This project is open for contributions. All contributions must be done via pull requests. Feel free to create issues and pull requests.

## Credits

- [Payfast](https://www.payfast.co.za/)
- [React Native](https://reactnative.dev/)

## Support

<a href="https://www.buymeacoffee.com/axolem" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" width="150" ></a>





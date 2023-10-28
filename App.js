import { StatusBar } from "expo-status-bar";
import { Button, SafeAreaView, Text } from "react-native";

import PayFast, {
  Frequency,
  UpdateCard,
  LinkPayment
} from "react-native-payfast-plugin";

import React from "react";


export default function App() {
  const [link, setLink] = React.useState("No link");
  return (
    <SafeAreaView style={{ paddingTop: 40, flex: 1 }}>
      <StatusBar style="auto" />
      {false ? (
        <PayFast
          data={{
            merchantDetails: {
              merchant_id: "10031584",
              merchant_key: "5n52c1qu5501c",
              notify_url:
                "https://webhook.site/f30e4b32-15b5-44e6-ae0b-c75486b8797d",
            },
            customerDetails: {
              name_first: "First Name",
              name_last: "Last Name",
              email_address: "axolemaranjana@gmail.com",
              cell_number: "0681721606",
            },
            transactionDetails: {
              m_payment_id: "1234",
              amount: "10.00",
              item_name: "Item Name",
              item_description: "Item Description",
            },
            transactionOptions: {
              email_confirmation: 0,
              confirmation_address: "axolemaranjana4@gmail.com",
            },
            recurringBilling: {
              // frequency: Frequency.MONTHLY,
              // cycles: "7",
              billing_date: "2021-08-01",
              subscription_type: "2",
              recurring_amount: 500,
              frequency: Frequency.DAILY
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
      ) : false ? (
        <UpdateCard
          token="d33e90c2-f09d-48b2-9ccb-d9129822eafb"
          onComplete={(data) => console.log(data)}
          sandbox={true}
        />
      ) : (
        <>
          <Button
            title="Get Link"
            onPress={() => {
              const link = new LinkPayment(
                {
                  merchantDetails: {
                    merchant_id: "10031584",
                    merchant_key: "5n52c1qu5501c",
                    notify_url:
                      "https://webhook.site/f30e4b32-15b5-44e6-ae0b-c75486b8797d",
                  },
                  customerDetails: {
                    name_first: "First Name",
                    name_last: "Last Name",
                    email_address: "axolemaranjana@gmail.com",
                    cell_number: "0681721606",
                  },
                  transactionDetails: {
                    m_payment_id: "1234",
                    amount: "10.00",
                    item_name: "Item Name",
                    item_description: "Item Description",
                  },
                  transactionOptions: {
                    email_confirmation: 0,
                    confirmation_address: "axolemaranjana4@gmail.com",
                  },
                },
                true,
                "thisisatestforthe"
              );

              link.cancel_url = "https://www.google.com/search?q=cancel";
              link.return_url = "https://www.google.com/search?q=success";

              link.getLink().then((link) => {
                setLink(link);
              });
            }}
          />
          <Text>{link}</Text>
        </>
      )}
    </SafeAreaView>
  );
}

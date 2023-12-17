import { StatusBar } from "expo-status-bar";
import { Button, SafeAreaView, Text, View } from "react-native";

// import PayFast, {
//   Frequency,
//   UpdateCard,
//   LinkPayment
// } from "react-native-payfast-plugin";

import PayFast, {
  Subsciption,
  Frequency,
  UpdateCard,
  LinkPayment
} from "./react-native-payfast-plugin";

import React from "react";


export default function App() {
  const [link, setLink] = React.useState("No link");

  const subscription = new Subsciption("18753352", "06ce12dc-c2be-42d8-abfb-876757b19b7b", "GPBUSDZaR15.178", true);
  return (
    <SafeAreaView style={{ paddingTop: 40, flex: 1 }}>
      <StatusBar style="auto" />
      {true ? (
        <PayFast
          data={{
            merchantDetails: {
              merchant_id: "18753352",
              merchant_key: "8juvzu22esbxc",
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
              amount: "0.00",
              item_name: "Item Name",
              item_description: "Item Description",
            },
            transactionOptions: {
              email_confirmation: 0,
              confirmation_address: "axolemaranjana4@gmail.com",
            },
            recurringBilling: {
              frequency: Frequency.ANNUALLY,
              cycles: "7",
              billing_date: "2021-08-01",
              subscription_type: "2",
              recurring_amount: 5,
              //frequency: Frequency.DAILY
            },
          }}
          sandbox={false}
          passphrase="GPBUSDZaR15.178"
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
          sandbox={false}
        />
      ) : (
        <View style={{ gap: 10, padding: 20 }}>
          <Button
            title="Charge Card"
            onPress={async () => {
              const res = await subscription.chargeTokenizedCard({
                amount: 500,
                item_name: "Item Name",
                //item_description: "Item Description",
                //m_payment_id: "1234",
                //itn: true
              })

              console.log(res)
            }}
          />
          <Button
            title="Pause Subscription"
            onPress={async () => {
              const res = await subscription.pauseSubscription();

              console.log(res)
            }}
          />
          <Button
            title="Resume Subscription"
            onPress={async () => {
              const res = await subscription.resumeSubscription();

              console.log(res)
            }}
          />
          <Button
            title="Get Subscription"
            onPress={async () => {
              const res = await subscription.getSubscription();

              console.log(res)
            }}
          />
          <Button
            title="Cancel Subscription"
            onPress={async () => {
              const res = await subscription.chargeTokenizedCard({
                amount: 500,
                item_name: "Item Name",
                item_description: "Item Description",
                m_payment_id: "1234",
                itn: true
              })

              console.log(res)
            }}
          />
          <Button
            title="Get Link"
            onPress={() => {
              const link = new LinkPayment(
                {
                  merchantDetails: {
                    merchant_id: "18753352",
                    merchant_key: "8juvzu22esbxc",
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
                false,
                "GPBUSDZaR15.178"
              );

              link.cancel_url = "https://www.google.com/search?q=cancel";
              link.return_url = "https://www.google.com/search?q=success";

              link.getLink().then((link) => {
               
                
                setLink(link);
              });
            }}
          />
          
          <Text>{link}</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

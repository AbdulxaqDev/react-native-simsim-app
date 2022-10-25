import {
 Text,
 View,
 StyleSheet,
 Button,
 ImageBackground,
 TouchableOpacity,
 ScrollView,
 Image,
 Dimensions,
 ActivityIndicator,
 Alert,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import kitchenImg from "../src/assets/images/kitchen.png";
import addIcon from "../src/assets/images/addCircleW.png";
import { devicesActions } from "../store/devicesSlice";
import Paho from "paho-mqtt";
import AsyncStorage, {
 useAsyncStorage,
} from "@react-native-async-storage/async-storage";

const client = new Paho.Client(
 "test.mosquitto.org",
 Number(8080),
 `mqtt-async-test-${parseInt(Math.random() * 100)}`
);

export default function Channels({
 channels = [
  {
   id: 6,
   name: "Test 1",
   description: "string",
   topic_name:
    "Home 85960803a4-dbb0-4a95-8bdf-00ddb946e705/deveeice 0ww1/channel 353",
   state: false,
   created_at: "2022-07-18T15:42:24.103708+05:00",
   owner: 3,
   device: 9,
  },
  {
   id: 7,
   name: "Test 2",
   description: "string",
   topic_name:
    "Home 851b744909-8b43-4604-8658-a976b703e490/deveeice 0ww1/channel 9",
   state: false,
   created_at: "2022-07-18T15:42:32.459737+05:00",
   owner: 3,
   device: 9,
  },
 ],
 selectedDeviceId,
 statusData,
}) {
 const [switchDevice, setSwitchDevice] = useState(true);
 const [loading, setLoading] = useState(false);
 const width = Dimensions.get("window").width;
 const height = Dimensions.get("window").height;
 const [topic, setTopic] = useState(null);
 const [topicMessage, setTopicMesssage] = useState(null);
 const [channelID, setChannelID] = useState(null);
 const [message, setMessage] = useState(null);
 const [connectedPaho, setConnectedPaho] = useState(false);
 const value = useSelector((state) => state.devices.value);
 const dispatch = useDispatch();
 const [homeDeviceData, setHomeDeviceData] = useState(null);
 const [stateControl, setStateControl] = useState(false);
 const [channelsState, setChannelsState] = useState([]);
 const dataUpdater = () => {
  dispatch(devicesActions.updater());
 };

 function onMessage(message) {
  setChannelsState([...channelsState, message]);
 }

 useEffect(() => {
  if (channels) {
   client.connect({
    onSuccess: () => {
     setConnectedPaho(true);
    },
    onFailure: () => {
     console.log("Failed to connect!");
    },
   });
  }
 }, []);

 const subscribeChannel = (channelTopic) => {
  const { homeName, homeKey, deviceName, deviceHome, homeId } = homeDeviceData;

  if (
   connectedPaho &&
   homeDeviceData &&
   stateControl &&
   deviceHome === homeId
  ) {
   client.subscribe("1" + channelTopic);

   const message = new Paho.Message("status");

   console.log(`${homeName}${homeKey}/${deviceName}/status`);

   message.destinationName = `${homeName}${homeKey}/${deviceName}/status`;

   client.send(message);

   client.onMessageArrived = onMessage;

   setStateControl(false);
  }
 };

 const publishChannel = (status, client, topicName) => {
  if (status) {
   const message = new Paho.Message("off");
   message.destinationName = topicName;
   client.send(message);
  } else {
   const message = new Paho.Message("on");
   message.destinationName = topicName;
   client.send(message);
  }
 };

 const navigation = useNavigation();

 useEffect(() => {
  if (statusData.home !== null && statusData.device !== null) {
   setHomeDeviceData((pre) => ({
    ...pre,
    homeName: statusData.home.name,
    homeKey: statusData.home.key,
    deviceName: statusData.device.name,
    homeId: statusData.home.id,
    deviceHome: statusData.device.home,
   }));
   setStateControl(true);
  }
 }, [statusData.home, statusData.device]);

 return (
  <View style={style.allChannels}>
   {loading && (
    <View
     style={{
      position: "absolute",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 500,
      backgroundColor: "rgba(22, 24, 37, 0.4)",
      width: width,
      height: height,
     }}
    >
     <ActivityIndicator size="large" color="#FFFFFF" />
    </View>
   )}
   <ScrollView showsVerticalScrollIndicator={false}>
    {channels.map((channel, i) => {
     let checked = false;
     if (selectedDeviceId == channel.device) {
      subscribeChannel(channel.topic_name);
      if (
       channelsState.some(
        (channelState) =>
         channelState.destinationName === `1${channel.topic_name}` &&
         channelState.payloadString === "1"
       )
      ) {
       checked = true;
      }
     }

     return (
      selectedDeviceId == channel.device && (
       <View style={style.wrapper} key={channel.id}>
        <ImageBackground source={kitchenImg} style={style.channel}>
         <View>
          <Text style={style.channelName}>{channel.name}</Text>
         </View>
         <TouchableOpacity style={style.btnWrapper} activeOpacity={1}>
          <View style={[style.brd, { paddingLeft: checked ? 32 : 7 }]}>
           <TouchableOpacity style={style.btnFrame}>
            <Button
             style={style.channelBtn}
             title={checked ? "On" : "Off"}
             color="#212540"
             onPress={() => {
              publishChannel(checked, client, channel.topic_name);
             }}
            />
           </TouchableOpacity>
          </View>
         </TouchableOpacity>
        </ImageBackground>
       </View>
      )
     );
    })}

    <TouchableOpacity
     style={style.addChannel}
     activeOpacity={0.7}
     onPress={() => navigation.navigate("Add channel")}
    >
     <Image source={addIcon} />
    </TouchableOpacity>
   </ScrollView>
  </View>
 );
}

const style = StyleSheet.create({
 allChannels: {
  flex: 0.7,
  borderRadius: 10,
  overflow: "hidden",
 },
 wrapper: {
  borderRadius: 10,
 },
 channel: {
  width: "100%",
  backgroundColor: "rgba(0, 0, 0, 0)",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-around",
  height: 150,
  borderRadius: 10,
  overflow: "hidden",
  marginTop: 10,
 },
 channelName: {
  color: "#fff",
  fontSize: 27,
  fontWeight: "400",
  fontFamily: "Poppins-SemiBold",
  padding: 25,
  textTransform: "capitalize",
 },
 btnWrapper: {
  width: "100%",
  display: "flex",
  alignItems: "flex-end",
  paddingBottom: 17,
  paddingRight: 17,
 },
 brd: {
  width: 95,
  padding: 7,
  backgroundColor: "#ed7844",
  borderRadius: 100,
 },
 btnFrame: {
  width: 55,
  height: 33,
  borderRadius: 100,
  overflow: "hidden",
 },
 channelBtn: {
  width: 20,
  height: 40,
  borderRadius: 30,
 },
 addChannel: {
  marginTop: 10,
  backgroundColor: "#353a5b",
  height: 60,
  borderRadius: 10,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
 },
});

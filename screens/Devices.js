import {
 View,
 Text,
 SafeAreaView,
 StyleSheet,
 Dimensions,
 ActivityIndicator,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

import HomeDrops from "../components/HomeDrops";
import HomeDevices from "../components/HomeDevices";
import Channels from "../components/Channels";
import Sensors from "../components/Sensors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BaseUrl from "./baseUrl";

const isUserSignIn = async () => {
 try {
  const isUser = await AsyncStorage.getItem("@IS_LOGGED_IN");
  return isUser == "true";
 } catch (e) {
  console.log(
   "Error on getting Token from Asyn storage (Home Settings screen): ",
   e
  );
 }
};

export default function Devices({ navigation }) {
 const value = useSelector((state) => state.devices.value);

 /*
    Setting HOME to Asyncstorage, which is local storage.
*/
 const setHomeToStorage = async (home) => {
  try {
   const deleteId = await AsyncStorage.removeItem("@HOME");
   const id = await AsyncStorage.setItem("@HOME", JSON.stringify(home));
   // const name = await AsyncStorage.setItem('@HOME_NAME', homeNAME)
  } catch (e) {
   console.log(
    "Error on getting Token from Asyn storage (Home Settings screen): ",
    e
   );
  }
 };

 /*
  Getting Home from Asyncstorage, which is local storage.
*/
 const getHomeToStorage = async () => {
  try {
   const home = await AsyncStorage.getItem("@HOME");
   // const name = await AsyncStorage.getItem('@HOME_NAME')
   return home;
  } catch (e) {
   console.log(
    "Error on getting Token from Asyn storage (Home Settings screen): ",
    e
   );
  }
 };

 /*
  Setting HOME to Asyncstorage, which is local storage.
*/
 const setDeviceIdToStorage = async (deviceid) => {
  try {
   const deleteId = await AsyncStorage.removeItem("@DEVICE_ID");
   const id = await AsyncStorage.setItem(
    "@DEVICE_ID",
    JSON.stringify(deviceid)
   );
  } catch (e) {
   console.log(
    "Error on getting Token from Asyn storage (Home Settings screen): ",
    e
   );
  }
 };

 /*
  Getting Home from Asyncstorage, which is local storage.
  */
 const getDeviceIdFromStorage = async () => {
  try {
   const id = await AsyncStorage.getItem("@DEVICE_ID");
   return id;
  } catch (e) {
   console.log(
    "Error on getting Token from Asyn storage (Home Settings screen): ",
    e
   );
  }
 };

 const [selecedItem, setSelecedItem] = useState(null);
 const [loading, setLoading] = useState(true);

 const [homes, setHomes] = useState([]);
 const [devices, setDevices] = useState([]);
 const [channelsList, setChannelsList] = useState([]);
 const [sensors, setSensors] = useState([]);
 const [homeId, setHomeId] = useState(null);
 const [deviceId, setDeviceId] = useState(null);
 const [device, setDevice] = useState(null);
 const [statusData, setStatusData] = useState({
  home: null,
  device: null,
 });

 /*
      Setting height and width of device
  */
 const width = Dimensions.get("window").width;
 const height = Dimensions.get("window").height;

 /*
      Set selected device ID to channels list on Device screen, channels list list.
  */
 const getSelectedDeviceId = (device) => {
  setDeviceIdToStorage(device);
  setDeviceId(device.id);
  setStatusData((pre) => ({
   ...pre,
   device: device,
  }));
 };

 /*
      Set selected item to dropdown on Device screen, home list.
  */
 const getSelectedHomeIdAndName = (item) => {
  setStatusData((pre) => ({
   ...pre,
   home: item,
  }));
  setHomeToStorage(item);
  setHomeId(item.id);
  setSelecedItem(item);
 };

 /*
      Getting token from Asyncstorage, wjich is local storage.
  */
 const getToken = async () => {
  try {
   const value = await AsyncStorage.getItem("@LOGIN_TOKEN");
   return value;
  } catch (e) {
   console.log(
    "Error on getting Token from Asyn storage (Devices screen): ",
    e
   );
  }
 };

 /*
      Async function to fetch, gets token and endpoint in API as arguments
  */
 const apiRequest = async (token, data) => {
  try {
   let myHeaders = new Headers();
   myHeaders.append("Authorization", "Bearer " + token);

   let requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
   };

   let response = await fetch(`${BaseUrl}/api/${data}/`, requestOptions);
   let jsonData = response.json();
   return jsonData;
  } catch (e) {
   console.log(
    `Error on getting ${data} List from Asyn storage (Devices screen): `,
    e
   );
  }
 };

 const fetchAll = (token, ...endPoints) => {
  Promise.all([
   apiRequest(token, endPoints[0]),
   apiRequest(token, endPoints[1]),
   apiRequest(token, endPoints[2]),
   apiRequest(token, endPoints[3]),
  ])
   .then((allResponses) => {
    const listOfHomes = allResponses[0];
    const listOfDevices = allResponses[1];
    const listOfSensors = allResponses[2];
    const listOfChannels = allResponses[3];
    setHomes(listOfHomes);
    setDevices(listOfDevices);
    setSensors(listOfSensors);
    setChannelsList(listOfChannels);
    setLoading(false);
   })
   .catch((error) => console.log("Error on Devie screen on fetchAll", error));
 };

 useEffect(() => {
  console.log("API request triggered in Device screen");
  let isApiSubscribed = true;
  if (isApiSubscribed) {
   getToken()
    .then((token) => {
     // handle success
     fetchAll(token, "home", "device", "sensor", "channel");
    })
    .catch((error) => console.log("Error on Devie screen on fetching", error));
  }
  return () => {
   // cancel the subscription
   isApiSubscribed = false;
  };
 }, [value]);

 useEffect(() => {
  getHomeToStorage()
   .then((home) => {
    let homeData = JSON.parse(home);
    setHomeId(homeData.id);
    setSelecedItem(homeData);
    setStatusData((pre) => ({
     ...pre,
     home: homeData,
    }));
   })
   .catch((e) =>
    console.log("Error on setting home data from local storage: ", e)
   );
  getDeviceIdFromStorage()
   .then((device) => {
    let deviceData = JSON.parse(device);
    setDevice(deviceData);
    setDeviceId(deviceData.id);
    setStatusData((pre) => ({
     ...pre,
     device: deviceData,
    }));
   })
   .catch((e) =>
    console.log("Error on setting device data from local storage: ", e)
   );
 }, []);

 return (
  isUserSignIn() && (
   <SafeAreaView style={style.container} navigation={navigation}>
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
    <HomeDrops
     selectedItem={selecedItem}
     listOfHomes={homes}
     onSelect={getSelectedHomeIdAndName}
    />
    <HomeDevices
     deviceData={device}
     devices={devices}
     homeId={homeId}
     onSelectedDeviceId={getSelectedDeviceId}
    />
    <View>
     <Text style={style.sensorsTitle}>Channels</Text>
    </View>
    <Channels
     channels={channelsList}
     selectedDeviceId={deviceId}
     statusData={statusData}
    />
    <View>
     <Text style={style.sensorsTitle}>Sensors</Text>
    </View>
    <Sensors deviceId={deviceId} sensors={sensors} />
   </SafeAreaView>
  )
 );
}

const style = StyleSheet.create({
 container: {
  padding: 10,
  backgroundColor: "rgb(22, 24, 37)",
  flex: 1,
 },
 sensorsTitle: {
  color: "#fff",
  fontSize: 20,
  fontWeight: "400",
  fontFamily: "Poppins-Light",
  padding: 5,
  textTransform: "capitalize",
  marginBottom: -10,
  marginTop: 10,
 },
});

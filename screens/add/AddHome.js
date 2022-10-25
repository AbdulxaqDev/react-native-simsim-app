import {
 View,
 Text,
 StyleSheet,
 SafeAreaView,
 TextInput,
 ActivityIndicator,
 Dimensions,
 Alert,
} from "react-native";
import React, { useState } from "react";

import { useDispatch } from "react-redux";
import { devicesActions } from "../../store/devicesSlice";

import Btn from "../../components/Btn";
import { TouchableOpacity } from "react-native-gesture-handler";

import AsyncStorage from "@react-native-async-storage/async-storage";
import BaseUrl from "../baseUrl";

export default function AddHome() {
 const dispatch = useDispatch();
 const dataUpdater = () => {
  dispatch(devicesActions.updater());
 };

 /*
      Setting height and width of device
  */
 const width = Dimensions.get("window").width;
 const height = Dimensions.get("window").height;

 const [homeName, setHomeName] = useState("");
 const [loading, setLoading] = useState(false);

 const getToken = async () => {
  try {
   const value = await AsyncStorage.getItem("@LOGIN_TOKEN");
   return value;
  } catch (e) {
   console.log(
    "Error on getting Token from Asyn storage (Add home screen): ",
    e
   );
  }
 };

 /*
    Async function to fetch, gets token and endpoint in API as arguments
*/
 const apiRequest = async (token, data, requestType) => {
  try {
   let myHeaders = new Headers();
   myHeaders.append("Authorization", "Bearer " + token);
   myHeaders.append("Content-Type", "application/json");

   let raw = {
    name: homeName,
   };

   let requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: JSON.stringify(raw),
    redirect: "follow",
   };

   let response = await fetch(`${BaseUrl}/api/${data}/`, requestOptions);
   let jsonData = await response.json();
   return jsonData;
  } catch (e) {
   console.log(
    `Error on getting ${data} List from Asyn storage (Add home screen): `,
    e
   );
  }
 };

 const postAll = (token, ...endPoints) => {
  console.log(endPoints[0]);
  Promise.all([apiRequest(token, endPoints[0], "POST")])
   .then((allResponses) => {
    const postedHome = allResponses[0];
    setLoading(false);
    setHomeName("");
    dataUpdater();
    console.log("Posted home: ----------------- / ", postedHome);
   })
   .catch((error) => console.log("Error on postAll()", error));
 };

 const postHome = () => {
  if (homeName != "") {
   getToken()
    .then((token) => {
     postAll(token, "home");
     dataUpdater();
    })
    .catch((error) => {
     Alert.alert("Error", `Error on creating home, try again.`, [
      { text: "OK" },
     ]);
    });
   setLoading(true);
  } else {
   Alert.alert("Empty", `Please enter home name and try again.`, [
    { text: "OK" },
   ]);
  }
 };

 return (
  <SafeAreaView style={style.container}>
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
   <View style={style.textAreaWrapper}>
    <TextInput
     style={style.textArea}
     placeholder="Home name"
     placeholderTextColor="#B4B4B4"
     underlineColorAndroid="transparent"
     onChangeText={(homeName) => {
      setHomeName(homeName);
     }}
     value={homeName}
    ></TextInput>
   </View>
   <TouchableOpacity
    onPress={() => {
     postHome();
    }}
   >
    <Btn btnAlign="center" btnTitle="Add" btnMarginTop={30} />
   </TouchableOpacity>
  </SafeAreaView>
 );
}

const style = StyleSheet.create({
 container: {
  padding: 10,
  backgroundColor: "rgb(22, 24, 37)",
  flex: 1,
  position: "relative",
 },
 textAreaWrapper: {
  backgroundColor: "#3F455B",
  marginTop: 71,
  borderRadius: 7,
  display: "flex",
  height: Dimensions.get("window").height * 0.5,
 },
 textArea: {
  borderRadius: 7,
  textAlignVertical: "top",
  padding: 10,
  color: "#FFFFFF",
  fontFamily: "Poppins-Regular",
  fontSize: 16,
  marginHorizontal: 34,
  marginVertical: 17,
  borderBottomColor: "#B4B4B4",
  borderBottomWidth: 1,
 },
});

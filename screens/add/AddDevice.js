import {
 View,
 Text,
 StyleSheet,
 SafeAreaView,
 TextInput,
 TouchableOpacity,
 Dimensions,
 ActivityIndicator,
 Alert,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { devicesActions } from "../../store/devicesSlice";

import Btn from "../../components/Btn";
import DropDown from "../../components/dropDown";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BaseUrl from "../baseUrl";

export default function AddDevice() {
 const dispatch = useDispatch();
 const dataUpdater = () => {
  dispatch(devicesActions.updater());
 };

 const [loading, setLoading] = useState(false);
 const [deviceName, setDeviceName] = useState("");
 const [listOfProducts, setListOfProducts] = useState([]);
 const [listOfHomes, setListOfHomes] = useState([]);
 const [productName, setProductName] = useState("");
 const [productID, setProductID] = useState("");
 const [home, setHome] = useState("");
 const [homeId, setHomeId] = useState("");
 const width = Dimensions.get("window").width;
 const height = Dimensions.get("window").height;

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

 const apiRequest = async (token, data, requestType) => {
  try {
   let myHeaders = new Headers();
   myHeaders.append("Authorization", "Bearer " + token);
   let raw = {
    product: productID,
    home: homeId,
    name: deviceName,
    description: "No description",
   };

   if (requestType == "POST") {
    myHeaders.append("Content-Type", "application/json");
   }

   let requestOptions =
    requestType == "POST"
     ? {
        method: "POST",
        headers: myHeaders,
        body: JSON.stringify(raw),
        redirect: "follow",
       }
     : {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
       };

   let response = await fetch(`${BaseUrl}/api/${data}/`, requestOptions);
   let jsonData = await response.json();
   return jsonData.results;
  } catch (e) {
   console.log(
    `Error on getting ${data} List from Asyn storage (Devices screen): `,
    e
   );
  }
 };

 const fetchAll = (token, ...endPoints) => {
  Promise.all([
   apiRequest(token, endPoints[0], "GET"),
   apiRequest(token, endPoints[1], "GET"),
  ])
   .then((allResponses) => {
    const listOfProduct = allResponses[0];
    const listOfHome = allResponses[1];
    setListOfProducts(listOfProduct);
    setListOfHomes(listOfHome);
    dataUpdater();
    setLoading(false);
   })
   .catch((error) => console.log("Error on Devie screen on fetchAll", error));
 };

 useEffect(() => {
  getToken()
   .then((token) => {
    fetchAll(token, "productproduct", "home");
   })
   .catch((error) =>
    console.log("Error on add device screen on fetching", error)
   );
 }, []);

 const postAll = (token, ...endPoints) => {
  console.log(endPoints[0]);
  Promise.all([apiRequest(token, endPoints[0], "POST")])
   .then((allResponses) => {
    const postedCondition = allResponses[0];
    setLoading(false);
    console.log("Posted device: ----------------- / ", postedCondition);
   })
   .catch((error) => console.log("Error on postAll()", error));
 };

 const postDevice = () => {
  if ((deviceName != "" && productName != "", homeId != "")) {
   getToken()
    .then((token) => {
     postAll(token, "device");
     setDeviceName("");
     setHome("");
     setProductName("");
     dataUpdater();
    })
    .catch((error) => {
     Alert.alert(`${error}`, `Error on creating device, try again.`, [
      { text: "OK" },
     ]);
    });
   setLoading(true);
  } else {
   Alert.alert("Empty", `Please enter device name and choose a product.`, [
    { text: "OK" },
   ]);
  }
 };

 const handleSelectedProduct = (product, id) => {
  setProductID(id);
  setProductName(product);
  console.log("this is product     ", product.split("").pop());
 };

 const handleSelectedHome = (home, id) => {
  setHome(home);
  setHomeId(id);
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
     placeholder="Device name"
     placeholderTextColor="#B4B4B4"
     underlineColorAndroid="transparent"
     onChangeText={(deviceName) => {
      setDeviceName(deviceName);
     }}
     value={deviceName}
    ></TextInput>
    <DropDown
     label="Choose home"
     listOfItems={listOfHomes}
     selectedItem={home}
     handleSelectedItem={handleSelectedHome}
     width="100%"
    />
    <DropDown
     label="Choose a product"
     listOfItems={listOfProducts}
     selectedItem={productName}
     handleSelectedItem={handleSelectedProduct}
     width="100%"
    />
   </View>
   <TouchableOpacity
    style={{
     zIndex: 10,
     height: 43,
     width: 130,
     marginLeft: width / 2,
     transform: [{ translateX: -65 }, { translateY: 0 }],
     marginTop: 80,
    }}
    onPress={() => {
     postDevice();
    }}
   >
    <Btn btnAlign="center" btnTitle="Add" btnMarginTop={0} />
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
  zIndex: 100,
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

import {
 View,
 Text,
 StyleSheet,
 SafeAreaView,
 TouchableOpacity,
 Image,
 Dimensions,
 ActivityIndicator,
 Alert,
} from "react-native";
import React, { useState, useEffect } from "react";
import Svg, { Path } from "react-native-svg";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BaseUrl from "./baseUrl";
import { useSelector } from "react-redux";

export default function More() {
 const value = useSelector((state) => state.userProfile.value);

 const navigation = useNavigation();
 const width = Dimensions.get("window").width;
 const height = Dimensions.get("window").height;
 const [loading, setLoading] = useState(false);

 const [email, setEmail] = useState("");
 const [emails, setEmails] = useState([]);

 /*
      Getting token from Asyncstorage, wjich is local storage.
  */
 const getToken = async () => {
  try {
   const value = await AsyncStorage.getItem("@LOGIN_TOKEN");
   const user_email = await AsyncStorage.getItem("@USER_EMAIL");
   setEmail(user_email);
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
  Promise.all([apiRequest(token, endPoints[0], "GET")])
   .then((allResponses) => {
    const listOfUsers = allResponses[0];
    setEmails(listOfUsers[0]);
    setLoading(false);
   })
   .catch((error) => console.log("Error on more screen on fetchAll", error));
 };

 useEffect(() => {
  let isApiSubscribed = true;
  getToken()
   .then((token) => {
    if (isApiSubscribed) {
     // handle success
     fetchAll(token, "me");
    }
   })
   .catch((error) => console.log("Error on more screen on register", error));
  return () => {
   // cancel the subscription
   isApiSubscribed = false;
  };
 }, [value]);

 return (
  <>
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
    <View style={style.userSide}>
     <View style={style.userImg}>
      <UserSvgIcon />
     </View>
     <View>
      <Text style={style.userName}>{email}</Text>
      <TouchableOpacity
       style={style.userEditWrapper}
       onPress={() =>
        navigation.navigate("Edit profile", {
         firstN: emails.first_name,
         lastN: emails.last_name,
         pN: emails.phone_number,
         uN: emails.username,
         uID: emails.id,
         em: emails.email,
        })
       }
      >
       <Text style={style.userEdit}>Edit profile</Text>
      </TouchableOpacity>
     </View>
    </View>

    <View>
     <TouchableOpacity
      style={style.moreOptionWrapper}
      onPress={() => navigation.navigate("Home settings")}
     >
      <Text style={style.moreOption}>Home settings</Text>
     </TouchableOpacity>
     <TouchableOpacity
      style={style.moreOptionWrapper}
      onPress={() => navigation.navigate("Device settings")}
     >
      <Text style={style.moreOption}>Device settings</Text>
     </TouchableOpacity>
     <TouchableOpacity
      style={style.moreOptionWrapper}
      onPress={() => navigation.navigate("Channel settings")}
     >
      <Text style={style.moreOption}>Channel settings</Text>
     </TouchableOpacity>
     <TouchableOpacity
      style={style.moreOptionWrapper}
      onPress={() => navigation.navigate("Schedule settings")}
     >
      <Text style={style.moreOption}>Schedule settings</Text>
     </TouchableOpacity>
     <TouchableOpacity
      style={[style.moreOptionWrapper, { marginBottom: 170 }]}
      onPress={() => navigation.navigate("Sensor settings")}
     >
      <Text style={style.moreOption}>Sensor settings</Text>
     </TouchableOpacity>
    </View>

    <TouchableOpacity
     style={style.moreOptionWrapper}
     onPress={() => {
      const updateToken = async () => {
       try {
        await AsyncStorage.removeItem("@LOGIN_TOKEN");
        await AsyncStorage.removeItem("@USER_EMAIL");
        await AsyncStorage.setItem("@IS_LOGGED_IN", "false");
       } catch (e) {
        console.log("Error logging out: ", e);
       }
      };
      updateToken().then(() => {
       navigation.navigate("SignIn");
      });
     }}
    >
     <Text style={style.moreOption}>Log out</Text>
    </TouchableOpacity>
   </SafeAreaView>
  </>
 );
}

const UserSvgIcon = (props) => (
 <Svg
  width={30}
  height={30}
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
  {...props}
 >
  <Path
   d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"
   stroke="#fff"
   strokeWidth={2}
   strokeLinecap="round"
   strokeLinejoin="round"
  />
 </Svg>
);

const style = StyleSheet.create({
 container: {
  padding: 10,
  backgroundColor: "rgb(22, 24, 37)",
  flex: 1,
  position: "relative",
  display: "flex",
  justifyContent: "space-around",
  alignItems: "center",
 },
 userSide: {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "row",
  fontFamily: "Poppins-Regular",
 },
 userName: {
  fontSize: 19,
  color: "white",
  marginBottom: 5,
 },
 userEdit: {
  color: "#fff",
  fontSize: 13,
  textDecorationLine: "underline",
 },
 userImg: {
  borderWidth: 2,
  borderColor: "#FFFFFF",
  borderRadius: 50,
  marginRight: 10,
  padding: 10,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  paddingTop: 13,
  paddingLeft: 14,
 },
 moreOptionWrapper: {
  marginTop: 20,
 },
 moreOption: {
  color: "#fff",
  borderBottomColor: "#797979",
  borderBottomWidth: 1,
  paddingBottom: 10,
  alignSelf: "center",
  fontSize: 20,
 },
});

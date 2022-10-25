import {
  View, Text, StyleSheet, SafeAreaView, TextInput, Dimensions,
  ActivityIndicator,
  Alert,
  TouchableOpacity
} from 'react-native'
import React, { useState, useEffect } from 'react';
import BaseUrl from '../baseUrl';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useSelector, useDispatch } from "react-redux"
import { profileActions } from '../../store/userProfileEdit';


import Btn from '../../components/Btn';

export default function EditProfile({ route }) {

  const value = useSelector(state => state.userProfile.value);
  const dispatch = useDispatch();
  const updater = () => {
    dispatch(profileActions.updater())
  }
  const width = Dimensions.get('window').width;
  const height = Dimensions.get('window').height;
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNum, setPhoneNum] = useState("");
  const [userName, setUserName] = useState("");
  const [userId, setUserId] = useState(null);

  const {
    firstN,
    lastN,
    pN,
    uN,
    uID,
    em,
  } = route.params







  /*
      Getting token from Asyncstorage, wjich is local storage.
  */
  const getToken = async () => {
    try {
      const value = await AsyncStorage.getItem('@LOGIN_TOKEN');
      return value;
    } catch (e) {
      console.log("Error on getting Token from Asyn storage (Devices screen): ", e);
    }
  }


  const apiRequest = async (token, data, requestType, id) => {
    try {

      let myHeaders = new Headers();
      myHeaders.append("Authorization", "Bearer " + token);
      myHeaders.append("Content-Type", "application/json");

      const raw = {
        "username": userName,
        "email": email,
        "first_name": firstName,
        "last_name": lastName,
        "phone_number": phoneNum
      }

      let requestOptions = {
        method: requestType,
        headers: myHeaders,
        body: JSON.stringify(raw),
        redirect: 'follow'
      };

      let response = await fetch(`${BaseUrl}/api/${data}/${id}/`, requestOptions);
      let jsonData = await response.json();
      return jsonData;
    } catch (e) {
      console.log(`Error on getting ${data} List from Asyn storage (Devices screen): `, e);
    }
  };

  const putAll = () => {
    getToken().then((token) => {
      apiRequest(token, 'me', "PUT", userId)
    }).catch(error => console.log("Error on more screen on register", error))
    updater()
  }


  useEffect(() => {
    getToken().then(() => {
      setFirstName(firstN);
      setLastName(lastN);
      setPhoneNum(pN);
      setUserName(uN);
      setUserId(uID);
      setEmail(em);
    }).catch(e => console.log("set all in fo error: ", e))
  }, [])










  return (
    <SafeAreaView style={style.container} >
      {
        loading
        && (
          <View style={{
            position: 'absolute',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 500,
            backgroundColor: 'rgba(22, 24, 37, 0.4)',
            width: width,
            height: height,
          }} >
            <ActivityIndicator size="large" color="#FFFFFF" />
          </View>
        )
      }
      <View style={style.textAreaWrapper} >
        <TextInput
          style={style.textArea}
          placeholder="Email address"
          placeholderTextColor="#B4B4B4"
          underlineColorAndroid="transparent"
          onChangeText={text => setEmail(text)}
          value={email}
        ></TextInput>
        <TextInput
          style={style.textArea}
          placeholder="Username"
          placeholderTextColor="#B4B4B4"
          underlineColorAndroid="transparent"
          onChangeText={text => setUserName(text)}
          value={userName}
        ></TextInput>
        <TextInput
          style={style.textArea}
          placeholder="Firstname"
          placeholderTextColor="#B4B4B4"
          underlineColorAndroid="transparent"
          onChangeText={text => setFirstName(text)}
          value={firstName}
        ></TextInput>
        <TextInput
          style={style.textArea}
          placeholder="Lastname"
          placeholderTextColor="#B4B4B4"
          underlineColorAndroid="transparent"
          onChangeText={text => setLastName(text)}
          value={lastName}
        ></TextInput>
        <TextInput
          style={style.textArea}
          placeholder="Phone number"
          placeholderTextColor="#B4B4B4"
          underlineColorAndroid="transparent"
          onChangeText={text => setPhoneNum(text)}
          value={phoneNum}
        ></TextInput>
      </View>
      <TouchableOpacity
        activeOpacity={0.8}
        style={{
          height: 43,
          width: 130,
          marginLeft: width / 2,
          transform: [{ translateX: -65 }, { translateY: 0 }],
          marginTop: 80,
        }}
        onPress={() => {
          if (email != em ||
            userName != uN ||
            lastName != lastN ||
            firstName != firstN ||
            phoneNum != pN) {
            putAll()
          } else {
            Alert.alert(
              'Warning',
              `You need to update your profile to save`,
              [
                { text: 'OK' },
              ]
            );
          }
        }}
      >
        <Btn btnAlign="center" btnTitle='Save' btnMarginTop={30} />
      </TouchableOpacity>
    </SafeAreaView>
  )
}


const style = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: 'rgb(22, 24, 37)',
    flex: 1,
    position: 'relative',
  },
  textAreaWrapper: {
    backgroundColor: '#3F455B',
    marginTop: 71,
    borderRadius: 7,
    display: 'flex',

  },
  textArea: {
    borderRadius: 7,
    textAlignVertical: 'top',
    padding: 10,
    color: '#FFFFFF',
    fontFamily: "Poppins-Regular",
    fontSize: 16,
    marginHorizontal: 34,
    marginVertical: 17,
    borderBottomColor: "#B4B4B4",
    borderBottomWidth: 1,
  },
});


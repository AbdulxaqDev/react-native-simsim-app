import { View, Text, SafeAreaView, StyleSheet, TextInput, Button, TouchableOpacity, Keyboard, Dimensions, ActivityIndicator, Alert} from 'react-native'
import React, { useState, useEffect } from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';
import BaseUrl from './baseUrl';



export default function Dialog() {

  const width = Dimensions.get('window').width;
  const height = Dimensions.get('window').height;
  const [feedBack, setFeedBack] = useState("");
  const [loading, setLoading] = useState(false);





  const getToken = async () => {
    try {
      const value = await AsyncStorage.getItem('@LOGIN_TOKEN')
      return value
    } catch (e) {
      console.log("Error on getting Token from Asyn storage (Add home screen): ", e);
    }
  }


  /*
    Async function to fetch, gets token and endpoint in API as arguments
*/
  const apiRequest = async (token, data, requestType) => {
    try {

      let myHeaders = new Headers();
      myHeaders.append("Authorization", "Bearer " + token);
      myHeaders.append("Content-Type", "application/json");

      let raw = {
        "description": feedBack
      };

      let requestOptions = {
        method: requestType,
        headers: myHeaders,
        body: JSON.stringify(raw),
        redirect: 'follow'
      }

      let response = await fetch(`${BaseUrl}/api/${data}/`, requestOptions);
      let jsonData = response.json();
      return jsonData;

    } catch (e) {
      console.log(`Error on getting ${data} List from Asyn storage (Add home screen): `, e);
    }
  };



  const postAll = (token, ...endPoints) => {
    console.log(endPoints[0]);
    Promise.all([
      apiRequest(token, endPoints[0], "POST"),
    ]).then(allResponses => {
      setLoading(false)
      setFeedBack("")
    }).catch(error => console.log("Error on posting feedback", error))
  }

  const poetFeedBack = () => {

    if (feedBack != "") {
      getToken().then((token) => {
        postAll(token, 'description')
      }).catch(error => {
        Alert.alert(
          'Error',
          `${error}`,
          [
            { text: 'OK' },
          ]
        );
      })
      setLoading(true)
    } else {
      Alert.alert(
        'Empty',
        `Please write feedback.`,
        [
          { text: 'OK' },
        ]
      );
    }
  }





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
      <View>
        <Text style={style.title} >Give your feedback</Text>
      </View>
      <View>
        <TextInput style={style.textArea}
          multiline={true}
          numberOfLines={15}
          autoFocus={true}
          keyboardAppearance={'dark'}
          showSoftInputOnFocus={true}
          onPressIn={() => { }}
          placeholder="Description"
          placeholderTextColor='#B4B4B4'
          onChangeText={feedback => setFeedBack(feedback)}
          value={feedBack}
        ></TextInput>
      </View>
      <View style={style.btnWrapper} >
        <TouchableOpacity style={style.sendMsgBtn} activeOpacity={0.7}
          onPress={() => {
            Keyboard.dismiss
            poetFeedBack()
          }}
        >
          <Text style={style.sendText} >Send</Text>
        </TouchableOpacity>
      </View>
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
  title: {
    textAlign: 'center',
    marginTop: 48,
    fontFamily: "Poppins-Bold",
    color: '#FFFFFF',
    fontSize: 24,
  },
  textArea: {
    backgroundColor: '#3F455B',
    marginTop: 71,
    borderRadius: 7,
    textAlignVertical: 'top',
    padding: 10,
    color: '#FFFFFF',
    fontFamily: "Poppins-Regular",
    fontSize: 16
  },
  btnWrapper: {
    alignItems: 'flex-end',
    marginTop: 30,
  },
  sendMsgBtn: {
    backgroundColor: '#ed7844',
    width: 131,
    height: 43,
    borderRadius: 5,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  sendText: {
    fontFamily: "Poppins-Medium",
    textAlign: 'center',
    fontSize: 24,
    color: "#FFFFFF"
  }
});



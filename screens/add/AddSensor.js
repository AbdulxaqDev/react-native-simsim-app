import {
  View, Text, StyleSheet, SafeAreaView, TextInput, TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  Alert
} from 'react-native'
import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux';
import { devicesActions } from '../../store/devicesSlice';

import Btn from '../../components/Btn';
import DropDown from '../../components/dropDown';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BaseUrl from '../baseUrl'



export default function AddSensor() {

  const dispatch = useDispatch();
  const dataUpdater = () => {
    dispatch(devicesActions.updater())
  }


  const [sensor, setSensor] = useState("");
  const [device, setDevice] = useState("");
  const [deviceId, setDeviceId] = useState("");
  const [type, setType] = useState("");
  const [devicesList, setDevocesList] = useState([]);
  const [loading, setLoading] = useState(false);
  const width = Dimensions.get('window').width;
  const height = Dimensions.get('window').height;






  /*
      Getting token from Asyncstorage, wjich is local storage.
  */
  const getToken = async () => {
    try {
      const value = await AsyncStorage.getItem('@LOGIN_TOKEN')
      return value
    } catch (e) {
      console.log("Error on getting Token from Asyn storage (Devices screen): ", e);
    }
  }


  const apiRequest = async (token, data, requestType) => {
    try {

      let myHeaders = new Headers();
      myHeaders.append("Authorization", "Bearer " + token);

      let raw = {
        "name": sensor,
        "state": "0",
        "type": type,
        "device": deviceId
      }


      if (requestType == "POST") {
        myHeaders.append("Content-Type", "application/json");
      }

      let requestOptions = requestType == "POST" ? {
        method: 'POST',
        headers: myHeaders,
        body: JSON.stringify(raw),
        redirect: 'follow'
      } : {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
      };

      let response = await fetch(`${BaseUrl}/api/${data}/`, requestOptions);
      let jsonData = await response.json();
      return jsonData.results;
    } catch (e) {
      console.log(`Error on getting ${data} List from Asyn storage (Devices screen): `, e);
    }
  };



  const fetchAll = (token, ...endPoints) => {
    Promise.all([
      apiRequest(token, endPoints[0], "GET"),
    ]).then(allResponses => {
      const listOfDevice = allResponses[0];
      setDevocesList(listOfDevice)
      dataUpdater()
      setLoading(false)
    }).catch(error => console.log("Error on Devie screen on fetchAll", error))

  }

  useEffect(() => {
    getToken().then((token) => {
      fetchAll(token, 'device')
    }).catch(error => console.log("Error on add device screen on fetching", error))

  }, [])

  const postAll = (token, ...endPoints) => {
    console.log(endPoints[0]);
    Promise.all([
      apiRequest(token, endPoints[0], "POST"),
    ]).then(allResponses => {
      const postedCondition = allResponses[0]
      setLoading(false)
      console.log("Posted device: ----------------- \/ ", postedCondition);
      if (Object.keys(postedCondition).length < 2) {
        Alert.alert(
          `Error`,
          `${Object.keys(postedCondition)} ${Object.values(postedCondition)}`,
          [
            { text: 'OK' },
          ]
        );
        return;
      }
    }).catch(error => console.log("Error on postAll()", error))
  }

  const postDevice = () => {
    if (device != "" && sensor) {
      getToken().then((token) => {
        postAll(token, 'sensor')
        setSensor("")
        setType("")
       setDevice("")
       dataUpdater();
      }).catch(error => {
        Alert.alert(
          `${error}`,
          `Error on creating device, try again.`,
          [
            { text: 'OK' },
          ]
        );
      })
      setLoading(true)
    } else {
      Alert.alert(
        'Empty',
        `Please enter device name and choose a product.`,
        [
          { text: 'OK' },
        ]
      );
    }
  }


  const handleDevice = (device, id) => {
    setDevice(device)
    setDeviceId(id)
    console.log("this is device     ", device);
  }

  
  const handleType = (device) => {
    setType(device)
    console.log("this is type     ", type);
  }

  const sensorTypes = [
    { id: 1, name: "temperature" },
    { id: 2, name: "humidity" },
    { id: 3, name: "light" },
    { id: 4, name: "motion" },
];

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
          placeholder="Sensor name"
          placeholderTextColor="#B4B4B4"
          underlineColorAndroid="transparent"
          onChangeText={(sensorName) => { setSensor(sensorName) }}
          value={sensor}
        ></TextInput>
        <DropDown
          label='Choose a device'
          listOfItems={devicesList}
          selectedItem={device}
          handleSelectedItem={handleDevice}
          width='100%'
        />
        <DropDown
          label='Choose a type'
          listOfItems={sensorTypes}
          selectedItem={type}
          handleSelectedItem={handleType}
          width='100%'
        />
      </View>
      <TouchableOpacity style={{ zIndex: 10, height: 43, width: 130, marginLeft: width / 2, transform: [{ translateX: -65 }, { translateY: 0 }], marginTop: 80, }}
        onPress={() => {
          postDevice()
        }} >
        <Btn btnAlign="center" btnTitle='Add' btnMarginTop={0} />
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
    height: Dimensions.get('window').height * 0.5
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


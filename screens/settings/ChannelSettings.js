import { View, Text, StyleSheet, SafeAreaView, TextInput, Dimensions, ActivityIndicator, TouchableOpacity } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { devicesActions } from '../../store/devicesSlice';

import UpdateDeleteList from '../../components/UpdateDeleteList';
import AsyncStorage from '@react-native-async-storage/async-storage'
import BaseUrl from '../baseUrl';



/*
    Setting height and width of device
*/
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;




export default function DeviceSettings() {

  const value = useSelector(state => state.devices.value);
  const dispatch = useDispatch();
  const dataUpdater = () => {
    dispatch(devicesActions.updater())
  }

  const [loading, setLoading] = useState(true);
  const [devices, setDevices] = useState([]);
  const [channels, setChannels] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState("");
  const [deviceID, setDeviceID] = useState("");

  const [home, setHome] = useState("");
  const [homeId, setHomeId] = useState("");





  /*
      Getting token from Asyncstorage, wjich is local storage.
  */
  const getToken = async () => {
    try {
      const value = await AsyncStorage.getItem('@LOGIN_TOKEN')
      return value
    } catch (e) {
      console.log("Error on getting Token from Asyn storage (Home Settings screen): ", e);
    }
  }



  /*
      Async function to fetch, gets token and endpoint in API as arguments
  */
  const apiRequest = async (token, data, requestType, id, name) => {
    try {

      let myHeaders = new Headers();
      myHeaders.append("Authorization", "Bearer " + token);

      if (requestType == "POST" || requestType == "PUT") {
        myHeaders.append("Content-Type", "application/json");
      }
      console.log("new channel name", name);
      let raw = {
        "name": name,
        "description": "No description",
        "device": deviceID
      }


      let requestOptions = requestType == "POST" || requestType == "PUT" ? {
        method: requestType,
        headers: myHeaders,
        body: JSON.stringify(raw),
        redirect: 'follow'
      } : {
        method: requestType,
        headers: myHeaders,
        redirect: 'follow'
      };

      let url = requestType == "PUT" || requestType == "DELETE" ? `${BaseUrl}/api/${data}/${id}/` : `${BaseUrl}/api/${data}/`;

      let response = await fetch(url, requestOptions);
      let jsonData = response.json();
      return jsonData;

    } catch (e) {
      console.log(`Error on getting ${data} List from Asyn storage (Devices screen): `, e);
    }
  };


  const fetchAll = (token, ...endPoints) => {
    Promise.all([
      apiRequest(token, endPoints[0], 'GET'),
      apiRequest(token, endPoints[1], 'GET'),
    ]).then(allResponses => {
      const listOfDevices = allResponses[0]
      const listOfChannels = allResponses[1]
      setDevices(listOfDevices)
      setChannels(listOfChannels)
      setLoading(false)
    }).catch(error => console.log("Error on DevieSettings on fetchAll", error))

  }

  useEffect(() => {
    let isApiSubscribed = true;
    getToken().then((token) => {
      if (isApiSubscribed) {
        // handle success
        fetchAll(token, 'device', 'channel')
      }
    }).catch(error => console.log("Error on Devie setting useEffect on fetching", error))
    return () => {
      // cancel the subscription
      isApiSubscribed = false;
    };
  }, [value])


  const handleHomeData = (name, id) => {
    console.log(`Name of channel is updated, new Name is ${name}, ID:  ${id} `);

    getToken().then((token) => {
      Promise.all([
        apiRequest(token, 'channel', 'PUT', id, name)
      ]).then(allResponses => {
        const postedCondition = allResponses[0]
        setLoading(false)
        console.log("Updated condition: ----------------- \/ ", postedCondition);
      }).catch(error => console.log("Error on put channel", error))
    })
    dataUpdater()
  }


  const handleOldHomeData = (name, id) => {
    setHome(name)
    setHomeId(id)
  }
  const deleteHome = (name, id) => {
    getToken().then((token) => {
      Promise.all([
        apiRequest(token, 'channel', 'DELETE', id)
      ]).then(allResponses => {
        const postedCondition = allResponses[0]
        setLoading(false)
        console.log("Delete condition: ----------------- \/ ", postedCondition);
      }).catch(error => console.log("Error on dleteHome()", error))
    })
    dataUpdater()
  }


  const handleSelectedDevice = (name, id) => {
    setSelectedDevice(name)
    setDeviceID(id)
    console.log("Selected channel name", name, id);
  }

  return (
    <>
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
      <UpdateDeleteList
        isSensorSettingsScreen={false}
        listOfItems={channels}
        getNewItemData={handleHomeData}
        getOldItemData={handleOldHomeData}
        deleteItem={deleteHome}
        isChannelSettingsScreen={true}
        homesList={devices}
        handleSelectedDevice={handleSelectedDevice}
        selectedItems={[selectedDevice]}

      />
    </>
  )
}


const style = StyleSheet.create({
  HomeSettings: {
    position: 'relative',
  }
});


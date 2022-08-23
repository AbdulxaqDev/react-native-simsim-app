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
  const [sensors, setSensors] = useState([]);
  const [devices, setDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState("");
  const [deviceID, setDeviceID] = useState("");
  const [type, setType] = useState("");

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

      let raw = {
        "name": name,
        "state": "status",
        "type": type,
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
      if (requestType != "DELETE") {
        let jsonData = response.json();
        return jsonData;
      }

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
      const listOfSensors = allResponses[1]
      setDevices(listOfDevices)
      setSensors(listOfSensors)
      console.log(listOfSensors);
      setLoading(false)
    }).catch(error => console.log("Error on DevieSettings on fetchAll", error))

  }

  useEffect(() => {
    let isApiSubscribed = true;
    getToken().then((token) => {
      if (isApiSubscribed) {
        // handle success
        fetchAll(token, 'device', 'sensor')
      }
    }).catch(error => console.log("Error on Devie setting useEffect on fetching", error))
    return () => {
      // cancel the subscription
      isApiSubscribed = false;
    };
  }, [value])


  const handleHomeData = (name, id) => {
    console.log(`Name of home is updated, new Name is ${name}, ID:  ${id} `);

    getToken().then((token) => {
      Promise.all([
        apiRequest(token, 'sensor', 'PUT', id, name)
      ]).then(allResponses => {
        const postedCondition = allResponses[0]
        console.log(postedCondition);
        
        setLoading(false);
        console.log("Updated sensor: ----------------- \/ ", postedCondition);
      }).catch(error => console.log("Error on post sensor", error))
    })
    dataUpdater();
  }


  const handleOldHomeData = (name, id) => {
    setHome(name)
    setHomeId(id)
  }
  const deleteHome = (name, id) => {
    getToken().then((token) => {
      Promise.all([
        apiRequest(token, 'sensor', 'DELETE', id)
      ]).then(allResponses => {
        dataUpdater();
        setLoading(false);
      }).catch(error => console.log("Error on deleting sensor()", error))
    })
  }


  const handleSelectedDevice = (name, id) => {
    setSelectedDevice(name)
    setDeviceID(id)
    console.log("Selected channel name", name, id);
  }

  const handleSelectedType = (name) => {
    console.log("Type names:      --------//////////-------   ",name);
    setType(name)
  }

  const sensorTypes = [
    { id: 1, name: "temperature" },
    { id: 2, name: "humidity" },
    { id: 3, name: "light" },
    { id: 4, name: "motion" },
  ];

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
        isSensorSettingsScreen={true}
        listOfItems={sensors}
        getNewItemData={handleHomeData}
        getOldItemData={handleOldHomeData}
        deleteItem={deleteHome}
        homesList={devices}
        handleSelectedDevice={handleSelectedDevice}
        selectedItems={[selectedDevice, type]}
        handleSelectedType={handleSelectedType}
        sensorTypes={sensorTypes}
      />
    </>
  )
}


const style = StyleSheet.create({
  HomeSettings: {
    position: 'relative',
  }
});


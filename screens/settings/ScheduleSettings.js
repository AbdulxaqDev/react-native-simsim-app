import { View, Text, StyleSheet, SafeAreaView, TextInput, Dimensions, ActivityIndicator, TouchableOpacity } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { devicesActions } from '../../store/devicesSlice';

import ScheduleUpdateDeleteList from '../../components/ScheduleUpdateDeleteList';
import AsyncStorage from '@react-native-async-storage/async-storage'
import BaseUrl from '../baseUrl';



/*
    Setting height and width of device
*/
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;




export default function ScheduleSettings() {

  const value = useSelector(state => state.devices.value);
  const dispatch = useDispatch();
  const dataUpdater = () => {
    dispatch(devicesActions.updater())
  }
  const [loading, setLoading] = useState(true);

  const [devices, setDevices] = useState([]);
  const [channels, setChannels] = useState([]);
  const [sensors, setSensors] = useState([]);
  const [smartconditions, setSmartconditions] = useState([])

  const [ smartcondition, setSmartcondition] = useState("")
  const [ smartconditionID, setSmartconditionID] = useState("")





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
  const apiRequest = async (token, data, requestType, id, raw) => {
    try {
      let myHeaders = new Headers();
      myHeaders.append("Authorization", "Bearer " + token);

      if (requestType == "PUT") {
        myHeaders.append("Content-Type", "application/json");
      }


      let requestOptions = requestType == "PUT" ? {
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
      console.log(`Error on getting ${data} List : `, e);
    }
  };


  const fetchAll = (token, ...endPoints) => {
    Promise.all([
      apiRequest(token, endPoints[0], 'GET'),
      apiRequest(token, endPoints[1], 'GET'),
      apiRequest(token, endPoints[2], 'GET'),
      apiRequest(token, endPoints[3], 'GET'),
    ]).then(allResponses => {
      const listOfDevices = allResponses[0]
      const listOfChannel = allResponses[1]
      const listOfSensor = allResponses[2]
      const listOfSmartconditions = allResponses[3]
      setDevices(listOfDevices)
      setChannels(listOfChannel)
      setSensors(listOfSensor)
      setSmartconditions(listOfSmartconditions)
      // console.log("These are smartconditions", listOfSmartconditions);
      setLoading(false)
    }).catch(error => console.log("Error on DevieSettings on fetchAll", error))

  }

  useEffect(() => {
    let isApiSubscribed = true;
    getToken().then((token) => {
      if (isApiSubscribed) {
        // handle success
        fetchAll(token, 'device', 'channel', 'sensor', 'smartconditions')
      }
    }).catch(error => console.log("Error on Smartcondition setting useEffect on fetching", error))
    return () => {
      // cancel the subscription
      isApiSubscribed = false;
    };
  }, [value])


  const postSmartCon = (raw, id) => {
    getToken().then((token) => {
      Promise.all([
        apiRequest(token, 'smartconditions', 'PUT', id, raw)
      ]).then(allResponses => {
        const postedSmartCondition = allResponses[0]
        dataUpdater()
        setLoading(false)
        console.log("Updated postedSmartCondition: =============> ", postedSmartCondition);
      }).catch(error => console.log("Error on post Smartcondition: ", error))
    })

  }


  const handleOldSmartData = (name, id) => {
    setHome(name)
    setHomeId(id)
  }

  const deleteSmartCon = (id) => {
    getToken().then((token) => {
      Promise.all([
        apiRequest(token, 'smartconditions', 'DELETE', id)
      ]).then(allResponses => {
        setLoading(false)
      }).catch(error => console.log("Error on delete Smartcondition()", error))
    })
    dataUpdater()
  }


  const conditions = [
    { id: 1, name: 'Add Timer' },
    { id: 2, name: 'Add sensor condition' },
  ]
  const actions = [
    { id: 1, name: 'on' },
    { id: 2, name: 'off' },
  ]


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
      <ScheduleUpdateDeleteList
        listOfItems={smartconditions}
        listOfDevices={devices}
        listOfChannels={channels}
        listOfSensors={sensors}
        listOfConditions={conditions}
        listOfActions={actions}
        getNewItemData = {postSmartCon}
        deleteItem = {deleteSmartCon}
      />
    </>
  )
}


const style = StyleSheet.create({
  HomeSettings: {
    position: 'relative',
  }
});


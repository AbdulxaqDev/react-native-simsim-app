import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  Alert
} from 'react-native';
import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BaseUrl from './baseUrl';

import { useDispatch, useSelector } from 'react-redux';
import { devicesActions } from '../store/devicesSlice';




import Btn from '../components/Btn';
import DropDown from '../components/dropDown';

export default function Schedule() {

  const value = useSelector(state => state.devices.value);
  const dispatch = useDispatch();
  const dataUpdater = () => {
    dispatch(devicesActions.updater())
  }



  /*
      Setting height and width of device
  */
 
  const width = Dimensions.get('window').width;
  const height = Dimensions.get('window').height;


  const [devices, setDevices] = useState([]);
  const [channelsList, setChannelsList] = useState([]);
  const [sensors, setSensors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [conditionName, setConditionName] = useState("");
  const [condition, setCondition] = useState(null);
  const [hour, setHour] = useState(null);
  const [minut, setMinut] = useState(null);
  const [deviceId, setDeviceId] = useState("");
  const [channelId, setChannelId] = useState(null);
  const [sensorId, setSensorId] = useState(null);
  const [aboveTemp, setAboveTemp] = useState(null);
  const [belowTemp, setBelowTemp] = useState(null);
  const [action, setAction] = useState(null);
  const conditions = [
    { id: 1, name: 'Add Timer' },
    { id: 2, name: 'Add sensor condition' },
  ]
  const actions = [
    { id: 1, name: 'on' },
    { id: 2, name: 'off' },
  ]


  const [selectedCondition, setSelectedCondition] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState(false);
  const [selectedSensor, setSelectedSensor] = useState(false);
  const [selectedAction, setSelectedAction] = useState(false);








  const handleSelectedCondition = (condition, id) => {
    // 👇️ take parameter passed from Child component
    setCondition(condition);
    setSelectedCondition(condition)
    console.log('condition', condition, id);
  };


  const handleSelectedDeviceID = (name, id) => {
    setDeviceId(id);
    setSelectedDevice(name);
    console.log("Selected Device id: ", name, id);
  }

  const handleSelectedChannelId = (name, id) => {
    setChannelId(id);
    setSelectedChannel(name)
    console.log("Selected Channel id: ", name, id);
  }

  const handleSelectedSensorId = (name, id) => {
    setSensorId(id);
    setSelectedSensor(name)
    console.log("Selected Sensor id: ", name, id);
  }

  const handleSelectedAction = (actionState, id) => {
    setAction(actionState);
    setSelectedAction(actionState)
    console.log("Selected Action: ", actionState, id);
  }



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



  /*
      Async function to fetch, gets token and endpoint in API as arguments
  */
  const apiRequest = async (token, data, requestType) => {
    try {

      let myHeaders = new Headers();
      myHeaders.append("Authorization", "Bearer " + token);

      let raw = condition == "Add Timer" ? {
        "condition": {
          "timer": `${hour}:${minut}`,
        },
        "name": conditionName,
        "status": action,
        "device": deviceId,
        "channel": [channelId]
      } : {
        "condition": {
          "sensor_status": {
            "above": aboveTemp,
            "below": belowTemp,
            "sensor": sensorId
          }
        },
        "name": conditionName,
        "status": action,
        "device": deviceId,
        "channel": [channelId]
      };

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
      let jsonData = response.json();
      return jsonData;
    } catch (e) {
      console.log(`Error on getting ${data} List from Asyn storage (Devices screen): `, e);
    }
  };


  const fetchAll = (token, ...endPoints) => {
    Promise.all([
      apiRequest(token, endPoints[0], "GET"),
      apiRequest(token, endPoints[1], "GET"),
      apiRequest(token, endPoints[2], "GET"),
    ]).then(allResponses => {
      const listOfDevices = allResponses[0]
      const listOfChannels = allResponses[1]
      const listOfSensors = allResponses[2]
      setDevices(listOfDevices)
      setChannelsList(listOfChannels)
      setSensors(listOfSensors)
      setLoading(false)
    }).catch(error => console.log("Error on Devie screen on fetchAll", error))
    dataUpdater();
  }

  useEffect(() => {
    getToken().then((token) => {
      fetchAll(token, 'device', 'channel', 'sensor')
    }).catch(error => console.log("Error on Schedule screen on fetching", error))

  }, [])

  const postAll = (token, ...endPoints) => {
    console.log(endPoints[0]);
    Promise.all([
      apiRequest(token, endPoints[0], "POST"),
    ]).then(allResponses => {
      const postedCondition = allResponses[0]
      setLoading(false)
      console.log("Posted condition: ----------------- \/ ", postedCondition);
    }).catch(error => console.log("Error on postAll()", error))
  }





  const postCondition = () => {
    getToken().then((token) => {
      postAll(token, 'smartconditions')
    }).then(() => {
      setConditionName("")
      setAboveTemp("")
      setBelowTemp("")
      setSelectedCondition("Choose condition")
      setSelectedDevice("Choose device")
      setSelectedChannel("Choose device channel")
      setSelectedSensor("Choose device sensor")
      setSelectedAction("Do")
      setBelowTemp("")
      setAboveTemp("")
      setHour("")
      setMinut("")
    }).catch(error => {
      console.log("Error on Schedule screen on POSTing", error)
      Alert.alert(
        'Error',
        `Error on creating smart condition, try again.`,
        [
          { text: 'OK' },
        ]
      );
    })
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
      <View style={style.textAreaWrapper} >
        <TextInput
          style={style.textArea}
          placeholder="Name"
          placeholderTextColor="#B4B4B4"
          underlineColorAndroid="transparent"
          onChangeText={(name) => { setConditionName(name) }}
          value={conditionName}
        ></TextInput>

        <DropDown
          listOfItems={conditions}
          label="Choose condition"
          width='100%'
          handleSelectedItem={handleSelectedCondition}
          selectedItem={selectedCondition}
        />
        <View style={[style.timer, { display: condition == "Add Timer" ? 'flex' : 'none' }]}  >
          <TextInput
            style={style.timerInput}
            placeholder="hh"
            placeholderTextColor="#B4B4B4"
            underlineColorAndroid="transparent"
            keyboardType='numeric'
            maxLength={2}
            onChangeText={(hh) => {

              setHour(hh)
              const allNums = /[0-9]/


              if (allNums.test(hh) || hh == "") {
                if (Number(hh) > 24 || Number(hh) < 0) {
                  Alert.alert(
                    'Number',
                    `You entered number bigger than 24 for hours`,
                    [
                      { text: 'OK' },
                    ]
                  );
                  setHour("")
                }
              } else {
                Alert.alert(
                  'Not letter',
                  `Please enter number between 0-24`,
                  [
                    { text: 'OK' },
                  ]
                );
                setHour("")
              }
            }}
            value={hour}
          ></TextInput>
          <TextInput
            style={style.timerInput}
            placeholder="mm"
            placeholderTextColor="#B4B4B4"
            underlineColorAndroid="transparent"
            keyboardType='numeric'
            maxLength={2}
            onChangeText={(mm) => {

              setMinut(mm)
              const allNums = /[0-9]/

              if (allNums.test(mm) || mm == "") {
                if (Number(mm) > 59 || Number(mm) < 0) {
                  Alert.alert(
                    'Number',
                    `You entered number bigger than 59`,
                    [
                      { text: 'OK' },
                    ]
                  );
                  setHour("")
                }
              } else {
                Alert.alert(
                  'Not letter',
                  `Please enter number between 0-59`,
                  [
                    { text: 'OK' },
                  ]
                );
                setHour("")
              }
            }}
            value={minut}
          ></TextInput>
        </View>
        <DropDown
          listOfItems={devices}
          label="Choose device"
          width='100%'
          handleSelectedItem={handleSelectedDeviceID}
          selectedItem={selectedDevice}
        />
        <DropDown
          listOfItems={channelsList.filter(getChannelByDeviceId => getChannelByDeviceId.device == deviceId)}
          label="Choose device channel"
          width='100%'
          deviceID={deviceId}
          checkID={true}
          handleSelectedItem={handleSelectedChannelId}
          selectedItem={selectedChannel}
        />
        <View style={[{ display: condition == "Add sensor condition" ? 'flex' : 'none' }]} >
          <DropDown
            listOfItems={sensors.filter(getSensorByDeviceId => getSensorByDeviceId.device == deviceId)}
            label={`Choose device sensor`}
            width='100%'
            deviceID={deviceId}
            checkID={true}
            handleSelectedItem={handleSelectedSensorId}
            selectedItem={selectedSensor}
          />
          <TextInput
            style={style.textArea}
            placeholder="Above"
            placeholderTextColor="#B4B4B4"
            underlineColorAndroid="transparent"
            keyboardType='numeric'
            onChangeText={(above) => {

              setAboveTemp(Number(above))
              const allNums = /[0-9]/

              if (!allNums.test(above) || above == "") {
                Alert.alert(
                  'Above',
                  `Please enter number`,
                  [
                    { text: 'OK' },
                  ]
                );
              }

            }}
            value={aboveTemp}
          ></TextInput>
          <TextInput
            style={style.textArea}
            placeholder="Belowe"
            placeholderTextColor="#B4B4B4"
            underlineColorAndroid="transparent"
            keyboardType='numeric'
            onChangeText={(below) => {

              setBelowTemp(Number(below))
              const allNums = /[0-9]/

              if (!allNums.test(below) || below == "") {
                Alert.alert(
                  'Below',
                  `Please enter number`,
                  [
                    { text: 'OK' },
                  ]
                );
              }
            }}
            value={belowTemp}
          ></TextInput>
        </View>

        <DropDown
          listOfItems={actions}
          label="Do"
          width='100%'
          handleSelectedItem={handleSelectedAction}
          selectedItem={selectedAction}
        />
      </View>
      <TouchableOpacity
        onPress={() => {
          postCondition();
        }}
        style={{ height: 43, width: 130, marginLeft: width / 2, transform: [{ translateX: -65 }, { translateY: 0 }], marginTop: 80, }}
      >
        <Btn btnTitle='Save' btnAlign='center' btnMarginTop={0} />
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
    marginTop: 20,
    borderRadius: 7,
    display: 'flex',
    paddingBottom: 30,
  },
  textArea: {
    borderRadius: 7,
    textAlignVertical: 'top',
    padding: 10,
    paddingBottom: 0,
    color: '#FFFFFF',
    fontFamily: "Poppins-Regular",
    fontSize: 16,
    marginHorizontal: 34,
    marginVertical: 7,
    borderBottomColor: "#B4B4B4",
    borderBottomWidth: 1,
    paddingLeft: 10,
  },
  timer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: "100%",
    marginTop: 10,
  },
  timerInput: {
    borderRadius: 5,
    borderColor: "#B4B4B4",
    borderWidth: 1,
    width: '20%',
    textAlign: 'center',
    color: '#FFFFFF',
    fontFamily: "Poppins-Regular",
    fontSize: 16,
  }
});

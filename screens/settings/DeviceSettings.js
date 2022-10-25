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
  const [homes, setHomes] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedHome, setSelectedHome] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");

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
        "description": "No description",
        "product": Number(selectedProduct.split("").pop()),
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
      let jsonData = await response.json();
      return jsonData.results;

    } catch (e) {
      console.log(`Error on getting ${data} List from Asyn storage (Devices screen): `, e);
    }
  };


  const fetchAll = (token, ...endPoints) => {
    Promise.all([
      apiRequest(token, endPoints[0], 'GET'),
      apiRequest(token, endPoints[1], 'GET'),
      apiRequest(token, endPoints[2], 'GET'),
    ]).then(allResponses => {
      const listOfDevices = allResponses[0]
      const listOfHomes = allResponses[1]
      const listOfProducts = allResponses[2]
      setDevices(listOfDevices)
      setHomes(listOfHomes)
      setProducts(listOfProducts)
      setLoading(false)
    }).catch(error => console.log("Error on DevieSettings on fetchAll", error))

  }

  useEffect(() => {
    let isApiSubscribed = true;
    getToken().then((token) => {
      if (isApiSubscribed) {
        // handle success
        fetchAll(token, 'device', 'home', 'product')
      }
    }).catch(error => console.log("Error on Devie setting useEffect on fetching", error))
    return () => {
      // cancel the subscription
      isApiSubscribed = false;
    };
  }, [value])


  const handleHomeData = (name, id) => {
    // console.log("Name ==--------/////////////////++++++++== ", name);

    getToken().then((token) => {
      Promise.all([
        apiRequest(token, 'device', 'PUT', id, name)
      ]).then(allResponses => {
        const postedCondition = allResponses[0]
        dataUpdater()
        setLoading(false)
        console.log("Updated device: ----------------- |||| ", postedCondition);
      }).catch(error => console.log("Error on postAll()", error))
    })

  }


  const handleOldHomeData = (name, id) => {
    setHome(name)
    setHomeId(id)
  }
  const deleteHome = (name, id) => {
    getToken().then((token) => {
      Promise.all([
        apiRequest(token, 'device', 'DELETE', id)
      ]).then(allResponses => {
        const postedCondition = allResponses[0]
        
        setLoading(false)
        console.log("Delete condition: ----------------- \/ ", postedCondition);
      }).catch(error => console.log("Error on dleteHome()", error))
    })
    dataUpdater()
  }


  const handleSelectedHome = (name, id) => {
    setSelectedHome(name)
    setHomeId(id)
    console.log("Selected home name", name, id);
  }

  const handleSelectedProduct = (name, id) => {
    setSelectedProduct(name)
    console.log("Selected product name", name);
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
        listOfItems={devices}
        getNewItemData={handleHomeData}
        getOldItemData={handleOldHomeData}
        deleteItem={deleteHome}
        isDeviceSettingsScreen={true}
        homesList={homes}
        productsList={products}
        handleSelectedHome={handleSelectedHome}
        handleSelectedProduct={handleSelectedProduct}
        selectedItems={[selectedHome, selectedProduct]}

      />
    </>
  )
}


const style = StyleSheet.create({
  HomeSettings: {
    position: 'relative',
  }
});


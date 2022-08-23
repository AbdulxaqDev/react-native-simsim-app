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




export default function HomeSettings() {

    const value = useSelector(state => state.devices.value);
    const dispatch = useDispatch();
    const dataUpdater = () => {
      dispatch(devicesActions.updater())
    }

    const [loading, setLoading] = useState(true);
    const [homes, setHomes] = useState([])
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
                "name": name
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
            apiRequest(token, endPoints[0]),
        ]).then(allResponses => {
            const listOfHomes = allResponses[0]
            setHomes(listOfHomes)
            setLoading(false)
        }).catch(error => console.log("Error on Devie screen on fetchAll", error))

    }

    useEffect(() => {
        let isApiSubscribed = true;
        getToken().then((token) => {
            if (isApiSubscribed) {
                // handle success
                fetchAll(token, 'home')
            }
        }).catch(error => console.log("Error on Devie screen on fetching", error))
        return () => {
            // cancel the subscription
            isApiSubscribed = false;
        };

    }, [value])


    const handleHomeData = (name, id) => {
        if (home == name) {
            console.log('Name of home is NOT updated');
        } else {
            console.log(`Name of home is updated, newName is ${name} `);
            getToken().then((token) => {
                Promise.all([
                    apiRequest(token, 'home', 'PUT', id, name)
                ]).then(allResponses => {
                    const postedCondition = allResponses[0]
                    dataUpdater();
                    setLoading(false);
                }).catch(error => console.log("Error on postAll()", error))
            })
        }
    }


    const handleOldHomeData = (name, id) => {
        setHome(name)
        setHomeId(id)
    }

    const deleteHome = (name, id) => {
        getToken().then((token) => {
            Promise.all([
                apiRequest(token, 'home', 'DELETE', id)
            ]).then(allResponses => {
                setLoading(false);
            }).catch(error => console.log("Error on dleteHome()", error))
        })
        dataUpdater();
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
                listOfItems={homes}
                getNewItemData={handleHomeData}
                getOldItemData={handleOldHomeData}
                deleteItem={deleteHome}
                isHomeSettingsScreen={true}
            />
        </>
    )
}


const style = StyleSheet.create({
    HomeSettings: {
        position: 'relative',
    }
});


import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native'
import React, { useState, useContext, createContext, useEffect } from 'react'
import { useNavigation } from "@react-navigation/native";
import addIcon from '../src/assets/images/addicon.png'
// import AddDevice from '../screens/add/AddDevice';





export default function HomeDevices({
    devices = [
        {
            "id": 1,
            "channels": [
                1
            ],
            "sensors": [
                1
            ],
            "name": "Test",
            "description": "001",
            "created_at": "2022-07-13T18:45:53.809828+05:00",
            "updated_at": "2022-07-13T18:45:53.814598+05:00",
            "owner": 2,
            "product": 1,
            "home": 9
        },
        {
            "id": 2,
            "channels": [
                2,
                3,
                5
            ],
            "sensors": [],
            "name": "Test 2",
            "description": "001",
            "created_at": "2022-07-13T18:46:06.211588+05:00",
            "updated_at": "2022-07-13T18:46:06.214732+05:00",
            "owner": 2,
            "product": 4,
            "home": 9
        },
    ],
    homeId,
    onSelectedDeviceId = () => { },
    deviceData = ""
}) {

    
    const [activeDevId, setActiveDevId] = useState(null);
    const onSelect = (id) => {
        onSelectedDeviceId(id)
    }
    const navigation = useNavigation();
    useEffect(() => {
        deviceData? setActiveDevId(deviceData.id) : deviceData
    }, [deviceData])
    return (
        <View style={style.deviceWrapper} >
            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} >
                {
                    devices.map((device) => {
                        return (
                            homeId == device.home &&
                            <TouchableOpacity
                                activeOpacity={0.8}
                                onPress={() => {
                                    onSelect(device)
                                    setActiveDevId(device.id)
                                }}
                                key={device.id}
                            >
                                <View style={[style.device, { backgroundColor: activeDevId == device.id ? "#ed7844" : "#333542" }]}>
                                    <Text style={style.deviceName} >{ device.name  }</Text>
                                </View>
                            </TouchableOpacity>
                        )
                    })
                }
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => navigation.navigate("Add device")}
                >
                    <View style={style.device}>
                        <Image source={addIcon} />
                    </View>
                </TouchableOpacity>
            </ScrollView>
        </View>
    )
}


const style = StyleSheet.create({
    deviceWrapper: {
        marginTop: 20,
        borderRadius: 10,
        overflow: 'hidden',
    },
    device: {
        height: 75,
        width: 105,
        borderRadius: 10,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10,
        backgroundColor: '#333542',
    },
    deviceName: {
        color: '#fff',
        fontWeight: '900',
        fontSize: 20,
        fontFamily: 'Poppins-Medium',
    },
})
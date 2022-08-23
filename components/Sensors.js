import { Text, View, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native'
import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import addIcon from '../src/assets/images/addCircleW.png'

export default function Sensors({
    sensors = [
        {
            "id": 5,
            "name": "sensor device 9",
            "state": "string",
            "topic_name": "Home 853dcfba7f-d1eb-4e0f-9c30-7c4fa38c07ea/deveeice 0ww1/sensor device 9",
            "type": "temperature",
            "created_at": "2022-07-20T06:52:56.273969+05:00",
            "updated_at": "2022-07-20T06:52:56.280099+05:00",
            "owner": 3,
            "device": 9
        },
        {
            "id": 6,
            "name": "sensor 00 device 9",
            "state": "string",
            "topic_name": "Home 85ead0621f-344b-4bec-ac67-1c6189d5e560/deveeice 0ww1/sensor 00 device 9",
            "type": "temperature",
            "created_at": "2022-07-20T06:53:01.486549+05:00",
            "updated_at": "2022-07-20T06:53:01.491446+05:00",
            "owner": 3,
            "device": 9
        },
        {
            "id": 7,
            "name": "sensor 00 device 10",
            "state": "string",
            "topic_name": "Home 85d0eaa0dd-e930-4f5d-b381-b079b3669a0e/device 1/sensor 00 device 10",
            "type": "temperature",
            "created_at": "2022-07-20T06:53:25.147278+05:00",
            "updated_at": "2022-07-20T06:53:25.151938+05:00",
            "owner": 3,
            "device": 10
        },
        {
            "id": 8,
            "name": "sensor 55 device 10",
            "state": "string",
            "topic_name": "Home 857084cc99-e73b-4ac3-a198-961f7006657f/device 1/sensor 55 device 10",
            "type": "temperature",
            "created_at": "2022-07-20T06:53:30.647511+05:00",
            "updated_at": "2022-07-20T06:53:30.653826+05:00",
            "owner": 3,
            "device": 10
        },
    ],
    deviceId = null,
}) {
    const [switchDevice, setSwitchDevice] = useState(true);
    const navigation = useNavigation();
    return (
        <View style={style.allSensors} >
            <ScrollView showsVerticalScrollIndicator={false} >
                {
                    sensors.map((sensor) => {
                        return (
                            deviceId == sensor.device &&
                            <TouchableOpacity 
                                style={style.wrapper} activeOpacity={0.7}
                                onPress = {() => navigation.navigate("Sensor details", {label: sensor.created_at.slice(0, 10), type: sensor.type, state: sensor.state.split(" ")})}
                                key={sensor.id}
                                >
                                    <View style={style.sensor} >
                                        <Text style={style.sensorName}>
                                            {sensor.name}
                                        </Text>
                                        <Text style={style.sensorName}>
                                            {sensor.type} 
                                        </Text>
                                    </View>
                            </TouchableOpacity>
                        )
                    })
                }


                <TouchableOpacity 
                    style={style.addSensor} activeOpacity={0.8}
                    onPress={() => navigation.navigate("Add sensor")}    
                >
                    <Image style={style.addIcon} source={addIcon} />
                </TouchableOpacity>
            </ScrollView>
        </View>
    )
}

const style = StyleSheet.create({
    allSensors: {
        flex: 0.3,
        borderRadius: 10,
        overflow: 'hidden',
        marginBottom: 10, 
    },
    wrapper: {
        borderRadius: 10,
    },
    sensor: {
        width: '100%',
        backgroundColor: '#1d242c',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderRadius: 10,
        overflow: 'hidden',
        marginTop: 10,
        paddingLeft: 20,
        paddingRight: 20,
    },
    sensorName: {
        color: '#fff',
        fontSize: 20,
        fontWeight: "400",
        fontFamily: 'Poppins-Light',
        padding: 5,
        textTransform: 'capitalize'
    },
    addSensor:{
        marginTop: 10,
        backgroundColor: '#353a5b',
        height: 40,
        borderRadius: 10,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    addIcon: {
        width: 30,
        height: 30,
    }
});
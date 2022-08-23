import {
    Text, View, StyleSheet, Button, ImageBackground, TouchableOpacity, ScrollView, Image, Dimensions,
    ActivityIndicator,
    Alert
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import kitchenImg from '../src/assets/images/kitchen.png';
import addIcon from '../src/assets/images/addCircleW.png';

import AsyncStorage from '@react-native-async-storage/async-storage';


export default function Channels({
    channels = [
        {
            "id": 6,
            "name": "Test 1",
            "description": "string",
            "topic_name": "Home 85960803a4-dbb0-4a95-8bdf-00ddb946e705/deveeice 0ww1/channel 353",
            "state": false,
            "created_at": "2022-07-18T15:42:24.103708+05:00",
            "owner": 3,
            "device": 9
        },
        {
            "id": 7,
            "name": "Test 2",
            "description": "string",
            "topic_name": "Home 851b744909-8b43-4604-8658-a976b703e490/deveeice 0ww1/channel 9",
            "state": false,
            "created_at": "2022-07-18T15:42:32.459737+05:00",
            "owner": 3,
            "device": 9
        },
    ],
    selectedDeviceId
}) {
    const [switchDevice, setSwitchDevice] = useState(true);
    const [loading, setLoading] = useState(false);
    const width = Dimensions.get('window').width;
    const height = Dimensions.get('window').height;
    const [topic, setTopic] = useState();
    const [topicMessage, setTopicMesssage] = useState();


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

    const messageRequest = (token) => {
        console.log(token);
        let msg = {
            "message": topicMessage,
            "topic": topic
        }

        const socket = new WebSocket(`ws://34.204.8.155:8000/ws/?token=${token}`);

        socket.onopen = () => {
            console.log("Connection established!");
            socket.send(JSON.stringify(msg))
        };

        socket.onmessage =  () => {
            setTopic("")
            setTopicMesssage("")
        }

        socket.onerror = (error) => {
            Alert.alert(
                'Error',
                `${error}`,
                [
                    { text: 'OK' },
                ]
            );
        };

    }



    const sendMessage = () => {
        getToken().then((token) => {
            if (topic != "" && topicMessage != "") {
                messageRequest(token)
            }
        }).catch(e => console.log("Error on WebSocket (Channels.js, 90): ", e))
    }

    const navigation = useNavigation();


    
    return (
        <View style={style.allChannels} >
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
            <ScrollView showsVerticalScrollIndicator={false} >
                {
                    channels.map((channel, i) => {
                        return (
                            selectedDeviceId == channel.device &&
                            <View
                                style={style.wrapper}
                                key={channel.id}
                            >
                                <ImageBackground
                                    source={kitchenImg}
                                    style={style.channel}
                                >
                                    <View>
                                        <Text style={style.channelName}>
                                            {channel.name}
                                        </Text>
                                    </View>
                                    <TouchableOpacity style={style.btnWrapper} activeOpacity={1}>
                                        <View style={[style.brd, { paddingLeft: channel.state ? 32 : 7 }]} >
                                            <TouchableOpacity style={style.btnFrame}  >
                                                <Button
                                                    style={style.channelBtn}
                                                    title={channel.state ? "On" : "Off"}
                                                    color="#212540"
                                                    onPress={() => {
                                                        setTopicMesssage(channel.state ? "off" : "on")
                                                        setTopic(channel.topic_name)
                                                        sendMessage()
                                                        // loading(true)
                                                        console.log("Clicked");
                                                    }}
                                                />
                                            </TouchableOpacity>
                                        </View>
                                    </TouchableOpacity>
                                </ImageBackground>
                            </View>
                        )
                    })
                }


                <TouchableOpacity
                    style={style.addChannel} activeOpacity={0.7}
                    onPress={() => navigation.navigate("Add channel")}
                >
                    <Image source={addIcon} />
                </TouchableOpacity>
            </ScrollView>
        </View>
    )
}

const style = StyleSheet.create({
    allChannels: {
        flex: 0.7,
        borderRadius: 10,
        overflow: 'hidden',
    },
    wrapper: {
        borderRadius: 10,
    },
    channel: {
        width: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-around',
        height: 150,
        borderRadius: 10,
        overflow: 'hidden',
        marginTop: 10,
    },
    channelName: {
        color: '#fff',
        fontSize: 27,
        fontWeight: "400",
        fontFamily: 'Poppins-SemiBold',
        padding: 25,
        textTransform: 'capitalize'
    },
    btnWrapper: {
        width: "100%",
        display: 'flex',
        alignItems: 'flex-end',
        paddingBottom: 17,
        paddingRight: 17,
    },
    brd: {
        width: 95,
        padding: 7,
        backgroundColor: '#ed7844',
        borderRadius: 100,
    },
    btnFrame: {
        width: 55,
        height: 33,
        borderRadius: 100,
        overflow: 'hidden',
    },
    channelBtn: {
        width: 20,
        height: 40,
        borderRadius: 30,
    },
    addChannel: {
        marginTop: 10,
        backgroundColor: '#353a5b',
        height: 60,
        borderRadius: 10,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
});
import { View, Text, SafeAreaView, StyleSheet, TextInput, Button, TouchableOpacity, Keyboard, Image, Alert, ActivityIndicator, Dimensions, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react';

import mainLogo from "../../src/assets/images/mainLogo.png";
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage'
import BaseUrl from '../baseUrl';


export default function SignIn() {
    const navigation = useNavigation();

    const [NewPassword, setNewPassword] = useState(null);
    const [email, setEmail] = useState(null);

    const width = Dimensions.get('window').width;
    const height = Dimensions.get('window').height;
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        setLoading(false)
    }, [])


    const signIn = async () => {
        let myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        let raw = JSON.stringify({
            "email": email,
            "password": NewPassword,
        });

        let requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch(`${BaseUrl}/token/`, requestOptions)
            .then(response => response.json())
            .then(result => {
                setLoading(false)
                if (Object.keys(result).length == 1) {
                    Alert.alert(
                        'Error',
                        `${result.detail? result.detail : result.access}\n\nEmail or passwors is wrong please try agin.` ,
                        [
                            { text: 'OK' },
                        ]
                    );
                } else {
                    const saveToken = async () => {
                        let raw = JSON.stringify({
                            "email": email,
                            "password": NewPassword
                        });
                        let requestOptions = {
                            method: 'POST',
                            headers: { "Content-Type": "application/json" },
                            body: raw,
                            redirect: 'follow',
                        };
                        fetch(`${BaseUrl}/token/`, requestOptions)
                            .then(response => {
                                
                                return response.json()
                            })
                            .then(result => {
                                const saveToken = async () => {
                                    try {
                                        await AsyncStorage.setItem('@LOGIN_TOKEN', result.access);
                                        await AsyncStorage.setItem('@USER_EMAIL', email);
                                        await AsyncStorage.setItem('@IS_LOGGED_IN', "true");

                                    } catch (e) {
                                        console.log("Error saving Token to Asyn Storage (sign in screen): ", e);
                                    }
                                }
                                const updateToken = async () => {
                                    try {
                                        await AsyncStorage.removeItem('@LOGIN_TOKEN');
                                        await AsyncStorage.removeItem('@USER_EMAIL');

                                    } catch (e) {
                                        console.log("Error savig Token to Asyn Storage (sign in screen): ", e);
                                    }
                                  }
                                  updateToken().then(()=>{
                                    saveToken().then(() => navigation.navigate("bottomTabNavigations"));
                                  });
                            })
                            .catch(error => console.log('Token error (sign in screen)', error));
                    }
                    saveToken()
                }
            })
            .catch(error => console.log('Sign In error', error));
    };

    return (
        <SafeAreaView style={style.container} >
            <ScrollView>
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
            <View>
                <Text style={style.title} >Sign in</Text>
                <Text style={style.subTitle} >Sign in your account</Text>
            </View>
            <View style={style.regiterPart} >
                <Image style={style.mainLogo} source={mainLogo} />
                <Text style={style.mainTitle} >
                    Smart <Text style={style.mainTitleBold} >Home</Text>
                </Text>
                <View style={style.textAreaWrapper} >
                    <TextInput
                        style={style.textArea}
                        placeholder="Email Address"
                        placeholderTextColor="#B4B4B4"
                        underlineColorAndroid="transparent"
                        onChangeText={(text) => setEmail(text)}
                    ></TextInput>
                    <TextInput
                        style={style.textArea}
                        placeholder="Password"
                        placeholderTextColor="#B4B4B4"
                        underlineColorAndroid="transparent"
                        onChangeText={(text) => setNewPassword(text)}
                    ></TextInput>
                    {/* <TouchableOpacity style={{ marginRight: 44, paddingVertical: 5 }}
                        onPress={() => navigation.navigate("ForgotPassword")}
                    >
                        <Text style={{ color: '#B4B4B4', textDecorationLine: 'underline', fontSize: 16, textAlign: 'right' }} >Forgot?</Text>
                    </TouchableOpacity> */}
                </View>
                <View style={style.btnWrapper} >
                    <TouchableOpacity
                        style={style.sendMsgBtn}
                        activeOpacity={0.7}
                        onPress = {() => {
                            if (
                                email != null &&
                                NewPassword != null
                            ) {
                                signIn();
                                setLoading(true)
                            }else{
                                Alert.alert(
                                    'Sign In',
                                    "Please fill all fields",
                                    [
                                        { text: 'OK' },
                                    ]
                                );
                            }
                                Keyboard.dismiss;
                            }} 
                        >
                        <Text style={style.sendText} >Next</Text>
                    </TouchableOpacity>
                </View>
                <View style={style.register} >
                    <Text style={{ color: "#B4B4B4", fontFamily: "Poppins-Regular" }} >New User?  </Text>
                    <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
                        <Text
                            style={{ color: "#FFFFFF", fontFamily: "Poppins-Regular", textDecorationLine: 'underline' }}
                        >Register Now</Text>
                    </TouchableOpacity>
                </View>
            </View>
            </ScrollView>
        </SafeAreaView>
    )
}

const style = StyleSheet.create({
    container: {
        padding: 10,
        backgroundColor: 'rgb(22, 24, 37)',
        flex: 1,
        position: 'relative',
        justifyContent: 'space-between'
    },
    title: {
        textAlign: 'center',
        marginTop: 48,
        fontFamily: "Poppins-Bold",
        color: '#FFFFFF',
        fontSize: 26,
    },
    subTitle: {
        textAlign: 'center',
        color: "#686868",
        fontFamily: "Poppins-Regular",
    },
    regiterPart: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    mainLogo: {
        width: 146,
        height: 146,
    },
    mainTitle: {
        marginTop: 32,
        fontSize: 36,
        color: "#FFFFFF",
        fontFamily: "Poppins-Light"
    },
    mainTitleBold: {
        fontFamily: "Poppins-Bold"
    },
    textAreaWrapper: {
        backgroundColor: '#3F455B',
        marginTop: 60,
        borderRadius: 7,
        display: 'flex',
        width: "100%"
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
    btnWrapper: {
        alignItems: 'center',
        marginTop: 30,
    },
    sendMsgBtn: {
        backgroundColor: '#ed7844',
        width: 131,
        height: 43,
        borderRadius: 5,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    sendText: {
        fontFamily: "Poppins-Medium",
        textAlign: 'center',
        fontSize: 24,
        color: "#FFFFFF"
    },
    register: {
        paddingTop: 20,
        width: "100%",
        flexDirection: 'row',
        justifyContent: 'center',
    }
});



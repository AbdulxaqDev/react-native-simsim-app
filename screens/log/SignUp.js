import { View, Text, SafeAreaView, StyleSheet, TextInput, TouchableOpacity, Keyboard, Image, ScrollView, Alert, ActivityIndicator, Dimensions } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage'
import BaseUrl from '../baseUrl';


export default function SignUp() {
    const navigation = useNavigation();
    const [FirstName, setFirstName] = useState(null);
    const [LastName, setLastName] = useState(null);
    const [UserName, setUserName] = useState(null);
    const [PhoneNumber, setPhoneNumber] = useState(null);
    const [NewPassword, setNewPassword] = useState(null);
    const [ConfirmPassword, setConfirmPassword] = useState(null);
    const [email, setEmail] = useState(null);

    const width = Dimensions.get('window').width;
    const height = Dimensions.get('window').height;
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(false)
    }, [])


    const register = async () => {
        let myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        let raw = JSON.stringify({
            "email": email,
            "first_name": FirstName,
            "last_name": LastName,
            "phone_number": PhoneNumber,
            "username": UserName,
            "password": NewPassword,
            "password2": ConfirmPassword
        });

        let requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch(`${BaseUrl}/api/register/`, requestOptions)
            .then(response => response.json())
            .then(result => {
                setLoading(false)
                if (Object.keys(result).length < 2) {
                    Alert.alert(
                        'Error',
                        result.message? result.message : result.email[0],
                        [
                            { text: 'OK' },
                        ]
                    );
                } else {
                    navigation.navigate("bottomTabNavigations");
                    const saveToken = async () => {
                        let raw = JSON.stringify({
                            "email": email,
                            "password": NewPassword
                        });
                        let requestOptions = {
                            method: 'POST',
                            headers: { "Content-Type": "application/json" },
                            body: raw,
                            redirect: 'follow'
                        };
                        fetch("http://192.168.1.143:8000/token/", requestOptions)
                            .then(response => response.json())
                            .then(result => {
                                console.log(result.access)
                                const saveToken = async () => {
                                    try {
                                        await AsyncStorage.setItem('@LOGIN_TOKEN', result.access);
                                        await AsyncStorage.setItem('@IS_LOGGED_IN', "true");
                                        console.log('New Token is Saved (sign up screen)')
                                    } catch (e) {
                                        console.log("Error saving Token to Asyn Storage (sign up screen): ", e);
                                    }
                                }
                                const updateToken = async () => {
                                    try {
                                        await AsyncStorage.removeItem('@LOGIN_TOKEN');
                                        await AsyncStorage.removeItem('@USER_EMAIL');
                                        console.log('Old token us removed (sign up screen)')
                                    } catch (e) {
                                        console.log("Error savig Token to Asyn Storage (sign up screen) : ", e);
                                    }
                                  }
                                  updateToken().then(()=>{
                                    saveToken();
                                  });
                            })
                            .catch(error => console.log('Token error', error));
                    }
                    saveToken()
                }
            })
            .catch(error => console.log('Register error', error));

    };


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
            <ScrollView>
                <View>
                    <Text style={style.title} >Sign up</Text>
                    <Text style={style.subTitle} >Create your account</Text>
                </View>
                <View style={style.regiterPart} >
                    <View style={style.textAreaWrapper} >
                        <TextInput
                            style={style.textArea}
                            placeholder="Fist Name"
                            placeholderTextColor="#B4B4B4"
                            underlineColorAndroid="transparent"
                            onChangeText={(text) => setFirstName(text)}
                        ></TextInput>
                        <TextInput
                            style={style.textArea}
                            placeholder="Last Name"
                            placeholderTextColor="#B4B4B4"
                            underlineColorAndroid="transparent"
                            onChangeText={(text) => setLastName(text)}
                        ></TextInput>
                        <TextInput
                            style={style.textArea}
                            placeholder="Username"
                            placeholderTextColor="#B4B4B4"
                            underlineColorAndroid="transparent"
                            onChangeText={(text) => setUserName(text)}
                        ></TextInput>
                        <TextInput
                            style={style.textArea}
                            placeholder="Phone number"
                            placeholderTextColor="#B4B4B4"
                            underlineColorAndroid="transparent"
                            onChangeText={(text) => setPhoneNumber(text)}
                        ></TextInput>
                        <TextInput
                            style={style.textArea}
                            placeholder="Email Address"
                            placeholderTextColor="#B4B4B4"
                            underlineColorAndroid="transparent"
                            onChangeText={(text) => setEmail(text)}
                        ></TextInput>
                        <TextInput
                            style={style.textArea}
                            placeholder="Create Password"
                            placeholderTextColor="#B4B4B4"
                            underlineColorAndroid="transparent"
                            onChangeText={(text) => setNewPassword(text)}
                        ></TextInput>
                        <TextInput
                            style={style.textArea}
                            placeholder="Confirm Password"
                            placeholderTextColor="#B4B4B4"
                            underlineColorAndroid="transparent"
                            onChangeText={(text) => setConfirmPassword(text)}
                        ></TextInput>
                    </View>
                    <View style={style.btnWrapper} >
                        <TouchableOpacity
                            style={style.sendMsgBtn}
                            activeOpacity={0.7}
                            
                            onPress = {() => {
                                if (
                                    email != null &&
                                    FirstName != null &&
                                    LastName != null &&
                                    PhoneNumber != null &&
                                    UserName != null &&
                                    NewPassword != null &&
                                    ConfirmPassword != null
                                ) {
                                    setLoading(true)
                                    register();
                                }else{
                                    Alert.alert(
                                        'Sign Up',
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
            </View>
        </ScrollView>
        </SafeAreaView >
    )
}

const style = StyleSheet.create({
    container: {
        padding: 10,
        backgroundColor: 'rgb(22, 24, 37)',
        flex: 1,
        position: 'relative',
        justifyContent: 'flex-start'
    },
    title: {
        textAlign: 'center',
        marginTop: 10,
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
    textAreaWrapper: {
        backgroundColor: '#3F455B',
        borderRadius: 7,
        display: 'flex',
        width: "100%",
        marginTop: 10
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
});


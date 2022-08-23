import { View, Text, SafeAreaView, StyleSheet, TextInput , TouchableOpacity, Keyboard, Image } from 'react-native'
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import BaseUrl from '../baseUrl';

export default function ForgotPassword() {
    const navigation = useNavigation();
    return (
        <SafeAreaView style={style.container} >
            <View>
                <Text style={style.title} >Forgot Password</Text>
                <Text style={style.title} >Relax,</Text>
                <Text style={style.title} >it will take less than a min</Text>
                <Text style={style.subTitle} >Create your account</Text>
            </View>
            <View style={style.regiterPart} >
                <View style={style.textAreaWrapper} >
                    <TextInput
                        style={style.textArea}
                        placeholder="Email adress"
                        placeholderTextColor="#B4B4B4"
                        underlineColorAndroid="transparent"
                    ></TextInput>
                </View>
                <View style={style.btnWrapper} >
                    <TouchableOpacity 
                        style={style.sendMsgBtn} 
                        activeOpacity={0.7} 
                        onPress={()=>{
                            Keyboard.dismiss
                            navigation.navigate("Verify");
                        }} >
                        <Text style={style.sendText} >Next</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
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
        fontFamily: "Poppins-Regular",
        color: '#FFFFFF',
        fontSize: 22,
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
        marginTop: 60
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
        marginTop: 70,
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



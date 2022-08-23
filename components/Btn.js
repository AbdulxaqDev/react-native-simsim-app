import { View, Text, SafeAreaView, StyleSheet, TextInput, Button, TouchableOpacity, Keyboard } from 'react-native'
import React from 'react';

export default function Btn({btnMarginTop=10, btnTitle='Title Name', btnAlign='flex-end',}) {
  return (
        <View style={[style.btnWrapper, { marginTop: btnMarginTop, alignItems: btnAlign}]} >
          <View 
            style={style.sendMsgBtn} 
            activeOpacity={0.7} 
            onPress={()=> Keyboard.dismiss }
          > 
            <Text  style={style.sendText} >{btnTitle}</Text>
          </View>
        </View>
  )
}

const style = StyleSheet.create({
  sendMsgBtn: {
    backgroundColor: '#ed7844',
    width: 131,
    height: 43,
    borderRadius: 5,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  sendText:{
    fontFamily: "Poppins-Medium",
    textAlign: 'center',
    fontSize: 24,
    color: "#FFFFFF"
  }
});



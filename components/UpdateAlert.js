import { View, Text, StyleSheet, SafeAreaView, TextInput, Dimensions, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'

import Btn from './Btn';
import DropDown from './dropDown'

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export default function UpdateAlert(
    {
        listOfItems = [],
        modalVisibility = false,
        changeModalVisibilty = () => { },
        itemName = "",
        itemId = null,
        getNewItemData = () => { },
        isSensorSettingsScreen,
    }
) {
    const [dataReady, setDataReady] = useState(false);
    const [newItemName, setNewItemName] = useState('');

    useEffect(() => {
        setNewItemName(itemName)

    }, [])


    return (
        <View style={[style.container, { display: modalVisibility ? "flex" : "none" }]} >
            <View style={style.textAreaWrapper} >
                <TextInput
                    style={style.textArea}
                    placeholder="Edit item name"
                    placeholderTextColor="#B4B4B4"
                    underlineColorAndroid="transparent"
                    onChangeText={(newName) => { setNewItemName(newName) }}
                    value={itemName}
                ></TextInput>
                <DropDown />
            </View>
            <TouchableOpacity
                onPress={() => {
                    getNewItemData(newItemName, itemId)
                    changeModalVisibilty(false)
                }}
                activeOpacity={0.7}
            >
                <Btn btnAlign="center" btnTitle='Save' btnMarginTop={30} />
            </TouchableOpacity>
        </View>
    )
}


const style = StyleSheet.create({
    container: {
        position: 'absolute',
        padding: 10,
        backgroundColor: 'rgba(22, 24, 37, 0.7)',
        width: width,
        height: height,
        justifyContent: 'center',
    },
    textAreaWrapper: {
        backgroundColor: '#3F455B',
        borderRadius: 7,
        display: 'flex',
        zIndex: 10,
    },
    textArea: {
        borderRadius: 7,
        textAlignVertical: 'top',
        paddingLeft: 10,
        paddingBottom: 10,
        color: '#FFFFFF',
        fontFamily: "Poppins-Regular",
        fontSize: 16,
        marginHorizontal: 34,
        marginVertical: 10,
        borderBottomColor: "#B4B4B4",
        borderBottomWidth: 1,
    },
});


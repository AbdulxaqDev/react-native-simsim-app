import { View, Text, StyleSheet, SafeAreaView, TextInput, TouchableOpacity, ScrollView, Dimensions, Alert } from 'react-native';
import Svg, { Path } from "react-native-svg";
import Clipboard from '@react-native-clipboard/clipboard';
import React, { useState, useEffect } from 'react';

// import UpdateAlert from './UpdateAlert';
import DropDown from "./dropDown"
import Btn from "./Btn"

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export default function UpdateDeleteList(
    {
        isSensorSettingsScreen = false,
        handleSelectedType = () => { },
        isDeviceSettingsScreen = false,
        isChannelSettingsScreen = false,
        isHomeSettingsScreen = false,
        listOfItems = [],
        getNewItemData = () => { },
        getOldItemData = () => { },
        deleteItem = () => { },
        homesList = [],
        productsList = [],
        handleSelectedHome = () => { },
        handleSelectedProduct = () => { },
        handleSelectedDevice = () => { },
        selectedItems = [],
        sensorTypes = []
    }
) {
    const [showUpMod, setShowUpMod] = useState(false);
    const [oldItem, setOldItem] = useState("");
    const [oldItemId, setOldItemId] = useState("");
    const [homeID, setHomeID] = useState(null);
    const [productID, setProductId] = useState(null);
    const [deviceID, setDeviceID] = useState(null);
    const [sensorType, setSensorType] = useState(null)



    const changeModalVisibilty = (condition) => {
        setShowUpMod(condition)
    }


    return (
        <SafeAreaView style={style.container} >
            <View style={style.heightScroll} >
                <ScrollView showsVerticalScrollIndicator={true} >
                    {listOfItems.map((item, i) => {
                        return (
                            <View style={style.rowWrapper} key={item.id} >
                                <Text style={style.rowText} >{item.name}</Text>
                                <View style={style.editDeleteBtn} >
                                    <TouchableOpacity
                                        onPress={() => {
                                            setOldItem(item.name)
                                            setOldItemId(item.id)
                                            getOldItemData(item.name, item.id)
                                            setShowUpMod(true)

                                            if (isDeviceSettingsScreen) {
                                                setHomeID(item.home)
                                                setProductId(item.product)
                                            }

                                            if (isChannelSettingsScreen) {
                                                setDeviceID(item.device)
                                            }

                                            if (isSensorSettingsScreen) {
                                                setDeviceID(item.device)
                                                setSensorType(item.type)
                                                handleSelectedType(item.type)

                                            }
                                        }}
                                        activeOpacity={0.7}
                                    >
                                        <EditIcon />
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() => {
                                            Alert.alert(
                                                "Warning",
                                                "Click 'OK' button, if you want to delete, otherwise 'CANCEL' to cancel it.",
                                                [
                                                    {
                                                        text: "Cancel",
                                                        onPress: () => { },
                                                        style: "cancel"
                                                    },
                                                    { text: "OK", onPress: () => deleteItem(item.name, item.id) }
                                                ]
                                            );
                                        }}
                                        style={{marginLeft: 10}}
                                    >
                                        <DeleteIcon />
                                    </TouchableOpacity>
                                    <TouchableOpacity 
                                        style={{ display: isHomeSettingsScreen ? 'flex' : 'none' }} 
                                        onPress={() => {
                                            Clipboard.setString(item.key)
                                            Alert.alert(
                                                'Home key copied',
                                                `${item.key}`,
                                                [
                                                  { text: 'OK' },
                                                ]
                                              );                                            
                                        }}
                                    >
                                        <Text style={[style.rowText, { marginLeft: 10, fontFamily: "Poppins-Bold", }]} >
                                            Key
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        );
                    })}
                </ScrollView>
                <View style={[updateAlert.container, { display: showUpMod ? "flex" : "none" }]} >
                    <View style={updateAlert.textAreaWrapper} >
                        <TextInput
                            style={updateAlert.textArea}
                            placeholder="Edit home name"
                            placeholderTextColor="#B4B4B4"
                            underlineColorAndroid="transparent"
                            onChangeText={(newName) => {
                                setOldItem(newName)
                            }}
                            value={oldItem}
                            editable={isDeviceSettingsScreen || isHomeSettingsScreen ? false : true}
                        ></TextInput>
                        <View style={{ display: isDeviceSettingsScreen ? 'flex' : 'none' }}>
                            {/* <DropDown
                                        listOfItems={homesList}
                                        label="Choose new home"
                                        selectedItem={selectedItems[0] == "" ? homesList.filter(getById => getById.id == homeID)[0] != undefined? homesList.filter(getById => getById.id == homeID)[0].name : selectedItems[0] : selectedItems[0]}
                                        handleSelectedItem={handleSelectedHome}
                                    /> */}
                            <DropDown
                                listOfItems={productsList}
                                label="Choose new product"
                                selectedItem={selectedItems[1] == "" ? productsList.filter(getById => getById.num_of_channels == productID)[0] != undefined ? productsList.filter(getById => getById.num_of_channels == productID)[0].name : selectedItems[1] : selectedItems[1]}
                                handleSelectedItem={handleSelectedProduct}
                            />
                        </View>
                        <View style={{ display: isChannelSettingsScreen ? 'flex' : 'none' }}>
                            <DropDown
                                listOfItems={homesList}
                                label="Choose new device"
                                selectedItem={selectedItems[0] == "" ? homesList.filter(getById => getById.id == deviceID)[0] != undefined ? homesList.filter(getById => getById.id == deviceID)[0].name : selectedItems[0] : selectedItems[0]}
                                handleSelectedItem={handleSelectedDevice}
                            />
                        </View>
                        <View style={{ display: isSensorSettingsScreen ? 'flex' : 'none' }}>
                            <DropDown
                                listOfItems={homesList}
                                label="Choose new device"
                                selectedItem={selectedItems[0] == "" ? homesList.filter(getById => getById.id == deviceID)[0] != undefined ? homesList.filter(getById => getById.id == deviceID)[0].name : selectedItems[0] : selectedItems[0]}
                                handleSelectedItem={handleSelectedDevice}
                            />
                            <DropDown
                                listOfItems={sensorTypes}
                                label="Choose new type"
                                selectedItem={selectedItems[1] == "" ? sensorTypes.filter(getById => getById.name == sensorType)[0] != undefined ? sensorTypes.filter(getById => getById.name == sensorType)[0].name : selectedItems[1] : selectedItems[1]}
                                handleSelectedItem={handleSelectedType}
                            />
                        </View>
                    </View>
                    <View style={updateAlert.modalBtns} >
                        <TouchableOpacity
                            onPress={() => {
                                changeModalVisibilty(false)
                            }}
                            activeOpacity={0.7}
                        >
                            <Btn btnAlign="center" btnTitle='Cancel' btnMarginTop={30} />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                getNewItemData(oldItem, oldItemId)
                                changeModalVisibilty(false)
                            }}
                            activeOpacity={0.7}
                            style={{ display: isHomeSettingsScreen ? 'none' : 'flex' }}
                        >
                            <Btn btnAlign="center" btnTitle='Save' btnMarginTop={30} />
                        </TouchableOpacity>
                    </View>
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
    },
    rowWrapper: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: '#3F455B',
        marginTop: 10,
        borderRadius: 4,
        padding: 10,
        paddingHorizontal: 30,
    },
    editDeleteBtn: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        width: "25%",
    },
    rowText: {
        textAlignVertical: 'top',
        color: '#FFFFFF',
        fontFamily: "Poppins-Regular",
        fontSize: 16,
        width: width * 0.4
    },
    heightScroll: {
        maxHeight: '100%',
        height: '100%',
    },
});


const updateAlert = StyleSheet.create({
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
    modalBtns: {
        flexDirection: "row",
        justifyContent: 'space-around'
    },
});





const EditIcon = (props) => (
    <Svg
        width={24}
        height={24}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <Path
            d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"
            stroke="#fff"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <Path
            d="M18.5 2.5a2.121 2.121 0 113 3L12 15l-4 1 1-4 9.5-9.5z"
            stroke="#fff"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </Svg>
);


const DeleteIcon = (props) => (
    <Svg
        width={25}
        height={25}
        viewBox="0 0 25 25"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <Path
            d="M3.872 6.742h18M19.872 6.742v14a2 2 0 01-2 2h-10a2 2 0 01-2-2v-14m3 0v-2a2 2 0 012-2h4a2 2 0 012 2v2M10.872 11.742v6M14.872 11.742v6"
            stroke="#fff"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </Svg>
);

const SaveIcon = (props) => (
    <Svg
        width={24}
        height={24}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <Path
            d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"
            stroke="#fff"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <Path
            d="M17 21v-8H7v8M7 3v5h8"
            stroke="#fff"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </Svg>
);



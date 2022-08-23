import { View, Text, StyleSheet, SafeAreaView, TextInput, TouchableOpacity, ScrollView, Dimensions, Alert } from 'react-native';
import Svg, { Path } from "react-native-svg";
import Clipboard from '@react-native-clipboard/clipboard';
import React, { useState, useEffect } from 'react';

// import UpdateAlert from './UpdateAlert';
import DropDown from "./dropDown"
import Btn from "./Btn"

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export default function ScheduleUpdateDeleteList(
    {
        listOfItems = [],
        listOfDevices = [],
        listOfChannels = [],
        listOfSensors = [],
        listOfConditions = [],
        listOfActions = [],
        getNewItemData = () => {},
        deleteItem = () => {}
    }
) {

    const [showUpMod, setShowUpMod] = useState(false);
    const [oldItem, setOldItem] = useState("");
    const [oldItemID, setOldItemID] = useState("");
    const [deviceID, setDeviceID] = useState("")
    const [hour, setHour] = useState("");
    const [minut, setMinut] = useState("")
    const [aboveTemp, setAboveTemp] = useState("")
    const [belowTemp, setBelowTemp] = useState("")



    const changeModalVisibilty = (visiblr) => {
        setShowUpMod(visiblr)
    }

    const [selectedCondition, setSelectedCondition] = useState("")
    const [selectedDevice, setSelectedDevice] = useState("");
    const [selectedChannel, setSelectedChannel] = useState("")
    const [selectedChannelID, setSelectedChannelID] = useState("")
    const [selectedSensor, setSelectedSensor] = useState("")
    const [selectedAction, setSelectedAction] = useState("")


    const handleSelectedCondition = (name, id) => {
        setSelectedCondition(name)
    }

    const handleSelectedDeviceID = (name, id) => {
        setDeviceID(id)
        setSelectedDevice(name)
    }

    const handleSelectedChannelId = (name, id) => {
        setSelectedChannel(name)
        setSelectedChannelID(id)
    }

    const handleSelectedSensorId = (name, id) => {
        setSelectedSensor(id)
    }

    const handleSelectedAction = (name, id) => {
        setSelectedAction(name)
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
                                            setOldItem(item.name);
                                            setOldItemID(item.id);
                                            setShowUpMod(true);
                                            setSelectedCondition(item.condition.timer ? "Add Timer" : "Add sensor condition");
                                            setSelectedChannelID(item.channel[0])
                                            setDeviceID(item.device);
                                            listOfDevices.filter((gadget) => {
                                                if (gadget.id == deviceID) {
                                                    setSelectedDevice(gadget.name);
                                                }
                                            })

                                            listOfSensors.filter((gadget) => {
                                                if (gadget.device == deviceID) {
                                                    setSelectedSensor(gadget.name);
                                                }
                                            })

                                            listOfChannels.filter((gadget) => {
                                                if (gadget.device == deviceID) {
                                                    setSelectedChannel(gadget.name);
                                                }
                                            })

                                            if (item.condition.timer == null) {
                                                setSelectedAction(item.status);
                                                setAboveTemp(item.condition.sensor_status.above);
                                                setBelowTemp(item.condition.sensor_status.below);

                                                setHour("");
                                                setMinut("");
                                            }else{
                                                setSelectedAction(item.status);
                                                setHour(Number(item.condition.timer.slice(0,2)));
                                                setMinut(Number(item.condition.timer.slice(3,6)));

                                                // cleaning unnecessery inputs
                                                setSelectedSensor("")
                                                setAboveTemp("");
                                                setBelowTemp("");
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
                                                    { text: "OK", onPress: () => deleteItem(item.id)}
                                                ]
                                            );
                                        }}
                                        style={{ marginLeft: 10 }}
                                    >
                                        <DeleteIcon />
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
                        ></TextInput>
                        <DropDown
                            listOfItems={listOfConditions}
                            label="Choose condition"
                            width='100%'
                            handleSelectedItem={handleSelectedCondition}
                            selectedItem={selectedCondition}
                        />
                        <View style={[style.timer, { display: selectedCondition == "Add Timer" ? 'flex' : 'none' }]}  >
                            <TextInput
                                style={style.timerInput}
                                placeholder="hh"
                                placeholderTextColor="#B4B4B4"
                                underlineColorAndroid="transparent"
                                keyboardType='numeric'
                                maxLength={2}
                                onChangeText={(hh) => {

                                    setHour(hh)
                                    const allNums = /[0-9]/


                                    if (allNums.test(hh) || hh == "") {
                                        if (Number(hh) > 24 || Number(hh) < 0) {
                                            Alert.alert(
                                                'Number',
                                                `You entered number bigger than 24 for hours`,
                                                [
                                                    { text: 'OK' },
                                                ]
                                            );
                                            setHour("")
                                        }
                                    } else {
                                        Alert.alert(
                                            'Not letter',
                                            `Please enter number between 0-24`,
                                            [
                                                { text: 'OK' },
                                            ]
                                        );
                                        setHour("")
                                    }
                                }}
                                value={`${hour}`}
                            ></TextInput>
                            <TextInput
                                style={style.timerInput}
                                placeholder="mm"
                                placeholderTextColor="#B4B4B4"
                                underlineColorAndroid="transparent"
                                keyboardType='numeric'
                                maxLength={2}
                                onChangeText={(mm) => {

                                    setMinut(mm)
                                    const allNums = /[0-9]/

                                    if (allNums.test(mm) || mm == "") {
                                        if (Number(mm) > 59 || Number(mm) < 0) {
                                            Alert.alert(
                                                'Number',
                                                `You entered number bigger than 59`,
                                                [
                                                    { text: 'OK' },
                                                ]
                                            );
                                            setHour("")
                                        }
                                    } else {
                                        Alert.alert(
                                            'Not letter',
                                            `Please enter number between 0-59`,
                                            [
                                                { text: 'OK' },
                                            ]
                                        );
                                        setHour("")
                                    }
                                }}
                                value={`${minut}`}
                            ></TextInput>
                        </View>
                        <DropDown
                            listOfItems={listOfDevices}
                            label="Choose device"
                            width='100%'
                            handleSelectedItem={handleSelectedDeviceID}
                            selectedItem={selectedDevice}
                        />
                        <DropDown
                            listOfItems={listOfChannels.filter(getChannelByDeviceId => getChannelByDeviceId.device == deviceID)}
                            label="Choose device channel"
                            width='100%'
                            handleSelectedItem={handleSelectedChannelId}
                            selectedItem={selectedChannel}
                        />
                        <View style={[{ display: selectedCondition == "Add sensor condition" ? 'flex' : 'none' }]} >
                            <DropDown
                                listOfItems={listOfSensors.filter(getSensorByDeviceId => getSensorByDeviceId.device == deviceID)}
                                label={`Choose device sensor`}
                                width='100%'
                                handleSelectedItem={handleSelectedSensorId}
                                selectedItem={selectedSensor}
                            />
                            <TextInput
                                style={style.textArea}
                                placeholder="Above"
                                placeholderTextColor="#B4B4B4"
                                underlineColorAndroid="transparent"
                                keyboardType='numeric'
                                onChangeText={(above) => {
                                    
                                    setAboveTemp(Number(above))
                                    const allNums = /[0-9]/

                                    if (!allNums.test(above) || above == "") {
                                        Alert.alert(
                                            'Above',
                                            `Please enter number`,
                                            [
                                                { text: 'OK' },
                                            ]
                                        );
                                    }

                                }}
                                value={`${aboveTemp}`}
                            ></TextInput>
                            <TextInput
                                style={style.textArea}
                                placeholder="Belowe"
                                placeholderTextColor="#B4B4B4"
                                underlineColorAndroid="transparent"
                                keyboardType='numeric'
                                onChangeText={(below) => {

                                    setBelowTemp(Number(below))
                                    const allNums = /[0-9]/

                                    if (!allNums.test(below) || below == "") {
                                        Alert.alert(
                                            'Below',
                                            `Please enter number`,
                                            [
                                                { text: 'OK' },
                                            ]
                                        );
                                    }
                                }}
                                value={`${belowTemp}`}
                            ></TextInput>
                        </View>

                        <DropDown
                            listOfItems={listOfActions}
                            label="Do"
                            width='100%'
                            handleSelectedItem={handleSelectedAction}
                            selectedItem={selectedAction}
                        />
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
                                changeModalVisibilty(false)

                                let raw = selectedCondition == "Add Timer" ? {
                                    "condition": {
                                      "timer": `${hour}:${minut}`,
                                    },
                                    "name": oldItem,
                                    "status": selectedAction,
                                    "device": deviceID,
                                    "channel": [selectedChannelID]
                                  } : {
                                    "condition": {
                                      "sensor_status": {
                                        "above": aboveTemp,
                                        "below": belowTemp,
                                        "sensor": selectedSensor
                                      }
                                    },
                                    "name": oldItem,
                                    "status": selectedAction,
                                    "device": deviceID,
                                    "channel": [selectedChannelID]
                                  };
                                  getNewItemData(raw, oldItemID)
                            }}
                            activeOpacity={0.7}
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
    timer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        width: "100%",
        marginTop: 10,
    },
    timerInput: {
        borderRadius: 5,
        borderColor: "#B4B4B4",
        borderWidth: 1,
        width: '20%',
        textAlign: 'center',
        color: '#FFFFFF',
        fontFamily: "Poppins-Regular",
        fontSize: 16,
    },
    textArea: {
        borderRadius: 7,
        textAlignVertical: 'top',
        padding: 10,
        paddingBottom: 0,
        color: '#FFFFFF',
        fontFamily: "Poppins-Regular",
        fontSize: 16,
        marginHorizontal: 34,
        marginVertical: 7,
        borderBottomColor: "#B4B4B4",
        borderBottomWidth: 1,
        paddingLeft: 10,
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



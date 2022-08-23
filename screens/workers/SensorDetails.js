import { View, Text, StyleSheet, SafeAreaView, TextInput, ScrollView, Dimensions } from 'react-native'
import React from 'react'

import Btn from '../../components/Btn';



const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export default function SensorDetails({ route }) {
    const { label, type, state } = route.params
    return (
        <SafeAreaView style={style.container} >
            <View style={style.labelWrapper} >
                <Text style={style.labelData} >{label}</Text>
            </View>
            {/* <View style={style.headerWrapper}>
                <Text style={style.header}>Date</Text>
                <Text style={style.header}>Temp</Text>
            </View> */}

            <ScrollView showsVerticalScrollIndicator={true} >
                {state.map((detail, i) => {
                    return (
                        <View key={i} style={style.dateWrapper}>
                            <Text style={style.passedDate}>{type.toUpperCase()}</Text>
                            <Text style={style.passedDate}>{detail} {type == "temperature" ? "°C" : type == "humidity" ? "%" : ""}</Text>
                        </View>
                    );
                })}

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
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    dateWrapper: {
        backgroundColor: "#3F455B",
        padding: 10,
        borderRadius: 7,
        width: width*0.9,
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        paddingHorizontal: 20,
        marginVertical: 5,
    },
    labelWrapper: {
        backgroundColor: "#3F455B",
        padding: 10,
        borderRadius: 7,
        width: 200,
        marginBottom: 30,
    },
    labelData: {
        fontFamily: "Poppins-Medium",
        color: "#FFFFFF",
        fontSize: 24,
        textAlign: 'center',

    },
    headerWrapper: {
        fontFamily: "Poppins-Medium",
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        width: "100%",
        paddingHorizontal: 30,
        marginTop: 40,
    },
    header: {
        fontFamily: "Poppins-Medium",
        color: "#FFFFFF",
        fontSize: 20,
    },
    passedDate: {
        fontFamily: "Poppins-Light",
        color: "#FFFFFF",
        fontSize: 20,

    }
});


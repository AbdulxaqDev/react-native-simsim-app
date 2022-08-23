import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView, Button } from 'react-native'
import React, { useState, useContext } from 'react';
import dropIcon from '../src/assets/images/dropicon2.png';






export default function HomeDrops({
    listOfItems = [
        { id: 1, name: "name 1" },
        { id: 2, name: "name 2" },
        { id: 3, name: "name 3" },
    ],
    width = '100%',
    label = 'Label here',
    handleSelectedItem  = ()=>{},
    handleSelectedItemID = ()=>{},
    selectedItem = false,
}) {
    listOfItems.length == 0 ? listOfItems = [{name: "No option"}] : '';

    const [showOption, setShowOption] = useState(false);
    const onSelectItem = (item, id) => {
        setShowOption(false);
        handleSelectedItemID(id)
    }
    return (
        <View style={style.main} >
            <TouchableOpacity
                style={[style.dropDown, { width: width,}]}
                activeOpacity={0.9}
                onPress={() => setShowOption(!showOption)}
            >
                <Text style={style.title} >{selectedItem ? selectedItem : label}</Text>
                <Image style={{
                    transform: [{ rotate: showOption ? '270deg' : '90deg' }],
                    width: 8,
                    height: 8,
                }} source={dropIcon} />
            </TouchableOpacity>
            {
                showOption && (
                    <View style={style.wrapper} >
                        <ScrollView showsVerticalScrollIndicator={true} >
                            {listOfItems.map((item, i) => {
                                return (
                                    <TouchableOpacity
                                        key={item.id}
                                        onPress={() => {
                                            onSelectItem(item.name, item.id)
                                            handleSelectedItem(item.name, item.id)
                                        }}
                                        style={[{
                                            backgroundColor: "rgb(63, 69, 91)",
                                            borderBottomColor: "#FFFFFF",
                                            borderBottomWidth: 1,
                                        }]}
                                        activeOpacity={0.8}
                                    >
                                        <Text style={style.title} >{item.name}</Text>
                                    </TouchableOpacity>
                                );
                            })}

                        </ScrollView>
                    </View>
                )
            }
        </View>
    )
}

const style = StyleSheet.create({
    main: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        paddingHorizontal: 34,
    },
    dropDown: {
        backgroundColor: 'rgba(100, 24, 37, 0)',
        color: "white",
        borderRadius: 5,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        marginHorizontal: 34,
        marginVertical: 7,
        borderBottomColor: "#B4B4B4",
        borderBottomWidth: 1,
    },
    title: {
        color: "white",
        padding: 10,
        textAlign: "left",
        fontSize: 15,
        fontFamily: 'Poppins-Medium',
        zIndex: 200
    },
    wrapper: {
        position: 'absolute',
        top: 37,
        backgroundColor: '#1d2031',
        padding: 7,
        borderRadius: 5,
        marginTop: 30,
        maxHeight: 200,
        width: '100%',
        zIndex: 2000
    }
});

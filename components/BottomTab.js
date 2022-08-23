import 'react-native-gesture-handler';
import React, { useState } from "react";
import Svg, { Path } from "react-native-svg"
import {StyleSheet } from 'react-native';
import { NavigationContainer, useIsFocused, useNavigation, useNavigationState, DefaultTheme } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { useSelector, useDispatch } from 'react-redux';
import { homeDeviceChannelSensorActions } from '../store/devicesSlice';


// MAIN SCREENS
import Devices from "../screens/Devices";
import Schedule from "../screens/Schedule";
import Dialog from "../screens/Dialog";
import More from "../screens/More";
// BOTTOM TAB ICONS

// Add SCREENS
import AddDevice from '../screens/add/AddDevice';
import AddChannel from '../screens/add/AddChannel';
import AddHome from '../screens/add/AddHome';
import AddSensor from '../screens/add/AddSensor';

// Worker SCREENS
import EditProfile from '../screens/workers/EditPrfile';
import SensorDetails from '../screens/workers/SensorDetails';

// Log Secreens
import SignIn from '../screens/log/SignIn';
import SignUp from '../screens/log/SignUp';
import ForgotPassword from '../screens/log/ForgetPassword';
import Verify from '../screens/log/Verify';

//Settings in More screen

import HomeSettings from '../screens/settings/HomeSettings'
import DeviceSettings from '../screens/settings/DeviceSettings'
import ChannelSettings from '../screens/settings/ChannelSettings'
import SensorSettings from '../screens/settings/SensorSettings'
import ScheduleSettings from '../screens/settings/ScheduleSettings'


const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();


/*
    Getting token from Asyncstorage, wjich is local storage.
*/
// const isUserLoggedIn = async () => {
//     try {
//         const value = await AsyncStorage.getItem('@IS_LOGGED_IN');
//         console.log( "this one", value);
//         return value == 'logged in'? true : false;
//     } catch (e) {
//         console.log("Error on getting Token from Asyn storage (Devices screen): ", e);
//     }
// }



const navTheme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        background: '#161825',
    },
};



function bottomTabNavigations() {
    const [w, setW] = useState(0)

    return (
                <Tab.Navigator initialRouteName="Devices"
                    screenOptions={{
                        headerShown: false,
                        gestureEnabled: true,
                        tabBarStyle: {
                            backgroundColor: '#161825',
                            paddingTop: 5,
                            paddingBottom: 0,
                            borderTopColor: "#FFFFFF",
                        },
                        tabBarLabelStyle: {
                            fontSize: 12,
                            color: "#FFFFFF",
                            fontFamily: "Poppins-Regular"
                        },
                    }} >
                    <Tab.Screen name="Devices" component={Devices}
                        options={{
                            tabBarIcon: () => (<DevicesSvgIcon strokeWidth={w == 0 ? 2 : 1} stroke={w == 0 ? "#ed7844" : "#fff"} />)
                        }}
                        listeners={{
                            tabPress: () => {
                                setW(0)
                            },
                        }}
                    />
                    <Tab.Screen name="Schedule" component={Schedule}
                        options={{
                            tabBarIcon: () => (<ScheduleSvgIcon strokeWidth={w == 1 ? 2 : 1} stroke={w == 1 ? "#ed7844" : "#fff"} />)
                        }}
                        listeners={{
                            tabPress: () => {
                                setW(1)
                            },
                        }}
                    />
                    <Tab.Screen name="Dialog" component={Dialog}
                        options={{
                            tabBarIcon: () => (<DialogSvgIcom strokeWidth={w == 2 ? 2 : 1} stroke={w == 2 ? "#ed7844" : "#fff"} />)
                        }}
                        listeners={{
                            tabPress: () => {
                                setW(2)
                            },
                        }}
                    />
                    <Tab.Screen name="More" component={More}
                        options={{
                            tabBarIcon: () => (<MoreSvgIcon strokeWidth={w == 3 ? 2 : 1} stroke={w == 3 ? "#ed7844" : "#fff"} />)
                        }}
                        listeners={{
                            tabPress: () => {
                                setW(3)
                            },
                        }}
                    />
                </Tab.Navigator>

    );
}


const Navigation =  ({
    initialScreen = "SignIn",
}) => {
    const screenOptions = {
        headerShown: false,
        transparentCard: true,

        // This removes the #eee background from the card
        // See https://github.com/react-navigation/react-navigation/issues/2713
        transitionConfig: () => ({
            containerStyleLight: {},
            containerStyleDark: {},
        })
    };


    const options = {
        // Editing Header Tab (Title, Back arrow color, etc.)
        headerShown: true,
        headerTitleStyle: {
            color: '#FFFFFF',
            fontFamily: "Poppins-Regular",
            fontSize: 20,
        },
        headerTitleAlign: 'center',
        headerStyle: {
            backgroundColor: '#161825'
        },
        // Back arrow color 
        headerTintColor: "#FFFFFF"
    }
    const wTitileOpt = {
        // Editing Header Tab (Title, Back arrow color, etc.)
        headerShown: false,
        headerTitleStyle: {
            color: '#FFFFFF',
            fontFamily: "Poppins-Regular",
            fontSize: 20,
        },
        headerTitleAlign: 'center',
        headerStyle: {
            backgroundColor: '#161825'
        },
        // Back arrow color 
        headerTintColor: "#FFFFFF"
    }

    return (
                <NavigationContainer style={style.back} theme={navTheme} >
                    <Stack.Navigator initialRouteName={initialScreen} screenOptions={screenOptions}>
                        <Stack.Screen name="SignIn" component={SignIn} options={wTitileOpt} />
                        <Stack.Screen name="SignUp" component={SignUp} options={wTitileOpt} />
                        <Stack.Screen name="ForgotPassword" component={ForgotPassword} options={wTitileOpt} />
                        <Stack.Screen name="Verify" component={Verify} options={wTitileOpt} />




                        <Stack.Screen name="Add device" component={AddDevice} options={options} />
                        <Stack.Screen name="Add channel" component={AddChannel} options={options} />
                        <Stack.Screen name="Add home" component={AddHome} options={options} />
                        <Stack.Screen name="Add sensor" component={AddSensor} options={options} />

                        {/* More Screen */}
                        <Stack.Screen name="Edit profile" component={EditProfile} options={options} />
                        <Stack.Screen name="Sensor details" component={SensorDetails} options={options} />

                        <Stack.Screen name="Home settings" component={HomeSettings} options={options} />
                        <Stack.Screen name="Device settings" component={DeviceSettings} options={options} />
                        <Stack.Screen name="Channel settings" component={ChannelSettings} options={options} />
                        <Stack.Screen name="Sensor settings" component={SensorSettings} options={options} />
                        <Stack.Screen name="Schedule settings" component={ScheduleSettings} options={options} />

                        {/* Bottom Tabs */}
                        <Stack.Screen name="bottomTabNavigations" children={bottomTabNavigations} />

                        {/* Main Screens */}
                        <Stack.Screen name="Devices" component={Devices} options={wTitileOpt} />
                        <Stack.Screen name="Schedule" component={Schedule} options={wTitileOpt} />
                        <Stack.Screen name="Dialog" component={Dialog} options={wTitileOpt} />
                        <Stack.Screen name="More" component={More} options={wTitileOpt} />


                    </Stack.Navigator>
                </NavigationContainer>
    )
}


export default Navigation;






const DevicesSvgIcon = (props) => (
    <Svg
        width={24}
        height={24}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <Path
            d="M5 17H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-1"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <Path
            d="m12 15 5 6H7l5-6Z"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </Svg>
)

const ScheduleSvgIcon = (props) => (
    <Svg
        width={24}
        height={24}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <Path
            d="M19 4H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2ZM16 2v4M8 2v4M3 10h18"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </Svg>
)


const DialogSvgIcom = (props) => (
    <Svg
        width={24}
        height={24}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <Path
            d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7Z"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </Svg>
)

const MoreSvgIcon = (props) => (
    <Svg
        width={24}
        height={24}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <Path
            d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </Svg>
)


const style = StyleSheet.create({
    back: {
        backgroundColor: "red",
    }
});







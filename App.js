import React, { useState, useEffect } from 'react';
import Navigation from './components/BottomTab';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Provider } from 'react-redux';
import store from './store/index'

export default function App() {


      const [userIn, setUserIn] = useState(false)
      const [userReady, setUserReady] = useState(false)

/*
    Getting token from Asyncstorage, wjich is local storage.
*/
      const screen1 = () => <Navigation initialScreen="bottomTabNavigations" />  

      const screen2 = () =>  <Navigation initialScreen="SignIn" />

      const isUserLoggedIn = async () => {
            try {
                  const value = await AsyncStorage.getItem('@IS_LOGGED_IN');
                  return value == 'true' ? true : false
            } catch (e) {
                  console.log("Error on getting @IS_LOGGED_IN from Asyn storage (App.js): ", e);
            }
      }

      useEffect(()=>{
            isUserLoggedIn().then((data)=>{
                  setUserIn(data)
                  setUserReady(true)
            })
      }, [isUserLoggedIn()])


      return (
            <Provider store={store} >
                  {userReady? userIn? screen1() : screen2() : null}
            </Provider>
      )

}


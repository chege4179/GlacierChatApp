/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { FC, useEffect } from "react";
import { extendTheme } from "native-base";
import { NativeBaseProvider } from "native-base/src/core/NativeBaseProvider";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Screens from "./src/util/Screens";
import LoginScreen from "./src/screens/LoginScreen";
import DashBoardScreen from "./src/screens/DashBoardScreen";
import auth from "@react-native-firebase/auth";
import ProfileScreen from "./src/screens/ProfileScreen";
import SearchScreen from "./src/screens/SearchScreen";
import ChatScreen from "./src/screens/ChatScreen";
import AllChatsScreen from "./src/screens/AllChatsScreen";

const Stack = createNativeStackNavigator();
const App :React.FC = () => {
     const currentUser = auth().currentUser;
     const theme = extendTheme({
          colors: {
               // Add new color
               primary: {
                    50: "#E3F2F9",
                    100: "#C5E4F3",
                    200: "#A2D4EC",
                    300: "#7AC1E4",
                    400: "#47A9DA",
                    500: "#0088CC",
                    600: "#007AB8",
                    700: "#006BA1",
                    800: "#005885",
                    900: "#6366F1",
               },
               // Redefining only one shade, rest of the color will remain same.
               amber: {
                    400: "#d97706",
               },
          },
          config: {
               // Changing initialColorMode to 'dark'
               initialColorMode: "dark",
          },
     });

     useEffect(() => {
          let isSubscribed = true;
          auth().onAuthStateChanged((user) => {
               if (isSubscribed) {


               }
          });
          return () => {
               isSubscribed = false;
          };
     }, []);
     return (
          <NavigationContainer>
               <NativeBaseProvider theme={theme}>
                    <Stack.Navigator
                         initialRouteName={currentUser === null ? Screens.LOGIN_SCREEN : Screens.DASHBOARD_SCREEN}>
                         <Stack.Screen name={Screens.LOGIN_SCREEN} component={LoginScreen} options={{
                              headerShown: false,
                         }} />
                         <Stack.Screen name={Screens.DASHBOARD_SCREEN} component={DashBoardScreen} options={{
                              headerShown: false,
                         }} />
                         <Stack.Screen name={Screens.PROFILE_SCREEN} component={ProfileScreen} options={{
                              headerShown: false,
                         }} />
                         <Stack.Screen name={Screens.SEARCH_SCREEN} component={SearchScreen} options={{
                              headerShown: false,
                         }} />
                         <Stack.Screen name={Screens.CHAT_SCREEN} component={ChatScreen} />
                         <Stack.Screen name={Screens.ALL_CHATS_SCREEN} component={AllChatsScreen} options={{
                              headerShown: false,
                         }} />
                    </Stack.Navigator>
               </NativeBaseProvider>
          </NavigationContainer>

     );
};

export default App;

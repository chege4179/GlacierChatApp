import React, { useEffect } from "react";
import { Avatar, Box, Button, Text, VStack } from "native-base";
import auth from "@react-native-firebase/auth";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import Screens from "../util/Screens";
import { useNavigation } from "@react-navigation/native";
import { BackHandler } from "react-native";

const ProfileScreen = () => {
     const navigation = useNavigation()
     const currentUser = auth().currentUser
     const LogOut = () => {
          GoogleSignin.signOut().then(() => {
               auth()
               .signOut()
               .then(() => {
                    navigation.navigate(Screens.LOGIN_SCREEN)
               })
               .catch((err) => {
                    console.log("Sign Out error", err);
               });
          })
     };
     useEffect(() => {
          BackHandler.addEventListener("hardwareBackPress",() => {
               navigation.goBack()
          })
          return () => {
               BackHandler.removeEventListener("hardwareBackPress",() => {

               })
          }
     }, []);

     return (
          <Box width="100%" height="100%" display="flex"  alignItems="center" p={4} justifyContent="space-between">
               <VStack width="100%" alignItems="center">
                    <Avatar bg="cyan.500" alignSelf="center" size="xl" source={{ uri: currentUser.photoURL }}/>
                    <Text color="black" fontSize={30} fontWeight="bold">{currentUser.displayName}</Text>
                    <Text color="black" fontSize={17} >{currentUser.email}</Text>
               </VStack>
               <Button width="90%" height={12} bg="primary.900" borderRadius="xl" onPress={LogOut}>
                    <Text fontSize={18} fontWeight="bold">Log Out</Text>
               </Button>
          </Box>
     );
};

export default ProfileScreen;

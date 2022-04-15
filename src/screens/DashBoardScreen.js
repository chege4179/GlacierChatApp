import React, { useEffect, useLayoutEffect, useState } from "react";
import { Avatar, Box, HStack, Text, VStack } from "native-base";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import { TouchableOpacity } from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Screens from "../util/Screens";

const DashBoardScreen = () => {
     const navigation = useNavigation()
     const user = auth().currentUser
     console.log("User",user);

     useLayoutEffect(() => {
          navigation.setOptions({
               headerShown:false,
          })
     },[])

     useEffect(() => {
          const subscriber = auth().onAuthStateChanged((user) => {

               firestore()
                    .collection("Users")
                    .get()
                    .then((snapshot) => {
                         const users = snapshot.docs.map((doc) => (doc.data()))
                         if (user){
                              const existingUser = users.findIndex((userr) => userr.email ===user.email)
                              if (existingUser === -1){
                                   addUserToDatabase(user);
                              }
                         }
                    });
          });
          return subscriber; // unsubscribe on unmount
     }, []);

     function addUserToDatabase(user) {
          firestore()
          .collection("Users")
          .add({
               displayName: user.displayName,
               email: user.email,
               userId: user.uid,
               photoURL: user.photoURL,
          })
          .then(() => {
               console.log("User added!");
          });
     }
     const GoToProfilePage = ()=> {
          navigation.navigate(Screens.PROFILE_SCREEN)
     }
     const GoToSearchScreen = () =>{
          navigation.navigate(Screens.SEARCH_SCREEN)
     }
     return (
          <Box width="100%" height="100%" display="flex" justifyContent="center" alignItems="center">
               <VStack width="100%" height="100%" >
                    <HStack space={4} width="100%" height={16} bg="primary.900"  justifyContent="space-between" px={4} alignItems="center">
                         <TouchableOpacity onPress={GoToProfilePage}>
                              <Avatar bg="cyan.500" alignSelf="center" size="md" source={{ uri: user?.photoURL }}/>
                         </TouchableOpacity>
                         <Text color="black" fontSize={26} fontWeight="bold">My Chats</Text>
                         <TouchableOpacity onPress={GoToSearchScreen}>
                              <FontAwesome name="search" size={30 } color="black"/>
                         </TouchableOpacity>
                    </HStack>
               </VStack>
          </Box>
     );
};

export default DashBoardScreen;
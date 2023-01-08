import React, { useEffect, useLayoutEffect, useState } from "react";
import { Alert, Avatar, Box, HStack, Slide, Text, VStack } from "native-base";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import { TouchableOpacity } from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Screens from "../util/Screens";
import AllChatsScreen from "./AllChatsScreen";
import NetInfo from "@react-native-community/netinfo";


const DashBoardScreen = () => {
     const navigation = useNavigation()
     const user = auth().currentUser
     const [isConnected,setIsConnected] = useState<boolean>(false)
     useLayoutEffect(() => {
          navigation.setOptions({
               headerShown:false,
          })
     },[])

     useEffect(() => {
          let isSubscribed = true
          const subscriber = auth().onAuthStateChanged((user:FirebaseAuthTypes.User) => {
               if (isSubscribed){
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
               }
          });
          return () => {
               isSubscribed = false
          }
     }, []);



     useEffect(() => {
          NetInfo.addEventListener(state => {
               setIsConnected(state.isConnected)
               // console.log("Connection type", state.type);
               // console.log("Is connected?", state.isConnected);
          });
          return () => {
               setIsConnected(false)

          }
     },[])

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
               <Slide in={!isConnected} placement="top">
                    <Alert justifyContent="center" status="error">
                         <Alert.Icon />
                         <Text color="error.600" fontWeight="medium">
                              {isConnected ? "Internet Connection found" : "No Internet Connection"}
                         </Text>
                    </Alert>
               </Slide>
               <VStack width="100%" height="100%" >
                    <HStack space={4} width="100%" height="8%" bg="primary.900"  justifyContent="space-between" px={4} alignItems="center">
                         <TouchableOpacity onPress={GoToProfilePage}>
                              <Avatar bg="cyan.500" alignSelf="center" size="sm" source={{ uri: user?.photoURL }}/>
                         </TouchableOpacity>
                         <Text color="black" fontSize={26} fontWeight="bold">My Chats</Text>
                         <TouchableOpacity onPress={GoToSearchScreen}>
                              <FontAwesome name="search" size={30 } color="black"/>
                         </TouchableOpacity>
                    </HStack>
                    <Box width="100%" height="100%" display="flex" justifyContent="center" alignItems="center" px={1}>
                         <AllChatsScreen/>
                    </Box>

               </VStack>

          </Box>
     );
};

export default DashBoardScreen;

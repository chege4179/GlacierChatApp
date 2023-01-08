import React, { useEffect, useLayoutEffect, useState } from "react";
import { Box, Text, VStack, FlatList, Spinner, Slide, Alert, Avatar } from "native-base";
import firestore from "@react-native-firebase/firestore";
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import { addUserToDatabase, getDocId } from "../util/helperfunctions";
import ChatRoomCard from "../components/ChatRoomCard";
import NetInfo from "@react-native-community/netinfo"
import { useNavigation } from "@react-navigation/native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { TouchableOpacity } from "react-native";
import Screens from "../util/Screens";

const AllChatsScreen: React.FC = () => {
     const navigation  = useNavigation()
     const currentUser = auth().currentUser
     const [receiverEmails,setReceiverEmails] = useState([])
     const [isLoading,setIsLoading] = useState(false)
     const [isConnected,setIsConnected] = useState<boolean>(false)

     const GoToProfilePage = ()=> {
          navigation.navigate(Screens.PROFILE_SCREEN)
     }
     const GoToSearchScreen = () =>{
          navigation.navigate(Screens.SEARCH_SCREEN)
     }
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

     useLayoutEffect(() => {
          navigation.setOptions({
               title:"My Chats",
               headerRight:()=> {
                    return(
                         <TouchableOpacity onPress={GoToSearchScreen}>
                              <FontAwesome name="search" size={27} color="black"/>
                         </TouchableOpacity>
                    )
               },
               headerLeft:()=>{
                    return(
                         <TouchableOpacity onPress={GoToProfilePage} style={{ marginRight:10, }}>
                              <Avatar bg="cyan.500" alignSelf="center" size="sm" source={{ uri: currentUser?.photoURL }}/>
                         </TouchableOpacity>
                    )
               }
          })

     },[]);



     navigation.addListener("focus",() => {
          setIsLoading(true)
          if (currentUser !== null){
               getDocId(currentUser.email)
               .then((docId)=>{
                    firestore()
                    .collection("Users")
                    .doc(docId)
                    .collection("Chats")
                    .onSnapshot((receiverDocs) => {
                         const receivers = receiverDocs.docs.map((doc) => ({ id:doc.id,...doc.data() }))
                         setIsLoading(false)
                         setReceiverEmails(receivers)
                    })
               })
               .catch((err)=>{
                    setIsLoading(false)
                    console.log(err);
                    console.log("error");
               })
          }
     })
     useEffect(() => {
          setIsLoading(true)
          if (currentUser !== null){
               getDocId(currentUser.email)
               .then((docId)=>{
                    firestore()
                    .collection("Users")
                    .doc(docId)
                    .collection("Chats")
                    .onSnapshot((receiverDocs) => {
                         const receivers = receiverDocs.docs.map((doc) => ({ id:doc.id,...doc.data() }))
                         setIsLoading(false)
                         setReceiverEmails(receivers)
                    })
               })
               .catch((err)=>{
                    setIsLoading(false)
                    console.log(err);
                    console.log("error");
               })
          }

     }, []);
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

     return (
          <VStack width="100%"height="100%" px={2}>

               {
                    isLoading ? (
                         <Box width="100%" height="100%" display="flex" justifyContent="center" alignItems="center">
                              <Spinner size="lg" />
                         </Box>
                    ):(
                         <>

                              <Slide in={!isConnected} placement="top">
                                   <Alert justifyContent="center" status="error">
                                        <Alert.Icon />
                                        <Text color="error.600" fontWeight="medium">
                                             {isConnected ? "Internet Connection found" : "No Internet Connection"}
                                        </Text>
                                   </Alert>
                              </Slide>
                              <FlatList
                                   py={2}
                                   width="100%"
                                   data={receiverEmails}
                                   keyExtractor={(item) => item.id}
                                   renderItem={({ item }) => {
                                        return(
                                             <>
                                                  <ChatRoomCard key={item.id} email={item.receiver} />
                                             </>

                                        )
                                   }}
                              />
                         </>

                    )
               }

          </VStack>
     );
};

export default AllChatsScreen;

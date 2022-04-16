import React, { useEffect, useState } from "react";
import { Box, Text, VStack,FlatList } from "native-base";
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";
import { getDocId } from "../util/helperfunctions";
import ChatRoomCard from "../components/ChatRoomCard";

const AllChatsScreen = () => {
     const currentUser = auth().currentUser
     const [receiverEmails,setReceiverEmails] = useState([])
     useEffect(() => {
          getDocId(currentUser.email).then((docId)=>{
               firestore()
                    .collection("Users")
                    .doc(docId)
                    .collection("Chats")
                    .onSnapshot((receiverDocs) => {
                         const receivers = receiverDocs.docs.map((doc) => ({ id:doc.id,...doc.data() }))
                         setReceiverEmails(receivers)
                    })

          })

     }, []);

     return (
          <VStack width="100%"height="100%">
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
          </VStack>
     );
};

export default AllChatsScreen;

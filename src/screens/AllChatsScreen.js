import React, { useEffect, useState } from "react";
import { Box, Text, VStack } from "native-base";
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
                    .get()
                    .then((receiverDocs) =>{
                         const receivers = receiverDocs.docs.map((doc) => ({ id:doc.id,...doc.data() }))
                         console.warn("Receivers",receivers);

                         setReceiverEmails(receivers)
                    })

          })

     }, []);

     return (
          <VStack width="100%"height="100%">
               {
                    receiverEmails.map((receiver) => {
                         return(
                              <ChatRoomCard email={receiver.receiver} />
                         )
                    })
               }
          </VStack>
     );
};

export default AllChatsScreen;

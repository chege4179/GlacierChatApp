import firestore from "@react-native-firebase/firestore";
import User from "../types/User";
import { FirebaseAuthTypes } from "@react-native-firebase/auth";


async function getDocId(email:string){
     try {
          const users = await firestore().collection("Users").get()
          const usersss = users.docs.map((doc) => ({ id:doc.id,...doc.data() }))
          return usersss.find((user) => user.email === email).id
     }catch (e){
          console.log("error getting docID",e);
     }

}
async function getUserInfo(email:string){
     try {
          const userDocs = await firestore().collection("Users").get()
          const users:User[] = userDocs.docs.map((doc) => ({ id:doc.id,...doc.data() }))
          return users.find((user) => user.email === email)
     }catch (e){
          console.log(e);
     }
}
async function getChatId(sender:string,receiver:string,docId:string){
     try {
          const chatsDocs = await firestore().collection("Users").doc(docId).collection("Chats").get()
          const chats = chatsDocs.docs.map((doc) => ({ id:doc.id,...doc.data() }))
          const currentChat = chats.find((chat) => chat.sender === sender && chat.receiver === receiver)
          return currentChat.id
     }catch (e){
          console.log("Error getting chat id",e);
     }

}
async function checkIfChatsExists(sender:string,receiver:string,docId:string){
     try {
          const chatsDocs = await firestore().collection("Users").doc(docId).collection("Chats").get()
          const chats = chatsDocs.docs.map((doc) => ({ id:doc.id,...doc.data() }))
          const currentChat = chats.find((chat) => chat.sender === sender && chat.receiver === receiver)
          return currentChat !== undefined;
     }catch (e){
          console.log("Error checking if chat exists",e);
     }

}
async function getChats(docId:string,chatId:string){
     try {
          const chatsDocs = await firestore().collection("Users").doc(docId).collection("Chats").doc(chatId).collection("messages")
          const chats = chatsDocs.docs.map((doc) => ({ id:doc.id,...doc.data() }))
          return chats
     }catch (e){
          console.log("Error getting chat id",e);
     }

}

async function createNewChat(sender:string,receiver:string,message:string,docId:string){
     try {
          await firestore()
          .collection("Users")
          .doc(docId)
          .collection("Chats")
          .add({
               sender:sender,
               receiver:receiver,

          })
               .then(() => {
                    console.log("New Chat created");
               })
               .catch((err) => {
                    console.log("An error occurred while creating a new chat",err);

               })
          const chatId = await getChatId(sender,receiver,docId)
          sendMessageToExistingChat(sender,receiver,message,docId,chatId)
               .then(() => {
                    console.log("New message sent to the existing chat");
               })
               .catch((err) => {
                    console.log("An error occurred sending message to the existing chat",err);

               })
     }catch (e){
          console.log("Error creating a new chat",e);
     }

}
async function sendMessageToExistingChat(sender:string,receiver:string,message:string,docId:string,chatId:string){
     try {
          await firestore()
          .collection("Users")
          .doc(docId)
          .collection("Chats")
          .doc(chatId)
          .collection("messages")
          .add({
               message
          })
          .then(() => {
               console.log("New chat created and message sent");
          })
          .catch((err) => {
               console.log("An error occurred",err);

          })
     }catch (e){
          console.log("Error sending message to an existing chat",e);
     }
}
async function getLastMessage(loggedInUser,receiver){
     try {
          const docId:string = await getDocId(loggedInUser)
          const chatId :string = await getChatId(loggedInUser,receiver,docId)
          const chatsDocs = await firestore().collection("Users").doc(docId).collection("Chats").doc(chatId).collection("messages").get()
          const unorderedchats = chatsDocs.docs.map((doc) => ({ _id: doc.id, ...JSON.parse(doc.data().message) }))
          const orderChats = unorderedchats.sort((a, b) => a.time - b.time)
          return orderChats[orderChats.length - 1]
     }catch (e){
          console.log("Error in catch block",e);

     }


}
function truncate(str:string, n:number) {
     return str?.length > n ? str.substr(0, n - 1) + "...." : str;
}

function addUserToDatabase(user:FirebaseAuthTypes.User) {
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
export { getDocId,checkIfChatsExists,createNewChat,
     sendMessageToExistingChat,getChats,getChatId ,
     getUserInfo,truncate,getLastMessage,
     addUserToDatabase

}

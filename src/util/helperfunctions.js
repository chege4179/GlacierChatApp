import firestore from "@react-native-firebase/firestore";


async function getDocId(email){
     try {
          const users = await firestore().collection("Users").get()
          const usersss = users.docs.map((doc) => ({ id:doc.id,...doc.data() }))
          return usersss.find((user) => user.email === email).id
     }catch (e){
          console.log("error getting docID",e);
     }

}
async function getUserInfo(email){
     try {
          const userDocs = await firestore().collection("Users").get()
          const users = userDocs.docs.map((doc) => ({ id:doc.id,...doc.data() }))
          return users.find((user) => user.email === email)
     }catch (e){
          console.log(e);
     }
}
async function getChatId(sender,receiver,docId){
     try {
          const chatsDocs = await firestore().collection("Users").doc(docId).collection("Chats").get()
          const chats = chatsDocs.docs.map((doc) => ({ id:doc.id,...doc.data() }))
          const currentChat = chats.find((chat) => chat.sender === sender && chat.receiver === receiver)
          return currentChat.id
     }catch (e){
          console.log("Error getting chat id",e);
     }

}
async function checkIfChatsExists(sender,receiver,docId){
     try {
          const chatsDocs = await firestore().collection("Users").doc(docId).collection("Chats").get()
          const chats = chatsDocs.docs.map((doc) => ({ id:doc.id,...doc.data() }))
          const currentChat = chats.find((chat) => chat.sender === sender && chat.receiver === receiver)
          return currentChat !== undefined;
     }catch (e){
          console.log("Error checking if chat exists",e);
     }

}
async function getChats(docId,chatId){
     try {
          const chatsDocs = await firestore().collection("Users").doc(docId).collection("Chats").doc(chatId).collection("messages")
          const chats = chatsDocs.docs.map((doc) => ({ id:doc.id,...doc.data() }))
          return chats
     }catch (e){
          console.log("Error getting chat id",e);
     }

}

async function createNewChat(sender,receiver,message,docId){
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
async function sendMessageToExistingChat(sender,receiver,message,docId,chatId){
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

function truncate(str, n) {
     return str?.length > n ? str.substr(0, n - 1) + "...." : str;
}
export { getDocId,checkIfChatsExists,createNewChat,sendMessageToExistingChat,getChats,getChatId ,getUserInfo,truncate }
/**
 * {
 *      ...user,
 *      chats:[
 *           sender:email,
 *           receiver:email,
 *           messages:[
 *                { ...message }
 *           ]
 *      ]
 * }
 *
 */

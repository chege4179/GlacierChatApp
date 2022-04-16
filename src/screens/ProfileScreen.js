import React from "react";
import { Avatar, Box, Button, Text, VStack } from "native-base";
import auth from "@react-native-firebase/auth";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

const ProfileScreen = () => {
     const currentUser = auth().currentUser
     const LogOut = () => {
          GoogleSignin.signOut().then(() => {
               auth()
               .signOut()
               .then(() => {
                    console.log("Sign Out successful");
               })
               .catch((err) => {
                    console.log("Sign Out error", err);
               });
          })

     };
     return (
          <Box width="100%" height="100%" display="flex"  alignItems="center" p={4} justifyContent="space-between">
               <VStack width="100%" alignItems="center">
                    <Avatar bg="cyan.500" alignSelf="center" size="xl" source={{ uri: currentUser.photoURL }}/>
                    <Text color="black" fontSize={30} fontWeight="bold">{currentUser.displayName}</Text>
                    <Text color="black" fontSize={17} >{currentUser.email}</Text>
               </VStack>

               <Button width="90%" height={12} bg="primary.900" borderRadius="xl" onPress={LogOut}>
                    Log Out
               </Button>
          </Box>
     );
};

export default ProfileScreen;

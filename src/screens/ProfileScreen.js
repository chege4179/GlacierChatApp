import React from "react";
import { Box, Button, Text } from "native-base";
import auth from "@react-native-firebase/auth";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

const ProfileScreen = () => {
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
          <Box width="100%" height="100%">
               <Text color="black">Profile Screen</Text>
               <Button width="90%" height={12} bg="primary.900" borderRadius="xl" onPress={LogOut}>
                    Log Out
               </Button>
          </Box>
     );
};

export default ProfileScreen;

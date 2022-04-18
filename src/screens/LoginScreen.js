import React from "react";
import { GoogleSignin, GoogleSigninButton } from "@react-native-google-signin/google-signin";
import { WEB_CLIENT_ID } from "../util/config";
import auth from "@react-native-firebase/auth";
import { Box,Text, VStack } from "native-base";
import { useNavigation } from "@react-navigation/native";
import Screens from "../util/Screens";


GoogleSignin.configure({
     webClientId: WEB_CLIENT_ID,

});

const LoginScreen = () => {
     const navigation = useNavigation()
     async function onGoogleButtonPress() {
          try {
               // Get the users ID token
               const { idToken } = await GoogleSignin.signIn();

               // Create a Google credential with the token
               const googleCredential = auth.GoogleAuthProvider.credential(idToken);

               // Sign-in the user with the credential
               return auth().signInWithCredential(googleCredential);
          } catch (e) {
               console.log("Sign In error >>>>>>", JSON.stringify(e));

          }

     }

     return (
          <Box
               width="100%"
               height="100%"
               display="flex"
               p={4}
               justifyContent="center"
               alignItems="center"
          >
               <VStack
                    width="100%"
                    height="25%"
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
               >
                    <Text
                         fontSize={22}
                         fontWeight="bold"
                         color="black"
                    >Welcome to Glacier Chat App
                    </Text>
                    <GoogleSigninButton
                         style={{ width: 192, height: 48 }}
                         size={GoogleSigninButton.Size.Wide}
                         color={GoogleSigninButton.Color.Dark}
                         onPress={() => onGoogleButtonPress()
                         .then(() => navigation.navigate(Screens.DASHBOARD_SCREEN))
                         .catch((err) => console.log("Try error", err))}
                         disabled={false}
                    />
               </VStack>

          </Box>
     );
};

export default LoginScreen;

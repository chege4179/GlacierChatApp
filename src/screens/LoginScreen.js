import React from "react";
import { GoogleSignin, GoogleSigninButton } from "@react-native-google-signin/google-signin";
import { WEB_CLIENT_ID } from "../util/config";
import auth from "@react-native-firebase/auth";
import { Box, Button } from "native-base";


GoogleSignin.configure({
     webClientId: WEB_CLIENT_ID,

});

const LoginScreen = () => {
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
          <Box width="100%" height="100%" display="flex" p={4} justifyContent="center" alignItems="center">

               <GoogleSigninButton
                    style={{ width: 192, height: 48 }}
                    size={GoogleSigninButton.Size.Wide}
                    color={GoogleSigninButton.Color.Dark}
                    onPress={() => onGoogleButtonPress()
                    .then(() => console.log("Signed in with Google!"))
                    .catch((err) => console.log("Try error", err))}
                    disabled={false}
               />
          </Box>
     );
};

export default LoginScreen;
import React, { useEffect, useState } from "react";
import { Box, Input,  VStack,FlatList } from "native-base";
import firestore from "@react-native-firebase/firestore";
import UserSearchCard from "../components/UserSearchCard";
import auth from "@react-native-firebase/auth";

const SearchScreen = () => {
     const [users, setUsers] = useState([]);
     const [searchresults, setSearchResults] = useState([]);
     const user = auth().currentUser
     useEffect(() => {
          let isSubscribed = true
          if (isSubscribed){
               firestore()
               .collection("Users")
               .get()
               .then((snapshot) => {
                    const users = snapshot.docs.map((doc) => (doc.data()));
                    setUsers(users);
               });
          }
          return () => {
               isSubscribed = false
          }
     }, []);
     const SearchUser = (text) => {
          setSearchResults(users.filter((user) => user.displayName.toLowerCase().includes(text.toLowerCase())))
          if (text ===""){
               setSearchResults([])
          }
     };
     return (
          <Box width="100%" height="100%" p={2} display="flex" justifyContent="center" alignItems="center">
               <VStack width="100%" height="100%" display="flex" alignItems="center" justifyContent="center">
                    <Input size="2xl" placeholder="Search Users...." onChangeText={SearchUser} />
                    <FlatList
                         py={2}
                         width="100%"
                         data={searchresults.filter((usere) =>usere.email !== user.email )}
                         keyExtractor={(item, index) => index}
                         renderItem={({ item }) => {
                              return (<UserSearchCard user={item} />)
                         }}
                    />
               </VStack>
          </Box>
     );
};

export default SearchScreen;

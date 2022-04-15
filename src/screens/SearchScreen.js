import React, { useEffect, useState } from "react";
import { Box, Input, Text, VStack } from "native-base";
import firestore from "@react-native-firebase/firestore";
import UserSearchCard from "../components/UserSearchCard";

const SearchScreen = () => {
     const [users, setUsers] = useState([]);
     const [searchresults, setSearchResults] = useState([]);
     useEffect(() => {
          firestore()
          .collection("Users")
          .get()
          .then((snapshot) => {
               const users = snapshot.docs.map((doc) => (doc.data()));
               setUsers(users);
          });
     }, []);
     const SearchUser = (text) => {
          setSearchResults(users.filter((user) => user.displayName.toLowerCase().includes(text.toLowerCase())))
          if (text ===""){
               setSearchResults([])
          }
     };
     return (
          <Box width="100%" height="100%" p={2} display="flex" justifyContent="center" alignItems="center">
               <VStack width="100%" height="100%" display="flex" alignItems="center">
                    <Input size="2xl" placeholder="Search Users...." onChangeText={SearchUser} />
                    {
                         searchresults.map((user, index) => {
                              console.log("user", index, user);
                              return (<UserSearchCard key={index} user={user} />);
                         })
                    }

               </VStack>
          </Box>
     );
};

export default SearchScreen;

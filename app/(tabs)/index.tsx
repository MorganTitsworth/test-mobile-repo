import { Image, StyleSheet, Platform } from "react-native";

import { HelloWave } from "@/components/HelloWave";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { db } from "../../firebaseConfig";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { useState, useEffect } from "react";
import { useAuthContext } from "@/providers/authContext";
import { Button, TextInput } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { Link } from "expo-router";
declare interface user {
  firstName: string;
  lastName: string;
  id: string;
}
export default function HomeScreen() {
  const { authState, signOut, createAccountWithEmail, signInWithEmail } =
    useAuthContext();
  const [users, setUsers] = useState<any>([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  async function getPosts() {
    try {
      const querySnapshot = await getDocs(collection(db, "users"));
      const users = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      return users;
    } catch (e) {
      console.error("Error getting posts: ", e);
    }
  }
  useEffect(() => {
    getPosts().then((users) => setUsers(users));
  }, []);
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={
        <Image
          source={require("@/assets/images/partial-react-logo.png")}
          style={styles.reactLogo}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <Link href="../test" style={styles.button}>
          Go to TEST screen
        </Link>
        <ThemedText type="title">Create Account</ThemedText>
        <TextInput style={styles.input} value={email} onChangeText={setEmail} />
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
        />

        <Button
          title="Create Account"
          onPress={() => {
            createAccountWithEmail(email, password);
          }}
        />
        <Button
          title="Log in"
          onPress={() => {
            signInWithEmail(email, password);
          }}
        />
        <Button title="Sign Out" onPress={signOut} />
        {authState.user && (
          <ThemedText type="title">Welcome, {authState.user.email}!</ThemedText>
        )}
        {users.length > 0 && (
          <ThemedView>
            {users.map((user: user) => {
              return (
                <ThemedText type="title" key={user?.id}>
                  {user?.firstName} {user?.lastName}
                </ThemedText>
              );
            })}
          </ThemedView>
        )}
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "column",
    alignItems: "center",
    gap: 8,
    ...Platform.select({
      android: {
        backgroundColor: 'green',
      },
      ios: {
        backgroundColor: 'red',
      },
      default: {
        // other platforms, web for example
        backgroundColor: 'blue',
      },
    }),
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    width: 200,
    color: "black",
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
  button: {
    fontSize: 20,
    textDecorationLine: 'underline',
    color: 'white',
  },
});

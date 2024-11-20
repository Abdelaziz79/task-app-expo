import firebase from "@react-native-firebase/app";
import messaging from "@react-native-firebase/messaging";

const firebaseConfig = {
  appId: "1:60819767353:android:629bbf21fc159d1b108de8",
  projectId: "task-app-4cec8",
  apiKey: "AIzaSyDe433opGzi7RJhoybtbNHZfDKUtyqUmZY",
  storageBucket: "task-app-4cec8.firebasestorage.app",
  messagingSenderId: "60819767353",
};

export function initializeFirebase() {
  try {
    return firebase.app();
  } catch (error) {
    return firebase.initializeApp(firebaseConfig);
  }
}

export async function requestUserPermission() {
  try {
    await messaging().requestPermission();
    return await messaging().getToken();
  } catch (error) {
    console.log("permission rejected");
    return null;
  }
}

export async function onMessageReceived(callback: (message: any) => void) {
  return messaging().onMessage(callback);
}

export async function sendFirebaseNotification(
  token: string,
  title: string,
  body: string
) {
  const response = await fetch("https://fcm.googleapis.com/fcm/send", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization:
        "key=AAAA2Hs_Xtw:APA91bGxZGBXpZM_vhqXILPiM4-k-QU-lZlqwQ0Hs4mKHRASx8EOQF8BfpwXvpTn9UBVLIBBzQhZJ8KyZkEzldJ_2Q5Hs_XtwAPA91bGxZGBXpZM", // Replace with your FCM server key
    },
    body: JSON.stringify({
      to: token,
      notification: {
        title,
        body,
      },
      priority: "high",
    }),
  });
  return response.json();
}

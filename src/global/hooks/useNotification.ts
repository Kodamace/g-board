import { useEffect } from "react";
// @ts-ignore
import notificationSound from "../../../src/assets/notification-sound-7062.mp3";

const useNotification = (
  showNotification: boolean,
  title: string,
  sound?: any,
  icon?: string,
  body?: string
) => {
  const options: any = {
    body,
    icon,
    sound,
  };
  useEffect(() => {
    try {
      if (!("Notification" in window)) {
        alert("This browser does not support desktop notification");
      } else if (Notification.permission === "granted") {
        if (showNotification) {
          new Notification(title, options);
          const audio = new Audio(notificationSound);
          audio.play();
        }
      } else if (Notification.permission !== "denied") {
        // Ask the user for permission
        Notification.requestPermission().then((permission) => {
          // If the user accepts, let's create a notification
          if (permission === "granted") {
          }
        });
      }
    } catch (error: any) {
      console.log(error.message, error);
    }
  }, [showNotification]);
};

export default useNotification;

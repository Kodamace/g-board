import { useToast } from "@chakra-ui/react";
import { useEffect } from "react";

const useNotification = (showNotification: boolean) => {
  const toast = useToast();
  useEffect(() => {
    try {
      if (!("Notification" in window)) {
        alert("This browser does not support desktop notification");
      } else if (Notification.permission === "granted") {
        if (showNotification) {
          new Notification(
            "All balls have been dropped from the first section"
          );
        }
      } else if (Notification.permission !== "denied") {
        // Ask the user for permission
        Notification.requestPermission().then((permission) => {
          // If the user accepts, let's create a notification
          if (permission === "granted") {
            new Notification(
              "Hi there! you will receive notifications like this one."
            );
            // …
          }
        });
      }
    } catch (error) {
      toast({ title: "Whoops something went wrong with notifications!" });
    }
  }, [showNotification]);
};

export default useNotification;

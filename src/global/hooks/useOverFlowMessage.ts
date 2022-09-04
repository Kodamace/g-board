import React, { useEffect, useState } from "react";

const useOverFlowMessage = (percentage: number, isLoading: boolean) => {
  const [overFlowMessage, setOverFlowMessage] = useState("Overflowing!");
  const [isOverFlowing, setIsOverFlowing] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      setOverFlowMessage("Maxed Out!");
    } else {
      setOverFlowMessage("Overflowing!");
    }

    return () => {
      setOverFlowMessage("Overflowing!");
    };
  }, [isLoading]);

  useEffect(() => {
    if (percentage >= 100) {
      setIsOverFlowing(true);
    } else {
      setIsOverFlowing(false);
    }

    return () => {
      setIsOverFlowing(false);
    };
  }, [percentage]);

  return { overFlowMessage, isOverFlowing };
};

export default useOverFlowMessage;

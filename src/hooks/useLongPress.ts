import { useRef, useState } from "react";

export default function useLongPress() {
  const [action, setAction] = useState<string>("");

  const timerRef = useRef<any>();
  const isLongPress = useRef<boolean>(false);

  function startPressTimer() {
    isLongPress.current = false;
    timerRef.current = setTimeout(() => {
      isLongPress.current = true;
      setAction("longpress");
    }, 500);
  }

  // @ts-ignore
  function handleOnClick(e: any) {
    console.log("handleOnClick");
    if (isLongPress.current) {
      console.log("Is long press - not continuing.");
      return;
    }
    // setAction("");
  }

  function handleOnMouseDown() {
    console.log("handleOnMouseDown");
    startPressTimer();
  }

  function handleOnMouseUp() {
    console.log("handleOnMouseUp");
    clearTimeout(timerRef.current);
  }

  function handleOnTouchStart() {
    console.log("handleOnTouchStart");
    startPressTimer();
  }

  function handleOnTouchEnd() {
    if (action === "longpress") return;
    console.log("handleOnTouchEnd");
    clearTimeout(timerRef.current);
  }

  function handleOnCancel() {
    if (action === "longpress") {
      setAction("cancel");
    }
  }

  return {
    action,
    handlers: {
      onClick: handleOnClick,
      onMouseDown: handleOnMouseDown,
      onMouseUp: handleOnMouseUp,
      onTouchStart: handleOnTouchStart,
      onTouchEnd: handleOnTouchEnd,
    },
    // userHandlers: {
    onActionCancel: handleOnCancel,
    // }
  };
}

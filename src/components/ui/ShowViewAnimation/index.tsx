import React, { useEffect, useState } from "react";

function useDelayUnmount(isMounted: boolean, delayTime: number) {
  const [showDiv, setShowDiv] = useState(false);
  useEffect(() => {
    let timeoutId: any;
    if (isMounted && !showDiv) {
      setShowDiv(true);
    } else if (!isMounted && showDiv) {
      timeoutId = setTimeout(() => setShowDiv(false), delayTime); //delay our unmount
    }
    return () => clearTimeout(timeoutId); // cleanup mechanism for effects , the use of setTimeout generate a sideEffect
  }, [isMounted, delayTime, showDiv]);
  return showDiv;
}

interface IProps {
  isMounted: boolean;
  children: React.ReactNode;
}

const ShowViewAnimation: React.FC<IProps> = ({ children, isMounted }) => {
  const showDiv = useDelayUnmount(isMounted, 450);
  const mountedStyle = { animation: "inAnimation 450ms ease-in" };
  const unmountedStyle = {
    animation: "outAnimation 470ms ease-out",
    animationFillMode: "forwards",
  };
  return (
    <div>
      {showDiv && (
        <div style={isMounted ? mountedStyle : unmountedStyle}>{children}</div>
      )}
    </div>
  );
};

export default ShowViewAnimation;

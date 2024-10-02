import { useState, useEffect } from "react";

export default function Timer({ startTime }) {
  const calculateTimeLeft = () => {
    const difference = new Date(startTime) - new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearTimeout(timer);
  });

  const formatTimeLeft = () => {
    const { days, hours, minutes, seconds } = timeLeft;

    return `${days ? `${days}d ` : ""}${hours ? `${hours}h ` : ""}${
      minutes ? `${minutes}m ` : ""
    }${seconds ? `${seconds}s` : ""}`;
  };

  return (
    <>
      {Object.keys(timeLeft).length ? (
        <span>{formatTimeLeft()}</span>
      ) : (
        <span>Time's up!</span>
      )}
    </>
  );
}

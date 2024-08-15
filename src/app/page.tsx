"use client";
import { Dispatch, SetStateAction, useState, useEffect } from "react";

function RedoIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="size-10"
    >
      <path
        fillRule="evenodd"
        d="M4.755 10.059a7.5 7.5 0 0 1 12.548-3.364l1.903 1.903h-3.183a.75.75 0 1 0 0 1.5h4.992a.75.75 0 0 0 .75-.75V4.356a.75.75 0 0 0-1.5 0v3.18l-1.9-1.9A9 9 0 0 0 3.306 9.67a.75.75 0 1 0 1.45.388Zm15.408 3.352a.75.75 0 0 0-.919.53 7.5 7.5 0 0 1-12.548 3.364l-1.902-1.903h3.183a.75.75 0 0 0 0-1.5H2.984a.75.75 0 0 0-.75.75v4.992a.75.75 0 0 0 1.5 0v-3.18l1.9 1.9a9 9 0 0 0 15.059-4.035.75.75 0 0 0-.53-.918Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export default function Home() {
  const [text, setText] = useState("");
  const [submittedText, setSubmittedText] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittedText(text);
    setIsSubmitted(true);
  };

  return (
    <main className="grid min-h-screen flex-col place-items-center">
      {isSubmitted ? (
        <WordDisplay text={submittedText} wordsPerMinute={400} />
      ) : (
        <TextBox text={text} setText={setText} handleSubmit={handleSubmit} />
      )}
    </main>
  );
}

interface TextBoxProps {
  text: string;
  setText: Dispatch<SetStateAction<string>>;
  handleSubmit: (e: React.FormEvent) => void;
}

function TextBox({ text, setText, handleSubmit }: TextBoxProps) {
  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col justify-center items-center space-y-2 w-screen h-screen"
    >
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="p-2 border border-gray-300 text-black w-screen h-screen text-justify text-wrap text-2xl"
      />
      <button
        type="submit"
        className="p-2 bg-blue-500 font-semibold text-xl text-white w-screen"
      >
        Submit
      </button>
    </form>
  );
}

interface WordDisplayProps {
  text: string;
  wordsPerMinute: number;
}

function WordDisplay({ text, wordsPerMinute }: WordDisplayProps) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const words = text.split(" ");

  useEffect(() => {
    // Only start the word display if it's not complete
    if (!isComplete) {
      const interval = setInterval(() => {
        setCurrentWordIndex((prevIndex) => {
          if (prevIndex < words.length - 1) {
            return prevIndex + 1;
          } else {
            clearInterval(interval); // Stop the interval once we reach the end
            setIsComplete(true); // Mark the display as complete
            return prevIndex;
          }
        });
      }, (60 / wordsPerMinute) * 1000);

      // Cleanup interval on component unmount or when restarting
      return () => clearInterval(interval);
    }
  }, [isComplete, words.length, wordsPerMinute]);

  const handleRedo = () => {
    setCurrentWordIndex(0); // Reset the word index to the beginning
    setIsComplete(false); // Set the completion flag to false to restart the display
  };

  return (
    <div className="flex flex-col justify-center items-center w-screen h-screen">
      {!isComplete ? (
        <p className="text-6xl text-center font-semibold">
          {words[currentWordIndex]}
        </p>
      ) : (
        <button
          onClick={handleRedo}
          className="flex flex-col justify-center items-center space-y-2"
        >
          <RedoIcon />
          <span className="text-xl text-blue-500 font-semibold">Redo</span>
        </button>
      )}
    </div>
  );
}

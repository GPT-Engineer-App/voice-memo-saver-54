import React, { useState, useRef } from "react";
import { Container, Button, VStack, Heading, List, ListItem, IconButton } from "@chakra-ui/react";
import { FaMicrophone, FaStop, FaDownload, FaTrash } from "react-icons/fa";

const Index = () => {
  // Using state hooks to manage the list of recordings and recording state
  const [recordings, setRecordings] = useState([]);
  const [isRecording, setIsRecording] = useState(false);

  // useRef to reference the audio element and mediaRecorder instance
  const mediaRecorderRef = useRef(null);
  const audioRef = useRef(null);

  // Function to handle starting the recording
  const startRecording = () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      // Request the browser for the media stream
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
          mediaRecorderRef.current = new MediaRecorder(stream);
          mediaRecorderRef.current.ondataavailable = handleDataAvailable;
          mediaRecorderRef.current.start();
          setIsRecording(true);
        })
        .catch(console.error);
    }
  };

  // Function to handle data available event after recording
  const handleDataAvailable = (event) => {
    if (event.data.size > 0) {
      setRecordings((prevRecordings) => [...prevRecordings, URL.createObjectURL(event.data)]);
    }
  };

  // Function to handle stopping the recording
  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    setIsRecording(false);
  };

  // Function to download a recording
  const downloadRecording = (src) => {
    const blob = new Blob([src], { type: "audio/webm" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.style.display = "none";
    a.href = url;
    // Create a timestamp for the filename
    const date = new Date();
    a.download = `recording-${date.toISOString().split("T")[0]}-${date.getTime()}.webm`;
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  // Function to delete a recording
  const deleteRecording = (src) => {
    setRecordings((prevRecordings) => prevRecordings.filter((recording) => recording !== src));
    URL.revokeObjectURL(src); // Clean up memory by revoking the object URL
  };

  return (
    <Container centerContent>
      <VStack spacing={4}>
        <Heading>Voice Memo App</Heading>
        <Button leftIcon={isRecording ? <FaStop /> : <FaMicrophone />} colorScheme="teal" onClick={isRecording ? stopRecording : startRecording}>
          {isRecording ? "Stop Recording" : "Start Recording"}
        </Button>
        <List>
          {recordings.map((src, index) => (
            <ListItem key={src} display="flex" alignItems="center" justifyContent="space-between">
              <audio src={src} controls />
              <IconButton aria-label="Download recording" icon={<FaDownload />} onClick={() => downloadRecording(src)} />
              <IconButton aria-label="Delete recording" icon={<FaTrash />} onClick={() => deleteRecording(src)} />
            </ListItem>
          ))}
        </List>
      </VStack>
    </Container>
  );
};

export default Index;

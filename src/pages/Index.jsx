import React, { useState, useRef } from "react";
import { Container, Button, VStack, Heading, List, ListItem, IconButton, Text } from "@chakra-ui/react";
import { FaMicrophone, FaStop, FaDownload, FaTrash } from "react-icons/fa";

const Index = () => {
  const [recordings, setRecordings] = useState(() => {
    const savedRecordings = localStorage.getItem("recordings");
    return savedRecordings ? JSON.parse(savedRecordings) : [];
  });
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioRef = useRef(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.addEventListener("dataavailable", handleDataAvailable);
      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Could not start recording", err);
    }
  };

  const handleDataAvailable = (event) => {
    if (event.data.size > 0) {
      const newRecordingUrl = URL.createObjectURL(event.data);
      const recordingName = prompt("Please enter a name for your recording:", `Recording ${new Date().toISOString().split("T")[0]}`);
      setRecordings((prevRecordings) => {
        const updatedRecordings = [...prevRecordings, { url: newRecordingUrl, name: recordingName || `Recording ${new Date().toISOString()}` }];
        localStorage.setItem("recordings", JSON.stringify(updatedRecordings));
        return updatedRecordings;
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
      mediaRecorderRef.current.removeEventListener("dataavailable", handleDataAvailable);
      setIsRecording(false);
    }
  };

  const downloadRecording = (recording) => {
    const blob = new Blob([recording.url], { type: "audio/mp3" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.style.display = "none";
    a.href = url;
    a.download = recording.name ? `${recording.name}.mp3` : `recording-${new Date().toISOString().split("T")[0]}.mp3`;
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const deleteRecording = (recordingToDelete) => {
    setRecordings((prevRecordings) => {
      const updatedRecordings = prevRecordings.filter((recording) => recording.url !== recordingToDelete.url);
      localStorage.setItem("recordings", JSON.stringify(updatedRecordings));
      return updatedRecordings;
    });
    URL.revokeObjectURL(recordingToDelete.url);
  };

  return (
    <Container centerContent>
      <VStack spacing={4}>
        <Heading>Voice Memo App</Heading>
        <Button leftIcon={isRecording ? <FaStop /> : <FaMicrophone />} colorScheme="teal" onClick={isRecording ? stopRecording : startRecording}>
          {isRecording ? "Stop Recording" : "Start Recording"}
        </Button>
        <List>
          {recordings.map((recording, index) => (
            <ListItem key={recording.url} display="flex" alignItems="center" justifyContent="space-between">
              <audio src={recording.url} controls />
              <Text>{recording.name}</Text>
              <IconButton aria-label="Download recording" icon={<FaDownload />} onClick={() => downloadRecording(recording)} />
              <IconButton aria-label="Delete recording" icon={<FaTrash />} onClick={() => deleteRecording(recording)} />
            </ListItem>
          ))}
        </List>
      </VStack>
    </Container>
  );
};

export default Index;

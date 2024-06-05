import React from "react";
import { Box, Flex, IconButton, Heading, Spacer } from "@chakra-ui/react";
import { FaBars, FaUserCircle } from "react-icons/fa";

const Header = () => {
  return (
    <Box bg="purple.500" color="white" p={4}>
      <Flex alignItems="center">
        <IconButton icon={<FaBars />} aria-label="Menu" variant="ghost" color="white" mr={4} />
        <Heading as="h1" size="lg" flex="1" textAlign="center">
          Closer Together
        </Heading>
        <Spacer />
        <IconButton icon={<FaUserCircle />} aria-label="Profile" variant="ghost" color="white" />
      </Flex>
    </Box>
  );
};

export default Header;

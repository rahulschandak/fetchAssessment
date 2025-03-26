import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  Text,
  useToast,
  Container,
} from "@chakra-ui/react";

const LoginPage = () => {
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;
  const toast = useToast();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch(`${apiUrl}/auth/login`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Login failed. Please check your credentials.");
      }

      toast({
        title: "Login Successful!",
        description: "Redirecting to homepage.",
        status: "success",
        duration: 2000,
        isClosable: true,
      });

      navigate("/search");
    } catch (error) {
      setError(error.message);
      toast({
        title: "Login Failed",
        description: error.message,
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }
  };

  return (
    <Box
      bg="gray.50"
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      py={10}
    >
      <Container maxW="sm" p={6} bg="white" borderRadius="lg" shadow="lg">
        <Heading as="h2" size="lg" mb={6} textAlign="center">
        <Text>Welcome to FetchBuddy {"\u{1F415}"}</Text>
        </Heading>

        <form onSubmit={handleSubmit}>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel fontWeight="bold">Username</FormLabel>
              <Input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                focusBorderColor="green.400"
                placeholder="Rahul"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel fontWeight="bold">Email</FormLabel>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                focusBorderColor="green.400"
                placeholder="rahul@xyz.com"
              />
            </FormControl>

            {error && (
              <Text color="red.500" textAlign="center">
                {error}
              </Text>
            )}

            <Button
              colorScheme="green"
              type="submit"
              width="full"
              mt={4}
              isLoading={false}
            >
              Login
            </Button>
          </VStack>
        </form>

        <Text mt={4} fontSize="sm" color="gray.500" textAlign="center">
          Created by Rahul Chandak
        </Text>
      </Container>
    </Box>
  );
};

export default LoginPage;

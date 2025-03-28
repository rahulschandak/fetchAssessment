import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Flex, Link, Text, Spacer } from "@chakra-ui/react";

const NavBar = () => {
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;
  
  const handleClick = async (e) => {
    navigate("/search");
  }

  const handleLogout = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch(`${apiUrl}/auth/logout`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) throw new Error("Logout failed.");

      console.log("Logout successful");
      navigate("/");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <Flex as="nav" bg="green.500" color="white" p={4} align="center">
      <Text fontSize="xl" fontWeight="bold" onClick={handleClick}>
        FetchBuddy
      </Text>
      <Spacer />
      <Link
        as="button"
        fontWeight="bold"
        onClick={handleLogout}
        _hover={{ textDecoration: "none", color: "gray.200" }}
      >
        Logout
      </Link>
    </Flex>
  );
};

export default NavBar;

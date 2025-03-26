import React, { useState, useEffect } from "react";
import {
  Box,
  Text,
  Button,
  Container,
  Select,
  Image,
  HStack,
  SimpleGrid,
  Input,
  Grid,
  GridItem,
  Card,
  CardBody,
  Heading,
  Divider,
  IconButton,
  useDisclosure
} from "@chakra-ui/react";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";

import DogCard from "../components/DogCard";
import NavBar from "../components/NavBar";
import MatchedDogModal from "../components/MatchedDogModal";

const HomePage = () => {
  const [error, setError] = useState("");
  const [breeds, setBreeds] = useState([]);
  const [dogs, setDogs] = useState([]);
  const [selectedBreed, setSelectedBreed] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [ageMin, setAgeMin] = useState("");
  const [ageMax, setAgeMax] = useState("");
  const [sortField, setSortField] = useState("breed");
  const [sortOrder, setSortOrder] = useState("asc");
  const [nextPage, setNextPage] = useState(null);
  const [prevPage, setPrevPage] = useState(null);
  const [match, setMatch] = useState();
  const [favorites, setFavorites] = useState([]);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetch(`${apiUrl}/dogs/breeds`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setBreeds(data);
        fetchDogs();
      })
      .catch((err) => console.error("Error fetching breeds:", err));
  }, []);

  const fetchDogs = async (query = "") => {
    try {
      const searchResponse = await fetch(
        `${apiUrl}/dogs/search?sort=${sortField}:${sortOrder}&size=10${query}`,
        { credentials: "include" }
      );
      const searchData = await searchResponse.json();
      const resultIds = searchData.resultIds;

      if (resultIds.length === 0) {
        setDogs([]);
      } else {
        const dogDetails = await fetch(`${apiUrl}/dogs`, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(resultIds),
        }).then((res) => res.json());

        setDogs(dogDetails);
        setNextPage(searchData.next);
        setPrevPage(searchData.prev);
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const handleSearch = () => {
    let query = "";
    if (selectedBreed) query += `&breeds=${selectedBreed}`;
    if (zipCode) query += `&zipCodes=${zipCode}`;
    if (ageMin) query += `&ageMin=${ageMin}`;
    if (ageMax) query += `&ageMax=${ageMax}`;

    fetchDogs(query);
  };

  const handlePagination = (url) => {
    if (!url) return;
    fetchDogs(url);
  };

  const handleFavorite = (dogId) => {
    if (favorites.includes(dogId)) {
      setFavorites(favorites.filter((id) => id !== dogId));
    } else {
      setFavorites([...favorites, dogId]);
    }
  };

  const generateMatch = async () => {
    if (favorites.length === 0) {
      setError("Please select at least one favorite dog.");
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/dogs/match`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(favorites),
      });

      if (!response.ok) throw new Error("Match generation failed.");

      const matchData = await response.json();

      const matchedDogResponse = await fetch(`${apiUrl}/dogs`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify([matchData.match]),
      });

      const matchedDogDetails = await matchedDogResponse.json();

      setMatch(matchedDogDetails[0])
      onOpen();
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <Box bg="gray.50" minH="100vh">
      <NavBar />

      <Container maxW="8xl" py={8}>
        <Box bg="white" p={6} borderRadius="lg" shadow="md">
          <Heading size="lg" mb={4} textAlign="center">
            Search for Your New Best Friend 🐶
          </Heading>
          <Grid templateColumns={{ base: "1fr", md: "repeat(6, 1fr)" }} gap={4}>
            <GridItem colSpan={{ base: 2, md: 2 }}>
              <Select
                placeholder="Filter by Breed"
                onChange={(e) => setSelectedBreed(e.target.value)}
                w="full"
              >
                {breeds.map((breed) => (
                  <option key={breed} value={breed}>
                    {breed}
                  </option>
                ))}
              </Select>
            </GridItem>

            <GridItem colSpan={{ base: 2, md: 2 }}>
              <Input
                placeholder="Zip Code"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                w="full"
              />
            </GridItem>

            <GridItem colSpan={{ base: 2, md: 1 }}>
              <Input
                placeholder="Min Age"
                type="number"
                value={ageMin}
                onChange={(e) => setAgeMin(e.target.value)}
                w="full"
              />
            </GridItem>

            <GridItem colSpan={{ base: 2, md: 1 }}>
              <Input
                placeholder="Max Age"
                type="number"
                value={ageMax}
                onChange={(e) => setAgeMax(e.target.value)}
                w="full"
              />
            </GridItem>

            <GridItem colSpan={{ base: 2, md: 1 }}>
              <Select
                value={sortField}
                onChange={(e) => setSortField(e.target.value)}
                w="full"
              >
                <option value="breed">Sort by Breed</option>
                <option value="name">Sort by Name</option>
                <option value="age">Sort by Age</option>
              </Select>
            </GridItem>

            <GridItem colSpan={{ base: 2, md: 1 }}>
              <Select
                value={sortOrder}
                onChange={(e) => {
                  setSortOrder(e.target.value);
                }}
                w="full"
              >
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </Select>
            </GridItem>

            <GridItem colSpan={{ base: 2, md: 2 }}>
              <Button colorScheme="green" w="full" onClick={handleSearch}>
                Search
              </Button>
            </GridItem>

            <GridItem colSpan={{ base: 2, md: 2 }}>
              <Button colorScheme="green" w="full" onClick={generateMatch}>
                Generate Match
              </Button>
            </GridItem>
          </Grid>
        </Box>

        {dogs.length > 0 ? (
          <SimpleGrid
            columns={{ base: 1, sm: 2, md: 2, lg: 4 }}
            spacing={6}
            mt={8}
          >
            {dogs.map((dog) => (
              <Card shadow="lg" borderRadius="lg">
                <Image
                  src={dog.img}
                  alt={dog.name}
                  borderRadius="lg"
                  h="300px"
                />
                <CardBody>
                  <Heading size="md">{dog.name}</Heading>
                  <Text>Breed: {dog.breed}</Text>
                  <Text>Age: {dog.age} years</Text>
                  <Text>Zip Code: {dog.zip_code}</Text>
                </CardBody>
                <Divider />

                {/* Heart Icon Button */}
                <IconButton
                  icon={favorites.includes(dog.id) ? <AiFillHeart /> : <AiOutlineHeart />}
                  onClick={() => handleFavorite(dog.id)}
                  aria-label="Add to favorites"
                  size="md"
                  colorScheme="green"
                  variant="outline"
                  position="absolute"
                  bottom="4"
                  right="4"
                />
              </Card>
            ))}
          </SimpleGrid>
        ) : (
          <Text
            textAlign="center"
            padding="20px"
            color="gray.500"
            fontSize="lg"
            fontStyle="italic"
          >
            No results found
          </Text>
        )}

        <HStack spacing={4} justify="center" mt={6}>
          <Button
            colorScheme="green"
            onClick={() => handlePagination(prevPage)}
            isDisabled={!prevPage}
          >
            Previous
          </Button>
          <Button
            colorScheme="green"
            onClick={() => handlePagination(nextPage)}
            isDisabled={!nextPage}
          >
            Next
          </Button>
        </HStack>

        <MatchedDogModal isOpen={isOpen} onClose={onClose} match={match} />

      </Container>
    </Box>
  );
};

export default HomePage;

import React from "react";
import {
  Card,
  CardBody,
  Image,
  Heading,
  Text,
  Divider,
  IconButton
} from "@chakra-ui/react";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";


const DogCard = ({ dog }) => {

  const [favorites, setFavorites] = useState([]); // Array to store favorite dog IDs
  const apiUrl = import.meta.env.VITE_API_URL;

  const handleFavorite = (dogId) => {
    if (favorites.includes(dogId)) {
      setFavorites(favorites.filter((id) => id !== dogId)); // Remove from favorites
    } else {
      setFavorites([...favorites, dogId]); // Add to favorites
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
      const matchId = matchData.match;
      fetchDogDetails(matchId); // Fetch the matched dog details
    } catch (error) {
      setError(error.message);
    }
  };
  
  const fetchDogDetails = async (dogId) => {
    try {
      const dogResponse = await fetch(`${apiUrl}/dogs/${dogId}`, {
        credentials: "include",
      });
      const dogData = await dogResponse.json();
      // Handle the matched dog data (display it, etc.)
      console.log("Matched Dog:", dogData);
      setMatch(dogData); // You can store the matched dog in state for display
    } catch (error) {
      setError("Error fetching match details.");
    }
  };
  

  return (
    <Card shadow="lg" borderRadius="lg">
      <Image src={dog.img} alt={dog.name} borderRadius="lg" h="300px" />
      <CardBody>
        <Heading size="md">{dog.name}</Heading>
        <Text>Breed: {dog.breed}</Text>
        <Text>Age: {dog.age} years</Text>
        <Text>Zip Code: {dog.zip_code}</Text>
      </CardBody>
      <Divider />

      {/* Heart Icon Button */}
      <IconButton
        icon={dog.isFavorite ? <AiFillHeart /> : <AiOutlineHeart />}
        onClick={() => handleFavorite(dog.id)} // Assuming you have a function to handle favorites
        aria-label="Add to favorites"
        size="md"
        colorScheme="green"
        variant="outline"
        position="absolute"
        bottom="4"
        right="4"
      />
    </Card>
  );
};

export default DogCard;

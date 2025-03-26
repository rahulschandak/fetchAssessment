import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Image,
  Card,
  CardBody,
  Heading,
  Text,
} from "@chakra-ui/react";

const MatchedDogModal = ({ isOpen, onClose, match }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Your Matched Dog! 🐶</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {match ? (
            <Card shadow="lg">
              <Image src={match.img} alt={match.name} borderRadius="lg" />
              <CardBody>
                <Heading size="md">{match.name}</Heading>
                <Text>Breed: {match.breed}</Text>
                <Text>Age: {match.age} years</Text>
              </CardBody>
            </Card>
          ) : (
            <Text>No match found.</Text>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default MatchedDogModal;

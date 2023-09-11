import { Response } from "express";

// Function to check if an object is null or has a length of 0
export function checkAndReturnIfEmpty<T>(
  object: T | null | undefined,
  response: Response,
  customMessage: string
) {
  if (!object) {
    return response.status(404).json({ message: customMessage });
  }
  return false; // Indicates that the object is not empty
}

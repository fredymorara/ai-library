import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

// Defines the allowed file types for ingestion
const ALLOWED_FILE_TYPES = new Set([
  'csv',
  'pdf'
  // Add other file types like 'docx' or 'txt' here if supported by your processor
]);

/**
 * Checks if a given file extension is allowed for ingestion.
 * @param {string} fileExtension - The file extension (e.g., 'pdf', 'csv').
 * @returns {boolean} True if the file type is allowed, false otherwise.
 */
export function isAllowedFileType(fileExtension) {
  if (typeof fileExtension !== 'string') return false;
  return ALLOWED_FILE_TYPES.has(fileExtension.toLowerCase());
}

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
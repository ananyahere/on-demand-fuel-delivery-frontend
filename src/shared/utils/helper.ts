import { v4 as uuidv4 } from 'uuid';

/**
 * Formats the given date string to the format "MMM dd, yyyy".
 * 
 * @param {string} dateString - The date string to format.
 * @returns {string} - The formatted date string.
 */
export function formatDate(dateString: string): string {
  let date = new Date();
  if (dateString) date = new Date(dateString);
  const monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  const monthIndex = date.getMonth();
  const year = date.getFullYear();
  const day = date.getDate();
  const formattedDate = `${monthNames[monthIndex]} ${day}, ${year}`;
  return formattedDate;
}

/**
 * Generates a UUID (Universally Unique Identifier) using the v4 algorithm.
 * 
 * @returns {string} - The generated UUID in string format.
 */
export function generateUUID(): string {
  return uuidv4();
}

/**
 * Parses the given date string to a Date object.
 * 
 * @param {string} dateString - The date string in a format that can be parsed by Date.parse().
 * @returns {Date} - A Date object representing the parsed date string.
 * 
 * @throws {Error} - If the given date string cannot be parsed by Date.parse().
 */
export function parseDateFromString(dateString: string): Date {
  const timestamp = Date.parse(dateString);
  if (isNaN(timestamp)) {
    throw new Error('Invalid date string');
  }
  return new Date(timestamp);
}

/**
 * Returns the city code for the given city name.
 * 
 * @param {string} city - The name of the city for which the code is to be returned.
 * @returns {string} - The code representing the given city name, or 'hyd' if the given city is not recognized.
 */
export function getCityCode(city: string): string {
  switch(city){
    case 'Hyderabad':
      return 'hyd';
    case 'Bangalore':
      return 'bang';
    case 'Bhubaneswar':
      return 'bhu';
    default:
      return 'hyd';
  }
}

/**
 * Generates a date-time string in ISO format from the given date and time inputs.
 * 
 * @param {string} dateInput - The date input in a format that can be parsed by the Date constructor.
 * @param {string} timeInput - The time input in 'hh:mm' format.
 * @returns {string} - The generated date-time string in ISO format (e.g. "2019-10-04T09:54:10.000Z").
 */
export function generateDateTimeStamp(dateInput: string, timeInput: string): string {
  const date = new Date(dateInput);
  const timeParts = timeInput.split(':');
  date.setHours(parseInt(timeParts[0]));
  date.setMinutes(parseInt(timeParts[1]));
  date.setSeconds(0);

  const timestamp = date.getTime();
  return new Date(timestamp).toISOString();
}

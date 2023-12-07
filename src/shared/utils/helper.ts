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
 * Generates a UUID (Universally Unique Identifier).
 * 
 * @returns {string} - The generated UUID in string format.
 */
export function generateUUID(): string {
  const firstPart = (Math.random() * 46656) | 0;
  const secondPart = (Math.random() * 46656) | 0;
  const firstPartStr = ("000" + firstPart.toString(36)).slice(-3);
  const secondPartStr = ("000" + secondPart.toString(36)).slice(-3);
  return firstPartStr + secondPartStr;
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

export function generateShortUUID(): string {
  const firstPart = (Math.random() * 46656) | 0;
  const firstPartStr = ("000" + firstPart.toString(36)).slice(-3);
  return firstPartStr;
}

export function convertFuelUnit(quantity: number, fuelType: string, inputUnit: string): number {
  console.log("fuelType", fuelType)
  let conversionFactor: number = 1; // default is no conversion needed

  if (inputUnit.toLowerCase() === 'gallons') {
    conversionFactor = 3.78541; // 1 gallon = 3.78541 liters
  } else if (inputUnit.toLowerCase() === 'kilograms') {
    // conversion factor depends on fuel type
    switch (fuelType.toLowerCase()) {
      case 'cng':
        conversionFactor = 0.26; // 1 kg of CNG = 0.26 liters
        break;
      case 'diesel':
        conversionFactor = 0.83502; // 1 kg of diesel = 0.83502 liters
        break;
      case 'petrol':
        console.log("here petrol")
        conversionFactor = 0.7551; // 1 kg of petrol = 0.7551 liters
        break;
      default:
        throw new Error('Invalid fuel type');
    }
  } else {
    throw new Error('Invalid input unit type');
  }

  return Math.ceil(quantity * conversionFactor);
}

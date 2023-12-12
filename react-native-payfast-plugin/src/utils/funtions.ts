import { stringMd5 } from "react-native-quick-md5";

/**
 * @description This function removes all null, undefined, empty and false values from a map
 * @param map Map to be cleaned
 * @returns A string of the cleaned map and a new map with the cleaned values
 */
const clearNullValues = (map: Map<string, string | number>, passPhrase?: string): Map<string, string | number> => {
    let result = "";
    const newMap = new Map<string, string | number>();
    map.forEach((value: string | number, key) => {
        if (value !== null && value !== "" && value !== undefined && value) {
            result += `${key}=${encodeURIComponent(value.toString().trim()).replace(/%20/g, "+")}&`;
            newMap.set(key, value);
        }
    })

    result = result.slice(0, -1); // remove the last &

    if (passPhrase && passPhrase.length > 0) {
        result += `&passphrase=${encodeURIComponent(passPhrase.trim()).replace(/%20/g, "+")}`;
    }

    newMap.set("signature", stringMd5(result));
    return newMap;
};

const clearNullValuesFunc = (data: { [key: string]: any }): { [key: string]: any } => {
    const ordered_data: { [key: string]: any } = {};

    Object.keys(data).sort().forEach(value => {
        if (value !== null && value !== "" && value !== undefined && value) {
            ordered_data[value] = data[value];
        }
    });

    return ordered_data;
};

const generateAPISignature = (data: Record<string, any>, passPhrase: string | null = null): string => {
    // Arrange the array by key alphabetically for API calls
    const ordered_data: Record<string, any> = {};
    Object.keys(data).sort().forEach(key => {
        ordered_data[key] = data[key];
    });
    data = ordered_data;

    // Create the get string
    let getString = '';
    for (const key in data) {
        getString += `${key}=${encodeURIComponent(data[key]).replace(/%20/g, '+')}&`;
    }

    // Remove the last '&'
    getString = getString.substring(0, getString.length - 1);
    if (passPhrase !== null) {
        getString += `&passphrase=${encodeURIComponent(passPhrase.trim()).replace(/%20/g, "+")}`;
    }

    // Hash the data and create the signature
    return stringMd5(getString).toLowerCase();
};

function generateTimestamp(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = `${(now.getMonth() + 1)}`.padStart(2, '0');
    const day = `${now.getDate()}`.padStart(2, '0');
    const hours = `${now.getHours()}`.padStart(2, '0');
    const minutes = `${now.getMinutes()}`.padStart(2, '0');
    const seconds = `${now.getSeconds()}`.padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
}

export { clearNullValues, generateAPISignature, clearNullValuesFunc, generateTimestamp }
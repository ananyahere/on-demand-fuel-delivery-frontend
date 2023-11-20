import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }

  // Store an item in the localStorage with the specified key and value
  setItem(key: string, value: any): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  // Retrieve an item from the localStorage with the specified key
  getItem<T>(key: string): T {
    const storedValue = localStorage.getItem(key);
    if (storedValue) {
      return JSON.parse(storedValue);
    }
    return null;
  }

  // Remove an item with the specified key from the localStorage
  removeItem(key: string): void {
    localStorage.removeItem(key);
  }

  // Remove all items from the localStorage
  clear(): void {
    localStorage.clear();
  }
}
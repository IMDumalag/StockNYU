// GlobalVariable.jsx

class GlobalVariable {
  constructor() {
    this.listeners = [];
    this.userData = this.loadUserData(); // Load from localStorage when initialized
    this.currentItem = {}; // Initialize current item
  }

  // Methods for managing user data
  setUserData(userData) {
    console.log('Setting User Data:', userData); // Debugging line
    this.userData = userData;
    this.saveUserData(); // Save to localStorage whenever the data is updated
    this.notifyListeners();
  }

  getUserData() {
    return this.userData;
  }

  // Load user data from localStorage
  loadUserData() {
    const data = localStorage.getItem('userData');
    return data ? JSON.parse(data) : {};  // Return parsed data or an empty object if not found
  }

  // Save user data to localStorage
  saveUserData() {
    localStorage.setItem('userData', JSON.stringify(this.userData));
  }

  subscribe(listener) {
    this.listeners.push(listener);
  }

  unsubscribe(listener) {
    this.listeners = this.listeners.filter(l => l !== listener);
  }

  notifyListeners() {
    this.listeners.forEach(listener => listener());
  }

  // Methods for managing current item
  setCurrentItem(item) {
    this.currentItem = item;
    this.notifyListeners();
  }

  getCurrentItem() {
    return this.currentItem;
  }
}

const globalVariable = new GlobalVariable();
export default globalVariable;
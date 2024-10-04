class GlobalVariable {
  constructor() {
    this.listeners = [];
    this.userData = {};  // Object to store user data
  }

  
  // Methods for managing user data
  setUserData(userData) {
    console.log('Setting User Data:', userData); // Debugging line
    this.userData = userData;
    this.notifyListeners();
  }

  getUserData() {
    return this.userData;
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
}

const globalVariable = new GlobalVariable();
export default globalVariable;

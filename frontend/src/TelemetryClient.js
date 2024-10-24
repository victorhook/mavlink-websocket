class TelemetryClient {
    constructor(url, onDataReceived) {
      this.url = url;
      this.onDataReceived = onDataReceived; // Callback function for data handling
      this.data = {}; // Stores current telemetry data
      this.history = []; // Stores telemetry data history
      this.connect();
    }
  
    connect() {
      this.socket = new WebSocket(this.url);
  
      // On WebSocket connection established
      this.socket.onopen = () => {
        console.log('Connected to WebSocket server');
      };
  
      // Handle incoming telemetry data
      this.socket.onmessage = (event) => {
        try {
          const newData = JSON.parse(event.data); // Parse incoming telemetry data (JSON)
          if (Object.keys(newData).length === 0 && newData.constructor === Object) {
            return;
          }

          this.data = { ...newData }; // Update the current data object
  
          if (this.onDataReceived) {
            this.history = [...this.history, { ...newData }].slice(-100); // Keep only the latest 100 values
            this.onDataReceived(newData);
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };
  
      // Handle WebSocket connection close
      this.socket.onclose = () => {
        console.log('WebSocket connection closed');
      };
  
      // Handle WebSocket errors
      this.socket.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
    }
  
    // Optional: Method to close the connection
    close() {
      if (this.socket) {
        this.socket.close();
      }
    }
  }


export default TelemetryClient
  

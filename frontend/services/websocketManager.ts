import { getWebSocketURL } from "../config";

interface WebSocketMessage {
  type: string;
  data: any;
}

type MessageListener = (message: WebSocketMessage) => void;
type ConnectionStateListener = (isConnected: boolean) => void;

class WebSocketManager {
  private ws: WebSocket | null = null;
  private messageListeners: Set<MessageListener> = new Set();
  private connectionStateListeners: Set<ConnectionStateListener> = new Set();
  private _isConnected: boolean = false;

  get isConnected(): boolean {
    return this._isConnected;
  }

  connect(gameCode: string, username: string): void {
    // Disconnect existing connection if any
    if (this.ws) {
      this.ws.close();
      this.ws = null;
      this._isConnected = false;
      this.notifyConnectionState(false);
    }

    const url = getWebSocketURL(`/games/${gameCode}/join?username=${encodeURIComponent(username)}`);
    console.log("Connecting to WebSocket:", url);
    
    const ws = new WebSocket(url);

    ws.onopen = () => {
      console.log("WebSocket connected");
      this._isConnected = true;
      this.ws = ws;
      this.notifyConnectionState(true);
    };

    ws.onmessage = (event) => {
      try {
        const message: WebSocketMessage = JSON.parse(event.data);
        // Notify all listeners
        this.messageListeners.forEach((callback) => {
          try {
            callback(message);
          } catch (error) {
            console.error("Error in message listener:", error);
          }
        });
      } catch (error) {
        console.error("Error parsing WebSocket message:", error, event.data);
      }
    };

    ws.onclose = () => {
      console.log("WebSocket disconnected");
      this._isConnected = false;
      if (this.ws === ws) {
        this.ws = null;
      }
      this.notifyConnectionState(false);
    };

    ws.onerror = (event) => {
      console.error("WebSocket error:", event);
      this._isConnected = false;
      this.notifyConnectionState(false);
    };

    this.ws = ws;
  }

  disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
      this._isConnected = false;
      this.notifyConnectionState(false);
    }
  }

  sendMessage(message: any): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      console.warn("WebSocket is not connected. Cannot send message.");
    }
  }

  addMessageListener(callback: MessageListener): () => void {
    this.messageListeners.add(callback);
    // Return cleanup function
    return () => {
      this.messageListeners.delete(callback);
    };
  }

  addConnectionStateListener(callback: ConnectionStateListener): () => void {
    this.connectionStateListeners.add(callback);
    // Immediately notify current state
    callback(this._isConnected);
    // Return cleanup function
    return () => {
      this.connectionStateListeners.delete(callback);
    };
  }

  private notifyConnectionState(isConnected: boolean): void {
    this.connectionStateListeners.forEach((callback) => {
      try {
        callback(isConnected);
      } catch (error) {
        console.error("Error in connection state listener:", error);
      }
    });
  }

  getWebSocket(): WebSocket | null {
    return this.ws;
  }
}

// Export singleton instance
export const websocketManager = new WebSocketManager();


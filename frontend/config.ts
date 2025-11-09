// Server configuration
// IMPORTANT: Since your Go server runs in WSL2, you MUST set up port forwarding first!
// 
// STEP 1: Set up port forwarding (run in PowerShell as Administrator):
//   netsh interface portproxy add v4tov4 listenport=4000 listenaddress=0.0.0.0 connectport=4000 connectaddress=172.21.184.99
//   New-NetFirewallRule -DisplayName "WSL Go Server" -Direction Inbound -LocalPort 4000 -Protocol TCP -Action Allow
//
// STEP 2: Use your Windows host's LAN IP address (not the WSL IP)
// Your Windows host IPs: 192.168.56.1, 10.84.90.175, 172.21.176.1
// Your WSL IP: 172.21.184.99 (eth0) - DON'T use this from your phone!
// 
// Use the Windows host IP that matches your LAN connection (likely 10.84.90.175)
export const SERVER_URL = "10.84.90.175:4000";

// Helper function to get the WebSocket URL
export const getWebSocketURL = (path: string) => {
  // Ensure path starts with /
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const url = `ws://${SERVER_URL}${normalizedPath}`;
  console.log("WebSocket URL:", url);
  return url;
};

// Helper function to get the HTTP URL
export const getHTTPURL = (path: string) => {
  return `http://${SERVER_URL}${path}`;
};


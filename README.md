# Credit Guard App

Credit Guard is a React Native mobile application designed to help wholesalers and distributors manage credit, track transactions, and flag risky retailers. Built with Expo and NativeWind, it provides a seamless and modern user experience.

## Features

- **Retailer Registration**: Onboard new retailers with details, photo capture (GPS tagged), and explicit consent.
- **Credit Management**: Issue goods on credit and record repayments.
- **Transaction History**: View detailed transaction logs for each retailer.
- **Risk Management**: Flag retailers for non-payment or abusive behavior.
- **Search**: Quickly find retailers by name, mobile number, or shop name.
- **Secure Auth**: OTP-based authentication with secure token storage.

## Tech Stack

- **Framework**: React Native (Expo SDK 52)
- **Routing**: Expo Router
- **Styling**: NativeWind (Tailwind CSS)
- **State Management**: React Context API
- **Storage**: AsyncStorage
- **Networking**: Axios
- **Camera & Location**: Expo Camera & Expo Location

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Expo Go app on your mobile device (iOS/Android) OR Android Studio/Xcode for emulators.

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd credit-guard-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment**
   - Ensure the backend server is running (default: `http://localhost:5001`).
   - Update `services/api.ts` if testing on a physical device (replace `localhost` with your machine's IP address).

## Running the App

1. **Start the development server**
   ```bash
   npx expo start
   ```

2. **Run on Device/Emulator**
   - **iOS Simulator**: Press `i` in the terminal.
   - **Android Emulator**: Press `a` in the terminal.
   - **Physical Device**: Scan the QR code using the Expo Go app.

## Project Structure

```
credit-guard-app/
├── app/                 # Expo Router pages and layouts
│   ├── (tabs)/          # Main tab navigation
│   ├── retailer/        # Retailer related screens
│   ├── transaction/     # Transaction related screens
│   └── ...
├── components/          # Reusable UI components
├── context/             # React Context (Registration, Auth)
├── services/            # API integration
├── assets/              # Images and fonts
└── ...
```

## Troubleshooting

- **Camera Permissions**: If the camera doesn't open, ensure you've granted permissions in the app settings.
- **Network Errors**: If API calls fail, check if the backend is running and reachable. For physical devices, ensure the phone and computer are on the same Wi-Fi network.

## License

[MIT](LICENSE)

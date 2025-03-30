# Basketball Scorekeeper App

A modern, feature-rich basketball scorekeeping app built with React Native and Expo.

## Features

- Real-time scoreboard with team names, score, and game clock
- Detailed box score tracking for each player
  - Points, rebounds, assists, steals, blocks, fouls
  - Field goal, three-point, and free throw percentages
- Game log with timestamped events
- Interactive scoring controls
- Player substitution management
- Game clock editor
- Modern, dark-themed UI

## Prerequisites

- Node.js (v14 or newer)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (for Mac users) or Android Studio (for Android development)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd basketball-scorekeeper
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Run on your preferred platform:
- Press `i` for iOS simulator
- Press `a` for Android emulator
- Scan the QR code with Expo Go app on your physical device

## Usage

1. Start a New Game:
   - The app will initialize with default team names and empty rosters
   - Add players to each team before starting

2. During the Game:
   - Use the scoring buttons to record points (1pt, 2pt, 3pt)
   - Track fouls and timeouts
   - Manage substitutions using the team substitution buttons
   - Edit the game clock by tapping on the scoreboard
   - View live statistics in the box score
   - Monitor game events in the game log

3. Game Management:
   - The game clock can be started/stopped using the clock button
   - Use the substitution buttons to manage player rotations
   - All game events are automatically logged with timestamps

## Project Structure

```
my-app/
├── app/                 # Main application screens
├── components/         # Reusable React components
│   ├── Scoreboard.tsx
│   ├── GameControls.tsx
│   ├── BoxScore.tsx
│   ├── GameLog.tsx
│   ├── SubstitutionModal.tsx
│   └── ClockEditor.tsx
├── hooks/             # Custom React hooks
│   └── useGameClock.ts
├── store/             # State management (Zustand)
│   └── gameStore.ts
├── types/             # TypeScript type definitions
│   └── game.ts
└── package.json
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

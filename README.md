# Task Management Mobile App

A React Native mobile application built with Expo for task and team management. The app features real-time notifications, team collaboration, and deadline tracking.
- [the app apk](https://drive.google.com/file/d/1c-JUiOy7Gy5MX_aOQHKdf0x95mud5By6/view)
## Features

- 🔐 User Authentication
- 📋 Task Management
- 👥 Team Collaboration
- ⏰ Deadline Tracking
- 📱 Real-time Notifications
- 📊 Task Statistics
- 🖼️ Image Upload Support
- 🎨 Modern UI with Dark Theme

## Tech Stack

- [Expo](https://expo.dev/) - React Native development platform
- [Supabase](https://supabase.com/) - Backend and real-time subscriptions
- [NativeWind](https://www.nativewind.dev/) - Tailwind CSS for React Native
- [Expo Router](https://docs.expo.dev/router/introduction/) - File-based routing
- [React Native Gesture Handler](https://docs.swmansion.com/react-native-gesture-handler/) - Native touch and gesture system
- [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/) - Animations
- [Expo Notifications](https://docs.expo.dev/versions/latest/sdk/notifications/) - Push notifications

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Abdelaziz79/task-app-expo.git
   cd <repository-folder>
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npx expo start
   ```

### Environment Setup

Make sure you have the following installed:

- Node.js
- npm or yarn
- Expo CLI
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)
- Expo Go (for testing on physical devices)

## Project Structure

```
.
├── app/                    # Main application code
│   ├── (tabs)/            # Tab navigation screens
│   ├── (tasks)/           # Task-related screens
│   ├── team/              # Team management screens
│   └── user/              # User profile screens
├── components/            # Reusable components
├── contexts/              # React Context providers
├── hooks/                 # Custom React hooks
├── libs/                  # External library configurations
├── types/                 # TypeScript type definitions
└── utils/                 # Utility functions
```

## Features in Detail

### Authentication
- Email/password login system
- Persistent authentication using AsyncStorage
- Role-based access control (User, Admin, SuperAdmin)

### Task Management
- Create and assign tasks
- Upload images to tasks
- Mark tasks as complete
- Track task status (Pending/Completed)
- View task history

### Team Features
- Create and manage teams
- Add/remove team members
- Team-specific task assignment
- Team member collaboration

### Notifications
- Real-time push notifications
- Task assignment notifications
- Task completion notifications
- Notification center with read/unread status

### Deadlines
- Create and track deadlines
- Deadline priority indicators
- Visual progress tracking
- Swipe actions for quick management

## Building for Production

To create a production build:

```bash
eas build --platform android   # For Android
eas build --platform ios       # For iOS
```

## Contributing

1. Fork the repository.
2. Create your feature branch:
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. Commit your changes:
   ```bash
   git commit -m 'Add some AmazingFeature'
   ```
4. Push to the branch:
   ```bash
   git push origin feature/AmazingFeature
   ```
5. Open a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## Acknowledgments

- [Expo](https://expo.dev/) for the amazing development platform
- [Supabase](https://supabase.com/) for the backend infrastructure
- [NativeWind](https://www.nativewind.dev/) for the styling system


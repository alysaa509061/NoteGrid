# MatrixView

A modern expense tracking and calculation app built with React Native and Expo. MatrixView allows users to create notes with itemized tables, perform various mathematical calculations, and split totals among multiple people.

## 🎨 Color Palette

The app uses a sophisticated dark theme with carefully selected colors:

- **Primary Background**: `#231F20` - Deep charcoal black
- **Secondary Background**: `#426B69` - Muted teal green
- **Primary Text**: `#F3DFA2` - Warm cream white
- **Secondary Text**: `#A7754D` - Warm brown/tan
- **Logo + APP icon**: `#ac0000` - Burgundy red
- **Accent**: Various shades of the primary colors for borders and highlights

## 🔤 Typography

- **Font Family**: System default fonts (San Francisco on iOS, Roboto on Android)
- **Font Weights**: 
  - Regular (400) for body text
  - Semibold (600) for buttons and emphasis
  - Bold (700) for headers and totals
- **Font Sizes**: Responsive scaling from 14px to 32px based on content hierarchy

## 🛠️ Tools & Technologies

### Core Framework
- **React Native** `0.74.1` - Cross-platform mobile development
- **Expo SDK** `52.0.30` - Development platform and tooling
- **Expo Router** `4.0.17` - File-based navigation system
- **TypeScript** `5.8.3` - Type-safe JavaScript

### Navigation & UI
- **@react-navigation/native** `7.0.14` - Navigation library
- **@react-navigation/bottom-tabs** `7.2.0` - Tab navigation
- **lucide-react-native** `0.475.0` - Beautiful icon library
- **react-native-safe-area-context** `5.3.0` - Safe area handling

### Storage & State
- **@react-native-async-storage/async-storage** `2.2.0` - Local data persistence
- **React Hooks** - Built-in state management

### Development Tools
- **Metro Bundler** - JavaScript bundler for React Native
- **Expo CLI** - Command-line tools for Expo projects
- **ESLint** - Code linting and formatting

### Platform Support
- **iOS** - Native iOS app support
- **Android** - Native Android app support  
- **Web** - Progressive Web App capabilities

## 📱 Features

- **Note Creation**: Create titled notes with itemized tables
- **Mathematical Calculations**: 
  - Sum (default)
  - Subtraction (Value - Sum)
  - Average calculation
  - Item counting
  - Percentage breakdown
- **Split Calculator**: Optional bill splitting among multiple people
- **Data Persistence**: Local storage of all notes
- **Export Options**: Copy totals or full note details
- **Responsive Design**: Works across all screen sizes

## 🏗️ Architecture

- **File-based Routing**: Using Expo Router for intuitive navigation
- **Component-based**: Modular, reusable React components
- **TypeScript Interfaces**: Strong typing for data structures
- **Utility Functions**: Centralized calculation and formatting logic
- **Async Storage**: Persistent local data storage

## 🚀 Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open the app in:
   - Expo Go app on your phone
   - iOS Simulator
   - Android Emulator
   - Web browser

## 📁 Project Structure

```
├── app/                    # App screens and routing
│   ├── (tabs)/            # Tab-based navigation
│   │   ├── index.tsx      # Notes list screen
│   │   ├── create.tsx     # Note creation screen
│   │   └── _layout.tsx    # Tab layout configuration
│   ├── _layout.tsx        # Root layout
│   └── +not-found.tsx     # 404 screen
├── components/            # Reusable UI components
│   ├── CalculationSelector.tsx
│   ├── SplitCalculator.tsx
│   └── TableEditor.tsx
├── types/                 # TypeScript type definitions
│   └── Note.ts
├── utils/                 # Utility functions
│   ├── calculations.ts    # Math and formatting utilities
│   └── storage.ts         # Data persistence utilities
└── hooks/                 # Custom React hooks
    └── useFrameworkReady.ts
```

## 🎯 Design Philosophy

MatrixView follows modern mobile design principles with a focus on:
- **Dark Theme**: Reduces eye strain and provides a premium feel
- **Minimalist Interface**: Clean, uncluttered design
- **Intuitive Navigation**: Tab-based navigation for easy access
- **Responsive Layout**: Adapts to different screen sizes
- **Accessibility**: High contrast colors and readable fonts
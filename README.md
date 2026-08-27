# SmartPark

A smart parking management web app with real-time slot tracking, in-app booking, and live chat support — built with vanilla JavaScript and Firebase.

**Live demo:** https://smartpark-hg.web.app

## Features

- **Real-time parking map** — view slot availability (Available, Booked, Occupied, Reserved, Handicap, EV Charging) across multiple floors
- **Slot booking** — book a parking slot for a chosen duration and see live cost calculation
- **User accounts** — sign up, log in with email/password, or sign in with Google (Firebase Authentication)
- **Personal dashboard** — track active bookings, total hours parked, amount spent, loyalty points, and booking history
- **Profile customization** — upload a profile photo, or fall back to an auto-generated initials avatar
- **Live chat & calling** — in-app support chat and calling widget
- **Responsive design** — works across desktop and mobile screens

## Tech Stack

- **Frontend:** HTML, CSS, JavaScript (no framework)
- **Backend:** Firebase Realtime Database (live slot sync) and Firebase Authentication (Google Sign-In)
- **Hosting:** Firebase Hosting

## Project Structure

```
├── index.html              # Main app page
├── script.js                # Core app logic (booking, auth, dashboard)
├── style.css                 # Main styling
├── firebase-config.js       # Firebase initialization
├── imagescript.js            # Profile photo upload/handling
├── vehicle.js                 # Vehicle-related logic
├── livechat.js / livechat.css # Live chat widget
├── chat-integration.js       # Chat integration logic
├── calling.js                 # In-app calling feature
├── theme.js / theme.css / theme-integration.js  # Theming
└── sounds/                    # Notification sound effects
```

## Running Locally

1. Clone this repository
   ```
   git clone https://github.com/himanshugoud/smartpark.git
   ```
2. Open `index.html` in a browser, or serve the folder with any static file server.

> Note: live features (Google Sign-In, real-time slot sync) require a connected Firebase project — the `firebase-config.js` in this repo is pre-wired to a live Firebase backend for demo purposes.

## Author

**Himanshu Goud**

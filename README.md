# ☕ Coffee Finder

A modern web application that helps users discover coffee shops using interactive maps and location-based search.

Coffee Finder integrates **Google Maps JavaScript API** and **Geoapify Places API** to provide a dynamic experience where users can explore nearby cafés, search locations, and visualize results through an interactive map.

The project focuses on clean architecture, modular JavaScript, API integration, and creating a maintainable user experience.

---

## 🚀 Features

### 🗺️ Interactive Map

- Google Maps integration
- Dynamic coffee shop markers
- Automatic map centering
- Zoom and drag-based searching
- Custom map styling for a cleaner interface

### 🔎 Location Search

- Search coffee shops by city or location
- Geocoding support
- Search results based on current map boundaries
- Automatic filtering of visible locations

### ☕ Coffee Shop Information

- Display coffee shop names
- Show addresses
- Interactive information windows
- Numbered map markers

### ⭐ Favorites

- Save favorite coffee shops
- Store favorites using browser local storage
- Prevent duplicate user actions

---

# 🛠️ Technologies Used

## Frontend

- HTML5
- CSS3
- JavaScript ES Modules
- Vite

## APIs

- Google Maps JavaScript API
- Geoapify Places API
- Geoapify Geocoding API

## Development Tools

- Git
- GitHub
- ESLint
- Vite Development Server

---

# 🏗️ Project Architecture

The application follows a modular structure where each file has a clear responsibility.


src/
│
├── api.js # Handles external API communication
├── map.js # Google Maps initialization and marker management
├── ui.js # Handles DOM rendering and user interface
├── storage.js # Manages local storage operations
├── home.js # Controls home page behavior
├── main.js # Application entry point
│
└── styles/
└── style.css # Application styling


---

# 🔄 Application Flow


User Interaction
|
↓
home.js
|
↓
api.js
|
↓
External APIs
|
↓
Data Transformation
|
↓
map.js + ui.js
|
↓
User Interface


---

# 📍 How It Works

1. The application initializes Google Maps.
2. Users search for a city or move around the map.
3. The application calculates the visible map boundaries.
4. Coffee shop data is requested from Geoapify.
5. API responses are transformed into application-friendly objects.
6. Results are displayed as cards and interactive map markers.

---

# ⚙️ Installation

Clone the repository:

```bash
git clone https://github.com/YOUR_USERNAME/coffee-finder.git

Navigate to the project:

cd coffee-finder

Install dependencies:

npm install

Create an environment file:

.env

Add your Geoapify API key:

VITE_GEOAPIFY_KEY=your_api_key_here

Start the development server:

npm run dev

Open your browser:

http://localhost:3000
🔑 Environment Variables
Variable	Description
VITE_GEOAPIFY_KEY	API key used for Geoapify requests
🧠 Technical Decisions
Modular Architecture

The application separates responsibilities into independent modules:

API communication
Map management
UI rendering
Storage handling

Benefits:

Easier maintenance
Better code organization
Reduced dependency between components
Improved readability
Debounced Map Searching

Map movement and zoom events trigger location searches.

To prevent unnecessary API requests, the application uses debounce:

User moves map
        |
        ↓
 Wait 800ms
        |
        ↓
 Search API

This improves:

Performance
API efficiency
User experience
🔧 Challenges & Solutions
Managing Map State

During development, map functionality was refactored to improve maintainability by centralizing Google Maps state management.

Before:

let map;
let markers;
let infoWindows;

After:

const mapState = {
  map: null,
  markers: [],
  infoWindows: [],
  searchTimeout: null
};

This approach reduces global dependencies and makes future improvements easier.

API Data Transformation

External API responses are converted into a consistent internal format before being used by the application.

Benefits:

Cleaner UI code
Easier maintenance
Less dependency on external API structures
📈 Future Improvements

Possible future enhancements:

Replace deprecated Google Maps markers with Advanced Markers
Add user current location detection
Add coffee shop ratings and reviews
Add category filters
Add backend database support
Add authentication
Add automated testing

👨‍💻 Author

Dany Josue Jimenez Gonzalez

Software & Web Development Student

GitHub:
https://github.com/dany-datcom

LinkedIn:
(Add your LinkedIn profile)

📄 License

This project was created for educational and portfolio purposes.

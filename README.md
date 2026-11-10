# PadelMatch

**Course:** Electronic Business Development (BINF 503) · Winter 2026
**Instructor:** Dr. Nourhan Hamdi
**Teaching Assistants:** Mr. Nour Gaser, Mr. Omar Alaa, Ms. Mariam Khalid, Mr. Younes Zied, Mr. Mahmoud Hani

## 1. Team

| Name | Student ID | Tutorial group | GitHub username |
|---|---|---|---|
| Mazen Nabil | 16001775 | T7 | mzenabill |
| Mariam Omar | 16001360 | T7 | mariamomar612005-oss |
| Ahmed Eisa | 16002635 | T8 | ahmedeissa077 |
| Noreen Shams | 16004500 | T8 | noreenshams4-dotcom |
| Jamila Waleed | 16004555 | T8 | jamilacoder |
| Laila El Sherif | 16008387 | T8 | lailaelsherif2006 |

## 2. The idea

PadelMatch is a web application designed to simplify sports court reservations and player matchmaking for padel enthusiasts and venue managers. It allows padel players to search and book court slots at local venues, post open match invitations to find missing players, split booking costs, and log post-match scores. For venue managers, the system provides administrative tools to manage court availability, set hourly pricing tiers, and block off slots for maintenance.

## 3. Features

### 3.1 The full product

- Real-time push notifications for match invites and booking confirmations
- Integrated online payment gateway 
- Interactive venue mapping and geolocation court search
- Automated player leaderboard and skill rating algorithms
- Tournament creation, automated bracket generation, and league management
- Automated court lighting control hardware integration

### 3.2 The use cases we will build

| # | Use case | What the user does | What they see | What is stored |
|---|---|---|---|---|
| 1 | Registration and login | Registers with name, email, password, and role; logs in with credentials | Their home page, with their name and role in the header | A User, with the password hashed |
| 2 | Direct court booking | Selects a venue, date, court, and available time slot to submit a reservation | Interactive daily time grid showing available slots and booking confirmation | A Booking linked to userId and courtId |
| 3 | Open match creation | Posts an open match request seeking extra players with skill level preferences | Form setting skill requirements and cost split, followed by active listing | A Match linked to hostId and bookingId |
| 4 | Match join & slot reservation | Browses open match listings and joins an open game slot | Feed of available open matches with filter tags and slot confirmation | Updates Match with joined userId and sets isFull status |
| 5 | Venue schedule & pricing management | Creates courts, updates hourly rates, or blocks slots for maintenance | Venue manager dashboard with court lists and time-block maintenance toggles | Creates or updates Court pricing and maintenanceSlots |
| 6 | Post-match score logging & ratings | Submits final match set scores and leaves a rating for opponents | Post-game score submission form and updated profile rating stats | A Review document and updated User skillRating |

## 4. Who owns what

| Member | Use case |
|---|---|
| Laila El Sherif | 1. Registration and login |
| Jamila Waleed | 2. Direct court booking |
| Noreen Shams | 3. Open match creation |
| Mariam Omar | 4. Match join & slot reservation |
| Mazen Nabil | 5. Venue schedule & pricing management |
| Ahmed Eisa | 6. Post-match score logging & ratings |

## 5. Data Model

```javascript
// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // bcrypt hashed
  role: { type: String, enum: ['player', 'owner'], default: 'player' },
  skillRating: { type: Number, default: 3.0 }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);

// models/Court.js
const mongoose = require('mongoose');

const courtSchema = new mongoose.Schema({
  name: { type: String, required: true },
  venueName: { type: String, required: true },
  hourlyRate: { type: Number, required: true },
  isIndoor: { type: Boolean, default: false },
  maintenanceSlots: [{ date: String, timeSlot: String }]
}, { timestamps: true });

module.exports = mongoose.model('Court', courtSchema);

// models/Booking.js
const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  courtId: { type: mongoose.Schema.Types.ObjectId, ref: 'Court', required: true },
  date: { type: String, required: true }, // Format: YYYY-MM-DD
  timeSlot: { type: String, required: true }, // e.g. "18:00-19:30"
  totalAmount: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);

// models/Match.js
const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
  hostId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
  skillLevel: { type: String, required: true },
  maxPlayers: { type: Number, default: 4 },
  joinedPlayers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  costPerPlayer: { type: Number, required: true },
  isFull: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Match', matchSchema);

// models/Review.js
const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  reviewerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  targetUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  scoreLogged: { type: String }, 
  comment: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Review', reviewSchema);

## 6. Run it locally

> Leave this section as it is until Submission 2 (Thursday 10 December 2026,
> 23:59). Then fill it in: we follow these steps to run your project.

### Back end

```bash
cd backend
npm install
# create backend/.env from backend/.env.example (see the table below)
npm start
```

The API runs on http://localhost:3000.

| Variable in `.env` | What it is |
|---|---|
| `MONGODB_URI` | The connection string of your MongoDB Atlas database |
| `JWT_SECRET` | Any long random text, used to sign login tokens |
| [Any other variable] | [What it is] |

### Front end

```bash
cd frontend
npm install
npm run dev
```

The app runs on [the address `npm run dev` prints, e.g. http://localhost:5173].

# Horse Racing Database System - Admin Portal

A comprehensive full-stack application for managing horse racing data with admin functions for races, owners, horses, and trainers.

## Project Structure

```
horse-racing-database/
├── backend/                      # Backend server (Node.js + Express)
│   ├── config/
│   │   └── database.js          # MySQL connection pool configuration
│   ├── controllers/             # Request handlers (business logic)
│   │   ├── raceController.js    # Race operations
│   │   ├── ownerController.js   # Owner operations
│   │   ├── horseController.js   # Horse operations
│   │   ├── trainerController.js # Trainer operations
│   │   └── utilityController.js # Stables, tracks, health checks
│   ├── models/                  # Data access layer (database queries)
│   │   ├── Race.js              # Race data operations
│   │   ├── Owner.js             # Owner data operations
│   │   ├── Horse.js             # Horse data operations
│   │   ├── Trainer.js           # Trainer data operations
│   │   └── Utility.js           # Utility data operations
│   ├── routes/                  # API route definitions
│   │   ├── raceRoutes.js        # Race endpoints
│   │   ├── ownerRoutes.js       # Owner endpoints
│   │   ├── horseRoutes.js       # Horse endpoints
│   │   ├── trainerRoutes.js     # Trainer endpoints
│   │   └── utilityRoutes.js     # Utility endpoints
│   ├── server.js                # Main Express server setup
│   └── procedural_sql_FIXED.sql # Database stored procedures & triggers
│
├── frontend/                    # Frontend assets
│   ├── js/
│   │   └── app.js              # Frontend JavaScript logic
│   ├── assets/                 # Images, icons, logos (optional)
│   ├── index.html              # Main HTML interface
│   └── styles.css              # CSS styling
│
├── config/
│   └── .env.example            # Environment variables template
│
├── node_modules/               # NPM dependencies
├── package.json                # Project dependencies & scripts
├── package-lock.json           # Locked dependency versions
└── README.md                   # This file
```

## Architecture

### MVC Pattern

The backend follows the **Model-View-Controller** pattern:

- **Models** (`backend/models/`): Handle database interactions
- **Controllers** (`backend/controllers/`): Process requests and responses
- **Routes** (`backend/routes/`): Define API endpoints
- **Views** (`frontend/`): User interface (HTML/CSS/JS)

### Key Features

- ✅ Clean separation of concerns
- ✅ Modular and scalable structure
- ✅ Easy to test and maintain
- ✅ RESTful API design
- ✅ Stored procedures for complex operations
- ✅ Transaction management for data integrity

## Quick Start

### Prerequisites

- Node.js (v14 or higher)
- MySQL (v5.7 or higher)
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd horse-racing-database
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment**

   ```bash
   cp config/.env.example .env
   # Edit .env with your database credentials
   ```

4. **Set up the database**

   - Create MySQL database: `racing_db`
   - Run DDL statements to create tables
   - Run DML statements to populate initial data
   - Execute stored procedures:
     ```bash
     mysql -u root -p racing_db < backend/procedural_sql_FIXED.sql
     ```

5. **Start the server**

   ```bash
   # Production
   npm start

   # Development (with auto-reload)
   npm run dev
   ```

6. **Access the application**
   - Frontend: http://localhost:3000
   - API Health: http://localhost:3000/api/health

## API Endpoints

### Races

- `POST /api/races` - Create new race with results
- `GET /api/races/:id` - Get race details

### Owners

- `GET /api/owners/:id` - Get owner with owned horses
- `DELETE /api/owners/:id` - Delete owner (stored procedure)

### Horses

- `GET /api/horses/:id` - Get horse details
- `PUT /api/horses/:id/stable` - Move horse to new stable (stored procedure)

### Trainers

- `POST /api/trainers` - Add new trainer
- `GET /api/trainers/:id` - Get trainer details

### Utilities

- `GET /api/stables` - List all stables
- `GET /api/tracks` - List all tracks
- `GET /api/archive/horses` - View deleted horses
- `GET /api/health` - Health check endpoint

## Environment Variables

Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=3000

# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=racing_db
```

## Testing

The system includes:

- Database connection health checks
- Transaction management for data integrity
- Error handling and validation
- Stored procedures for complex operations

## Development

### Adding New Features

1. **Add a new model** in `backend/models/`
2. **Create controller** in `backend/controllers/`
3. **Define routes** in `backend/routes/`
4. **Register routes** in `backend/server.js`

### Code Style

- Use clear, descriptive variable names
- Add comments for complex logic
- Follow the existing MVC pattern
- Keep files focused and modular

## Dependencies

### Production

- `express` - Web framework
- `mysql2` - MySQL client with Promise support
- `cors` - Cross-Origin Resource Sharing
- `dotenv` - Environment variable management

### Development

- `nodemon` - Auto-restart server on changes

## Database Schema

The system manages:

- **Races**: Race information and results
- **Owners**: Horse owners and ownership relationships
- **Horses**: Horse details and stable assignments
- **Trainers**: Trainer information and stable assignments
- **Stables**: Stable locations and racing colors
- **Tracks**: Race track details
- **Archives**: Deleted horse records (via trigger)

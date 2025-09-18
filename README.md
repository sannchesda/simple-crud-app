# Simple CRUD Todo App

A modern, feature-rich Todo application built with Next.js 15, TypeScript, and Firebase. This project demonstrates a complete CRUD (Create, Read, Update, Delete) implementation with real-time synchronization and a clean, responsive user interface.

## Demo
This project is hosted on vercel with firebase firestore for storing data
- https://simple-crud-app-seven.vercel.app

## 🚀 Features


- ✅ **Add todos** - Create new todo items by typing and pressing Enter
- ✅ **View todos** - Display all todos in a clean, organized list
- ✅ **Edit todos** - Click edit button to modify existing todo items
- ✅ **Delete todos** - Remove todos with the delete button
- ✅ **Mark as complete** - Toggle completion status with visual strikethrough
- 🔄 **Real-time sync** - Multi-user support with Firebase Firestore
- 🏗️ **RESTful APIs** - Complete CRUD API endpoints
- 🔥 **Firebase Firestore integration** - Cloud database synchronization
- 💨 **TypeScript** - Full type safety
- 🎨 **Tailwind CSS** - Modern, utility-first styling


## 📋 API Endpoints

The application provides a complete REST API for todo management:

### GET `/api/todo`
Retrieve all todos
```json
Response: [
  {
    "id": "string",
    "todo": "string", 
    "isCompleted": "boolean",
    "createdAt": "timestamp"
  }
]
```

### POST `/api/todo`
Create a new todo
```json
Request Body: {
  "id": "uuid",
  "todo": "string",
  "isCompleted": "boolean", 
  "createdAt": "timestamp"
}
```

### PUT `/api/todo/[id]`
Update an existing todo
```json
Request Body: {
  "id": "uuid",
  "todo": "string",
  "isCompleted": "boolean",
  "createdAt": "timestamp" 
}
```

### DELETE `/api/todo/[id]`
Delete a todo by ID

## 🚀 Getting Started

### Prerequisites
- Node.js 20.x or higher
- npm or yarn package manager
- Firebase project (for cloud sync)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd simple-crud-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Firebase**
   
   Create a `.env` file in the root directory:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

   > **Note**: env file is not included

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

## 📁 Project Structure

```
src/
├── app/
│   ├── api/todo/           # REST API endpoints
│   ├── components/         # Reusable UI components
│   ├── about/             # About page
│   ├── firebase.ts        # Firebase configuration
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page (main todo app)
├── public/                # Static assets
└── configuration files    # Next.js, TypeScript, Tailwind configs
```

## 🧪 Development Notes

This project was built following the VTech coding challenge requirements:

- ✅ **Basic Requirements**: Complete todo list with Next.js and API integration
- ✅ **Advanced Functionality**: Validation, filtering, editing, completion states
- ✅ **CRUD APIs**: Full REST API implementation with proper HTTP methods
- ✅ **Bonus Challenge**: Multi-user real-time synchronization with Firebase


## 🔮 Future Enhancements

- Improve the beauty of UI/UX
- User authentication and personal todo lists
- Todo categories and tags
- Due dates and reminders
- Drag-and-drop reordering
- Dark mode support

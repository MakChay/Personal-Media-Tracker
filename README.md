# Personal Media Tracker 🎬

A sleek and responsive web app to track your movies, TV shows, books, and music. Users can log in, add media, track ratings, and view their personalized dashboard with stats. Built with **Firebase**, **HTML/CSS**, and **JavaScript**, with support for **dark/light mode**.

---

## 🚀 Features

* **User Authentication**
  Sign up, log in, and log out securely using Firebase Authentication.

* **Dashboard Statistics**
  Track your media collection with real-time stats for Movies, TV Shows, Books, and Music.

* **Add & Manage Media**
  Add new items with title, type, and optional rating. Edit or delete entries seamlessly.

* **Filter, Search, and Sort**
  Quickly find media with type filters, search by title, or sort by newest, oldest, or highest rating.

* **Responsive UI & Dark Mode**
  Optimized for all devices with smooth dark/light mode toggle.

* **Secure Data**
  Firebase Firestore rules ensure users can only access their own data.

---

## 📁 File Structure

```
personal-media-tracker/
│
├─ index.html           # Login page
├─ signup.html          # Signup page
├─ dashboard.html       # Main dashboard
├─ style.css            # Styling and theme support
├─ app.js               # Frontend JS logic (Firebase integration)
└─ README.md
```

---

## ⚡ Technologies Used

* **Frontend:** HTML, CSS, JavaScript
* **Backend & Database:** Firebase (Authentication, Firestore, Storage, Analytics)
* **Deployment:** Vercel (or any static hosting)

---

## 🔧 Installation

1. **Clone the repository**

```bash
git clone https://github.com/<your-username>/personal-media-tracker.git
cd personal-media-tracker
```

2. **Firebase Setup**

* Go to [Firebase Console](https://console.firebase.google.com/)
* Create a new project.
* Enable **Authentication** (Email/Password).
* Create a **Firestore Database** in production mode.
* Enable **Storage** if you plan to upload images (optional).
* Copy your Firebase config and update `app.js`:

```js
const firebaseConfig = {
  apiKey: "<YOUR_API_KEY>",
  authDomain: "<YOUR_PROJECT_ID>.firebaseapp.com",
  projectId: "<YOUR_PROJECT_ID>",
  storageBucket: "<YOUR_PROJECT_ID>.appspot.com",
  messagingSenderId: "<SENDER_ID>",
  appId: "<APP_ID>",
  measurementId: "<MEASUREMENT_ID>"
};
```

3. **Install dependencies** (optional if using build tools)

```bash
npm install
```

4. **Run locally**

Since this is a static site, you can use **Live Server** in VS Code or any local HTTP server:

```bash
npx serve .
```

5. **Deploy to Vercel**

```bash
vercel
```

* Add any **environment variables** in Vercel settings if you plan to hide Firebase config keys.

---

## 🔐 Security

Even though Firebase API keys are public, your Firestore rules protect user data:

```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /media/{docId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.uid;
    }
  }
}
```

---

## 🎨 Customization

* Change **primary & secondary colors** in `style.css`
* Modify **dark/light mode** toggle text/icons
* Add **additional media types** in `dashboard.html` and `app.js`

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -m "Add new feature"`
4. Push to the branch: `git push origin feature-name`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## 📧 Contact

Created by **Chay Makwara** – feel free to reach out for collaborations or questions!

* GitHub: [https://github.com/makchay](https://github.com/makchay)
* Email: [makwarac@yahoo.com](mailto:makwarac@yahoo.com)


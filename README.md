# 🥋 Martial Mastery Frontend

This is the **React-based frontend** for [Martial Mastery](https://github.com/Favasabdulnassr/martial-mastery-backend), a martial arts training platform for students, tutors, and administrators. Users can register, purchase courses, watch video tutorials, chat with tutors, and more.

Built with **React 18 + Redux Toolkit + Tailwind CSS + Vite** for blazing-fast development.

---

## ⚙️ Features

### 👤 Students
- Register/Login (email + Google OAuth)
- Browse and purchase courses
- Watch tutorial videos using **Plyr**
- Live chat with assigned tutor (after course purchase)
- Comment on videos
- Profile management

### 🎓 Tutors
- Register/Login
- Create & manage courses
- Upload videos using Cloudinary
- Mark course as complete for admin verification
- View students enrolled in their courses
- Wallet dashboard with withdrawal request

### 🛠️ Admin
- Monitor tuor-created courses
- Approve or reject tutor-created courses
- Monitor reported content
- View tutor/student dashboards


---

## 🚀 Tech Stack

| Area           | Tech                                      |
|----------------|-------------------------------------------|
| Frontend       | **React 18**, **Vite**, **React Router** |
| State          | **Redux Toolkit**, **redux-persist**     |
| Forms          | **Formik**, **Yup**                       |
| Styling        | **Tailwind CSS**, **clsx**, **tailwind-merge** |
| Animations     | **Framer Motion**                         |
| Payments       | **Stripe.js**, **@stripe/react-stripe-js** |
| Video Player   | **Plyr + plyr-react**                     |
| Auth           | **JWT**, **Google OAuth**, **jwt-decode**|
| Charts         | **Recharts**                              |
| Notifications  | **React Toastify**                        |
| Utils          | **Axios**, **date-fns**, **crypto-js**   |

---


📦 Installation

1. Clone the repository

```
git clone https://github.com/Favasabdulnassr/martial-mastery-frontend.git
cd martial-mastery-frontend
```

2. Install dependencies

```
npm install
# or
yarn install
```

3. Setup environment variables

Create a .env file in the root:

```
env

VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_STRIPE_PUBLIC_KEY=your_stripe_public_key

```

🧪 Running the App

Start the Vite dev server:

```
npm run dev
# or
yarn dev

```
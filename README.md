# 🚨 ImpactAI — AI NGO Command Center Dashboard

An AI-powered crisis management dashboard designed to help NGOs **monitor, analyze, and respond to real-time incidents efficiently**.

---

## 🌐 Live Demo

🔗 https://ngo-dashboard-160660418360.asia-south1.run.app

---

## 🧠 Overview

ImpactFlow is a **real-time decision support system** that integrates:

* Incident reporting
* Volunteer coordination
* Resource management
* AI-driven insights

All into a single **intelligent command center dashboard**.

---

## ✨ Key Features

### 📊 Real-Time Dashboard

* Live KPI tracking (reports, volunteers, resources)
* AI-powered overview of crisis status

### 🗺️ Interactive Map Intelligence

* Visualize incidents, volunteers, and assignments
* Zone-based hotspot detection
* Location → coordinates conversion using geocoding

### 🤖 AI Decision Support

* Priority alerts for critical situations
* Predictive insights based on demand vs supply
* AI reasoning for transparency

### 📁 Smart Data Collection

* Manual report generation
* Document upload & AI-based extraction
* Auto-filled forms using processed data

### 👥 Volunteer & Resource Management

* Track volunteer availability
* Assign tasks dynamically
* Monitor resource demand and shortages

### 📝 Support & Help System

* Issue tracking for internal team
* Structured support request handling

---

## 🏗️ Tech Stack

### 🎨 Frontend

* Next.js (App Router)
* React
* TypeScript
* Tailwind CSS

### 🔥 Backend & Database

* Firebase (Firestore + Authentication)

### ☁️ Cloud & Deployment

* Google Cloud Run
* Docker

### 🗺️ Maps & Location

* Google Maps JavaScript API
* Geocoding API

### 🤖 AI Integration

* External AI APIs for document processing
* Rule-based + AI-driven logic


## ⚙️ Setup Instructions

### 1. Clone the repo

git clone https://github.com/SofiyaPatwekar/ngo-dashboard.git
cd ngo-dashboard

### 2. Install dependencies

npm install

### 3. Add environment variables

Create a ".env.local" file:

NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_key

NEXT_PUBLIC_FIREBASE_API_KEY=your_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

### 4. Run locally

npm run dev

## 🚀 Deployment

Deployed using **Google Cloud Run** with containerized architecture.

## 🔮 Future Scope

* Adaptive AI learning based on historical data
* Offline-first functionality for low-connectivity regions
* Multilingual & voice-based reporting
* Integration with government & weather APIs
* Real-time notification system (SMS/WhatsApp)


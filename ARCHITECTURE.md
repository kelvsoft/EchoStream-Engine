# 🚀 Enterprise Real-Time Messaging Engine

A high-concurrency, event-driven chat infrastructure built with **Laravel 11**, **React**, and **Inertia.js**. This isn't just a chat app; it's a demonstration of professional-grade state management and network optimization.

## 🌟 Key Engineering Features

### 📡 Optimized WebSocket Architecture

-   **Throttled Heartbeat:** Implemented a 1.5s heartbeat for typing indicators to reduce server overhead and prevent WebSocket spam.
-   **Grace-Period Overlap:** Engineered a 4s receiver-side buffer to eliminate "flickering" indicators, ensuring a smooth UX similar to Slack/WhatsApp.
-   **Real-Time Read Receipts:** Integrated a message lifecycle system that updates message states across all clients instantly using Laravel Broadcasting.

### 🎨 Ultra-Responsive Fluid UI

-   **4K Ready:** Utilizing a fluid design system with Tailwind CSS, scaling seamlessly from mobile devices to 4K workstations.
-   **Dynamic Viewport Height (dvh):** Optimized for mobile browsers to prevent UI jumping caused by address bar movements.
-   **Instant Media Previews:** Client-side URL object mapping for immediate image feedback before server persistence.

### 🛠 Tech Stack

-   **Backend:** Laravel 11 (PHP 8.2+), MySQL
-   **Frontend:** React 18, Inertia.js, Tailwind CSS
-   **Real-time:** Laravel Echo, Pusher/Reverb
-   **Routing:** Ziggy Vue/React integration

## 🚀 Installation

1. **Clone & Install:**
   ```bash
   git clone https://github.com/kelvsoft/EchoStream-Engine.git
   cd EchoStream-Engine
   composer install
   npm install
   npm run build

   Note: Ensure your .env file is configured with your WebSocket credentials and BROADCAST_CONNECTION is set to reverb or pusher for real-time features to activate.
   
2. **Configure Environment:**
   Copy the example file and add your Database and Pusher/Reverb credentials:
   ```bash
   cp .env.example .env
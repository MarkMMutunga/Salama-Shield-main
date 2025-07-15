# 🛡️ Salama Shield

**A discreet safety app designed for personal security and emergency response**

Salama Shield is a Next.js-based safety application that disguises itself as a health tracker while providing critical emergency features. Designed with dis## 👨‍💻 Author

**Mark Mikile Mutunga**
- 📧 Email: [markmiki03@gmail.com](mailto:markmiki03@gmail.com)
- 📱 Phone: +254 707 678 643
- 🌍 Location: Kenya
- 💼 Full-Stack Developer specializing in safety and security applications

*Salama Shield was conceived and developed to address real-world safety challenges, particularly for vulnerable individuals who need discrete emergency response capabilities.*nd user safety in mind, it offers silent SOS capabilities, secure contact management, and privacy-focused features.

**Author**: Mark Mikile Mutunga  
**Email**: markmiki03@gmail.com  
**Phone**: +254 707 678 643

---

## 🌟 Features

### 🚨 **Stealth SOS**
- **Silent panic button** disguised within a health tracker interface
- **Live GPS location sharing** with emergency contacts
- **Preset distress messages** with automatic location coordinates
- **SMS fallback** for areas with poor internet connectivity
- **Works without internet** using device SMS capabilities

### 👥 **Trusted Circle**
- **Secure contact management** for up to 5 emergency contacts
- **Easy add/edit/delete** functionality for trusted contacts
- **Privacy-focused** - contacts stored locally with encryption

### 📝 **Private Digital Diary**
- **Encrypted evidence logging** with PIN/fingerprint protection
- **Multi-media support**: text notes, voice recordings, and photos
- **Timestamped entries** for legal documentation
- **Secure local storage** with data encryption

### 🗺️ **Safe Zone Map**
- **Interactive map** showing nearby police stations and safe spaces
- **Google Maps integration** with custom markers
- **Location-based services** for finding help quickly
- **Offline capability** with cached location data

### 🌐 **Platform & Accessibility**
- **Cross-platform support** (Android, iOS, Web)
- **Low data usage** optimized for areas with poor connectivity
- **Bilingual support**: English and Kiswahili
- **Responsive design** for all device sizes

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18.0 or higher
- **npm** or **yarn** package manager
- **Google Maps API Key** (for map functionality)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/salama-shield.git
   cd salama-shield
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory:
   ```env
   # Google Maps API Configuration
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
   ```

4. **Get Google Maps API Key**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing one
   - Enable Maps JavaScript API
   - Create API credentials and copy the key
   - Add the key to your `.env.local` file

5. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. **Access the application**
   - **HTTP**: http://localhost:9002
   - **HTTPS**: https://localhost:9002 (for full location services)

---

## 🛠️ Tech Stack

### **Frontend**
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Radix UI** - Accessible component primitives

### **UI Components**
- **shadcn/ui** - Beautiful, accessible components
- **Lucide React** - Modern icon library
- **React Hook Form** - Form handling with validation

### **Maps & Location**
- **@vis.gl/react-google-maps** - Modern Google Maps integration
- **Browser Geolocation API** - Real-time location services

### **State Management**
- **React Context API** - Global state management
- **Local Storage** - Persistent data storage
- **Custom Hooks** - Reusable logic

### **Development Tools**
- **Turbopack** - Fast development server
- **ESLint** - Code linting
- **TypeScript** - Static type checking

---

## 📱 App Structure

### **Home Page (`/`)**
- Disguised as a health tracker
- Health statistics display (steps, heart rate, sleep)
- **Hidden SOS button** for emergency activation
- PIN-protected access to main features

### **Main Features (Protected Routes)**
- **`/contacts`** - Emergency contact management
- **`/diary`** - Private encrypted diary
- **`/map`** - Safe zones and police stations
- **`/settings`** - App configuration and preferences

### **Security Features**
- **PIN authentication** for app access
- **Secure data storage** with encryption
- **Session management** with auto-lock
- **Privacy-first design** principles

---

## 🔧 Configuration

### **Available Scripts**

```bash
# Development
npm run dev          # Start development server (HTTP)
npm run dev:https    # Start with HTTPS (recommended for location services)

# AI/ML Features  
npm run genkit:dev   # Start AI development server
npm run genkit:watch # Watch mode for AI features

# Production
npm run build        # Build for production
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
npm run typecheck    # TypeScript type checking
```

### **Environment Variables**

```env
# Required
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key

# Optional
NODE_ENV=development
PORT=9002
```

---

## 🌍 Localization

The app supports multiple languages:

- **English** (`en`) - Default language
- **Kiswahili** (`sw`) - East African localization

Language files are located in `src/locales/`:
- `en.json` - English translations
- `sw.json` - Kiswahili translations

---

## 🔒 Security & Privacy

### **Data Protection**
- **Local storage encryption** for sensitive data
- **No cloud storage** of personal information
- **PIN-based authentication** for app access
- **Session timeouts** for security

### **Location Privacy**
- **HTTPS required** for location services
- **Permission-based access** to device location
- **No location tracking** when app is not in use
- **User-controlled** location sharing

### **Emergency Features**
- **Silent operation** to avoid detection
- **Quick access** emergency buttons
- **Automatic location sharing** in emergencies
- **SMS fallback** when internet is unavailable

---

## 🤝 Contributing

We welcome contributions to make Salama Shield better and safer for everyone.

### **How to Contribute**

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

### **Development Guidelines**
- Follow TypeScript best practices
- Maintain accessibility standards
- Test on multiple devices and browsers
- Ensure security and privacy compliance
- Add appropriate documentation

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🆘 Support & Emergency

### **For Emergencies**
- **Call local emergency services** immediately
- Use the app's SOS feature as a **supplementary tool**
- **This app is not a replacement** for professional emergency services

### **Technical Support**
- Open an issue in the GitHub repository
- Check the documentation in the `/docs` folder
- Review the FAQ section

---

## �‍💻 Author

**Mark Mikile Mutunga**
- 📧 Email: [markmiki03@gmail.com](mailto:markmiki03@gmail.com)
- 📱 Phone: +254 707 678 643
- 🌍 Location: Kenya
- 💼 Frontend Developer

*Salama Shield was conceived and developed to address real-world safety challenges, particularly for vulnerable individuals who need discrete emergency response capabilities.*

---

## �🙏 Acknowledgments

- **Google Maps** for location services
- **Radix UI** for accessible components
- **shadcn/ui** for beautiful UI components
- **Next.js team** for the amazing framework
- **Open source community** for various libraries and tools

---

## ⚠️ Important Notice

**Salama Shield is designed to supplement, not replace, traditional emergency services. In case of immediate danger, always contact local emergency services first.**

**Privacy Notice**: This app stores data locally on your device. No personal information is transmitted to external servers without your explicit consent.

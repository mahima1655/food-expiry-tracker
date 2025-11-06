# 🍎 Food Expiry Tracker

A modern, responsive web application to track food items and their expiry dates with AI-powered recipe suggestions.

## ✨ Features

- **Smart Food Management**: Add, view, and track food items with expiry dates
- **Expiry Alerts**: Get notifications for items expiring soon or already expired
- **AI Recipe Suggestions**: Get personalized recipe ideas based on available ingredients
- **Search & Filter**: Quickly find specific food items
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Data Persistence**: All data saved locally in your browser

## 🚀 Live Demo

Visit the live application: [Food Expiry Tracker](https://yourusername.github.io/food-expiry-tracker)

## 🛠️ Technologies Used

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Styling**: CSS Grid, Flexbox, CSS Variables
- **Icons**: Font Awesome
- **Fonts**: Inter (Google Fonts)
- **Storage**: LocalStorage API
- **AI Integration**: Ready for OpenAI API integration

## 📱 Screenshots

### Desktop View
- Clean, modern interface with tabbed navigation
- Real-time statistics in the header
- Professional card-based layout

### Mobile View
- Fully responsive design
- Touch-friendly interface
- Optimized for mobile usage

## 🔧 Installation & Setup

### Option 1: GitHub Pages (Recommended)
1. Fork this repository
2. Go to Settings → Pages
3. Select "Deploy from a branch" → main
4. Your site will be live at: `https://yourusername.github.io/repository-name`

### Option 2: Local Development
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/food-expiry-tracker.git
   cd food-expiry-tracker
   ```

2. Open `index.html` in your browser or use a local server:
   ```bash
   python -m http.server 8000
   # Visit http://localhost:8000
   ```

## 🤖 AI Integration

To enable real AI recipe suggestions:

1. Get an OpenAI API key from [OpenAI Platform](https://platform.openai.com/)
2. In `script.js`, uncomment the API code in `fetchAIRecipes()`
3. Replace `YOUR_API_KEY` with your actual API key
4. Deploy your changes

**Note**: For security, consider using environment variables or a backend service for API keys in production.

## 📂 Project Structure

```
food-expiry-tracker/
├── index.html          # Main HTML file
├── style.css           # Styles and responsive design
├── script.js           # JavaScript functionality
├── deploy.html         # Deployment instructions
├── .github/
│   └── workflows/
│       └── deploy.yml  # GitHub Actions deployment
└── README.md           # Project documentation
```

## 🎯 Usage

1. **Add Food Items**: Click "Add Item" and fill in the food details
2. **View Items**: See all your food items sorted by expiry date
3. **Check Alerts**: Get warnings for items expiring soon
4. **Get Recipes**: AI-powered suggestions based on your ingredients
5. **Search**: Use the search bar to find specific items

## 🔒 Privacy & Data

- All data is stored locally in your browser
- No personal information is sent to external servers
- AI recipe suggestions use only ingredient names (no personal data)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Font Awesome for icons
- Google Fonts for typography
- OpenAI for AI integration capabilities

---

**Made with ❤️ for reducing food waste and smart kitchen management**
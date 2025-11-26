# Bharat Education Portal

A comprehensive educational web platform featuring AI-powered assistance, virtual laboratories, and a digital library.

## Features

### 🤖 AI Assistant
- Interactive chat interface for student queries
- Subject-specific responses (Physics, Chemistry, Biology, Mathematics)
- Real-time conversation with typing indicators
- Mock AI responses (easily replaceable with real API integration)

### 🔬 Virtual Laboratories
**Physics Lab:**
- Pendulum Motion Experiment - Study harmonic motion and period calculation
- Projectile Motion Experiment - Explore trajectory and velocity components
- Interactive simulations with real-time calculations
- Canvas-based animations

**Chemistry Lab:**
- Acid-Base Titration - Virtual titration with pH monitoring
- Chemical Reactions Explorer - Learn synthesis, decomposition, and displacement reactions
- Visual feedback with color changes
- pH curve visualization

**Biology Lab:**
- Cell Division Explorer - Understand mitosis and meiosis
- DNA Structure Explorer - Interactive double helix visualization
- Base pairing rules demonstration
- Animated DNA representation

### 📚 Digital Library
- Collection of educational books across subjects
- Category-based filtering (Physics, Chemistry, Biology, Mathematics)
- Book purchasing interface
- Responsive grid layout with hover effects

## Technology Stack

- **Frontend:** HTML5, CSS3, JavaScript (ES6+)
- **Styling:** Tailwind CSS
- **Icons:** Font Awesome
- **Animations:** CSS transitions, Canvas API
- **Responsive Design:** Mobile-first approach

## File Structure

```
bharat-education-portal/
├── index.html          # Main HTML structure
├── script.js           # All JavaScript functionality
└── README.md           # This documentation
```

## Getting Started

1. Clone or download the files to your local machine
2. Open `index.html` in a web browser
3. Navigate through different sections using the top navigation

## AI Integration

The portal now supports real AI API integration for intelligent responses and complex math problem solving!

### 🚀 Quick Setup
1. Open the portal and navigate to **AI Assistant**
2. Click the **"Configure AI"** button
3. Enter your API key when prompted
4. Start asking questions!

### 🔑 Getting API Keys

**OpenAI (Recommended):**
- Visit: https://platform.openai.com/api-keys
- Create an account and generate an API key
- Copy the key (starts with "sk-")
- New accounts often get free credits

**Other Compatible APIs:**
- Any OpenAI-compatible API endpoint
- Google AI (Gemini) with OpenAI-compatible wrapper
- Local AI models with OpenAI-compatible server

### 🧠 Features with Real AI
- **Complex Math Problem Solving:** Step-by-step solutions
- **Advanced Physics Explanations:** Detailed conceptual understanding
- **Chemistry Problem Solving:** Reaction mechanisms and calculations
- **Biology Concepts:** Detailed explanations and examples
- **Personalized Learning:** Adaptive responses based on questions

### 💡 Example Questions to Try
```
Mathematics:
- "Solve: 2x² + 5x - 3 = 0"
- "What is the derivative of sin(x²)?"
- "Calculate the integral of x³ + 2x"

Physics:
- "Explain Newton's third law with examples"
- "How do electromagnetic waves propagate?"
- "What is quantum entanglement?"

Chemistry:
- "Balance this equation: C₃H₈ + O₂ → CO₂ + H₂O"
- "Explain acid-base titration process"
- "How does photosynthesis work at molecular level?"

Biology:
- "Describe the process of DNA replication"
- "How does cellular respiration work?"
- "What are the differences between mitosis and meiosis?"
```

### 🔧 Technical Integration

The system uses OpenAI's chat completions API:
```javascript
// API Configuration
const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
            { role: 'system', content: 'You are an educational AI assistant...' },
            { role: 'user', content: userMessage }
        ],
        max_tokens: 500,
        temperature: 0.7
    })
});
```

### 🎯 System Prompt
The AI is configured with an educational focus:
- Provides clear, educational explanations
- Solves math problems step-by-step
- Maintains appropriate tone for students
- Encourages learning and exploration
- Admits limitations when appropriate

### 💰 Cost Considerations
- GPT-3.5 Turbo: ~$0.002 per 1K tokens
- Typical student question: ~10-50 tokens
- Very cost-effective for educational use
- Free credits available for new accounts

## Features in Detail

### Navigation
- Clean, modern navigation bar with gradient background
- Responsive menu with icon indicators
- Smooth section transitions

### AI Chat Interface
- Real-time messaging with user/AI distinction
- Typing indicators for better UX
- Message history maintained in session
- Enter key support for sending messages

### Lab Simulations
- Interactive controls with sliders and buttons
- Real-time physics calculations
- Canvas-based visualizations
- Educational content with objectives and observations

### Library System
- Book cards with hover effects
- Category filtering
- Purchase interface (mock implementation)
- Responsive grid layout

## Browser Compatibility

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Future Enhancements

- User authentication and profiles
- Progress tracking and analytics
- Real AI API integration
- Payment gateway integration for book purchases
- More lab experiments and simulations
- Video tutorials and resources
- Discussion forums
- Online quizzes and assessments

## Contributing

Feel free to contribute by:
- Adding new lab experiments
- Improving the AI response system
- Enhancing the UI/UX
- Adding more educational content
- Fixing bugs and issues

## License

This project is open source and available under the MIT License.

---

**Note:** This is a demonstration project. The AI chat uses mock responses and the book purchasing system is simulated. In a production environment, you would need to integrate with real AI services and payment gateways.

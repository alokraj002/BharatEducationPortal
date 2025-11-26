// Global variables
let currentSection = 'home';
let aiApiKey = ''; // User will need to set their API key
let aiApiEndpoint = 'https://api.openai.com/v1/chat/completions'; // OpenAI API endpoint
let useRealAI = false; // Toggle between mock and real AI
let chatHistory = [];

// Marketplace and Credit System
let userCredits = 500; // Starting credits
let marketplaceBooks = []; // Student listings
let myListings = []; // User's listings
let transactions = []; // Transaction history

// Community Chat System
let currentChatRoom = null;
let currentUser = {
    name: "Student User",
    avatar: "👨‍🎓",
    id: "student_" + Math.random().toString(36).substr(2, 9)
};

// Chat rooms data
const chatRooms = {
    general: {
        name: "General Discussion",
        description: "Open to all students",
        icon: "fa-comments",
        color: "blue",
        onlineCount: 12,
        messages: [
            {
                id: 1,
                user: "Rahul Sharma",
                avatar: "👨‍🎓",
                message: "Hey everyone! How's the preparation going?",
                timestamp: new Date(Date.now() - 3600000),
                isOwn: false
            },
            {
                id: 2,
                user: "Priya Patel",
                avatar: "👩‍🎓",
                message: "Great! Just finished the physics assignment. Anyone need help?",
                timestamp: new Date(Date.now() - 3000000),
                isOwn: false
            },
            {
                id: 3,
                user: "Amit Kumar",
                avatar: "👨‍🏫",
                message: "I'm stuck on calculus problems. Can someone explain derivatives?",
                timestamp: new Date(Date.now() - 1800000),
                isOwn: false
            }
        ]
    },
    study: {
        name: "Study Groups",
        description: "Collaborative learning",
        icon: "fa-book-open",
        color: "green",
        onlineCount: 8,
        messages: [
            {
                id: 1,
                user: "Neha Singh",
                avatar: "👩‍🎓",
                message: "Starting a study group for JEE preparation. Who's interested?",
                timestamp: new Date(Date.now() - 7200000),
                isOwn: false
            },
            {
                id: 2,
                user: "Vikram Reddy",
                avatar: "👨‍🎓",
                message: "Count me in! I need help with organic chemistry.",
                timestamp: new Date(Date.now() - 6000000),
                isOwn: false
            }
        ]
    },
    physics: {
        name: "Physics Help",
        description: "Get physics assistance",
        icon: "fa-atom",
        color: "purple",
        onlineCount: 5,
        messages: [
            {
                id: 1,
                user: "Dr. Sharma",
                avatar: "👨‍🏫",
                message: "Remember: F = ma is the foundation of mechanics!",
                timestamp: new Date(Date.now() - 5400000),
                isOwn: false
            },
            {
                id: 2,
                user: "Kavya Nair",
                avatar: "👩‍🎓",
                message: "Can someone explain quantum mechanics basics?",
                timestamp: new Date(Date.now() - 2400000),
                isOwn: false
            }
        ]
    },
    math: {
        name: "Mathematics",
        description: "Solve problems together",
        icon: "fa-calculator",
        color: "orange",
        onlineCount: 7,
        messages: [
            {
                id: 1,
                user: "Prof. Gupta",
                avatar: "👨‍🏫",
                message: "Practice makes perfect! Try solving 5 problems daily.",
                timestamp: new Date(Date.now() - 4800000),
                isOwn: false
            },
            {
                id: 2,
                user: "Arjun Mehta",
                avatar: "👨‍🎓",
                message: "Integration techniques are tricky. Any tips?",
                timestamp: new Date(Date.now() - 1200000),
                isOwn: false
            }
        ]
    }
};

// Initialize sample marketplace data
function initializeMarketplace() {
    marketplaceBooks = [
        {
            id: 101,
            title: "Physics for JEE Advanced",
            author: "H.C. Verma",
            category: "textbooks",
            condition: "good",
            price: 150,
            originalPrice: 450,
            seller: "Rahul Sharma",
            description: "Good condition, minimal highlighting, covers all JEE topics",
            contactMethod: "chat",
            listedDate: new Date('2024-01-15')
        },
        {
            id: 102,
            title: "Organic Chemistry Notes",
            author: "Self-prepared",
            category: "notes",
            condition: "new",
            price: 80,
            originalPrice: 0,
            seller: "Priya Patel",
            description: "Complete handwritten notes for 12th grade organic chemistry",
            contactMethod: "email",
            listedDate: new Date('2024-01-20')
        },
        {
            id: 103,
            title: "The Alchemist",
            author: "Paulo Coelho",
            category: "novels",
            condition: "fair",
            price: 50,
            originalPrice: 250,
            seller: "Amit Kumar",
            description: "Classic novel, slightly worn cover, readable condition",
            contactMethod: "phone",
            listedDate: new Date('2024-01-18')
        }
    ];
}

// Navigation
function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('section').forEach(section => {
        section.classList.remove('section-active');
        section.classList.add('section-hidden');
    });
    
    // Show selected section
    document.getElementById(sectionId).classList.remove('section-hidden');
    document.getElementById(sectionId).classList.add('section-active');
    
    currentSection = sectionId;
    
    // Initialize section-specific content
    if (sectionId === 'library') {
        loadBooks();
    } else if (sectionId === 'marketplace') {
        loadMarketplace();
    } else if (sectionId === 'profile') {
        loadProfile();
    } else if (sectionId === 'community') {
        loadCommunity();
    }
}

// AI Chat Functions
function sendMessage() {
    const input = document.getElementById('user-input');
    const message = input.value.trim();
    
    if (!message) return;
    
    // Add user message
    addMessage(message, 'user');
    input.value = '';
    
    // Get AI response
    getAIResponse(message);
}

function askQuickQuestion(question) {
    const input = document.getElementById('user-input');
    input.value = question;
    sendMessage();
}

function addMessage(message, sender) {
    const chatMessages = document.getElementById('chat-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'chat-message flex items-start space-x-3';
    
    if (sender === 'user') {
        messageDiv.innerHTML = `
            <div class="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
                <i class="fas fa-user text-white text-sm"></i>
            </div>
            <div class="bg-gradient-to-r from-green-100 to-emerald-100 rounded-2xl p-4 max-w-md">
                <p class="text-gray-800">${message}</p>
            </div>
        `;
    } else {
        messageDiv.innerHTML = `
            <div class="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                <i class="fas fa-robot text-white text-sm"></i>
            </div>
            <div class="bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl p-4 max-w-md">
                <p class="text-gray-800">${message}</p>
            </div>
        `;
    }
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

async function getAIResponse(message) {
    // Show typing indicator
    addMessage('Thinking...', 'ai');
    
    try {
        let response;
        if (useRealAI && aiApiKey) {
            response = await getRealAIResponse(message);
        } else {
            response = await mockAIResponse(message);
        }
        
        // Remove typing indicator and add real response
        const lastMessage = document.querySelector('.chat-message:last-child');
        lastMessage.remove();
        
        addMessage(response, 'ai');
    } catch (error) {
        // Remove typing indicator
        const lastMessage = document.querySelector('.chat-message:last-child');
        lastMessage.remove();
        
        addMessage('Sorry, I encountered an error. Please try again.', 'ai');
    }
}

// Real AI API Integration
async function getRealAIResponse(message) {
    const systemPrompt = `You are an educational AI assistant for the Bharat Education Portal. You help students with Physics, Chemistry, Biology, Mathematics, and general study topics. 

Guidelines:
- Provide clear, educational explanations
- Solve math problems step-by-step when asked
- Be encouraging and supportive
- Keep responses appropriate for students
- For complex math problems, show the working process
- If you don't know something, admit it and suggest resources

Student question: ${message}`;

    const response = await fetch(aiApiEndpoint, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${aiApiKey}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: message }
            ],
            max_tokens: 500,
            temperature: 0.7
        })
    });

    if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
}

// API Configuration Function
function configureAI() {
    const apiKey = prompt('Enter your AI API Key (OpenAI or compatible):');
    if (apiKey) {
        aiApiKey = apiKey;
        useRealAI = true;
        updateAIStatus('AI API configured! Full features enabled.', 'success');
        addMessage('AI API configured successfully! I can now provide intelligent responses and solve complex math problems.', 'ai');
    } else {
        useRealAI = false;
        updateAIStatus('Using demo mode. Click "Configure AI" to enable full features.', 'demo');
        addMessage('Using demo mode. To enable full AI features including complex math problem solving, please configure your API key.', 'ai');
    }
}

// Update AI Status Display
function updateAIStatus(message, type) {
    const statusElement = document.getElementById('ai-status');
    if (statusElement) {
        statusElement.textContent = message;
        if (type === 'success') {
            statusElement.className = 'text-sm text-green-600 font-semibold';
        } else {
            statusElement.className = 'text-sm text-gray-500';
        }
    }
}

// Mock AI Response (replace with actual API call)
async function mockAIResponse(message) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Enhanced keyword-based responses for demo
    const lowerMessage = message.toLowerCase();
    
    // Debug: Log the message to see what's being received
    console.log("AI received message:", message);
    console.log("Lowercase message:", lowerMessage);
    
    // Check for specific topics first (more specific checks)
    if (lowerMessage.includes('newton') && lowerMessage.includes('law')) {
        return "Newton's Laws of Motion:\n\n1️⃣ **First Law (Inertia)**: An object at rest stays at rest, and an object in motion stays in motion unless acted upon by an external force.\n\n2️⃣ **Second Law**: F = ma (Force equals mass times acceleration). The acceleration of an object is directly proportional to the net force acting on it.\n\n3️⃣ **Third Law**: For every action, there is an equal and opposite reaction.\n\nWhich law would you like me to explain in more detail?";
    }
    
    // Check for third law specifically
    if (lowerMessage.includes('third law') || lowerMessage.includes('action') && lowerMessage.includes('reaction')) {
        return "🍎 **Newton's Third Law Explained:**\n\n**Statement:** For every action, there is an equal and opposite reaction.\n\n**Meaning:**\n• When object A exerts a force on object B\n• Object B exerts an equal force in the opposite direction on object A\n• Forces always occur in pairs\n• The forces are equal in magnitude but opposite in direction\n\n**Examples:**\n• **Rocket**: Pushes gas down → Gas pushes rocket up\n• **Walking**: Push foot backward → Ground pushes foot forward\n• **Swimming**: Push water back → Water pushes you forward\n• **Jumping**: Push ground down → Ground pushes you up\n\n**Key Point:** The forces act on different objects, so they don't cancel out!\n\nClear explanation?";
    }
    
    if (lowerMessage.includes('photosynthesis')) {
        return "🌱 **Photosynthesis Explained:**\n\nPhotosynthesis is the process by which plants convert light energy into chemical energy.\n\n**Equation:** 6CO₂ + 6H₂O + Light Energy → C₆H₁₂O₆ + 6O₂\n\n**Steps:**\n1️⃣ Light-dependent reactions (capture light energy)\n2️⃣ Calvin cycle (produce glucose)\n3️⃣ Release oxygen as byproduct\n\n**Importance:** Produces oxygen we breathe and forms the base of most food chains!\n\nNeed more details on any part?";
    }
    
    if (lowerMessage.includes('balance') && lowerMessage.includes('equation')) {
        return handleChemicalEquation(message);
    }
    
    // Check for chemical equation patterns
    if (lowerMessage.includes('h2') && lowerMessage.includes('o2') && lowerMessage.includes('h2o')) {
        return handleChemicalEquation(message);
    }
    
    if (lowerMessage.includes('derivative') || lowerMessage.includes('differentiation')) {
        return "📐 **Derivatives in Calculus:**\n\nA derivative measures the rate of change of a function.\n\n**Basic Rules:**\n• Power Rule: d/dx(xⁿ) = nxⁿ⁻¹\n• Product Rule: d/dx(uv) = u'v + uv'\n• Chain Rule: d/dx(f(g(x))) = f'(g(x))·g'(x)\n\n**Example:** If f(x) = x² + 3x - 2\nThen f'(x) = 2x + 3\n\nThe derivative tells us the slope of the tangent line at any point!\n\nWould you like me to solve a specific derivative problem?";
    }
    
    if (lowerMessage.includes('atom')) {
        return "⚛️ **Atoms Explained:**\n\nAn atom is the basic unit of matter consisting of:\n\n**Structure:**\n• **Nucleus**: Contains protons (+) and neutrons (neutral)\n• **Electrons**: Negatively charged particles orbiting the nucleus\n\n**Key Facts:**\n• Protons determine the element (atomic number)\n• Neutrons affect mass but not charge\n• Electrons determine chemical behavior\n• Most of an atom is empty space!\n\n**Example:** Carbon has 6 protons, 6 neutrons, and 6 electrons\n\nNeed more details about atomic structure?";
    }
    
    if (lowerMessage.includes('cell')) {
        return "🔬 **Cells Explained:**\n\nCells are the basic building blocks of life.\n\n**Types:**\n• **Prokaryotic**: No nucleus (bacteria)\n• **Eukaryotic**: Has nucleus (plants, animals, fungi)\n\n**Plant Cell Parts:**\n• Cell wall: Structural support\n• Chloroplasts: Photosynthesis\n• Large vacuole: Water storage\n\n**Animal Cell Parts:**\n• No cell wall\n• Small vacuoles\n• Centrioles for cell division\n\n**Common to Both:**\n• Nucleus: DNA storage\n• Mitochondria: Energy production\n• Cytoplasm: Cell contents\n\nWant to dive deeper into cell biology?";
    }
    
    if (lowerMessage.includes('energy')) {
        return "⚡ **Energy Explained:**\n\nEnergy is the capacity to do work or cause change.\n\n**Forms of Energy:**\n• **Kinetic**: Energy of motion (moving objects)\n• **Potential**: Stored energy (position, chemical bonds)\n• **Thermal**: Heat energy\n• **Electrical**: Movement of electrons\n• **Chemical**: Stored in chemical bonds\n• **Nuclear**: Stored in atomic nuclei\n\n**Conservation of Energy:**\nEnergy cannot be created or destroyed, only transformed from one form to another.\n\n**Examples:**\n• Falling object: Potential → Kinetic\n• Battery: Chemical → Electrical\n• Light bulb: Electrical → Light + Heat\n\nWhich energy form would you like to explore?";
    }
    
    // Check for math equation solving
    if (lowerMessage.includes('solve') && (lowerMessage.includes('x') || lowerMessage.includes('equation'))) {
        return solveMathEquation(message);
    }
    
    if (lowerMessage.includes('2x') && lowerMessage.includes('5x') && lowerMessage.includes('3')) {
        return solveMathEquation(message);
    }
    
    // Check for question patterns
    const questionPatterns = [
        'what is', 'define', 'explain', 'what are', 'what does', 'what do',
        'how does', 'how do', 'how is', 'how are', 'how can',
        'why is', 'why are', 'why do', 'why does',
        'solve', 'calculate', 'find', 'determine', 'compute'
    ];
    
    const isQuestion = questionPatterns.some(pattern => lowerMessage.includes(pattern));
    
    if (isQuestion) {
        // Try to match specific question types
        if (lowerMessage.includes('what is') || lowerMessage.includes('define') || lowerMessage.includes('explain')) {
            return handleExplanationRequest(message);
        }
        
        if (lowerMessage.includes('solve') || lowerMessage.includes('calculate') || lowerMessage.includes('find')) {
            return handleProblemSolving(message);
        }
        
        if (lowerMessage.includes('how') && (lowerMessage.includes('work') || lowerMessage.includes('do') || lowerMessage.includes('does'))) {
            return handleHowItWorks(message);
        }
        
        if (lowerMessage.includes('why') || lowerMessage.includes('because')) {
            return handleWhyQuestion(message);
        }
    }
    
    // Enhanced subject responses with more detail
    if (lowerMessage.includes('physics') || lowerMessage.includes('force') || lowerMessage.includes('motion') || lowerMessage.includes('energy')) {
        return "⚛️ **Physics Help:**\n\nI can help you with:\n• **Mechanics**: Newton's laws, motion, forces, energy\n• **Waves**: Sound, light, electromagnetic radiation\n• **Thermodynamics**: Heat, temperature, energy transfer\n• **Electricity**: Circuits, charges, magnetism\n• **Modern Physics**: Quantum mechanics, relativity\n\n**Current Topics:**\n• F = ma and force problems\n• Conservation of energy\n• Wave properties\n• Circuit analysis\n\nWhat specific physics concept or problem can I help you solve?";
    }
    
    if (lowerMessage.includes('chemistry') || lowerMessage.includes('chemical') || lowerMessage.includes('atom') || lowerMessage.includes('molecule')) {
        return "🧪 **Chemistry Assistance:**\n\nI can help with:\n• **Atomic Structure**: Protons, neutrons, electrons, isotopes\n• **Chemical Bonding**: Ionic, covalent, metallic bonds\n• **Reactions**: Balancing equations, types of reactions\n• **Solutions**: Concentration, pH, acids and bases\n• **Organic Chemistry**: Hydrocarbons, functional groups\n• **Periodic Trends**: Properties across periods and groups\n\n**Common Problems:**\n• Balancing chemical equations\n• Calculating molarity/mass\n• Understanding reaction mechanisms\n\nWhat chemistry topic do you need help with?";
    }
    
    if (lowerMessage.includes('biology') || lowerMessage.includes('cell') || lowerMessage.includes('gene') || lowerMessage.includes('dna')) {
        return "🧬 **Biology Support:**\n\nI can assist with:\n• **Cell Biology**: Structure, organelles, cell division\n• **Genetics**: DNA, RNA, inheritance, mutations\n• **Evolution**: Natural selection, adaptation, speciation\n• **Ecology**: Ecosystems, food chains, biodiversity\n• **Human Biology**: Systems, organs, homeostasis\n\n**Key Processes:**\n• Photosynthesis and cellular respiration\n• Mitosis and meiosis\n• Protein synthesis\n• Natural selection\n\nWhat biological concept would you like to explore?";
    }
    
    if (lowerMessage.includes('math') || lowerMessage.includes('algebra') || lowerMessage.includes('geometry') || lowerMessage.includes('calculus')) {
        return "📊 **Mathematics Help:**\n\nI can solve problems in:\n• **Algebra**: Equations, functions, polynomials\n• **Geometry**: Shapes, angles, area, volume\n• **Trigonometry**: Sine, cosine, tangent, identities\n• **Calculus**: Derivatives, integrals, limits\n• **Statistics**: Probability, data analysis, graphs\n\n**Problem Types:**\n• Step-by-step equation solving\n• Geometric proofs\n• Derivative/integral calculations\n• Word problems\n\nGive me a specific math problem and I'll solve it step-by-step!";
    }
    
    // Study help responses
    if (lowerMessage.includes('study') || lowerMessage.includes('learn') || lowerMessage.includes('prepare') || lowerMessage.includes('exam')) {
        return "📚 **Study Strategies:**\n\n**Effective Learning Techniques:**\n1️⃣ **Active Recall**: Test yourself instead of re-reading\n2️⃣ **Spaced Repetition**: Review material at increasing intervals\n3️⃣ **Practice Problems**: Apply concepts to solve problems\n4️⃣ **Teach Others**: Explain concepts to someone else\n\n**Exam Preparation:**\n• Start early and create a schedule\n• Focus on understanding, not memorization\n• Practice with past papers\n• Get adequate sleep before exams\n\n**Subject-Specific Tips:**\n• Physics: Focus on concepts and problem-solving\n• Chemistry: Memorize key reactions and formulas\n• Biology: Understand processes and connections\n• Math: Practice, practice, practice!\n\nWhat subject are you preparing for?";
    }
    
    // Greeting responses
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
        return "👋 Hello! I'm your AI learning assistant, ready to help with Physics, Chemistry, Biology, Mathematics, and study strategies!\n\n**What can I help you with today?**\n• Ask me to explain concepts\n• Solve math or science problems\n• Help with homework questions\n• Study for exams\n\nWhat would you like to learn about?";
    }
    
    // Default comprehensive response
    return "🎓 **Your AI Learning Assistant**\n\nI'm here to help with:\n\n📚 **Subjects:** Physics, Chemistry, Biology, Mathematics\n🔬 **Lab Help:** Virtual experiments and simulations\n📝 **Study Tips:** Effective learning strategies\n✏️ **Problem Solving:** Step-by-step solutions\n\n**How to ask me:**\n• \"Explain [concept]\" - for detailed explanations\n• \"Solve [problem]\" - for step-by-step solutions\n• \"How does [process] work?\" - for process explanations\n• \"Why [phenomenon]?\" - for understanding reasons\n\n**Example questions:**\n• \"Explain Newton's third law\"\n• \"Solve: 2x² + 5x - 3 = 0\"\n• \"How does photosynthesis work?\"\n• \"Balance: H₂ + O₂ → H₂O\"\n\nWhat would you like to learn about today?";
}

// Handle explanation requests
function handleExplanationRequest(message) {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('atom')) {
        return "⚛️ **Atoms Explained:**\n\nAn atom is the basic unit of matter consisting of:\n\n**Structure:**\n• **Nucleus**: Contains protons (+) and neutrons (neutral)\n• **Electrons**: Negatively charged particles orbiting the nucleus\n\n**Key Facts:**\n• Protons determine the element (atomic number)\n• Neutrons affect mass but not charge\n• Electrons determine chemical behavior\n• Most of an atom is empty space!\n\n**Example:** Carbon has 6 protons, 6 neutrons, and 6 electrons\n\nNeed more details about atomic structure?";
    }
    
    if (lowerMessage.includes('cell')) {
        return "🔬 **Cells Explained:**\n\nCells are the basic building blocks of life.\n\n**Types:**\n• **Prokaryotic**: No nucleus (bacteria)\n• **Eukaryotic**: Has nucleus (plants, animals, fungi)\n\n**Plant Cell Parts:**\n• Cell wall: Structural support\n• Chloroplasts: Photosynthesis\n• Large vacuole: Water storage\n\n**Animal Cell Parts:**\n• No cell wall\n• Small vacuoles\n• Centrioles for cell division\n\n**Common to Both:**\n• Nucleus: DNA storage\n• Mitochondria: Energy production\n• Cytoplasm: Cell contents\n\nWant to dive deeper into cell biology?";
    }
    
    if (lowerMessage.includes('energy')) {
        return "⚡ **Energy Explained:**\n\nEnergy is the capacity to do work or cause change.\n\n**Forms of Energy:**\n• **Kinetic**: Energy of motion (moving objects)\n• **Potential**: Stored energy (position, chemical bonds)\n• **Thermal**: Heat energy\n• **Electrical**: Movement of electrons\n• **Chemical**: Stored in chemical bonds\n• **Nuclear**: Stored in atomic nuclei\n\n**Conservation of Energy:**\nEnergy cannot be created or destroyed, only transformed from one form to another.\n\n**Examples:**\n• Falling object: Potential → Kinetic\n• Battery: Chemical → Electrical\n• Light bulb: Electrical → Light + Heat\n\nWhich energy form would you like to explore?";
    }
    
    return "I'd be happy to explain that! Could you be more specific about what concept you'd like me to explain? For example:\n\n• \"Explain atoms\" - for atomic structure\n• \"Explain cells\" - for cell biology\n• \"Explain energy\" - for energy concepts\n• \"Explain photosynthesis\" - for plant processes\n\nWhat specific topic would you like me to explain in detail?";
}

// Handle problem solving
function handleProblemSolving(message) {
    const lowerMessage = message.toLowerCase();
    
    // Math equation solving
    if (lowerMessage.includes('equation') || lowerMessage.includes('x') || lowerMessage.includes('=')) {
        return solveMathEquation(message);
    }
    
    // Physics problems
    if (lowerMessage.includes('force') || lowerMessage.includes('acceleration') || lowerMessage.includes('mass')) {
        return "🔬 **Physics Problem Solving:**\n\n**Key Formulas:**\n• Force: F = ma\n• Weight: W = mg (g = 9.8 m/s²)\n• Momentum: p = mv\n• Kinetic Energy: KE = ½mv²\n• Potential Energy: PE = mgh\n\n**Example Problem:**\nIf a 5kg object accelerates at 2 m/s²:\nF = ma = 5kg × 2 m/s² = 10N\n\nPlease provide the specific numbers and what you need to find, and I'll solve it step-by-step!";
    }
    
    return "I can help solve problems step-by-step! Please provide:\n\n• **Math Problems**: Give me the equation or numbers\n• **Physics Problems**: Include given values and what to find\n• **Chemistry Problems**: Show the reaction or concentrations\n\nExample: \"Solve 2x² + 5x - 3 = 0\" or \"Find force if mass = 5kg and acceleration = 2m/s²\"";
}

// Handle "how it works" questions
function handleHowItWorks(message) {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('respiration')) {
        return "🫁 **Cellular Respiration:**\n\n**Process:** Converting glucose to ATP (energy)\n\n**Equation:** C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O + ATP\n\n**Steps:**\n1️⃣ **Glycolysis**: Glucose → Pyruvate (2 ATP)\n2️⃣ **Krebs Cycle**: Pyruvate → CO₂ (2 ATP)\n3️⃣ **Electron Transport**: Oxygen → Water (32 ATP)\n\n**Total**: ~36 ATP per glucose molecule\n\n**Importance**: Powers all cellular activities!\n\nNeed more details on any step?";
    }
    
    if (lowerMessage.includes('nervous system')) {
        return "🧠 **How the Nervous System Works:**\n\n**Basic Process:**\n1️⃣ **Stimulus** detected by receptors\n2️⃣ **Signal** travels through sensory neurons\n3️⃣ **Processing** in brain/spinal cord\n4️⃣ **Response** sent via motor neurons\n5️⃣ **Action** by muscles/glands\n\n**Key Components:**\n• **Neurons**: Signal transmission cells\n• **Synapses**: Connection points between neurons\n• **Neurotransmitters**: Chemical messengers\n• **Brain**: Central processing unit\n• **Spinal Cord**: Information highway\n\n**Speed**: Up to 120 m/s for myelinated neurons!\n\nWant to know more about neural transmission?";
    }
    
    return "I can explain how things work! Please specify what process or system you'd like me to explain, such as:\n\n• \"How does respiration work?\"\n• \"How does the nervous system work?\"\n• \"How do batteries work?\"\n• \"How does photosynthesis work?\"";
}

// Handle "why" questions
function handleWhyQuestion(message) {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('sky') && lowerMessage.includes('blue')) {
        return "🌍 **Why the Sky is Blue:**\n\n**Rayleigh Scattering:**\n1️⃣ Sunlight contains all colors (white light)\n2️⃣ Blue light has shorter wavelength (~450nm)\n3️⃣ Short wavelengths scatter more than long ones\n4️⃣ Blue light scatters in all directions\n5️⃣ We see blue from all directions\n\n**Why not violet?** \nViolet scatters even more, but:\n• Our eyes are less sensitive to violet\n• Sun emits less violet light\n• Some violet is absorbed by atmosphere\n\n**Sunset = Red/Orange** because:\n• Light travels through more atmosphere\n• Most blue light has scattered away\n• Only long wavelengths (red/orange) remain\n\nCool, right?";
    }
    
    if (lowerMessage.includes('gravity')) {
        return "🌍 **Why Gravity Exists:**\n\n**Einstein's Explanation:**\nGravity isn't a force, but the curvature of spacetime!\n\n**How it works:**\n1️⃣ Mass/energy warps the fabric of spacetime\n2️⃣ Objects follow the straightest path through curved space\n3️⃣ This curved path appears as \"gravity\" to us\n4️⃣ More mass = more curvature = stronger gravity\n\n**Example:**\n• Earth creates a \"dent\" in spacetime\n• Moon follows this curved path\n• We perceive this as orbital motion\n\n**Newton vs Einstein:**\n• Newton: Gravity is a mysterious force\n• Einstein: Gravity is geometry!\n\nMind-blowing, isn't it?";
    }
    
    return "I love explaining \"why\" questions! Please tell me what phenomenon you're curious about, such as:\n\n• \"Why is the sky blue?\"\n• \"Why do we have gravity?\"\n• \"Why do objects fall?\"\n• \"Why do we need to breathe?\"";
}

// Handle chemical equation balancing
function handleChemicalEquation(message) {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('h2') && lowerMessage.includes('o2') && lowerMessage.includes('h2o')) {
        return "⚗️ **Balancing: H₂ + O₂ → H₂O**\n\n**Step 1:** Count atoms on both sides\n• Left: H=2, O=2\n• Right: H=2, O=1\n\n**Step 2:** Balance oxygen first\n• Add coefficient 2 to H₂O: H₂ + O₂ → 2H₂O\n• Now: Left H=2, O=2 | Right H=4, O=2\n\n**Step 3:** Balance hydrogen\n• Add coefficient 2 to H₂: 2H₂ + O₂ → 2H₂O\n• Final: Left H=4, O=2 | Right H=4, O=2 ✅\n\n**Balanced Equation:** 2H₂ + O₂ → 2H₂O\n\n**Check:** 4H + 2O → 4H + 2O (balanced!)\n\nNeed help with another equation?";
    }
    
    return "I can help balance chemical equations! Please provide the unbalanced equation, such as:\n\n• \"Balance: H₂ + O₂ → H₂O\"\n• \"Balance: CH₄ + O₂ → CO₂ + H₂O\"\n• \"Balance: Fe + O₂ → Fe₂O₃\"\n\nI'll show you the step-by-step balancing process!";
}

// Solve math equations
function solveMathEquation(message) {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('2x') && lowerMessage.includes('5x') && lowerMessage.includes('3')) {
        return "📐 **Solving: 2x² + 5x - 3 = 0**\n\n**Method: Quadratic Formula**\nFor ax² + bx + c = 0, x = [-b ± √(b²-4ac)]/2a\n\n**Given:** a=2, b=5, c=-3\n\n**Step 1:** Calculate discriminant\nΔ = b² - 4ac = 5² - 4(2)(-3) = 25 + 24 = 49\n\n**Step 2:** Apply formula\nx = [-5 ± √49]/(2×2) = [-5 ± 7]/4\n\n**Step 3:** Find both solutions\nx₁ = (-5 + 7)/4 = 2/4 = 0.5\nx₂ = (-5 - 7)/4 = -12/4 = -3\n\n**Answer:** x = 0.5 or x = -3\n\n**Check:**\nFor x=0.5: 2(0.25) + 5(0.5) - 3 = 0.5 + 2.5 - 3 = 0 ✅\nFor x=-3: 2(9) + 5(-3) - 3 = 18 - 15 - 3 = 0 ✅\n\nNeed help with another equation?";
    }
    
    return "I can solve math equations step-by-step! Please provide the specific equation, such as:\n\n• \"Solve: 2x² + 5x - 3 = 0\"\n• \"Solve: 3x - 7 = 14\"\n• \"Solve: x² - 9 = 0\"\n\nI'll show you the complete solution process!";
}

// Lab Functions
function startPhysicsLab(experiment) {
    const modal = document.getElementById('lab-modal');
    const title = document.getElementById('lab-title');
    const content = document.getElementById('lab-content');
    
    if (experiment === 'pendulum') {
        title.textContent = 'Pendulum Motion Experiment';
        content.innerHTML = `
            <div class="space-y-6">
                <div>
                    <h4 class="text-lg font-semibold mb-2">Objective</h4>
                    <p class="text-gray-600">Study the relationship between pendulum length and period.</p>
                </div>
                
                <div>
                    <h4 class="text-lg font-semibold mb-2">Interactive Simulation</h4>
                    <div class="bg-gray-100 rounded-lg p-8 text-center">
                        <canvas id="pendulum-canvas" width="400" height="300" class="mx-auto border border-gray-300 bg-white"></canvas>
                    </div>
                </div>
                
                <div>
                    <h4 class="text-lg font-semibold mb-2">Controls</h4>
                    <div class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium mb-1">Pendulum Length (m):</label>
                            <input type="range" id="length-slider" min="0.5" max="2" step="0.1" value="1" 
                                   class="w-full" onchange="updatePendulum()">
                            <span id="length-value">1.0 m</span>
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1">Initial Angle (degrees):</label>
                            <input type="range" id="angle-slider" min="5" max="45" step="5" value="15" 
                                   class="w-full" onchange="updatePendulum()">
                            <span id="angle-value">15°</span>
                        </div>
                        <button onclick="runPendulumSimulation()" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                            <i class="fas fa-play mr-2"></i>Run Simulation
                        </button>
                    </div>
                </div>
                
                <div>
                    <h4 class="text-lg font-semibold mb-2">Observations</h4>
                    <div id="pendulum-results" class="bg-blue-50 p-4 rounded">
                        <p>Run the simulation to see results...</p>
                    </div>
                </div>
            </div>
        `;
    } else if (experiment === 'projectile') {
        title.textContent = 'Projectile Motion Experiment';
        content.innerHTML = `
            <div class="space-y-6">
                <div>
                    <h4 class="text-lg font-semibold mb-2">Objective</h4>
                    <p class="text-gray-600">Explore how initial velocity and angle affect projectile trajectory.</p>
                </div>
                
                <div>
                    <h4 class="text-lg font-semibold mb-2">Interactive Simulation</h4>
                    <div class="bg-gray-100 rounded-lg p-8 text-center">
                        <canvas id="projectile-canvas" width="400" height="300" class="mx-auto border border-gray-300 bg-white"></canvas>
                    </div>
                </div>
                
                <div>
                    <h4 class="text-lg font-semibold mb-2">Controls</h4>
                    <div class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium mb-1">Initial Velocity (m/s):</label>
                            <input type="range" id="velocity-slider" min="10" max="50" step="5" value="25" 
                                   class="w-full" onchange="updateProjectile()">
                            <span id="velocity-value">25 m/s</span>
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1">Launch Angle (degrees):</label>
                            <input type="range" id="launch-angle-slider" min="15" max="75" step="5" value="45" 
                                   class="w-full" onchange="updateProjectile()">
                            <span id="launch-angle-value">45°</span>
                        </div>
                        <button onclick="runProjectileSimulation()" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                            <i class="fas fa-play mr-2"></i>Launch
                        </button>
                    </div>
                </div>
                
                <div>
                    <h4 class="text-lg font-semibold mb-2">Results</h4>
                    <div id="projectile-results" class="bg-blue-50 p-4 rounded">
                        <p>Launch the projectile to see results...</p>
                    </div>
                </div>
            </div>
        `;
    }
    
    modal.classList.remove('hidden');
}

function startChemistryLab(experiment) {
    const modal = document.getElementById('lab-modal');
    const title = document.getElementById('lab-title');
    const content = document.getElementById('lab-content');
    
    if (experiment === 'titration') {
        title.textContent = 'Acid-Base Titration Experiment';
        content.innerHTML = `
            <div class="space-y-6">
                <div>
                    <h4 class="text-lg font-semibold mb-2">Objective</h4>
                    <p class="text-gray-600">Determine the concentration of an unknown acid solution through titration.</p>
                </div>
                
                <div>
                    <h4 class="text-lg font-semibold mb-2">Virtual Titration Setup</h4>
                    <div class="bg-gray-100 rounded-lg p-8">
                        <div class="grid grid-cols-2 gap-4">
                            <div class="bg-white rounded p-4">
                                <h5 class="font-semibold mb-2">Burette (Base)</h5>
                                <div class="text-center">
                                    <div class="w-16 h-32 bg-blue-200 mx-auto mb-2 rounded"></div>
                                    <p>0.1 M NaOH</p>
                                    <p>Volume: <span id="base-volume">0.0</span> mL</p>
                                </div>
                            </div>
                            <div class="bg-white rounded p-4">
                                <h5 class="font-semibold mb-2">Flask (Acid)</h5>
                                <div class="text-center">
                                    <div class="w-20 h-20 bg-pink-200 mx-auto mb-2 rounded-full" id="acid-ph"></div>
                                    <p>Unknown HCl</p>
                                    <p>pH: <span id="ph-value">3.0</span></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div>
                    <h4 class="text-lg font-semibold mb-2">Titration Controls</h4>
                    <div class="space-y-4">
                        <button onclick="addBase(0.5)" class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                            Add Base (0.5 mL)
                        </button>
                        <button onclick="resetTitration()" class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
                            Reset Experiment
                        </button>
                    </div>
                </div>
                
                <div>
                    <h4 class="text-lg font-semibold mb-2">pH Curve</h4>
                    <div class="bg-gray-100 rounded p-4">
                        <canvas id="ph-curve" width="400" height="200" class="w-full"></canvas>
                    </div>
                </div>
            </div>
        `;
    } else if (experiment === 'reactions') {
        title.textContent = 'Chemical Reactions Explorer';
        content.innerHTML = `
            <div class="space-y-6">
                <div>
                    <h4 class="text-lg font-semibold mb-2">Explore Different Reaction Types</h4>
                    <p class="text-gray-600">Select a reaction type to see the molecular animation and balanced equation.</p>
                </div>
                
                <div class="grid grid-cols-2 gap-4">
                    <button onclick="showReaction('synthesis')" class="bg-green-500 text-white p-4 rounded hover:bg-green-600">
                        <i class="fas fa-plus mb-2"></i>
                        <p>Synthesis Reaction</p>
                    </button>
                    <button onclick="showReaction('decomposition')" class="bg-orange-500 text-white p-4 rounded hover:bg-orange-600">
                        <i class="fas fa-minus mb-2"></i>
                        <p>Decomposition Reaction</p>
                    </button>
                    <button onclick="showReaction('single')" class="bg-blue-500 text-white p-4 rounded hover:bg-blue-600">
                        <i class="fas fa-exchange-alt mb-2"></i>
                        <p>Single Displacement</p>
                    </button>
                    <button onclick="showReaction('double')" class="bg-purple-500 text-white p-4 rounded hover:bg-purple-600">
                        <i class="fas fa-random mb-2"></i>
                        <p>Double Displacement</p>
                    </button>
                </div>
                
                <div id="reaction-display" class="bg-gray-50 rounded p-6">
                    <p class="text-center text-gray-500">Select a reaction type to begin...</p>
                </div>
            </div>
        `;
    } else if (experiment === 'solutions') {
        title.textContent = 'Solutions & Concentrations Lab';
        content.innerHTML = `
            <div class="space-y-6">
                <div>
                    <h4 class="text-lg font-semibold mb-2">Objective</h4>
                    <p class="text-gray-600">Learn to calculate molarity, molality, and prepare chemical solutions.</p>
                </div>
                
                <div>
                    <h4 class="text-lg font-semibold mb-2">Solution Calculator</h4>
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium mb-1">Solute Mass (g):</label>
                            <input type="number" id="solute-mass" value="58.44" step="0.01" 
                                   class="w-full px-3 py-2 border rounded">
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1">Molar Mass (g/mol):</label>
                            <input type="number" id="molar-mass" value="58.44" step="0.01" 
                                   class="w-full px-3 py-2 border rounded">
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1">Solution Volume (L):</label>
                            <input type="number" id="solution-volume" value="0.5" step="0.01" 
                                   class="w-full px-3 py-2 border rounded">
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1">Solvent Mass (kg):</label>
                            <input type="number" id="solvent-mass" value="0.495" step="0.001" 
                                   class="w-full px-3 py-2 border rounded">
                        </div>
                    </div>
                    <button onclick="calculateSolution()" class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mt-4">
                        <i class="fas fa-calculator mr-2"></i>Calculate
                    </button>
                </div>
                
                <div>
                    <h4 class="text-lg font-semibold mb-2">Common Compounds</h4>
                    <div class="grid grid-cols-2 gap-2">
                        <button onclick="setCompound('NaCl', 58.44)" class="bg-blue-100 px-3 py-2 rounded text-sm hover:bg-blue-200">
                            NaCl (58.44 g/mol)
                        </button>
                        <button onclick="setCompound('HCl', 36.46)" class="bg-blue-100 px-3 py-2 rounded text-sm hover:bg-blue-200">
                            HCl (36.46 g/mol)
                        </button>
                        <button onclick="setCompound('NaOH', 40.00)" class="bg-blue-100 px-3 py-2 rounded text-sm hover:bg-blue-200">
                            NaOH (40.00 g/mol)
                        </button>
                        <button onclick="setCompound('H₂SO₄', 98.08)" class="bg-blue-100 px-3 py-2 rounded text-sm hover:bg-blue-200">
                            H₂SO₄ (98.08 g/mol)
                        </button>
                    </div>
                </div>
                
                <div>
                    <h4 class="text-lg font-semibold mb-2">Results</h4>
                    <div id="solution-results" class="bg-green-50 p-4 rounded">
                        <p>Enter values and click Calculate to see results...</p>
                    </div>
                </div>
                
                <div>
                    <h4 class="text-lg font-semibold mb-2">Dilution Calculator</h4>
                    <div class="grid grid-cols-3 gap-4">
                        <div>
                            <label class="block text-sm font-medium mb-1">Initial Concentration (M):</label>
                            <input type="number" id="initial-conc" value="1.0" step="0.1" 
                                   class="w-full px-3 py-2 border rounded">
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1">Final Volume (L):</label>
                            <input type="number" id="final-volume" value="0.25" step="0.01" 
                                   class="w-full px-3 py-2 border rounded">
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1">Final Concentration (M):</label>
                            <input type="number" id="final-conc" value="0.1" step="0.01" 
                                   class="w-full px-3 py-2 border rounded">
                        </div>
                    </div>
                    <button onclick="calculateDilution()" class="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 mt-4">
                        <i class="fas fa-flask mr-2"></i>Calculate Dilution
                    </button>
                    <div id="dilution-results" class="bg-purple-50 p-4 rounded mt-4">
                        <p>Calculate dilution requirements...</p>
                    </div>
                </div>
            </div>
        `;
    }
    
    modal.classList.remove('hidden');
}

function startBiologyLab(experiment) {
    const modal = document.getElementById('lab-modal');
    const title = document.getElementById('lab-title');
    const content = document.getElementById('lab-content');
    
    if (experiment === 'celldivision') {
        title.textContent = 'Cell Division Explorer';
        content.innerHTML = `
            <div class="space-y-6">
                <div>
                    <h4 class="text-lg font-semibold mb-2">Explore Mitosis and Meiosis</h4>
                    <p class="text-gray-600">Visualize the stages of cell division and understand the differences.</p>
                </div>
                
                <div class="flex space-x-4">
                    <button onclick="showCellDivision('mitosis')" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                        Mitosis
                    </button>
                    <button onclick="showCellDivision('meiosis')" class="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600">
                        Meiosis
                    </button>
                </div>
                
                <div id="cell-division-content" class="bg-gray-50 rounded p-6">
                    <p class="text-center text-gray-500">Select a division type to explore...</p>
                </div>
            </div>
        `;
    } else if (experiment === 'dna') {
        title.textContent = 'DNA Structure Explorer';
        content.innerHTML = `
            <div class="space-y-6">
                <div>
                    <h4 class="text-lg font-semibold mb-2">DNA Double Helix Structure</h4>
                    <p class="text-gray-600">Explore the structure of DNA and base pairing rules.</p>
                </div>
                
                <div class="bg-gray-100 rounded-lg p-8 text-center">
                    <canvas id="dna-canvas" width="400" height="300" class="mx-auto border border-gray-300 bg-white"></canvas>
                </div>
                
                <div>
                    <h4 class="text-lg font-semibold mb-2">Base Pairing Rules</h4>
                    <div class="grid grid-cols-2 gap-4">
                        <div class="bg-blue-50 p-4 rounded">
                            <h5 class="font-semibold text-blue-700">Adenine (A)</h5>
                            <p>Always pairs with Thymine (T)</p>
                            <p>2 hydrogen bonds</p>
                        </div>
                        <div class="bg-green-50 p-4 rounded">
                            <h5 class="font-semibold text-green-700">Guanine (G)</h5>
                            <p>Always pairs with Cytosine (C)</p>
                            <p>3 hydrogen bonds</p>
                        </div>
                    </div>
                </div>
                
                <button onclick="animateDNA()" class="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600">
                    <i class="fas fa-play mr-2"></i>Animate DNA
                </button>
            </div>
        `;
    }
    
    modal.classList.remove('hidden');
}

function closeLabModal() {
    document.getElementById('lab-modal').classList.add('hidden');
}

// Library Functions
const books = [
    { id: 1, title: "NCERT Physics Class 11", author: "NCERT", price: 299, category: "physics", image: "physics11.jpg" },
    { id: 2, title: "Concepts of Physics", author: "H.C. Verma", price: 399, category: "physics", image: "hcverma.jpg" },
    { id: 3, title: "NCERT Chemistry Class 12", author: "NCERT", price: 299, category: "chemistry", image: "chemistry12.jpg" },
    { id: 4, title: "Organic Chemistry", author: "O.P. Tandon", price: 450, category: "chemistry", image: "organic.jpg" },
    { id: 5, title: "NCERT Biology Class 11", author: "NCERT", price: 299, category: "biology", image: "biology11.jpg" },
    { id: 6, title: "Biology for NEET", author: "Trueman", price: 550, category: "biology", image: "neetbio.jpg" },
    { id: 7, title: "Mathematics for Class 10", author: "R.D. Sharma", price: 350, category: "mathematics", image: "math10.jpg" },
    { id: 8, title: "IIT Mathematics", author: "M.L. Khanna", price: 499, category: "mathematics", image: "iitmath.jpg" }
];

function loadBooks(category = 'all') {
    const booksGrid = document.getElementById('books-grid');
    const filteredBooks = category === 'all' ? books : books.filter(book => book.category === category);
    
    booksGrid.innerHTML = filteredBooks.map(book => `
        <div class="book-card bg-white rounded-lg shadow-lg overflow-hidden">
            <div class="h-48 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                <i class="fas fa-book text-white text-4xl"></i>
            </div>
            <div class="p-4">
                <h4 class="font-semibold text-lg mb-1">${book.title}</h4>
                <p class="text-gray-600 text-sm mb-2">by ${book.author}</p>
                <div class="flex justify-between items-center">
                    <span class="text-xl font-bold text-green-600">₹${book.price}</span>
                    <button onclick="purchaseBook(${book.id})" class="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm">
                        Buy Now
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function filterBooks(category) {
    // Update button styles
    document.querySelectorAll('[onclick^="filterBooks"]').forEach(btn => {
        btn.classList.remove('bg-blue-500', 'text-white');
        btn.classList.add('bg-gray-200');
    });
    event.target.classList.remove('bg-gray-200');
    event.target.classList.add('bg-blue-500', 'text-white');
    
    loadBooks(category);
}

function purchaseBook(bookId) {
    const book = books.find(b => b.id === bookId);
    if (book) {
        // In a real application, this would integrate with a payment system
        alert(`Thank you for purchasing "${book.title}"! In a real application, you would be redirected to payment.`);
    }
}

// Lab Simulation Functions (simplified versions)
function updatePendulum() {
    const length = document.getElementById('length-slider').value;
    const angle = document.getElementById('angle-slider').value;
    document.getElementById('length-value').textContent = length + ' m';
    document.getElementById('angle-value').textContent = angle + '°';
}

function runPendulumSimulation() {
    const length = parseFloat(document.getElementById('length-slider').value);
    const initialAngle = parseFloat(document.getElementById('angle-slider').value) * Math.PI / 180;
    
    // Calculate pendulum properties
    const period = 2 * Math.PI * Math.sqrt(length / 9.8);
    const frequency = 1 / period;
    const angularFrequency = 2 * Math.PI / period;
    const maxVelocity = angularFrequency * length * Math.sin(initialAngle);
    const maxKineticEnergy = 0.5 * 0.1 * Math.pow(maxVelocity, 2); // assuming 0.1 kg mass
    const maxPotentialEnergy = 0.1 * 9.8 * length * (1 - Math.cos(initialAngle));
    const totalEnergy = maxKineticEnergy + maxPotentialEnergy;
    
    // Add observation counter
    const observationsDiv = document.getElementById('pendulum-results');
    const currentContent = observationsDiv.innerHTML;
    const observationCount = (currentContent.match(/Observation \d+/g) || []).length + 1;
    
    const newObservation = `
        <div class="border-l-4 border-blue-500 pl-4 mb-3">
            <h5 class="font-semibold text-blue-700">Observation ${observationCount}</h5>
            <div class="grid grid-cols-2 gap-2 text-sm">
                <p><strong>Length:</strong> ${length.toFixed(1)} m</p>
                <p><strong>Initial Angle:</strong> ${(initialAngle * 180 / Math.PI).toFixed(0)}°</p>
                <p><strong>Period:</strong> ${period.toFixed(3)} s</p>
                <p><strong>Frequency:</strong> ${frequency.toFixed(2)} Hz</p>
                <p><strong>Max Velocity:</strong> ${maxVelocity.toFixed(3)} m/s</p>
                <p><strong>Total Energy:</strong> ${totalEnergy.toFixed(4)} J</p>
            </div>
            <p class="text-xs text-gray-600 mt-2">
                ${length < 1.0 ? 'Short pendulum: Higher frequency, lower period' : 
                  length > 1.5 ? 'Long pendulum: Lower frequency, higher period' : 
                  'Medium pendulum: Balanced properties'}
            </p>
        </div>
    `;
    
    // Add new observation to existing ones
    observationsDiv.innerHTML = currentContent.includes('Run the simulation') ? 
        newObservation : currentContent + newObservation;
    
    // Simple canvas animation
    const canvas = document.getElementById('pendulum-canvas');
    const ctx = canvas.getContext('2d');
    let angle = initialAngle;
    let angleVel = 0;
    let angleAcc = 0;
    let time = 0;
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Physics calculation
        angleAcc = -9.8 / (length * 100) * Math.sin(angle);
        angleVel += angleAcc * 0.05;
        angle += angleVel * 0.05;
        time += 0.05;
        
        // Draw pendulum
        const x = 200 + length * 100 * Math.sin(angle);
        const y = 50 + length * 100 * Math.cos(angle);
        
        // Draw support
        ctx.fillStyle = '#666';
        ctx.fillRect(190, 45, 20, 10);
        
        // Draw string
        ctx.beginPath();
        ctx.moveTo(200, 50);
        ctx.lineTo(x, y);
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Draw bob
        ctx.beginPath();
        ctx.arc(x, y, 12, 0, 2 * Math.PI);
        ctx.fillStyle = '#3B82F6';
        ctx.fill();
        ctx.strokeStyle = '#1E40AF';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Draw trajectory trace
        ctx.beginPath();
        ctx.arc(200, 50, length * 100, Math.PI/2 - initialAngle, Math.PI/2 + initialAngle);
        ctx.strokeStyle = 'rgba(59, 130, 246, 0.3)';
        ctx.lineWidth = 1;
        ctx.setLineDash([5, 5]);
        ctx.stroke();
        ctx.setLineDash([]);
        
        requestAnimationFrame(animate);
    }
    animate();
}

function updateProjectile() {
    const velocity = document.getElementById('velocity-slider').value;
    const angle = document.getElementById('launch-angle-slider').value;
    document.getElementById('velocity-value').textContent = velocity + ' m/s';
    document.getElementById('launch-angle-value').textContent = angle + '°';
}

function runProjectileSimulation() {
    const v0 = parseFloat(document.getElementById('velocity-slider').value);
    const angle = parseFloat(document.getElementById('launch-angle-slider').value) * Math.PI / 180;
    const vx = v0 * Math.cos(angle);
    const vy = v0 * Math.sin(angle);
    const maxHeight = (vy * vy) / (2 * 9.8);
    const range = (v0 * v0 * Math.sin(2 * angle)) / 9.8;
    const time = 2 * vy / 9.8;
    
    document.getElementById('projectile-results').innerHTML = `
        <p><strong>Maximum Height:</strong> ${maxHeight.toFixed(2)} m</p>
        <p><strong>Range:</strong> ${range.toFixed(2)} m</p>
        <p><strong>Time of Flight:</strong> ${time.toFixed(2)} s</p>
        <p><strong>Horizontal Velocity:</strong> ${vx.toFixed(2)} m/s</p>
        <p><strong>Initial Vertical Velocity:</strong> ${vy.toFixed(2)} m/s</p>
    `;
    
    // Simple canvas animation
    const canvas = document.getElementById('projectile-canvas');
    const ctx = canvas.getContext('2d');
    let t = 0;
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const x = 50 + vx * t;
        const y = 250 - (vy * t - 0.5 * 9.8 * t * t);
        
        if (x < canvas.width && y > 0) {
            ctx.beginPath();
            ctx.arc(x, y, 5, 0, 2 * Math.PI);
            ctx.fillStyle = '#EF4444';
            ctx.fill();
            
            // Draw trajectory
            ctx.beginPath();
            ctx.moveTo(50, 250);
            for (let i = 0; i <= t; i += 0.1) {
                const trajX = 50 + vx * i;
                const trajY = 250 - (vy * i - 0.5 * 9.8 * i * i);
                ctx.lineTo(trajX, trajY);
            }
            ctx.strokeStyle = '#3B82F6';
            ctx.stroke();
            
            t += 0.1;
            requestAnimationFrame(animate);
        }
    }
    animate();
}

// Chemistry lab functions
let baseVolume = 0;
let currentPH = 3.0;

function addBase(amount) {
    baseVolume += amount;
    currentPH = Math.min(11, 3.0 + baseVolume * 0.16);
    
    document.getElementById('base-volume').textContent = baseVolume.toFixed(1);
    document.getElementById('ph-value').textContent = currentPH.toFixed(1);
    
    // Update color based on pH
    const acidPh = document.getElementById('acid-ph');
    if (currentPH < 4) {
        acidPh.className = 'w-20 h-20 bg-pink-200 mx-auto mb-2 rounded-full';
    } else if (currentPH < 6) {
        acidPh.className = 'w-20 h-20 bg-purple-200 mx-auto mb-2 rounded-full';
    } else if (currentPH < 8) {
        acidPh.className = 'w-20 h-20 bg-blue-200 mx-auto mb-2 rounded-full';
    } else {
        acidPh.className = 'w-20 h-20 bg-green-200 mx-auto mb-2 rounded-full';
    }
}

function resetTitration() {
    baseVolume = 0;
    currentPH = 3.0;
    document.getElementById('base-volume').textContent = '0.0';
    document.getElementById('ph-value').textContent = '3.0';
    document.getElementById('acid-ph').className = 'w-20 h-20 bg-pink-200 mx-auto mb-2 rounded-full';
}

function showReaction(type) {
    const display = document.getElementById('reaction-display');
    const reactions = {
        synthesis: {
            name: "Synthesis Reaction",
            equation: "2H₂ + O₂ → 2H₂O",
            description: "Two or more simple substances combine to form a more complex substance."
        },
        decomposition: {
            name: "Decomposition Reaction",
            equation: "2H₂O → 2H₂ + O₂",
            description: "A complex substance breaks down into simpler substances."
        },
        single: {
            name: "Single Displacement",
            equation: "Zn + CuSO₄ → ZnSO₄ + Cu",
            description: "An element replaces another element in a compound."
        },
        double: {
            name: "Double Displacement",
            equation: "AgNO₃ + NaCl → AgCl + NaNO₃",
            description: "Two compounds exchange ions to form two new compounds."
        }
    };
    
    const reaction = reactions[type];
    display.innerHTML = `
        <h4 class="text-xl font-semibold mb-3">${reaction.name}</h4>
        <div class="bg-gray-100 p-4 rounded mb-3">
            <p class="text-lg font-mono text-center">${reaction.equation}</p>
        </div>
        <p class="text-gray-600">${reaction.description}</p>
    `;
}

function showCellDivision(type) {
    const content = document.getElementById('cell-division-content');
    
    if (type === 'mitosis') {
        content.innerHTML = `
            <h4 class="text-xl font-semibold mb-4">Mitosis - Cell Division for Growth</h4>
            <div class="grid grid-cols-2 gap-4">
                <div class="bg-blue-50 p-4 rounded">
                    <h5 class="font-semibold">Prophase</h5>
                    <p>Chromosomes condense, nuclear envelope breaks down</p>
                </div>
                <div class="bg-blue-50 p-4 rounded">
                    <h5 class="font-semibold">Metaphase</h5>
                    <p>Chromosomes align at the center</p>
                </div>
                <div class="bg-blue-50 p-4 rounded">
                    <h5 class="font-semibold">Anaphase</h5>
                    <p>Sister chromatids separate</p>
                </div>
                <div class="bg-blue-50 p-4 rounded">
                    <h5 class="font-semibold">Telophase</h5>
                    <p>Two daughter nuclei form</p>
                </div>
            </div>
            <p class="mt-4"><strong>Result:</strong> 2 identical daughter cells (diploid)</p>
        `;
    } else {
        content.innerHTML = `
            <h4 class="text-xl font-semibold mb-4">Meiosis - Cell Division for Reproduction</h4>
            <div class="space-y-4">
                <div class="bg-purple-50 p-4 rounded">
                    <h5 class="font-semibold">Meiosis I</h5>
                    <p>Homologous chromosomes separate, reducing chromosome number by half</p>
                </div>
                <div class="bg-purple-50 p-4 rounded">
                    <h5 class="font-semibold">Meiosis II</h5>
                    <p>Sister chromatids separate, similar to mitosis</p>
                </div>
            </div>
            <p class="mt-4"><strong>Result:</strong> 4 unique daughter cells (haploid)</p>
        `;
    }
}

function animateDNA() {
    const canvas = document.getElementById('dna-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let rotation = 0;
    
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw simplified DNA double helix
        for (let i = 0; i < 20; i++) {
            const y = i * 15;
            const x1 = 200 + Math.sin(rotation + i * 0.3) * 50;
            const x2 = 200 - Math.sin(rotation + i * 0.3) * 50;
            
            // Draw backbone
            ctx.beginPath();
            ctx.arc(x1, y, 3, 0, 2 * Math.PI);
            ctx.fillStyle = '#3B82F6';
            ctx.fill();
            
            ctx.beginPath();
            ctx.arc(x2, y, 3, 0, 2 * Math.PI);
            ctx.fillStyle = '#3B82F6';
            ctx.fill();
            
            // Draw base pairs
            ctx.beginPath();
            ctx.moveTo(x1, y);
            ctx.lineTo(x2, y);
            ctx.strokeStyle = '#10B981';
            ctx.stroke();
        }
        
        rotation += 0.05;
        requestAnimationFrame(draw);
    }
    draw();
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Add enter key support for chat
    document.getElementById('user-input').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    
    // Add enter key support for community chat
    document.getElementById('community-message-input').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendCommunityMessage();
        }
    });
    
    // Initialize marketplace
    initializeMarketplace();
    
    // Add sell book form handler
    document.getElementById('sell-book-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const newBook = {
            id: Date.now(),
            title: document.getElementById('book-title').value,
            author: document.getElementById('book-author').value,
            category: document.getElementById('book-category').value,
            condition: document.getElementById('book-condition').value,
            price: parseInt(document.getElementById('book-price').value),
            originalPrice: parseInt(document.getElementById('book-original-price').value) || 0,
            seller: "Student User", // Current user
            description: document.getElementById('book-description').value,
            contactMethod: document.getElementById('contact-method').value,
            listedDate: new Date()
        };
        
        // Add to marketplace
        marketplaceBooks.push(newBook);
        
        // Add to user's listings
        myListings.push(newBook);
        
        // Update UI
        loadMarketplace();
        updateMyListings();
        
        // Close modal and reset form
        closeSellBookModal();
        
        alert('Your book has been listed successfully!');
    });
});

// Solutions Lab Functions
function calculateSolution() {
    const mass = parseFloat(document.getElementById('solute-mass').value);
    const molarMass = parseFloat(document.getElementById('molar-mass').value);
    const volume = parseFloat(document.getElementById('solution-volume').value);
    const solventMass = parseFloat(document.getElementById('solvent-mass').value);
    
    // Calculate moles
    const moles = mass / molarMass;
    
    // Calculate molarity (moles/liter of solution)
    const molarity = moles / volume;
    
    // Calculate molality (moles/kg of solvent)
    const molality = moles / solventMass;
    
    // Calculate mass percent
    const totalMass = mass + solventMass * 1000; // Convert kg to g
    const massPercent = (mass / totalMass) * 100;
    
    // Calculate normality (for acids/bases, assuming monoprotic)
    const normality = molarity;
    
    const resultsDiv = document.getElementById('solution-results');
    resultsDiv.innerHTML = `
        <div class="space-y-2">
            <h5 class="font-semibold text-green-700">Calculation Results:</h5>
            <div class="grid grid-cols-2 gap-2 text-sm">
                <p><strong>Moles of Solute:</strong> ${moles.toFixed(4)} mol</p>
                <p><strong>Molarity (M):</strong> ${molarity.toFixed(3)} mol/L</p>
                <p><strong>Molality (m):</strong> ${molality.toFixed(3)} mol/kg</p>
                <p><strong>Mass Percent:</strong> ${massPercent.toFixed(2)}%</p>
                <p><strong>Normality (N):</strong> ${normality.toFixed(3)} N</p>
                <p><strong>Total Solution Mass:</strong> ${totalMass.toFixed(2)} g</p>
            </div>
            <div class="bg-blue-50 p-3 rounded text-xs">
                <p><strong>Preparation Instructions:</strong></p>
                <p>• Dissolve ${mass.toFixed(2)} g of solute in approximately ${(volume * 0.8).toFixed(2)} L of solvent</p>
                <p>• Transfer to a ${volume.toFixed(2)} L volumetric flask</p>
                <p>• Add solvent to mark and mix thoroughly</p>
            </div>
        </div>
    `;
}

function calculateDilution() {
    const initialConc = parseFloat(document.getElementById('initial-conc').value);
    const finalVolume = parseFloat(document.getElementById('final-volume').value);
    const finalConc = parseFloat(document.getElementById('final-conc').value);
    
    // Calculate using C1V1 = C2V2
    const initialVolume = (finalConc * finalVolume) / initialConc;
    const waterToAdd = finalVolume - initialVolume;
    const dilutionFactor = initialConc / finalConc;
    
    const resultsDiv = document.getElementById('dilution-results');
    resultsDiv.innerHTML = `
        <div class="space-y-2">
            <h5 class="font-semibold text-purple-700">Dilution Results:</h5>
            <div class="grid grid-cols-2 gap-2 text-sm">
                <p><strong>Initial Volume Needed:</strong> ${initialVolume.toFixed(3)} L</p>
                <p><strong>Water to Add:</strong> ${waterToAdd.toFixed(3)} L</p>
                <p><strong>Dilution Factor:</strong> ${dilutionFactor.toFixed(1)}x</p>
                <p><strong>Final Concentration:</strong> ${finalConc.toFixed(2)} M</p>
            </div>
            <div class="bg-yellow-50 p-3 rounded text-xs">
                <p><strong>Dilution Procedure:</strong></p>
                <p>• Measure ${initialVolume.toFixed(3)} L of ${initialConc.toFixed(2)} M solution</p>
                <p>• Add ${waterToAdd.toFixed(3)} L of distilled water</p>
                <p>• Mix thoroughly to achieve ${finalConc.toFixed(2)} M concentration</p>
                <p class="text-red-600 mt-1">⚠️ Always add acid to water, never water to acid!</p>
            </div>
        </div>
    `;
}

function setCompound(compound, molarMass) {
    document.getElementById('molar-mass').value = molarMass;
    
    // Set typical values for this compound
    if (compound === 'NaCl') {
        document.getElementById('solute-mass').value = '58.44';
        document.getElementById('solution-volume').value = '0.5';
        document.getElementById('solvent-mass').value = '0.495';
    } else if (compound === 'HCl') {
        document.getElementById('solute-mass').value = '36.46';
        document.getElementById('solution-volume').value = '0.25';
        document.getElementById('solvent-mass').value = '0.248';
    } else if (compound === 'NaOH') {
        document.getElementById('solute-mass').value = '40.00';
        document.getElementById('solution-volume').value = '0.5';
        document.getElementById('solvent-mass').value = '0.496';
    } else if (compound === 'H₂SO₄') {
        document.getElementById('solute-mass').value = '98.08';
        document.getElementById('solution-volume').value = '0.25';
        document.getElementById('solvent-mass').value = '0.247';
    }
    
    // Auto-calculate
    calculateSolution();
}

// Marketplace Functions
function loadMarketplace(category = 'all') {
    const marketplaceGrid = document.getElementById('marketplace-grid');
    const filteredBooks = category === 'all' ? marketplaceBooks : marketplaceBooks.filter(book => book.category === category);
    
    if (filteredBooks.length === 0) {
        marketplaceGrid.innerHTML = '<p class="text-gray-500 col-span-full text-center">No books available in this category.</p>';
        return;
    }
    
    marketplaceGrid.innerHTML = filteredBooks.map(book => `
        <div class="bg-white rounded-lg shadow-lg overflow-hidden book-card">
            <div class="h-48 bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center">
                <i class="fas fa-book text-white text-4xl"></i>
            </div>
            <div class="p-4">
                <h4 class="font-semibold text-lg mb-1 truncate">${book.title}</h4>
                <p class="text-gray-600 text-sm mb-1">by ${book.author}</p>
                <div class="flex items-center mb-2">
                    <span class="bg-${getConditionColor(book.condition)}-100 text-${getConditionColor(book.condition)}-800 text-xs px-2 py-1 rounded">
                        ${book.condition.charAt(0).toUpperCase() + book.condition.slice(1)}
                    </span>
                    <span class="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded ml-1">
                        ${book.category.charAt(0).toUpperCase() + book.category.slice(1)}
                    </span>
                </div>
                <div class="flex justify-between items-center mb-2">
                    <div>
                        <span class="text-xl font-bold text-green-600">${book.price} credits</span>
                        ${book.originalPrice > 0 ? `<span class="text-xs text-gray-500 line-through ml-1">₹${book.originalPrice}</span>` : ''}
                    </div>
                </div>
                <p class="text-xs text-gray-600 mb-3">Seller: ${book.seller}</p>
                <button onclick="buyBook(${book.id})" class="w-full bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600 text-sm">
                    <i class="fas fa-shopping-cart mr-1"></i>Buy Now
                </button>
            </div>
        </div>
    `).join('');
}

function getConditionColor(condition) {
    switch(condition) {
        case 'new': return 'green';
        case 'good': return 'blue';
        case 'fair': return 'yellow';
        case 'poor': return 'red';
        default: return 'gray';
    }
}

function filterMarketplace(category) {
    // Update button styles
    document.querySelectorAll('[onclick^="filterMarketplace"]').forEach(btn => {
        btn.classList.remove('bg-blue-500', 'text-white');
        btn.classList.add('bg-gray-200');
    });
    event.target.classList.remove('bg-gray-200');
    event.target.classList.add('bg-blue-500', 'text-white');
    
    loadMarketplace(category);
}

function showSellBookModal() {
    document.getElementById('sell-book-modal').classList.remove('hidden');
}

function closeSellBookModal() {
    document.getElementById('sell-book-modal').classList.add('hidden');
    document.getElementById('sell-book-form').reset();
}

function buyBook(bookId) {
    const book = marketplaceBooks.find(b => b.id === bookId);
    if (!book) return;
    
    if (userCredits < book.price) {
        alert('Insufficient credits! You need ' + (book.price - userCredits) + ' more credits to buy this book.');
        return;
    }
    
    if (confirm(`Are you sure you want to buy "${book.title}" for ${book.price} credits?`)) {
        // Process transaction
        userCredits -= book.price;
        
        // Add transaction record
        transactions.push({
            type: 'purchase',
            bookTitle: book.title,
            price: book.price,
            seller: book.seller,
            date: new Date(),
            status: 'completed'
        });
        
        // Remove book from marketplace
        marketplaceBooks = marketplaceBooks.filter(b => b.id !== bookId);
        
        // Update UI
        updateCreditsDisplay();
        loadMarketplace();
        updateTransactionHistory();
        
        alert(`Successfully purchased "${book.title}"! Contact the seller at their preferred method.`);
    }
}

// Profile and Credit Management Functions
function updateCreditsDisplay() {
    const creditsElement = document.getElementById('user-credits');
    if (creditsElement) {
        creditsElement.textContent = userCredits;
    }
}

function loadProfile() {
    updateCreditsDisplay();
    updateMyListings();
    updateTransactionHistory();
}

function updateMyListings() {
    const listingsDiv = document.getElementById('my-listings');
    if (myListings.length === 0) {
        listingsDiv.innerHTML = '<p class="text-gray-500">No active listings</p>';
        return;
    }
    
    listingsDiv.innerHTML = myListings.map(book => `
        <div class="border rounded p-3">
            <h5 class="font-semibold text-sm">${book.title}</h5>
            <p class="text-xs text-gray-600">Price: ${book.price} credits</p>
            <button onclick="removeListing(${book.id})" class="text-red-500 text-xs hover:text-red-700 mt-1">
                <i class="fas fa-trash mr-1"></i>Remove
            </button>
        </div>
    `).join('');
}

function updateTransactionHistory() {
    const historyDiv = document.getElementById('transaction-history');
    if (transactions.length === 0) {
        historyDiv.innerHTML = '<p class="text-gray-500">No transactions yet</p>';
        return;
    }
    
    historyDiv.innerHTML = transactions.slice(-5).reverse().map(transaction => `
        <div class="border rounded p-3">
            <div class="flex justify-between items-start">
                <div>
                    <p class="font-semibold text-sm">${transaction.type === 'purchase' ? 'Bought' : 'Sold'}: ${transaction.bookTitle}</p>
                    <p class="text-xs text-gray-600">${transaction.type === 'purchase' ? 'From: ' + transaction.seller : 'To: ' + transaction.buyer}</p>
                </div>
                <div class="text-right">
                    <p class="font-semibold text-sm ${transaction.type === 'purchase' ? 'text-red-600' : 'text-green-600'}">
                        ${transaction.type === 'purchase' ? '-' : '+'}${transaction.price} credits
                    </p>
                    <p class="text-xs text-gray-500">${formatDate(transaction.date)}</p>
                </div>
            </div>
        </div>
    `).join('');
}

function formatDate(date) {
    return new Date(date).toLocaleDateString('en-IN', { 
        day: 'numeric', 
        month: 'short', 
        hour: '2-digit', 
        minute: '2-digit' 
    });
}

function addCredits() {
    const amount = prompt('Enter amount of credits to add (₹1 = 10 credits):');
    if (amount && !isNaN(amount) && amount > 0) {
        const creditsToAdd = parseInt(amount) * 10;
        userCredits += creditsToAdd;
        
        transactions.push({
            type: 'add_credits',
            amount: creditsToAdd,
            date: new Date(),
            status: 'completed'
        });
        
        updateCreditsDisplay();
        updateTransactionHistory();
        alert(`Successfully added ${creditsToAdd} credits to your account!`);
    }
}

function viewCreditHistory() {
    const creditTransactions = transactions.filter(t => t.type === 'add_credits' || t.type === 'sale');
    if (creditTransactions.length === 0) {
        alert('No credit transactions found.');
        return;
    }
    
    let history = 'Credit Transaction History:\n\n';
    creditTransactions.forEach(transaction => {
        history += `${formatDate(transaction.date)} - `;
        if (transaction.type === 'add_credits') {
            history += `Added: +${transaction.amount} credits\n`;
        } else {
            history += `Sold "${transaction.bookTitle}": +${transaction.price} credits\n`;
        }
    });
    
    alert(history);
}

function transferCredits() {
    const recipient = prompt('Enter recipient username:');
    const amount = prompt('Enter amount of credits to transfer:');
    
    if (recipient && amount && !isNaN(amount) && amount > 0) {
        const transferAmount = parseInt(amount);
        if (transferAmount > userCredits) {
            alert('Insufficient credits for transfer!');
            return;
        }
        
        if (confirm(`Transfer ${transferAmount} credits to ${recipient}?`)) {
            userCredits -= transferAmount;
            
            transactions.push({
                type: 'transfer',
                recipient: recipient,
                amount: transferAmount,
                date: new Date(),
                status: 'completed'
            });
            
            updateCreditsDisplay();
            updateTransactionHistory();
            alert(`Successfully transferred ${transferAmount} credits to ${recipient}!`);
        }
    }
}

function removeListing(bookId) {
    if (confirm('Are you sure you want to remove this listing?')) {
        myListings = myListings.filter(book => book.id !== bookId);
        updateMyListings();
        alert('Listing removed successfully!');
    }
}

// Community Chat Functions
function loadCommunity() {
    // Initialize community section
    updateOnlineUsers();
    // Auto-join general room if no room is selected
    if (!currentChatRoom) {
        joinChatRoom('general');
    }
}

function joinChatRoom(roomId) {
    currentChatRoom = roomId;
    const room = chatRooms[roomId];
    
    if (!room) return;
    
    // Update room header
    document.getElementById('current-room-name').textContent = room.name;
    document.getElementById('current-room-desc').textContent = room.description;
    document.getElementById('online-count').innerHTML = `<i class="fas fa-circle text-green-500 mr-2 text-xs"></i>${room.onlineCount} online`;
    
    // Update room icon
    const iconElement = document.getElementById('current-room-icon');
    iconElement.className = `w-12 h-12 bg-${room.color}-500 rounded-full flex items-center justify-center`;
    iconElement.innerHTML = `<i class="fas ${room.icon} text-white text-xl"></i>`;
    
    // Update active room styling
    document.querySelectorAll('.chat-room-item').forEach(item => {
        item.classList.remove('ring-2', 'ring-blue-500');
    });
    event.currentTarget.classList.add('ring-2', 'ring-blue-500');
    
    // Load messages
    loadChatMessages(roomId);
    
    // Enable input
    document.getElementById('community-message-input').disabled = false;
    document.getElementById('send-community-message').disabled = false;
    
    // Focus input
    document.getElementById('community-message-input').focus();
}

function loadChatMessages(roomId) {
    const messagesContainer = document.getElementById('community-messages');
    const room = chatRooms[roomId];
    
    if (!room || !room.messages) {
        messagesContainer.innerHTML = '<div class="text-center py-8"><p class="text-gray-500">No messages yet. Start the conversation!</p></div>';
        return;
    }
    
    messagesContainer.innerHTML = room.messages.map(msg => `
        <div class="flex items-start space-x-3 ${msg.isOwn ? 'flex-row-reverse space-x-reverse' : ''}">
            <div class="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                <span class="text-lg">${msg.avatar}</span>
            </div>
            <div class="${msg.isOwn ? 'text-right' : ''}">
                <div class="flex items-center space-x-2 mb-1 ${msg.isOwn ? 'justify-end' : ''}">
                    <span class="font-semibold text-sm text-gray-800">${msg.user}</span>
                    <span class="text-xs text-gray-500">${formatMessageTime(msg.timestamp)}</span>
                </div>
                <div class="${msg.isOwn ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-800'} rounded-2xl px-4 py-2 max-w-md inline-block">
                    <p class="text-sm">${msg.message}</p>
                </div>
            </div>
        </div>
    `).join('');
    
    // Scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function sendCommunityMessage() {
    const input = document.getElementById('community-message-input');
    const message = input.value.trim();
    
    if (!message || !currentChatRoom) return;
    
    // Add message to current room
    const newMessage = {
        id: Date.now(),
        user: currentUser.name,
        avatar: currentUser.avatar,
        message: message,
        timestamp: new Date(),
        isOwn: true
    };
    
    chatRooms[currentChatRoom].messages.push(newMessage);
    
    // Clear input
    input.value = '';
    
    // Reload messages
    loadChatMessages(currentChatRoom);
    
    // Simulate other users responding
    simulateChatResponse();
}

function simulateChatResponse() {
    const responses = [
        "That's a great point!",
        "I agree with you.",
        "Thanks for sharing!",
        "Can you explain more?",
        "Interesting perspective!",
        "I had the same question.",
        "Good explanation!",
        "Let me think about that..."
    ];
    
    const users = ["Rahul Sharma", "Priya Patel", "Amit Kumar", "Neha Singh"];
    const avatars = ["👨‍🎓", "👩‍🎓", "👨‍🏫", "👩‍🏫"];
    
    setTimeout(() => {
        if (currentChatRoom && Math.random() > 0.3) {
            const randomUser = Math.floor(Math.random() * users.length);
            const randomResponse = Math.floor(Math.random() * responses.length);
            
            const responseMessage = {
                id: Date.now() + 1,
                user: users[randomUser],
                avatar: avatars[randomUser],
                message: responses[randomResponse],
                timestamp: new Date(),
                isOwn: false
            };
            
            chatRooms[currentChatRoom].messages.push(responseMessage);
            loadChatMessages(currentChatRoom);
        }
    }, 2000 + Math.random() * 3000);
}

function formatMessageTime(timestamp) {
    const now = new Date();
    const msgTime = new Date(timestamp);
    const diffMs = now - msgTime;
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
    return `${Math.floor(diffMins / 1440)}d ago`;
}

function createNewRoom() {
    const roomName = prompt('Enter room name:');
    if (!roomName) return;
    
    const roomDesc = prompt('Enter room description:');
    if (!roomDesc) roomDesc = 'Custom chat room';
    
    const roomId = 'custom_' + Math.random().toString(36).substr(2, 9);
    
    chatRooms[roomId] = {
        name: roomName,
        description: roomDesc,
        icon: 'fa-hashtag',
        color: 'indigo',
        onlineCount: 1,
        messages: []
    };
    
    alert(`Room "${roomName}" created successfully!`);
    // Refresh the community section to show new room
    loadCommunity();
}

function updateOnlineUsers() {
    // Simulate changing online counts
    setInterval(() => {
        Object.keys(chatRooms).forEach(roomId => {
            const change = Math.floor(Math.random() * 5) - 2; // -2 to +2
            chatRooms[roomId].onlineCount = Math.max(1, chatRooms[roomId].onlineCount + change);
        });
        
        // Update online counts in UI if in community section
        if (currentSection === 'community') {
            document.querySelectorAll('[onclick^="joinChatRoom"]').forEach(btn => {
                const roomId = btn.getAttribute('onclick').match(/'([^']+)'/)[1];
                const room = chatRooms[roomId];
                if (room) {
                    const onlineSpan = btn.querySelector('.bg-green-100');
                    if (onlineSpan) {
                        onlineSpan.innerHTML = `<i class="fas fa-circle text-green-500 mr-1 text-xs"></i>${room.onlineCount} online`;
                    }
                }
            });
            
            // Update current room online count
            if (currentChatRoom && chatRooms[currentChatRoom]) {
                document.getElementById('online-count').innerHTML = `<i class="fas fa-circle text-green-500 mr-2 text-xs"></i>${chatRooms[currentChatRoom].onlineCount} online`;
            }
        }
    }, 10000); // Update every 10 seconds
}

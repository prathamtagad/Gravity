// Comprehensive Study Buddy Mock Responses
// Used as fallback when Gemini API is unavailable

interface MockQA {
  keywords: string[]
  response: string
}

interface SubjectTopics {
  [topic: string]: string
}

// Study Techniques & Productivity
const STUDY_TECHNIQUES: MockQA[] = [
  { keywords: ['pomodoro', 'technique', 'timer'], response: "The Pomodoro Technique is amazing! 🍅 Work for 25 minutes, then take a 5-minute break. After 4 pomodoros, take a longer 15-30 minute break. It keeps your brain fresh and focused!" },
  { keywords: ['focus', 'concentrate', 'distraction'], response: "To improve focus: 1) Put your phone on silent 📱 2) Use website blockers 3) Study in 25-minute bursts 4) Take regular breaks 5) Stay hydrated! Your brain needs water to function well. 💧" },
  { keywords: ['motivation', 'motivated', 'lazy'], response: "Feeling unmotivated is normal! Try the 2-minute rule - start with just 2 minutes of study. Once you begin, you'll often keep going. Also, visualize your goals and reward yourself after study sessions! 🎯" },
  { keywords: ['procrastination', 'procrastinate', 'delay'], response: "Beat procrastination by breaking tasks into tiny steps! Instead of 'study chemistry', try 'read page 1 of chapter 3'. Small wins build momentum. Also, remove distractions before they tempt you! 🚀" },
  { keywords: ['memory', 'remember', 'memorize', 'forget'], response: "Memory tricks: Use mnemonics, create stories, teach others what you learned, and review using spaced repetition (review after 1 day, 3 days, 1 week). Active recall beats passive reading! 🧠" },
  { keywords: ['note', 'notes', 'taking'], response: "Best note-taking methods: Cornell Method (divide page into sections), Mind Maps (for visual learners), or the Outline Method. Use colors and diagrams! Don't copy everything - summarize in your own words. 📝" },
  { keywords: ['exam', 'test', 'preparation', 'prep'], response: "Exam prep strategy: 1) Start early, not the night before 2) Practice with past papers 3) Teach concepts to others 4) Get good sleep before exam 5) Review your weak areas more. You've got this! 💪" },
  { keywords: ['stress', 'anxiety', 'nervous', 'worried'], response: "Exam stress is real! Try deep breathing (4-7-8 technique), exercise regularly, get enough sleep, and break study into small chunks. Remember: one exam doesn't define your worth! 🌟" },
  { keywords: ['sleep', 'tired', 'exhausted', 'rest'], response: "Sleep is crucial for learning! During sleep, your brain consolidates memories. Aim for 7-8 hours. Avoid screens 1 hour before bed. A well-rested brain learns 40% better! 😴" },
  { keywords: ['morning', 'routine', 'productive'], response: "Morning routine ideas: Wake up at the same time daily, hydrate first, do 5 min of stretching, review your goals, and tackle your hardest subject first when your brain is freshest! ☀️" },
  { keywords: ['night', 'late', 'all-nighter'], response: "All-nighters are actually counterproductive! Your memory consolidates during sleep. Better to study less and sleep well than cram all night. If you must study late, take 10-min naps every 2 hours. 🌙" },
  { keywords: ['break', 'rest', 'pause'], response: "Breaks are essential! Every 25-50 minutes, take 5-10 minutes off. During breaks: stretch, walk, grab water, look at something far away to rest your eyes. Don't check social media - it extends your break! 🏃" },
  { keywords: ['group study', 'study group', 'together'], response: "Group study tips: Set clear goals, assign topics to each person to teach, quiz each other, and keep groups small (3-4 people). Meet in a quiet place and limit socializing! 👥" },
  { keywords: ['online', 'course', 'mooc', 'learning'], response: "Online learning tips: Set a schedule, take notes like in class, participate in forums, and actually do the assignments. Treat it like a real class, not a YouTube binge! 💻" },
  { keywords: ['reading', 'textbook', 'book'], response: "Active reading strategy: Skim headings first, read actively with questions in mind, highlight sparingly, summarize each section, and review within 24 hours. SQ3R method works great! 📚" },
  { keywords: ['deadline', 'assignment', 'submission'], response: "Deadline management: Work backwards from due date, set mini-deadlines, start early (even just 10 mins counts), and use calendar reminders. Submitting early = less stress! ⏰" },
  { keywords: ['multitasking', 'multiple', 'switch'], response: "Multitasking is a myth! Your brain actually switches between tasks, losing efficiency each time. Focus on one subject for 25-50 mins, then switch. Single-tasking is faster! 🎯" },
  { keywords: ['environment', 'place', 'where', 'study space'], response: "Ideal study environment: Good lighting, comfortable temperature, minimal noise, organized desk, and no bed in sight (it signals sleep!). Some people work better in libraries or cafes. 🏠" },
  { keywords: ['music', 'sound', 'listen'], response: "Study music: Lyrics can distract, so try lo-fi beats, classical music, or nature sounds. Some prefer complete silence. Experiment to find what works for you! Consistency helps too. 🎵" },
  { keywords: ['app', 'tool', 'software'], response: "Best study apps: Anki for flashcards, Forest for focus, Notion for notes, Quizlet for quizzes, and Todoist for tasks. Use them as tools, not distractions! 📱" },
]

// Computer Science Topics
const CS_TOPICS: SubjectTopics = {
  'algorithm': "Algorithms are step-by-step procedures for solving problems. Key types: Sorting (QuickSort O(n log n)), Searching (Binary Search O(log n)), Graph algorithms (BFS, DFS). Always consider time vs space complexity! 🖥️",
  'data structure': "Essential data structures: Arrays (O(1) access), Linked Lists (O(1) insert), Stacks (LIFO), Queues (FIFO), Trees (hierarchical), Graphs (connections), Hash Tables (O(1) average lookup). Choose based on your use case! 📊",
  'big o': "Big O measures algorithm efficiency. O(1) constant, O(log n) logarithmic, O(n) linear, O(n log n) efficient sorts, O(n²) quadratic, O(2ⁿ) exponential. Always aim for lower complexity! ⏱️",
  'recursion': "Recursion = function calling itself. Needs base case (stopping condition) and recursive case. Example: factorial(n) = n × factorial(n-1), base: factorial(0) = 1. Watch for stack overflow! 🔄",
  'oop': "OOP pillars: Encapsulation (hiding data), Inheritance (extending classes), Polymorphism (many forms), Abstraction (hiding complexity). Think of objects as real-world entities with properties and behaviors! 🎯",
  'database': "Database basics: SQL for relational (tables, joins, ACID), NoSQL for flexibility (MongoDB, Redis). Normalize to reduce redundancy, use indexes for faster queries, and always backup! 💾",
  'sql': "SQL essentials: SELECT (read), INSERT (create), UPDATE (modify), DELETE (remove). JOIN types: INNER (matching), LEFT (all left + matching right), Use WHERE for filtering, GROUP BY for aggregation! 📋",
  'api': "APIs (Application Programming Interfaces) let systems communicate. REST uses HTTP methods: GET (read), POST (create), PUT (update), DELETE (remove). JSON is the common format. Always handle errors! 🔌",
  'git': "Git commands: git init, add, commit, push, pull, branch, merge. Always write clear commit messages! Create branches for features, merge via pull requests. .gitignore for excluding files. 🔀",
  'python': "Python tips: Use list comprehensions, leverage built-in functions, follow PEP8 style, use virtual environments (venv), and explore libraries like NumPy, Pandas, and Flask! 🐍",
  'javascript': "JavaScript essentials: let/const over var, arrow functions, async/await for promises, destructuring, spread operator, and DOM manipulation. Modern JS is powerful and elegant! ⚡",
  'react': "React core concepts: Components (UI pieces), Props (data in), State (internal data), Hooks (useState, useEffect), Virtual DOM for efficient updates. Think in components! ⚛️",
  'machine learning': "ML basics: Supervised (labeled data - classification/regression), Unsupervised (clustering, patterns), Reinforcement (rewards). Start with linear regression, then neural networks! 🤖",
  'neural network': "Neural networks: Input layer → Hidden layers → Output layer. Neurons apply weights, sum inputs, use activation functions. Trained via backpropagation. Deep learning = many hidden layers! 🧠",
  'css': "CSS tips: Use Flexbox/Grid for layouts, CSS variables for themes, mobile-first approach, BEM naming convention. Understand specificity and the cascade! 🎨",
  'html': "HTML semantics: Use <header>, <nav>, <main>, <article>, <section>, <footer> for meaning. Accessibility matters - use alt text, aria labels. Structure before styling! 📄",
  'security': "Web security essentials: HTTPS, input validation, SQL injection prevention (parameterized queries), XSS prevention (sanitize output), CORS, and secure password hashing (bcrypt)! 🔒",
  'cloud': "Cloud computing: IaaS (infrastructure), PaaS (platform), SaaS (software). Major providers: AWS, Azure, GCP. Benefits: scalability, pay-as-you-go, global reach. Start with simple deployments! ☁️",
  'docker': "Docker containers: Lightweight, portable, consistent environments. Dockerfile defines image, docker-compose for multi-container apps. Containers share OS kernel unlike VMs! 🐳",
  'testing': "Testing types: Unit (single functions), Integration (components together), E2E (full user flow). TDD: Write test first, then code. Aim for good coverage but don't over-test! 🧪",
}

// Mathematics Topics
const MATH_TOPICS: SubjectTopics = {
  'calculus': "Calculus essentials: Limits (approaching values), Derivatives (rate of change), Integrals (area under curve). Remember: d/dx[xⁿ] = nxⁿ⁻¹, ∫xⁿdx = xⁿ⁺¹/(n+1). Practice, practice! 📈",
  'derivative': "Derivatives measure instantaneous rate of change. Key rules: Power rule, Product rule, Quotient rule, Chain rule. Applications: velocity, optimization, tangent lines! 📐",
  'integral': "Integration is reverse of differentiation. Techniques: Substitution, Integration by parts, Partial fractions. Definite integrals give area, indefinite give family of functions + C! ∫",
  'linear algebra': "Linear Algebra: Vectors, Matrices, Eigenvalues. Matrix operations: addition, multiplication (row×column), transpose, inverse. Used everywhere in ML, graphics, and engineering! 🔢",
  'matrix': "Matrix tips: Addition requires same dimensions, multiplication (m×n)(n×p)=(m×p), determinant for invertibility, rank for independence. Practice solving systems Ax=b! 📊",
  'probability': "Probability basics: P(A∪B) = P(A) + P(B) - P(A∩B), P(A|B) = P(A∩B)/P(B). Distributions: Binomial, Normal, Poisson. Expected value E[X] = Σx·P(x). 🎲",
  'statistics': "Statistics: Mean (average), Median (middle), Mode (most frequent), Standard deviation (spread). Hypothesis testing: p-value < 0.05 usually significant. Data tells stories! 📊",
  'trigonometry': "Trig essentials: sin²θ + cos²θ = 1, sin/cos/tan and their reciprocals. Unit circle is your friend! SOH-CAH-TOA for right triangles. Radians = degrees × π/180. 📐",
  'geometry': "Geometry formulas: Circle area = πr², Sphere volume = 4/3πr³, Triangle area = ½bh. Know Pythagorean theorem: a² + b² = c². Visualize problems! 📏",
  'algebra': "Algebra tips: FOIL for binomials, factoring (difference of squares, sum/difference of cubes), quadratic formula: x = (-b ± √(b²-4ac))/2a. Show all steps! ➕",
  'differential equation': "Diff equations: ODEs vs PDEs, order = highest derivative. Separable, linear, exact types. Solve by separation, integrating factors, or series. Applications everywhere! 📈",
  'complex numbers': "Complex numbers: z = a + bi where i² = -1. Polar form: r(cosθ + isinθ). De Moivre's theorem for powers. Crucial in engineering and physics! 🔄",
  'number theory': "Number theory: Prime numbers, GCD/LCM, modular arithmetic, Fermat's little theorem. Applications in cryptography (RSA). Every integer >1 is product of primes! 🔢",
  'discrete math': "Discrete math: Logic, sets, relations, functions, combinatorics, graph theory. Counting: permutations (order matters), combinations (order doesn't). Foundation for CS! 📋",
  'graph theory': "Graph theory: Vertices + Edges. Types: directed/undirected, weighted, trees. Algorithms: BFS, DFS, Dijkstra's shortest path. Networks, social media, maps use this! 🕸️",
}

// Physics Topics
const PHYSICS_TOPICS: SubjectTopics = {
  'mechanics': "Classical mechanics: F=ma, kinetic energy = ½mv², potential energy = mgh. Conservation laws (energy, momentum) are powerful! Start with free body diagrams. ⚙️",
  'newton': "Newton's Laws: 1) Inertia (objects stay put), 2) F=ma, 3) Action-reaction. Weight = mg. Friction = μN. Draw free body diagrams for every problem! 🍎",
  'electricity': "Electricity: V=IR (Ohm's law), P=IV. Series: R_total = R1+R2, Parallel: 1/R = 1/R1 + 1/R2. Kirchhoff's laws for complex circuits. Current flows like water! ⚡",
  'magnetism': "Electromagnetism: Moving charges create magnetic fields. F = qv×B. Right-hand rule for direction. Faraday's law: changing B induces voltage. Motors and generators! 🧲",
  'thermodynamics': "Thermodynamics: 0th (thermal equilibrium), 1st (energy conservation), 2nd (entropy increases), 3rd (absolute zero). Heat engines, refrigerators, and why time moves forward! 🔥",
  'waves': "Waves: v = fλ. Types: transverse (light), longitudinal (sound). Interference: constructive (add) and destructive (cancel). Doppler effect changes frequency! 🌊",
  'optics': "Optics: Reflection (angle in = angle out), Refraction (Snell's law: n1sinθ1 = n2sinθ2), mirrors, lenses. Real/virtual images. 1/f = 1/do + 1/di. 🔍",
  'quantum': "Quantum mechanics: Wave-particle duality, uncertainty principle (Δx·Δp ≥ ℏ/2), superposition, entanglement. Probability clouds, not orbits! Mind-bending but beautiful. ⚛️",
  'relativity': "Special relativity: Speed of light is constant, time dilates, length contracts at high speeds. E=mc² (mass-energy equivalence). GPS uses relativity corrections! 🚀",
  'momentum': "Momentum: p = mv. Conserved in collisions: m1v1 + m2v2 = m1v1' + m2v2'. Elastic (KE conserved) vs inelastic (objects stick). Impulse = FΔt = Δp. 💥",
  'energy': "Energy: Can't be created or destroyed, only transformed. KE = ½mv², PE = mgh (gravitational), PE = ½kx² (spring). Work = Force × distance. 🔋",
  'rotational': "Rotational motion: Angular velocity ω, torque τ = r×F, moment of inertia I (distribution of mass), angular momentum L = Iω. Rolling = translation + rotation! 🔄",
  'gravitation': "Gravity: F = Gm1m2/r². Orbits are conic sections. Escape velocity = √(2GM/r). Black holes when r < Schwarzschild radius. Gravity bends spacetime! 🌍",
  'fluid': "Fluid mechanics: Pressure = F/A, Pascal's principle, Archimedes (buoyancy = displaced fluid weight), Bernoulli (fast flow = low pressure). Plane wings, blood flow! 💧",
  'oscillation': "Oscillations: Simple harmonic motion, T = 2π√(m/k) for springs, T = 2π√(L/g) for pendulums. Damping reduces amplitude. Resonance when forcing frequency matches natural! 🎸",
}

// Chemistry Topics
const CHEMISTRY_TOPICS: SubjectTopics = {
  'periodic table': "Periodic table: Groups (columns) = similar properties, Periods (rows) = energy levels. Metals left, nonmetals right. Trends: electronegativity, ionization energy, atomic radius! 🧪",
  'atom': "Atomic structure: Nucleus (protons + neutrons) surrounded by electron clouds. Atomic # = protons = electrons (neutral). Mass # = protons + neutrons. Isotopes differ in neutrons! ⚛️",
  'bonding': "Chemical bonds: Ionic (metal + nonmetal, electron transfer), Covalent (nonmetals, electron sharing), Metallic (sea of electrons). Bond strength affects properties! 🔗",
  'organic': "Organic chemistry: Carbon-based compounds. Functional groups determine properties: -OH (alcohol), -COOH (acid), -NH2 (amine). Nomenclature follows IUPAC rules! 🧬",
  'reaction': "Reaction types: Synthesis (A+B→AB), Decomposition (AB→A+B), Single replacement, Double replacement, Combustion. Balance equations using coefficients! ⚗️",
  'equilibrium': "Chemical equilibrium: Forward rate = reverse rate. Le Chatelier's principle: system opposes changes. K > 1 favors products, K < 1 favors reactants. 🔄",
  'acid base': "Acids & Bases: Arrhenius (H+/OH-), Brønsted-Lowry (proton donor/acceptor), Lewis (electron pair acceptor/donor). pH = -log[H+]. Neutralization: acid + base → salt + water! 🧪",
  'redox': "Redox reactions: Oxidation = loss of electrons (OIL), Reduction = gain (RIG). Oxidation states track electrons. Used in batteries and corrosion! Balance charges AND atoms. ⚡",
  'stoichiometry': "Stoichiometry: Mole ratios from balanced equations. 1 mole = 6.022×10²³ particles. Molar mass from periodic table. Limiting reagent determines product amount! 📊",
  'thermochem': "Thermochemistry: Enthalpy (ΔH), endothermic (absorbs heat, +), exothermic (releases heat, -). Hess's law for multi-step reactions. Calorimetry measures heat! 🔥",
  'kinetics': "Chemical kinetics: Rate = k[A]ᵐ[B]ⁿ. Rate increases with temperature (Arrhenius equation), concentration, surface area. Catalysts lower activation energy without being consumed! ⏱️",
  'electrochemistry': "Electrochemistry: Galvanic cells (spontaneous, + voltage), Electrolytic cells (forced, - voltage). Cathode reduction, Anode oxidation. Batteries and electroplating! 🔋",
  'gas laws': "Gas laws: PV = nRT (ideal gas). Boyle's (P₁V₁ = P₂V₂), Charles's (V/T constant), Combined, Dalton's partial pressures. STP: 0°C, 1 atm, 22.4 L/mol. 💨",
  'solution': "Solutions: Molarity = mol/L, molality = mol/kg solvent. Dilution: M₁V₁ = M₂V₂. Colligative properties: boiling point elevation, freezing point depression. 🥤",
  'nuclear': "Nuclear chemistry: Alpha (²He), Beta (electron), Gamma (radiation). Half-life for decay. Fission (splitting), Fusion (combining). E = mc² releases massive energy! ☢️",
}

// Biology Topics
const BIOLOGY_TOPICS: SubjectTopics = {
  'cell': "Cell biology: Prokaryotes (no nucleus - bacteria), Eukaryotes (nucleus - animals, plants). Organelles: mitochondria (energy), ribosomes (proteins), nucleus (DNA). Cells are life's building blocks! 🔬",
  'dna': "DNA: Double helix, A-T G-C base pairs. Replication is semiconservative. Transcription → mRNA, Translation → Protein. Central dogma: DNA → RNA → Protein. 🧬",
  'genetics': "Genetics: Mendel's laws, dominant/recessive alleles, Punnett squares. Genotype (genes) vs Phenotype (expression). Hardy-Weinberg for populations. DNA mutations cause variation! 🧬",
  'evolution': "Evolution: Natural selection (survival of the fittest), genetic drift, gene flow, mutation. Evidence: fossils, comparative anatomy, molecular biology. Species adapt over time! 🌿",
  'ecology': "Ecology: Producers → Consumers → Decomposers. Energy decreases at each trophic level (~10% rule). Biomes, ecosystems, communities, populations, organisms. Balance matters! 🌍",
  'photosynthesis': "Photosynthesis: 6CO₂ + 6H₂O + light → C₆H₁₂O₆ + 6O₂. Light reactions in thylakoids, Calvin cycle in stroma. Chlorophyll absorbs light. Plants are solar-powered! 🌱",
  'respiration': "Cellular respiration: C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O + ATP. Glycolysis (cytoplasm), Krebs cycle (matrix), ETC (inner membrane). ~36-38 ATP per glucose! 💨",
  'mitosis': "Mitosis: Prophase → Metaphase → Anaphase → Telophase (PMAT). For growth/repair. 2n → 2n (diploid). Sister chromatids separate. Cytokinesis divides cytoplasm! 🔄",
  'meiosis': "Meiosis: Two divisions, produces 4 haploid gametes. Crossing over increases diversity. Meiosis I separates homologs, Meiosis II separates sisters. Sexual reproduction! 🔄",
  'protein': "Protein synthesis: Transcription (DNA→mRNA in nucleus), Translation (mRNA→protein at ribosomes). Codons (3 nucleotides) code for amino acids. 20 amino acids, 64 codons! 🧬",
  'enzyme': "Enzymes: Biological catalysts, lower activation energy. Lock-and-key or induced fit model. Affected by temperature, pH, substrate concentration. -ase suffix! ⚡",
  'immune': "Immune system: Innate (immediate, nonspecific) vs Adaptive (specific, memory). B cells make antibodies, T cells kill infected cells. Vaccines train immunity! 🛡️",
  'nervous': "Nervous system: Neurons transmit signals via action potentials. Synapse: neurotransmitters cross gap. CNS (brain+spinal cord), PNS (rest). Reflex arcs are fast! 🧠",
  'hormone': "Endocrine system: Hormones are chemical messengers. Feedback loops maintain homeostasis. Insulin (blood sugar), adrenaline (stress), thyroid (metabolism). Slow but long-lasting! 🔬",
  'human anatomy': "Human body systems: Circulatory (heart, blood), Respiratory (lungs), Digestive (stomach, intestines), Musculoskeletal, Nervous, Endocrine, Immune. All work together! 🫀",
}

// Economics Topics
const ECONOMICS_TOPICS: SubjectTopics = {
  'supply demand': "Supply & Demand: Price ↑ → Demand ↓, Supply ↑. Equilibrium where curves cross. Shifts vs movements along curve. Elasticity measures responsiveness! 📈",
  'gdp': "GDP = C + I + G + (X-M). Measures total economic output. Real GDP adjusts for inflation. Per capita = GDP/population. Growth rate matters for development! 💰",
  'inflation': "Inflation: General price increase over time. CPI measures basket of goods. Causes: demand-pull, cost-push, monetary. Moderate inflation (2-3%) is healthy! 📊",
  'monetary policy': "Monetary policy: Central bank controls money supply. Tools: interest rates, reserve requirements, open market operations. Lower rates → more borrowing → growth! 🏦",
  'fiscal policy': "Fiscal policy: Government spending and taxation. Expansionary (more spending, less taxes) for recession, Contractionary for inflation. Budget deficits/surpluses! 📋",
  'market structure': "Market structures: Perfect competition (many sellers, identical products), Monopoly (one seller), Oligopoly (few sellers), Monopolistic competition. Each has different pricing power! 🏪",
  'microeconomics': "Microeconomics: Individual choices, firms, markets. Utility maximization, profit maximization, market equilibrium. Marginal analysis is key! 🔍",
  'macroeconomics': "Macroeconomics: Aggregate economy - GDP, unemployment, inflation, growth. Business cycles, policy responses. The big picture! 🌐",
  'trade': "International trade: Comparative advantage (produce what you're relatively better at). Tariffs, quotas, trade agreements. Free trade increases efficiency! 🌍",
  'unemployment': "Unemployment types: Frictional (job searching), Structural (skills mismatch), Cyclical (recession). Natural rate excludes cyclical. Labor force participation matters! 📉",
}

// General Knowledge & Quick Answers
const QUICK_ANSWERS: MockQA[] = [
  { keywords: ['hello', 'hi', 'hey', 'greetings'], response: "Hey there! 👋 I'm your AI Study Buddy. Ask me anything about your studies - from math problems to exam tips. How can I help you today?" },
  { keywords: ['thanks', 'thank you', 'thx'], response: "You're welcome! Happy to help. Feel free to ask more questions anytime. Good luck with your studies! 🌟" },
  { keywords: ['who are you', 'what are you', 'about'], response: "I'm your AI Study Buddy, powered by Gemini! I'm here to help with study tips, explain concepts, and keep you motivated. Think of me as your 24/7 study partner! 🤖📚" },
  { keywords: ['joke', 'funny', 'laugh'], response: "Why do programmers prefer dark mode? Because light attracts bugs! 🐛💡 Now back to studying - but remember, laughter is great for stress relief!" },
  { keywords: ['time management', 'manage time'], response: "Time management tips: 1) Use a planner 2) Set specific study times 3) Prioritize tasks (urgent vs important) 4) Time-block your day 5) Review weekly. Your time is your most valuable asset! ⏰" },
  { keywords: ['burnout', 'overwhelmed', 'too much'], response: "Feeling burned out is a sign to pause! Take a real break (not phone scrolling), go outside, talk to friends. Quality > Quantity in studying. It's okay to rest - you'll come back stronger! 💪" },
  { keywords: ['career', 'job', 'future'], response: "Career advice: Build skills, network, get internships/projects, develop soft skills. Your major doesn't define your career - many successful people pivoted! Focus on learning and growth. 🚀" },
  { keywords: ['presentation', 'present', 'public speaking'], response: "Presentation tips: Practice aloud, know your material (not memorize), make eye contact, use visuals wisely, breathe, and remember - the audience wants you to succeed! 🎤" },
  { keywords: ['essay', 'writing', 'write'], response: "Essay writing: Start with outline, strong thesis, topic sentences for each paragraph, evidence + analysis, conclude by restating thesis differently. Revise and proofread! ✍️" },
  { keywords: ['research', 'paper', 'thesis'], response: "Research tips: Start with broad reading, narrow your question, use academic sources (Google Scholar), keep organized notes, cite as you go. Quality sources = quality paper! 📑" },
]

// Subject-specific detailed explanations
const DETAILED_EXPLANATIONS: { [key: string]: MockQA[] } = {
  'programming': [
    { keywords: ['loop', 'for', 'while'], response: "Loops repeat code! For loops: when you know iterations (for i in range(10)). While loops: when condition-based (while x < 100). Avoid infinite loops with proper exit conditions! 🔁" },
    { keywords: ['function', 'method', 'def'], response: "Functions are reusable code blocks. Parameters go in, return value comes out. Keep functions small and single-purpose. DRY principle: Don't Repeat Yourself! 🔧" },
    { keywords: ['array', 'list'], response: "Arrays/Lists store multiple items. Index starts at 0! Common operations: append, remove, slice, sort. Time complexity matters for large datasets. Choose the right data structure! 📦" },
    { keywords: ['debug', 'error', 'bug'], response: "Debugging tips: Read error messages carefully, use print statements, rubber duck debugging (explain to someone), use debugger tools, check edge cases. Bugs are learning opportunities! 🐛" },
    { keywords: ['string', 'text'], response: "Strings are text sequences. Common methods: split, join, upper, lower, strip, replace, find. Strings are immutable in most languages! Use f-strings for formatting in Python. 📝" },
    { keywords: ['class', 'object', 'instance'], response: "Classes are blueprints, objects are instances. __init__ initializes attributes, self refers to the instance. Inheritance for code reuse, encapsulation for data hiding! 🏗️" },
    { keywords: ['variable', 'var'], response: "Variables store data. Use meaningful names! In Python: dynamic typing. In Java/C++: static typing. Scope matters - local vs global. const/final for unchanging values! 📝" },
    { keywords: ['if', 'else', 'condition'], response: "Conditionals control flow! if-elif-else in Python, if-else if-else in JS/Java. Use && (and), || (or), ! (not). Keep conditions simple and readable! 🔀" },
  ],
  'math_help': [
    { keywords: ['solve', 'equation'], response: "Equation solving: Isolate the variable, do the same operation to both sides. Check your answer by substituting back! For quadratics, try factoring first, then formula. ✏️" },
    { keywords: ['proof', 'prove'], response: "Proof strategies: Direct proof, Contradiction (assume false), Induction (base + step), Contrapositive. State assumptions, show logical steps, conclude. Practice makes perfect! 📐" },
    { keywords: ['word problem', 'application'], response: "Word problems: Read carefully, identify unknown (x), translate words to math, set up equation, solve, check if answer makes sense in context. Draw diagrams! 📝" },
    { keywords: ['fraction', 'decimal'], response: "Fractions ↔ Decimals: Divide numerator by denominator. Common: 1/2=0.5, 1/4=0.25, 1/3=0.333... To add fractions, get common denominator first! 📊" },
    { keywords: ['percentage', 'percent'], response: "Percentages: Part/Whole × 100. Increase: New = Original × (1 + rate). Decrease: Original × (1 - rate). 15% of 80 = 0.15 × 80 = 12! 💯" },
    { keywords: ['graph', 'plot'], response: "Graphing tips: Label axes, choose appropriate scale, plot points carefully, draw smooth curves. y = mx + b is a line (m = slope, b = y-intercept)! 📈" },
    { keywords: ['logarithm', 'log'], response: "Logarithms: log_b(x) = y means b^y = x. log rules: log(ab) = log(a) + log(b), log(a/b) = log(a) - log(b), log(a^n) = n·log(a). Inverse of exponentials! 📊" },
    { keywords: ['exponent', 'power'], response: "Exponent rules: a^m × a^n = a^(m+n), a^m / a^n = a^(m-n), (a^m)^n = a^(mn), a^0 = 1, a^(-n) = 1/a^n. Memorize these! ⬆️" },
  ],
}

// Function to find best matching response
export const findMockResponse = (query: string): string => {
  const lowerQuery = query.toLowerCase()
  
  // Check quick answers first
  for (const qa of QUICK_ANSWERS) {
    if (qa.keywords.some(kw => lowerQuery.includes(kw))) {
      return qa.response
    }
  }
  
  // Check study techniques
  for (const qa of STUDY_TECHNIQUES) {
    if (qa.keywords.some(kw => lowerQuery.includes(kw))) {
      return qa.response
    }
  }
  
  // Check subject topics
  const allTopics = { ...CS_TOPICS, ...MATH_TOPICS, ...PHYSICS_TOPICS, ...CHEMISTRY_TOPICS, ...BIOLOGY_TOPICS, ...ECONOMICS_TOPICS }
  for (const [topic, response] of Object.entries(allTopics)) {
    if (lowerQuery.includes(topic)) {
      return response
    }
  }
  
  // Check detailed explanations
  for (const category of Object.values(DETAILED_EXPLANATIONS)) {
    for (const qa of category) {
      if (qa.keywords.some(kw => lowerQuery.includes(kw))) {
        return qa.response
      }
    }
  }
  
  // Default responses for common patterns
  if (lowerQuery.includes('what is') || lowerQuery.includes("what's")) {
    return "That's a great question! In academic terms, understanding concepts deeply involves breaking them down into components. Try looking at the fundamentals first, then build up. Would you like me to explain a specific topic? 🤔"
  }
  
  if (lowerQuery.includes('how to') || lowerQuery.includes('how do')) {
    return "Great question! The best approach is usually: 1) Understand the basics 2) Practice with examples 3) Apply to problems 4) Review mistakes. What specific skill are you trying to develop? 📚"
  }
  
  if (lowerQuery.includes('explain') || lowerQuery.includes('help')) {
    return "I'd love to help! Could you be more specific about which topic or concept you'd like me to explain? I can cover CS, Math, Physics, Chemistry, Biology, Economics, and study techniques! 🎯"
  }
  
  if (lowerQuery.includes('best') || lowerQuery.includes('recommend')) {
    return "My top recommendations: Start with fundamentals, practice actively (not passively reading), use spaced repetition, teach others what you learn, and don't forget to take breaks! What specific area do you need recommendations for? 🌟"
  }
  
  // Fun fallbacks
  const fallbacks = [
    "Interesting question! While I'm processing that, here's a study tip: Taking short walks between study sessions boosts memory retention by 40%! What else can I help with? 🚶",
    "I'm here to help! Pro tip: The best time to review material is right before sleep - your brain consolidates memories overnight. Ask me anything about your subjects! 😴📚",
    "Great curiosity! Remember: asking questions is the first step to mastery. Einstein said 'The important thing is not to stop questioning.' What topic shall we explore? 🤓",
    "Let's learn together! Fun fact: You're more likely to remember something if you write it by hand rather than typing. What concept can I help clarify? ✍️",
    "I appreciate your question! Here's motivation: Every expert was once a beginner. Keep asking, keep learning! What subject material can I assist with? 💪",
  ]
  
  return fallbacks[Math.floor(Math.random() * fallbacks.length)]
}

// Get all available topics for display
export const getAvailableTopics = (): string[] => {
  const topics = [
    'Study Techniques',
    'Computer Science',
    'Mathematics',
    'Physics',
    'Chemistry',
    'Biology',
    'Economics',
    'Programming Help'
  ]
  return topics
}

// Count total Q&A entries
export const getTotalQACount = (): number => {
  const studyTechniques = STUDY_TECHNIQUES.length
  const csTopics = Object.keys(CS_TOPICS).length
  const mathTopics = Object.keys(MATH_TOPICS).length
  const physicsTopics = Object.keys(PHYSICS_TOPICS).length
  const chemistryTopics = Object.keys(CHEMISTRY_TOPICS).length
  const biologyTopics = Object.keys(BIOLOGY_TOPICS).length
  const economicsTopics = Object.keys(ECONOMICS_TOPICS).length
  const quickAnswers = QUICK_ANSWERS.length
  const detailed = Object.values(DETAILED_EXPLANATIONS).reduce((sum, arr) => sum + arr.length, 0)
  
  return studyTechniques + csTopics + mathTopics + physicsTopics + 
         chemistryTopics + biologyTopics + economicsTopics + quickAnswers + detailed
}

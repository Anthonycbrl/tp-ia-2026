# Prompts — TimeTravel Agency

> Collection complète des prompts IA pour la webapp TimeTravel Agency  
> Stack : Next.js 14 · TailwindCSS · Framer Motion · Groq API · Vercel

---

## Prompt 1 — Génération complète de la webapp

```
Create a premium futuristic webapp for a luxury time travel agency called "TimeTravel Agency".

Tech stack:
- Next.js 14
- TypeScript
- TailwindCSS
- Framer Motion
- Responsive mobile-first design

Design style:
- cinematic
- futuristic luxury
- dark mode
- black background
- gold accents
- immersive UI
- glassmorphism
- subtle gradients
- smooth animations

Pages/Sections:
1. Sticky navbar
2. Hero section with animated background
3. 3 destination cards
4. AI chatbot widget fixed bottom-right
5. Testimonials section
6. CTA section
7. Footer

Destinations:
- Paris 1889
- Cretaceous Period (-65M years)
- Florence 1504

Each destination card should contain:
- immersive image
- title
- short description
- price
- "Explore Timeline" button
- hover animations

Add:
- Framer Motion animations
- smooth scrolling
- fade-in on scroll
- elegant transitions
- responsive layout

Generate production-quality code.
Use clean component architecture.
```

---

## Prompt 2 — Amélioration premium du design

```
Improve the UI to make it feel more cinematic and premium.

Add:
- animated particles in hero
- glowing buttons
- depth effects
- subtle parallax
- luxury typography
- better spacing
- smoother hover transitions
- immersive lighting effects

Keep performance optimized.
```

---

## Prompt 3 — Amélioration UX et responsive

```
Improve mobile responsiveness and UX.

Ensure:
- perfect mobile layout
- accessible buttons
- fast loading
- optimized typography
- proper spacing on small screens
- sticky CTA on mobile
```

---

## Prompt 4 — Animations Framer Motion avancées

```
Add advanced Framer Motion animations:
- staggered card entrance
- scroll reveal
- hover scale
- glow pulse on CTA
- animated hero text
- smooth section transitions

Animation style:
- cinematic
- smooth
- elegant
- not excessive

Duration: 0.6s to 0.8s
```

---

## Prompt 5 — Widget chatbot flottant

```
Create a floating AI chatbot widget.

Features:
- floating circular button bottom-right
- expandable chat window
- futuristic dark theme
- smooth open/close animation
- message bubbles
- typing animation
- API integration with /api/chat

Style:
- premium sci-fi
- elegant
- cinematic
- glassmorphism

Mobile optimized.
```

---

## Prompt 6 — Quiz de recommandation IA

```
Create an interactive destination recommendation quiz.

Requirements:
- 4 multiple-choice questions
- progress indicator
- smooth transitions
- calculate best destination
- show personalized recommendation card

Questions should evaluate:
- personality
- interests
- travel style
- preferred atmosphere

Final recommendation should feel immersive and personalized.
```

---

## Prompt 7 — Enrichissement IA de la recommandation

```
Generate a personalized luxury recommendation for a time traveler.

Destination: Florence 1504

User interests:
- art
- architecture
- history

Write:
- immersive recommendation
- emotional tone
- luxurious travel style
- 120 words max
```

---

## Prompt 8 — Intégration des assets custom

```
I added custom assets inside the project.

Use these assets throughout the application instead of placeholder media.

Assets:
- 1 cinematic background video for the hero section
- 3 destination images for the destination cards

Requirements:

1. HERO SECTION
- Use the uploaded video as fullscreen background
- Add dark overlay for readability
- Add subtle blur and cinematic gradient
- Autoplay, muted, loop, playsInline
- Optimize performance and lazy loading
- Ensure mobile compatibility

Hero style:
- luxury futuristic time-travel agency
- immersive cinematic atmosphere
- premium sci-fi feel

2. DESTINATION CARDS
Use the 3 uploaded images respectively for:
- Paris 1889
- Cretaceous Period
- Florence 1504

For each card:
- full-cover image
- hover zoom effect
- gradient overlay
- animated reveal on scroll
- premium typography
- glassmorphism content panel

3. IMAGE & VIDEO OPTIMIZATION
- Use Next.js Image component when possible
- Proper object-fit cover
- Responsive loading
- Lazy loading
- Preserve visual quality

4. ANIMATIONS
Add:
- smooth fade-in
- hover scale effects
- cinematic transitions
- subtle parallax on hero

5. DESIGN CONSISTENCY
Keep:
- dark mode
- gold accents
- elegant cinematic UI
- futuristic luxury aesthetic

6. RESPONSIVE
Ensure:
- mobile-first responsive layout
- optimized hero on mobile
- cards stack correctly on small screens

IMPORTANT:
Automatically detect and use the uploaded assets from the project files/public folder.
Replace every placeholder image or stock media with the uploaded assets.
```

---

## Prompt 9 — Migration OpenRouter → Groq API

```
Migrate the chatbot from OpenRouter to Groq API.

Requirements:

1. REMOVE OPENROUTER
- Remove all OpenRouter configuration
- Remove OpenAI SDK usage for OpenRouter
- Remove unused environment variables

2. INSTALL GROQ
Use: npm install groq-sdk

3. ENVIRONMENT VARIABLES
Create and use: GROQ_API_KEY=your_key_here
Never expose the API key in frontend code.

4. CREATE A CLEAN NEXT.JS API ROUTE
Use:
- app/api/chat/route.ts
- TypeScript
- async POST handler

5. USE GROQ MODEL
Model: llama-3.1-8b-instant

6. SYSTEM PROMPT
The AI assistant should behave like a premium luxury time-travel agency guide.

Personality:
- professional
- cinematic
- warm
- historically passionate
- futuristic luxury tone

Knowledge:
- Paris 1889
- Florence 1504
- Cretaceous Period

The assistant should:
- recommend destinations
- answer travel questions
- invent coherent luxury pricing
- stay immersive and cinematic

7. ADD ERROR HANDLING
Handle:
- missing API key
- API failures
- rate limits
- empty responses

Return clean JSON responses.

8. CONNECT EXISTING CHATBOT UI
The existing floating chatbot widget should:
- send messages to /api/chat
- display assistant responses
- show loading states
- handle API errors gracefully

9. KEEP THE CURRENT UI DESIGN
Do not modify:
- dark mode
- cinematic style
- glassmorphism
- animations
- layout

Only replace the AI backend.

10. OPTIMIZE PERFORMANCE
Requirements:
- fast response time
- prevent duplicate API calls
- avoid unnecessary rerenders
- mobile-friendly behavior

11. FINAL RESULT
The chatbot must work entirely with Groq API using: llama-3.1-8b-instant
No paid APIs. No OpenRouter dependency. Production-ready implementation.
```


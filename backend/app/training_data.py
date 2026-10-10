"""
training_data.py
~~~~~~~~~~~~~~~~
100+ basic Q&A training pairs for the Nutri AI assistant.
Covers: greetings, farewells, identity/name questions, project info,
how-are-you, thank-you, compliments, capability questions, and more.
"""

# Each entry: (list_of_trigger_keywords_or_phrases, response_string)
# The chat engine matches user input against triggers (case-insensitive, partial match).
TRAINING_DATA = [

    # ── GREETINGS ─────────────────────────────────────────────────────────────
    (["hi", "hii", "hiii", "hey", "heya", "hola", "hy"], "Hey there! 👋 Welcome to Nutri AI! How can I help you today?"),
    (["hello", "helo", "helloo", "hellooo"], "Hello! 😊 I'm your Nutri AI assistant. Ask me anything about nutrition, meals, or your diet plan!"),
    (["good morning", "gm"], "Good morning! ☀️ Ready to start your day with a healthy meal plan? I'm here to help!"),
    (["good afternoon"], "Good afternoon! 🌤️ Hope your day is going great! Need any nutrition advice?"),
    (["good evening", "gud evening"], "Good evening! 🌙 Let's end the day on a healthy note. How can I assist you?"),
    (["good night", "gn", "goodnight"], "Good night! 🌙 Rest well and wake up ready for a healthy tomorrow! 💪"),
    (["greetings", "salutations"], "Greetings! 🎉 I'm Nutri AI — your personal nutrition assistant. How can I help?"),
    (["yo", "sup", "whats up", "wassup", "wazzup"], "Yo! 😄 What's up? Ready to talk nutrition? Let's go!"),
    (["howdy"], "Howdy! 🤠 Nutri AI at your service! What nutrition questions do you have?"),
    (["namaste", "namaskar"], "Namaste! 🙏 Welcome to Nutri AI. I'm here to help you with your health journey!"),
    (["bonjour", "ciao", "hallo", "konnichiwa"], "Hello in every language! 🌍 I'm Nutri AI — your global nutrition guide! How can I help?"),
    (["welcome"], "Welcome! 🎊 I'm so glad you're here. Let's get started on your healthy journey!"),
    (["hi there", "hey there", "hello there"], "Hi there! 👋 Great to meet you! I'm Nutri AI. What can I do for you?"),
    (["hi nutri", "hello nutri", "hey nutri", "hi ai", "hello ai", "hey ai"], "Hello! I'm Nutri AI 🌿 — ready to help you eat better and feel amazing!"),

    # ── HOW ARE YOU ────────────────────────────────────────────────────────────
    (["how are you", "how r u", "how are u", "hru", "how r you"], "I'm doing fantastic, thanks for asking! 😊 As an AI, I'm always at 100% and ready to help you. How are YOU feeling today?"),
    (["how do you do", "how do u do"], "I'm doing wonderfully! 🌟 How about you? Anything I can help you with today?"),
    (["are you ok", "are you okay", "u ok"], "I'm perfectly fine, thank you! 😄 Always here and ready. How are you doing?"),
    (["how is it going", "how it going"], "It's going great! Every day is a new opportunity to eat healthy. 🥗 How about you?"),
    (["how life", "hows life", "how is life"], "Life's great when you're eating healthy! 😄 How's your nutrition journey going?"),
    (["feeling good", "feel good", "feeling great"], "That's wonderful to hear! 🎉 Feeling good is often linked to eating well. Keep it up!"),
    (["whats new", "anything new"], "Everything is new every day! 🌱 I'm constantly here to help you discover new healthy foods and habits. What's up?"),
    (["how have you been", "how hav u been"], "I've been great, always learning and ready to help! 😊 How have YOU been?"),
    (["im good", "i am good", "doing good", "doing well"], "Glad to hear that! 😊 Keep that positive energy going — healthy body, healthy mind!"),
    (["im fine", "i am fine"], "Great! 😊 Anything I can help you with today? Nutrition tips, meal plans, calorie tracking?"),
    (["im not good", "not feeling well", "feeling sick", "not well"], "Oh no, I'm sorry to hear that! 😢 Please take care of yourself. Remember, good nutrition can help your body recover. Stay hydrated! 💧"),
    (["im tired", "feeling tired", "exhausted"], "I'm sorry you're feeling tired. 😴 Did you know that iron-rich foods like spinach, lentils, and lean meat can boost your energy? Would you like some energy-boosting meal ideas?"),
    (["im hungry", "starving", "i am hungry"], "Oh you're hungry! 🍽️ Let me help! Tell me what you're in the mood for, or I can suggest a healthy meal based on your goals!"),

    # ── NAME / IDENTITY ────────────────────────────────────────────────────────
    (["what is your name", "your name", "whats your name", "who are you"], "I'm **Nutri AI** 🌿 — your personal AI-powered nutrition and diet assistant! Nice to meet you!"),
    (["what do they call you", "what should i call you"], "You can call me **Nutri** or **Nutri AI**! 😊 Either works perfectly fine!"),
    (["do you have a name", "you have a name"], "Yes! My name is **Nutri AI** 🌿. I'm your personal nutrition companion!"),
    (["tell me about yourself", "about you", "who r u", "who are u"], "I'm **Nutri AI** 🌿 — an intelligent nutrition assistant designed to help you track meals, get personalized diet plans, scan food barcodes, and achieve your health goals. I'm here 24/7 for you!"),
    (["are you a bot", "are you an ai", "are you real", "are you human", "r u human", "r u a bot"], "I'm an AI assistant — Nutri AI! 🤖 Not human, but I'm pretty great at nutrition advice! 😄"),
    (["are you alive", "do you have feelings"], "I don't have feelings like humans do, but I do have a passion for helping you eat healthy! 🌱 Does that count?"),
    (["are you smart", "how smart are you"], "I'm trained on thousands of nutrition facts and healthy living tips! 🧠 Smart enough to help you reach your health goals, I'd say!"),
    (["what are you", "what r u"], "I'm Nutri AI — your AI-powered nutrition coach! 🌿 I can help with meal planning, calorie tracking, diet advice, and much more!"),
    (["your age", "how old are you", "how old r u"], "I don't have an age! 😄 I'm an AI, so I'm as young as when I was first created. But my nutrition knowledge is timeless! 🌟"),

    # ── PROJECT NAME ───────────────────────────────────────────────────────────
    (["what is this app", "what is nutri", "what is nutri ai", "about this app", "about nutri"], "This is **Nutri AI** 🌿 — a smart nutrition tracking app that helps you log meals, get personalized diet plans, scan food barcodes, and track your health goals. All in one place!"),
    (["project name", "name of this project", "app name"], "The project is called **Nutri AI** 🌿! It's a full-stack AI-powered nutrition and wellness app."),
    (["who made you", "who created you", "who built you", "who developed you"], "Nutri AI was built by a talented development team to help people like you live healthier lives! 🚀"),
    (["why was nutri made", "purpose of nutri", "why this app"], "Nutri AI was created to make healthy eating easier and more accessible for everyone! 🥗 Tracking nutrition, planning meals, and getting AI guidance — all in one smart app!"),
    (["what can nutri do", "what can you do", "your features", "capabilities", "what can you help with"], "I can help you with:\n\n🥗 Meal Logging — Track what you eat daily\n📊 Diet Plans — Get personalized nutrition plans\n🔍 Barcode Scanner — Scan food to get nutrition info\n📸 Food Photo Analysis — AI identifies your food\n💬 Nutrition Chat — Ask me anything about health!\n\nWhat would you like to explore?"),
    (["is nutri free", "cost of nutri", "how much does it cost"], "Nutri AI is here to help you! Contact the team for pricing details. But your health journey? Priceless! 😄"),

    # ── THANK YOU ──────────────────────────────────────────────────────────────
    (["thank you", "thanks", "thank u", "thankyou", "thx", "ty", "thnx", "thnks"], "You're welcome! 😊 I'm always here to help. Is there anything else you'd like to know?"),
    (["thanks a lot", "many thanks", "thanks so much", "thank you so much"], "You're very welcome! 🙏 It was my pleasure helping you. Don't hesitate to ask anything anytime!"),
    (["appreciate it", "i appreciate", "much appreciated"], "I'm glad I could help! 😊 Your health journey matters, and I'm here every step of the way!"),
    (["great help", "very helpful", "so helpful", "helpful"], "Thank you! 😊 Helping you is what I'm here for! Keep up the great work on your health journey! 💪"),

    # ── FAREWELLS ──────────────────────────────────────────────────────────────
    (["bye", "bye bye", "byeee", "bbye"], "Goodbye! 👋 Take care and stay healthy! Come back anytime you need nutrition advice! 🌿"),
    (["goodbye", "good bye", "farewell"], "Farewell! 🌟 Keep eating healthy and I'll see you soon! 👋"),
    (["see you", "see ya", "cya", "catch you later", "talk later"], "See you later! 😊 Stay healthy and come back anytime! 🌱"),
    (["take care", "tc"], "You too! Take care! 💚 Remember — good nutrition is self-care! 🥗"),
    (["have a good day", "have a nice day", "have a great day"], "Thank you! You too! 🌟 May your day be as healthy and bright as a fresh salad! 😄"),
    (["have a good night", "sweet dreams"], "Sweet dreams! 🌙 Rest well — your body recovers and recharges overnight. See you tomorrow! 💤"),
    (["im leaving", "i have to go", "gotta go", "gtg"], "Okay! No problem! 👋 Come back whenever you need help. Eat healthy! 🌿"),
    (["brb", "be right back"], "Take your time! I'll be right here when you get back! 😊"),
    (["ttyl", "talk to you later"], "Talk to you later! 😊 Stay healthy in the meantime! 🌱"),

    # ── COMPLIMENTS ────────────────────────────────────────────────────────────
    (["you are great", "you are amazing", "amazing"], "Thank you so much! 😊 You're pretty amazing too for taking steps towards a healthier life!"),
    (["you are smart", "so smart", "very smart"], "Aw, thank you! 🧠 I try my best! You're smart too for choosing healthy eating!"),
    (["you are helpful", "so helpful"], "That's my goal! 😊 I'm always here to help you on your nutrition journey!"),
    (["i love you", "love you", "love u"], "That's so sweet! 💚 I love helping you stay healthy! 😄"),
    (["you are the best", "best ai"], "Thank you! 🌟 You're the best for taking your health seriously! We make a great team! 💪"),
    (["you are cool", "so cool"], "Thanks, I try! 😎 But you know what's cooler? Eating healthy and feeling amazing! 🌿"),
    (["good job", "well done", "nice work", "great job"], "Thank you! 😊 Now let's get to work on your nutrition goals — that's the real great job! 💪"),
    (["impressive", "wow", "awesome", "fantastic"], "Thanks! 🎉 I'm always working to impress with the best nutrition advice! What can I help you with?"),

    # ── BASIC QUESTIONS ────────────────────────────────────────────────────────
    (["how does this work", "how do i use this", "how to use"], "It's simple! 😊 You can:\n1. 💬 Chat with me for nutrition advice\n2. 🍽️ Log your meals\n3. 📊 Check your diet plan\n4. 📸 Upload food photos\n5. 🔍 Scan barcodes\n\nWhat would you like to start with?"),
    (["help", "i need help", "can you help", "need assistance"], "Of course! I'm here to help! 😊 Tell me what you need — nutrition advice, meal planning, calorie tracking, or something else? Just ask!"),
    (["yes", "yeah", "yep", "yup", "sure", "ok", "okay", "alright", "of course"], "Great! 😊 Tell me more — I'm listening!"),
    (["no", "nope", "nah", "not really"], "No worries! 😊 Feel free to ask me anything else whenever you're ready!"),
    (["maybe", "i think so", "not sure", "idk"], "That's okay! Take your time. 😊 I'm here whenever you're ready to explore!"),
    (["what time is it", "whats the time"], "I don't have access to the clock, but I know it's always a good time to eat healthy! 😄 Check your device for the time!"),
    (["what day is it", "whats today"], "I don't have calendar access, but every day is a great day to make healthy choices! 🌱"),
    (["tell me a joke", "joke", "make me laugh", "say something funny"], "Why did the salad go to the gym? 🥗💪 Because it wanted to get a little *dressing*! 😄 Hope that made you smile!"),
    (["tell me a fact", "fun fact", "did you know"], "Did you know? 🤔 Drinking water before meals can help reduce calorie intake and support weight management! Stay hydrated! 💧"),
    (["motivate me", "motivation", "inspire me", "i need motivation"], "You've got this! 💪 Every healthy choice you make today is an investment in your future self. Small steps lead to big results. Start now — your body will thank you! 🌟"),
    (["i can do it", "i will do it", "lets do this", "lets go"], "YES! That's the spirit! 🔥 Let's crush those health goals together! You're unstoppable! 💪"),
    (["i give up", "i want to quit", "this is too hard"], "Don't give up! 💚 Progress takes time and every step counts. Even small healthy choices matter. You're stronger than you think! Keep going! 💪"),

    # ── NUTRITION BASICS ───────────────────────────────────────────────────────
    (["what is calorie", "what are calories", "calorie meaning"], "A calorie is a unit of energy! 🔥 Your body uses calories from food as fuel. Balancing calories in vs. calories out is key to weight management!"),
    (["what is protein", "protein meaning", "why protein"], "Protein is an essential macronutrient that builds and repairs muscles, supports immunity, and keeps you full longer! 💪 Great sources: chicken, eggs, lentils, tofu."),
    (["what is carbs", "what are carbohydrates", "carb meaning"], "Carbohydrates are your body's primary energy source! ⚡ Complex carbs (oats, brown rice, veggies) are healthier than simple carbs (sugar, white bread)."),
    (["what is fat", "dietary fat", "healthy fats"], "Fats are essential for brain health, hormone production, and absorbing vitamins! 🥑 Healthy fats come from avocados, nuts, olive oil, and fatty fish."),
    (["drink water", "how much water", "water intake"], "Staying hydrated is crucial! 💧 The general recommendation is 8 glasses (2 liters) per day, but it varies by your body weight and activity level."),
    (["what is bmi", "bmi meaning", "body mass index"], "BMI (Body Mass Index) is a measure of body weight relative to height. 📊 It helps assess if you're underweight, normal weight, overweight, or obese. Should I help you calculate yours?"),
    (["how to lose weight", "weight loss", "lose weight", "losing weight"], "For healthy weight loss:\n1. Create a small calorie deficit\n2. Eat more protein and fiber\n3. Stay hydrated\n4. Exercise regularly\n5. Get enough sleep\n\nWould you like a personalized diet plan?"),
    (["how to gain weight", "weight gain", "gain weight", "gaining weight"], "For healthy weight gain:\n1. Eat in a calorie surplus\n2. Focus on protein-rich foods\n3. Include healthy fats\n4. Strength training helps!\n5. Eat frequently\n\nWant me to suggest a meal plan?"),
    (["what to eat", "what should i eat", "food suggestion", "meal idea"], "It depends on your goals! 🍽️ For a balanced meal, aim for:\n• 50% vegetables/fruits\n• 25% lean protein\n• 25% whole grains\n\nTell me your goals and I'll give personalized suggestions!"),
    (["healthy food", "healthy eating", "eat healthy", "healthy diet"], "Healthy eating means choosing whole, minimally processed foods! 🥗 Think: fruits, vegetables, lean proteins, whole grains, and healthy fats. Less sugar, salt, and ultra-processed foods!"),
    (["breakfast", "what to eat for breakfast", "breakfast ideas"], "A great breakfast fuels your day! ☀️ Try:\n• Oatmeal with fruits 🍓\n• Eggs with whole grain toast 🥚\n• Greek yogurt with nuts 🥜\n• Smoothie with protein 🥤\n\nWhat are your dietary preferences?"),
    (["lunch", "what to eat for lunch", "lunch ideas"], "For a healthy lunch, try: 🥗\n• Grilled chicken salad\n• Lentil soup with whole grain bread\n• Brown rice with vegetables and protein\n• Whole wheat wrap with lean meat\n\nNeed a personalized lunch plan?"),
    (["dinner", "what to eat for dinner", "dinner ideas"], "For a healthy dinner: 🌙\n• Baked fish with steamed veggies\n• Stir-fried tofu with brown rice\n• Chicken breast with sweet potato\n• Dal with roti and salad\n\nWant me to build a full day meal plan?"),
    (["snack", "snacks", "healthy snack", "snack ideas"], "Healthy snack ideas: 🍎\n• Apple slices with peanut butter\n• Handful of mixed nuts\n• Carrot sticks with hummus\n• Greek yogurt\n• Hard-boiled eggs\n\nKeep snacks protein-rich to stay full longer!"),
    
# ── NEW FOOD & NUTRITION DATA ──

(["what are the benefits of apple", "benefits of apple", "why is apple healthy"],
 "Apples provide fiber, vitamin C, water, and natural carbohydrates. They can be a convenient whole-fruit snack."),

(["can i eat apple every day", "eat apple daily", "apple every day"],
 "Yes, an apple can be included regularly as part of a varied and balanced diet."),

(["is apple good for a snack", "apple as a snack", "is apple a healthy snack"],
 "Yes. Apple is a convenient fruit snack and can be paired with yogurt, nuts, or another protein source."),

(["what nutrients are in apple", "apple nutrients", "nutrition in apple"],
 "Apples mainly provide carbohydrates, fiber, vitamin C, water, and various plant compounds."),

(["is apple better whole or as juice", "apple or apple juice", "whole apple vs juice"],
 "Whole apple is generally more filling because it retains its fiber and food structure. Juice is easier to consume quickly."),

(["what is a healthy portion of apple", "apple serving size", "how much apple should i eat"],
 "One medium apple is a practical portion for many people, although individual energy needs vary."),

(["can i have apple before workout", "apple before exercise", "eat apple before gym"],
 "Yes. Apple provides carbohydrates that can be useful before exercise. Pair it with another food if you need a more substantial snack."),

(["what can i pair with apple", "foods to eat with apple", "apple food combinations"],
 "Apple pairs well with plain yogurt, peanut butter, nuts, oats, or cottage cheese."),

(["how should i prepare apple", "best way to eat apple", "how to eat apple"],
 "Wash the apple and eat it whole. Keeping the skin on can provide additional fiber."),

(["what are the benefits of banana", "banana benefits", "why is banana healthy"],
 "Bananas provide carbohydrates, potassium, vitamin B6, and fiber. They are useful as a convenient energy-rich snack."),

(["can i eat banana every day", "eat banana daily", "banana every day"],
 "Yes. Banana can be included regularly as part of a varied diet and appropriate portion."),

(["is banana good before exercise", "banana before workout", "eat banana before gym"],
 "Banana can be useful before exercise because it provides readily available carbohydrate and potassium."),

(["what nutrients are in banana", "banana nutrients", "nutrition in banana"],
 "Bananas provide carbohydrate, potassium, vitamin B6, fiber, and small amounts of several other nutrients."),

(["can banana help after workout", "banana after exercise", "eat banana after gym"],
 "Banana can provide carbohydrate after exercise. Combining it with a protein source can make a more complete recovery snack."),

(["what can i pair with banana", "foods to eat with banana", "banana food combinations"],
 "Banana pairs well with yogurt, oats, milk, nuts, peanut butter, or seeds."),

(["are oranges good for hydration", "orange for hydration", "does orange contain water"],
 "Oranges contain a high amount of water and can contribute to overall fluid intake."),

(["what nutrients does orange contain", "orange nutrients", "nutrition in orange"],
 "Oranges provide vitamin C, water, fiber, folate, and various plant compounds."),

(["is whole orange better than orange juice", "orange or orange juice", "whole orange vs juice"],
 "Whole orange generally provides more fiber and tends to be more filling than juice."),

(["can i eat orange at night", "orange before sleep", "eat orange at night"],
 "Yes. Orange can be eaten at night if it fits comfortably into your overall diet."),

(["what are the benefits of guava", "guava benefits", "why is guava healthy"],
 "Guava provides substantial vitamin C along with fiber, water, and other plant nutrients."),

(["is guava high in fiber", "guava fiber", "does guava contain fiber"],
 "Yes. Guava is a useful fruit source of dietary fiber."),

(["can guava be eaten with seeds", "eat guava seeds", "are guava seeds edible"],
 "Yes. The edible seeds of guava can normally be eaten along with the fruit."),

(["is papaya good for digestion", "papaya for digestion", "does papaya help digestion"],
 "Papaya provides water and fiber, which can contribute to normal digestive health."),

(["what nutrients does papaya contain", "papaya nutrients", "nutrition in papaya"],
 "Papaya provides vitamin C, carotenoids, folate, fiber, and water."),

(["can i eat papaya as a snack", "papaya snack", "eat papaya as snack"],
 "Yes. Fresh papaya can be used as a light fruit snack."),

(["is watermelon healthy", "watermelon benefits", "why is watermelon healthy"],
 "Watermelon provides water, carbohydrate, vitamin C, and carotenoids and can fit into a balanced diet."),

(["does watermelon contain a lot of water", "water in watermelon", "is watermelon hydrating"],
 "Yes. Watermelon has a high water content and can contribute to daily fluid intake."),

(["is watermelon good after exercise", "watermelon after workout", "watermelon after gym"],
 "Watermelon can provide fluid and carbohydrate after exercise, although it may need to be combined with other foods for a complete recovery meal."),

(["what are the benefits of pineapple", "pineapple benefits", "why is pineapple healthy"],
 "Pineapple provides vitamin C, water, carbohydrate, and plant compounds."),

(["can pineapple be eaten daily", "eat pineapple every day", "pineapple daily"],
 "Pineapple can be included regularly in a varied diet when portions fit your needs."),

(["is fresh pineapple better than canned", "fresh vs canned pineapple", "which pineapple is healthier"],
 "Fresh pineapple avoids the added syrup that can be present in some canned versions. Choose canned pineapple packed in water or its own juice when possible."),

(["what are the benefits of pomegranate", "pomegranate benefits", "why is pomegranate healthy"],
 "Pomegranate provides fiber and plant compounds such as polyphenols."),

(["is pomegranate juice as healthy as whole pomegranate", "pomegranate or pomegranate juice", "whole pomegranate vs juice"],
 "Whole pomegranate provides fiber that is largely absent from juice, so the whole fruit is generally more filling."),

(["how much pomegranate should i eat", "pomegranate serving size", "pomegranate portion"],
 "A moderate serving of pomegranate arils can fit easily into a balanced meal or snack."),

(["are grapes healthy", "grape benefits", "why are grapes healthy"],
 "Grapes provide water, carbohydrate, fiber, and plant compounds and can be included as a fruit choice."),

(["can i eat grapes before workout", "grapes before exercise", "grapes before gym"],
 "Yes. Grapes provide carbohydrate and can work as a light pre-workout snack."),

(["are frozen grapes healthy", "frozen grape benefits", "can i eat frozen grapes"],
 "Frozen grapes can be a convenient fruit snack and retain many of the nutrients found in fresh grapes."),

(["what are the benefits of kiwi", "kiwi benefits", "why is kiwi healthy"],
 "Kiwi provides vitamin C, fiber, potassium, and other plant nutrients."),

(["can kiwi help increase vitamin c intake", "kiwi vitamin c", "is kiwi high in vitamin c"],
 "Yes. Kiwi is a useful source of vitamin C."),

(["can i eat kiwi with the skin", "eat kiwi skin", "is kiwi skin edible"],
 "The skin is edible and contains additional fiber, but you can peel it if you prefer."),

(["what are the benefits of avocado", "avocado benefits", "why is avocado healthy"],
 "Avocado provides mostly unsaturated fat, fiber, potassium, and folate."),

(["is avocado high in healthy fats", "avocado healthy fats", "does avocado contain healthy fat"],
 "Yes. Avocado contains mostly monounsaturated fat, although it is also relatively energy-dense."),

(["can avocado help make a meal filling", "does avocado keep you full", "avocado and fullness"],
 "Its combination of fat and fiber can contribute to satiety when included in an appropriate portion."),

(["what are the benefits of carrot", "carrot benefits", "why are carrots healthy"],
 "Carrots provide beta-carotene, fiber, potassium, and other plant nutrients."),

(["is cooked carrot healthy", "cooked carrot benefits", "can i eat cooked carrots"],
 "Yes. Cooked carrots remain nutritious, and cooking can improve the body's access to some carotenoids."),

(["are raw carrots a good snack", "raw carrot snack", "can i eat raw carrots"],
 "Yes. Raw carrots are a convenient crunchy snack and provide fiber and carotenoids."),

(["what are the benefits of spinach", "spinach benefits", "why is spinach healthy"],
 "Spinach provides folate, vitamin K, carotenoids, fiber, and several minerals."),

(["is spinach better raw or cooked", "raw vs cooked spinach", "should spinach be cooked"],
 "Both can be nutritious. Cooking reduces volume and can improve absorption of some nutrients, while raw spinach retains its fresh texture."),

(["can spinach be added to breakfast", "spinach for breakfast", "eat spinach at breakfast"],
 "Yes. Spinach can be added to eggs, sandwiches, smoothies, or savory oats."),

(["what are the benefits of broccoli", "broccoli benefits", "why is broccoli healthy"],
 "Broccoli provides fiber, vitamin C, vitamin K, folate, and plant compounds."),

(["is steamed broccoli healthy", "steamed broccoli benefits", "can i steam broccoli"],
 "Yes. Light steaming is a simple way to prepare broccoli while limiting added fat."),

(["can broccoli provide vitamin c", "broccoli vitamin c", "is broccoli high in vitamin c"],
 "Yes. Broccoli is a useful vegetable source of vitamin C."),

(["what are the benefits of tomato", "tomato benefits", "why are tomatoes healthy"],
 "Tomatoes provide vitamin C, potassium, fiber, and lycopene."),

(["is cooked tomato healthy", "cooked tomato benefits", "can tomatoes be cooked"],
 "Yes. Cooking tomatoes can increase the availability of lycopene, while different preparation methods provide different nutritional profiles."),

(["can tomatoes be eaten raw", "raw tomatoes", "eat tomato raw"],
 "Yes. Raw tomatoes are nutritious and can be used in salads, sandwiches, or snacks."),

(["what are the benefits of cucumber", "cucumber benefits", "why is cucumber healthy"],
 "Cucumber has high water content and provides small amounts of vitamin K and other nutrients."),

(["is cucumber good for a light snack", "cucumber as snack", "cucumber snack idea"],
 "Yes. Cucumber is a low-energy, water-rich food that can be used as a light snack."),

(["can cucumber help with hydration", "cucumber for hydration", "does cucumber contain water"],
 "Cucumber contains a lot of water and can contribute to overall fluid intake."),

(["what are the benefits of beetroot", "beetroot benefits", "why is beetroot healthy"],
 "Beetroot provides folate, fiber, potassium, and naturally occurring dietary nitrates."),

(["can beetroot be eaten before exercise", "beetroot before workout", "beetroot before gym"],
 "Beetroot is a source of dietary nitrates, and beetroot products are sometimes used around exercise. Individual responses vary."),

(["is roasted beetroot healthy", "roasted beetroot benefits", "can beetroot be roasted"],
 "Yes. Roasted beetroot can be nutritious; keep added oil and salt moderate."),

(["what are the benefits of sweet potato", "sweet potato benefits", "why is sweet potato healthy"],
 "Sweet potato provides carbohydrate, fiber, potassium, and beta-carotene."),

(["is sweet potato better than regular potato", "sweet potato vs potato", "which is healthier sweet potato or potato"],
 "Neither is universally better. Sweet potato provides more beta-carotene, while regular potato is also nutritious and provides potassium."),

(["can sweet potato be eaten after workout", "sweet potato after gym", "sweet potato post workout"],
 "Yes. Sweet potato provides carbohydrate and can be combined with a protein source for a balanced recovery meal."),

(["what are the benefits of oats", "oats benefits", "why are oats healthy"],
 "Oats provide carbohydrate, fiber, and beta-glucan, a soluble fiber associated with heart-health benefits."),

(["are oats good for breakfast", "oats for breakfast", "is oatmeal healthy"],
 "Yes. Oats can provide a filling carbohydrate-and-fiber base for breakfast."),

(["can oats be eaten without cooking", "raw oats", "can i eat oats uncooked"],
 "Some oat products can be eaten without cooking when prepared appropriately, such as overnight oats. Follow the product's preparation guidance."),

(["what can i add to oats", "oatmeal toppings", "foods to add to oats"],
 "You can add fruit, plain yogurt, milk, nuts, seeds, or cinnamon to oats."),

(["are overnight oats healthy", "overnight oats benefits", "is overnight oats healthy"],
 "Overnight oats can be nutritious when made with oats, a suitable liquid, fruit, and optional nuts or seeds without excessive added sugar."),

(["what are the benefits of lentils", "lentil benefits", "why are lentils healthy"],
 "Lentils provide plant protein, fiber, folate, iron, and other minerals."),

(["are lentils good for vegetarians", "lentils for vegetarians", "vegetarian lentil protein"],
 "Yes. Lentils are a useful plant-based source of protein and can complement grains and vegetables."),

(["can lentils be eaten every day", "eat lentils daily", "lentils every day"],
 "Lentils can be eaten regularly as part of a varied diet, provided they fit your digestion and overall nutritional needs."),

(["what are the benefits of chickpeas", "chickpea benefits", "why are chickpeas healthy"],
 "Chickpeas provide plant protein, fiber, folate, iron, and other minerals."),

(["are chickpeas good for weight management", "chickpeas for weight management", "chickpeas and fullness"],
 "Chickpeas can be filling because they provide protein and fiber. Portion size and the overall diet still matter."),

(["can chickpeas be used in salads", "chickpeas in salad", "chickpea salad"],
 "Yes. Cooked chickpeas can add protein, fiber, and texture to salads."),

(["what are the benefits of tofu", "tofu benefits", "why is tofu healthy"],
 "Tofu provides plant protein and may provide calcium depending on how it is made."),

(["is tofu a complete protein", "tofu complete protein", "does tofu have all amino acids"],
 "Soy protein in tofu contains all nine essential amino acids, making it a high-quality plant protein."),

(["can tofu be eaten daily", "eat tofu every day", "tofu daily"],
 "Tofu can be included regularly as part of a varied diet if it suits your preferences and nutritional needs."),

(["what are the benefits of curd", "curd benefits", "why is curd healthy"],
 "Plain curd provides protein, calcium, and other nutrients. Some varieties contain live cultures."),

(["is plain curd better than sweetened curd", "plain curd vs sweetened curd", "unsweetened curd benefits"],
 "Plain curd usually contains less added sugar because you can control what is added to it."),

(["can curd be eaten with fruit", "curd and fruit", "fruit with curd"],
 "Yes. Plain curd with fresh fruit can make a balanced snack containing protein, calcium, and carbohydrates."),

(["what are the benefits of brown rice", "brown rice benefits", "why is brown rice healthy"],
 "Brown rice provides carbohydrate and generally more fiber than white rice because the bran and germ are retained."),

(["is brown rice good for lunch", "brown rice for lunch", "can i eat brown rice at lunch"],
 "Yes. Brown rice can be a nutritious carbohydrate base when combined with vegetables and a protein source."),

(["can brown rice be eaten every day", "eat brown rice daily", "brown rice every day"],
 "Yes, it can be part of a varied diet. Variety among grains and carbohydrate sources is also useful."),

(["what are the benefits of quinoa", "quinoa benefits", "why is quinoa healthy"],
 "Quinoa provides carbohydrate, fiber, minerals, and relatively high-quality plant protein."),

(["is quinoa good for vegetarians", "quinoa for vegetarians", "vegetarian quinoa protein"],
 "Yes. Quinoa can contribute plant protein and can be combined with legumes for a nutrient-rich meal."),

(["can quinoa replace rice", "quinoa instead of rice", "use quinoa instead of rice"],
 "Yes. Quinoa can be used instead of rice in bowls, salads, and many other meals."),

(["what are the benefits of whole wheat", "whole wheat benefits", "why is whole wheat healthy"],
 "Whole-wheat foods generally provide more fiber and retain more of the grain's nutrients than refined wheat products."),

(["is whole wheat bread healthy", "whole wheat bread benefits", "is whole grain bread healthy"],
 "Whole-wheat bread can be a nutritious carbohydrate and fiber source, especially when the first ingredient is whole wheat."),

(["how can i identify whole grain bread", "identify whole wheat bread", "how to choose whole grain bread"],
 "Check the ingredient list for whole wheat or another whole grain as a main ingredient and compare the fiber content on the nutrition label."),

 # ── NEW FOOD & NUTRITION DATA 2 ──

(["what are the benefits of eggs", "egg benefits", "why are eggs nutritious"],
 "Eggs provide high-quality protein, vitamin B12, choline, selenium, and several other nutrients."),

(["how much protein is in an egg", "protein in one egg", "egg protein amount"],
 "A typical large egg provides about 6 grams of protein, although the exact amount varies with egg size."),

(["are eggs good for breakfast", "egg breakfast benefits", "can i eat eggs for breakfast"],
 "Eggs can be a nutritious breakfast choice because they provide protein and several important micronutrients."),

(["is egg yolk healthy", "egg yolk benefits", "can i eat egg yolk"],
 "Egg yolk contains nutrients including choline, vitamin B12, vitamin D, and selenium. It can be part of a balanced diet."),

(["are egg whites high in protein", "egg white protein", "protein in egg white"],
 "Egg whites are mainly protein and contain very little fat."),

(["what are the benefits of almonds", "almond benefits", "why are almonds healthy"],
 "Almonds provide protein, fiber, unsaturated fats, magnesium, and vitamin E."),

(["how many almonds should i eat", "almond serving size", "healthy amount of almonds"],
 "A small handful is a practical portion for many people, but the appropriate amount depends on your energy needs."),

(["are soaked almonds better", "soaked almond benefits", "should almonds be soaked"],
 "Soaking almonds can soften them and may improve texture, but it does not make them dramatically more nutritious."),

(["what are the benefits of walnuts", "walnut benefits", "why are walnuts healthy"],
 "Walnuts provide unsaturated fats, including plant-based omega-3 ALA, along with fiber and minerals."),

(["are walnuts good for the brain", "walnuts and brain health", "do walnuts help the brain"],
 "Walnuts provide nutrients and unsaturated fats that can fit into a diet supportive of overall health. They are not a treatment for brain conditions."),

(["what are the benefits of peanuts", "peanut benefits", "why are peanuts healthy"],
 "Peanuts provide protein, unsaturated fats, fiber, magnesium, and other nutrients."),

(["is peanut butter healthy", "peanut butter benefits", "can i eat peanut butter"],
 "Peanut butter can provide protein and unsaturated fat. Choose versions with minimal added sugar and appropriate portions."),

(["how to choose healthy peanut butter", "best peanut butter ingredients", "what peanut butter should i buy"],
 "Look for peanut butter with a simple ingredient list and compare added sugar, salt, and overall calories."),

(["what are the benefits of cashews", "cashew benefits", "why are cashews healthy"],
 "Cashews provide unsaturated fats, protein, magnesium, copper, and other minerals."),

(["what are the benefits of pistachios", "pistachio benefits", "why are pistachios healthy"],
 "Pistachios provide protein, fiber, unsaturated fats, potassium, and several micronutrients."),

(["are pistachios good as a snack", "pistachio snack", "can i snack on pistachios"],
 "Pistachios can be a nutrient-dense snack. Unsalted or lightly salted versions can help limit sodium."),

(["what are the benefits of chia seeds", "chia seed benefits", "why are chia seeds healthy"],
 "Chia seeds provide fiber, plant-based omega-3 ALA, protein, and minerals such as calcium and magnesium."),

(["how should i eat chia seeds", "ways to eat chia seeds", "chia seed meal ideas"],
 "Chia seeds can be added to yogurt, oats, smoothies, or soaked in liquid to make a pudding-like food."),

(["do chia seeds need to be soaked", "should chia seeds be soaked", "chia seed soaking"],
 "Chia seeds can be eaten in foods without soaking, but soaking them creates a gel-like texture and can make them easier to consume."),

(["what are the benefits of flax seeds", "flaxseed benefits", "why are flax seeds healthy"],
 "Flax seeds provide fiber, plant-based omega-3 ALA, and lignans."),

(["is ground flaxseed better than whole", "ground vs whole flaxseed", "how should i eat flaxseed"],
 "Ground flaxseed is generally easier to digest and allows more of its nutrients to be accessed than whole seeds."),

(["what are the benefits of pumpkin seeds", "pumpkin seed benefits", "why are pumpkin seeds healthy"],
 "Pumpkin seeds provide protein, unsaturated fats, magnesium, zinc, and iron."),

(["what are the benefits of sunflower seeds", "sunflower seed benefits", "why are sunflower seeds healthy"],
 "Sunflower seeds provide vitamin E, unsaturated fats, protein, magnesium, and other nutrients."),

(["what are the benefits of milk", "milk benefits", "why is milk nutritious"],
 "Milk provides protein, calcium, vitamin B12, and other nutrients. Fortified milk may also provide vitamin D."),

(["is milk good after exercise", "milk after workout", "can i drink milk after gym"],
 "Milk provides protein and carbohydrate and can be useful after exercise as part of a balanced recovery meal."),

(["what is the difference between skim and whole milk", "skim milk vs whole milk", "whole milk or low fat milk"],
 "The main difference is fat and therefore calorie content. Both can provide protein and calcium."),

(["what are the benefits of yogurt", "yogurt benefits", "why is yogurt healthy"],
 "Plain yogurt provides protein, calcium, and other nutrients. Some yogurts also contain live cultures."),

(["is greek yogurt high in protein", "greek yogurt protein", "protein in greek yogurt"],
 "Greek yogurt is typically higher in protein than many regular yogurts, although the amount varies by product."),

(["how to choose healthy yogurt", "best yogurt to buy", "what yogurt should i choose"],
 "Compare protein, added sugar, and ingredients. Plain yogurt is an easy option when you want to control added sweetness."),

(["what are the benefits of cheese", "cheese benefits", "is cheese nutritious"],
 "Cheese can provide protein and calcium, but some varieties are also high in sodium and saturated fat, so portions matter."),

(["is cottage cheese high in protein", "cottage cheese protein", "cottage cheese benefits"],
 "Cottage cheese is generally a good source of protein and can also provide calcium."),

(["what are the benefits of chicken", "chicken benefits", "why is chicken a protein source"],
 "Chicken provides high-quality protein and several vitamins and minerals, with lean cuts generally containing less fat."),

(["which chicken part has less fat", "lean chicken cuts", "low fat chicken"],
 "Skinless chicken breast is generally one of the leaner chicken choices."),

(["is grilled chicken healthy", "grilled chicken benefits", "can i eat grilled chicken"],
 "Grilled chicken can be a nutritious protein choice. Limit excessive oil, salt, and heavily charred portions."),

(["what are the benefits of fish", "fish benefits", "why is fish nutritious"],
 "Fish provides high-quality protein and several micronutrients. Fatty fish also provide omega-3 fatty acids."),

(["what are fatty fish", "examples of fatty fish", "which fish contain omega 3"],
 "Salmon, sardines, mackerel, and trout are examples of fish that can provide substantial omega-3 fatty acids."),

(["why is omega 3 important", "omega 3 benefits", "what does omega 3 do"],
 "Omega-3 fatty acids are important components of cell membranes and play roles in normal heart, brain, and eye function."),

(["what are the benefits of salmon", "salmon benefits", "why is salmon healthy"],
 "Salmon provides high-quality protein and omega-3 fatty acids along with nutrients such as vitamin B12 and selenium."),

(["what are the benefits of sardines", "sardine benefits", "why are sardines nutritious"],
 "Sardines provide protein, omega-3 fats, vitamin B12, and calcium when the edible bones are included."),

(["what are the benefits of beans", "beans benefits", "why are beans healthy"],
 "Beans provide plant protein, fiber, folate, iron, potassium, and other minerals."),

(["are beans good for gut health", "beans and digestion", "beans for gut health"],
 "Beans provide dietary fiber that can support a healthy gut. Increase portions gradually if you are not used to high-fiber foods."),

(["how can i reduce gas from beans", "beans cause gas", "how to digest beans better"],
 "Start with smaller portions, rinse canned beans, and increase intake gradually. Proper cooking can also improve tolerance."),

(["are canned beans healthy", "canned beans nutrition", "can i eat canned beans"],
 "Canned beans can be nutritious and convenient. Rinsing them can reduce some of the sodium from the canning liquid."),

(["what are the benefits of hummus", "hummus benefits", "is hummus healthy"],
 "Hummus can provide plant protein, fiber, and unsaturated fats from ingredients such as chickpeas and tahini."),

(["is hummus good as a snack", "hummus snack", "what to eat with hummus"],
 "Hummus can be paired with vegetables, whole-grain bread, or whole-grain crackers for a balanced snack."),

(["what are the benefits of olive oil", "olive oil benefits", "is olive oil healthy"],
 "Olive oil is rich in monounsaturated fat and can be used as a source of unsaturated fat in a balanced diet."),

(["how much olive oil should i use", "olive oil serving", "olive oil portion"],
 "Olive oil is energy-dense, so use an amount appropriate for the meal and your overall energy needs."),

(["what are healthy cooking oils", "best oils for cooking", "which cooking oil is healthy"],
 "Common unsaturated-fat-rich options include olive, canola, sunflower, and other vegetable oils. The best choice also depends on cooking method and preference."),

(["what are saturated fats", "saturated fat meaning", "foods high in saturated fat"],
 "Saturated fats are a type of dietary fat found in foods such as butter, ghee, fatty meats, and some full-fat dairy products."),

(["what are unsaturated fats", "unsaturated fat meaning", "foods with unsaturated fat"],
 "Unsaturated fats are found in foods such as nuts, seeds, avocados, fish, and many plant oils."),

(["what is dietary fiber", "fiber meaning", "why do we need fiber"],
 "Dietary fiber is found mainly in plant foods and supports normal digestion. It can also help with fullness and blood sugar control."),

(["how much fiber should i eat", "daily fiber requirement", "recommended fiber intake"],
 "Fiber needs vary with age and sex, but adults generally benefit from a diet rich in vegetables, fruits, legumes, whole grains, nuts, and seeds."),

(["what happens if i eat too much fiber", "too much fiber symptoms", "high fiber side effects"],
 "A sudden large increase in fiber can cause gas, bloating, or abdominal discomfort. Increase fiber gradually and drink enough fluids."),

(["why is protein important", "protein importance", "what does protein do"],
 "Protein is needed for building and repairing tissues and for making enzymes, hormones, and other body components."),

(["what are complete proteins", "complete protein meaning", "examples of complete protein"],
 "Complete proteins provide all nine essential amino acids in adequate amounts. Eggs, dairy, fish, meat, and soy are examples."),

(["how much protein do i need", "daily protein requirement", "protein requirement per day"],
 "Protein needs depend on body size, age, activity, health, and goals. A personalized target should consider your complete diet and activity level."),

(["can protein help with fullness", "protein and satiety", "does protein keep you full"],
 "Protein can increase feelings of fullness and can be useful as part of balanced meals."),

(["what is potassium", "potassium importance", "why do we need potassium"],
 "Potassium is an essential mineral involved in fluid balance, nerve signals, and normal muscle function."),

(["which foods are high in potassium", "potassium rich foods", "foods containing potassium"],
 "Foods such as potatoes, bananas, beans, yogurt, spinach, and avocado provide potassium."),

(["what is calcium", "calcium importance", "why do we need calcium"],
 "Calcium is important for bones and teeth and is also involved in normal muscle and nerve function."),

(["which foods contain calcium", "calcium rich foods", "foods high in calcium"],
 "Dairy products, calcium-set tofu, fortified plant milks, some fish with edible bones, and certain leafy vegetables can provide calcium."),

(["what is iron", "iron importance", "why does the body need iron"],
 "Iron is needed to make hemoglobin and support oxygen transport and normal energy metabolism."),

(["which foods are high in iron", "iron rich foods", "foods containing iron"],
 "Iron is found in foods such as lentils, beans, meat, eggs, tofu, spinach, and fortified cereals."),

(["what is vitamin d", "vitamin d importance", "why do we need vitamin d"],
 "Vitamin D helps the body absorb calcium and supports normal bone, muscle, and immune function."),

(["which foods contain vitamin d", "vitamin d food sources", "foods high in vitamin d"],
 "Vitamin D is found in foods such as fatty fish, egg yolks, fortified milk, and some fortified foods."),

(["what is vitamin b12", "b12 importance", "why is vitamin b12 needed"],
 "Vitamin B12 supports normal red blood cell formation and nervous-system function and is involved in DNA synthesis."),

(["which foods contain vitamin b12", "b12 food sources", "foods high in b12"],
 "Vitamin B12 is naturally found mainly in animal foods such as meat, fish, eggs, and dairy, and is also available in fortified foods."),

(["what is vitamin c", "vitamin c importance", "why do we need vitamin c"],
 "Vitamin C supports normal immune function, collagen production, wound healing, and absorption of non-heme iron."),

(["what is magnesium", "magnesium importance", "why do we need magnesium"],
 "Magnesium is involved in normal muscle and nerve function, energy production, and many biochemical reactions."),

(["which foods are high in magnesium", "magnesium rich foods", "foods containing magnesium"],
 "Nuts, seeds, legumes, whole grains, and many leafy green vegetables provide magnesium."),

(["why is hydration important", "importance of hydration", "why should i drink water"],
 "Water is essential for temperature regulation, circulation, digestion, and many normal body functions."),

(["how can i drink more water", "tips to drink more water", "increase water intake"],
 "Keep water available, drink regularly through the day, and use foods such as fruits and vegetables to contribute to overall fluid intake."),

(["can tea count as water", "does tea count as hydration", "tea and hydration"],
 "Unsweetened tea contributes to fluid intake and can count toward hydration."),

(["can coffee cause dehydration", "coffee and hydration", "does coffee dehydrate you"],
 "Moderate coffee intake still contributes to fluid intake. Caffeine can have a mild diuretic effect, but typical amounts do not simply cancel out the fluid consumed."),

(["what are electrolytes", "electrolyte meaning", "why are electrolytes important"],
 "Electrolytes are minerals such as sodium, potassium, and magnesium that help regulate fluid balance, nerve function, and muscle function."),

(["when should i use an electrolyte drink", "electrolyte drink use", "do i need electrolytes"],
 "Electrolyte drinks can be useful during prolonged or intense exercise with substantial sweating, but they are not necessary for every normal workout."),

(["what is added sugar", "added sugar meaning", "what counts as added sugar"],
 "Added sugar is sugar added to foods or drinks during processing or preparation, rather than sugar naturally present in the food."),

(["how can i reduce added sugar", "reduce sugar intake", "ways to eat less sugar"],
 "Choose unsweetened drinks, compare food labels, limit sugary snacks, and use whole fruit when you want something sweet."),

(["is honey healthier than sugar", "honey vs sugar", "is honey better than sugar"],
 "Honey and table sugar both provide added sugars and calories. Honey may contain small amounts of other compounds, but it should still be used in moderation."),

(["is jaggery healthier than sugar", "jaggery vs sugar", "is jaggery good for health"],
 "Jaggery is less refined than table sugar and may contain small amounts of minerals, but it is still mainly sugar and should be consumed moderately."),

(["how to read a nutrition label", "nutrition label guide", "how do i understand food labels"],
 "Check serving size, calories, protein, fiber, saturated fat, sodium, and added sugar, then compare similar products."),

(["what is serving size on a label", "serving size meaning", "food label serving size"],
 "Serving size is the reference amount used for the nutrition information on the label. It may not equal the amount you actually eat."),

(["what does calories per serving mean", "calories per serving meaning", "food label calories"],
 "Calories per serving indicate the energy provided by the listed serving amount. Eating multiple servings means consuming multiple times those calories."),

(["how can i choose low sodium food", "reduce sodium in diet", "low sodium food tips"],
 "Compare sodium values on labels, choose fresh foods more often, and limit highly processed and heavily salted foods."),

(["does cooking change nutrition", "effect of cooking on nutrients", "does cooking reduce nutrients"],
 "Cooking can change nutrient levels in different ways. Some nutrients are reduced by heat or water, while cooking can improve access to others."),

(["is steaming healthier than frying", "steaming vs frying", "best cooking method"],
 "Steaming usually requires little added fat, while frying can substantially increase the energy content depending on the oil and amount used."),

(["is deep fried food healthy", "deep fried food effects", "should i avoid fried food"],
 "Deep-fried foods can be high in calories and added fat. They can be eaten occasionally, but frequent large portions may make a balanced diet harder."),

(["how can i make food less oily", "reduce oil in cooking", "tips for less oily food"],
 "Measure cooking oil instead of pouring freely, use non-stick cookware when appropriate, and prefer steaming, baking, grilling, or sautéing with modest oil."),

(["what is mindful eating", "mindful eating meaning", "how does mindful eating work"],
 "Mindful eating means paying attention to hunger, fullness, taste, and eating habits rather than eating automatically or distractedly."),

(["how do i control portion size", "portion control tips", "ways to manage portions"],
 "Use appropriate plates or bowls, serve a moderate amount first, eat slowly, and adjust based on hunger and the rest of the meal."),

(["should i skip breakfast for weight loss", "breakfast and weight loss", "is skipping breakfast good"],
 "Skipping breakfast is not automatically necessary for weight loss. Overall calorie intake, food quality, activity, and adherence matter more."),

(["is eating late at night bad", "late night eating", "can i eat at night"],
 "Eating at night is not automatically unhealthy. The overall diet, total intake, food choices, and personal routine matter."),

(["can i eat snacks between meals", "snacking between meals", "are snacks necessary"],
 "Snacks are optional. They can be useful when you are genuinely hungry or need to bridge a long gap between meals."),

(["what makes a balanced meal", "balanced meal components", "how to build a balanced plate"],
 "A balanced meal can include a protein source, vegetables or fruit, a suitable carbohydrate source, and a moderate amount of healthy fat."),

(["how much vegetables should i eat", "daily vegetable intake", "vegetable portion per day"],
 "Aim to include vegetables regularly across meals and vary the colors and types to obtain a broad range of nutrients."),

(["why should i eat different colored vegetables", "vegetable variety", "different vegetable colors"],
 "Different colored vegetables contain different combinations of vitamins, minerals, and plant compounds, so variety improves dietary diversity."),

(["is frozen food always unhealthy", "are frozen foods healthy", "frozen food nutrition"],
 "Frozen foods are not automatically unhealthy. Plain frozen vegetables and fruits can retain many nutrients and are often convenient."),

(["are frozen vegetables nutritious", "frozen vegetable benefits", "can i eat frozen vegetables"],
 "Yes. Plain frozen vegetables can be a nutritious and convenient option and may retain many nutrients well."),

(["is canned food always unhealthy", "are canned foods healthy", "canned food nutrition"],
 "Canned foods can be nutritious. Choose options with less added sugar or sodium when possible and rinse canned foods when appropriate."),

(["what is meal prepping", "meal prep meaning", "how does meal prep help"],
 "Meal prepping means preparing some meals or ingredients ahead of time. It can make balanced eating more convenient during busy days."),

(["how long can cooked food stay in the fridge", "leftover storage time", "how to store cooked food"],
 "Refrigerate perishable cooked food promptly in covered containers and follow food-safety guidance for storage times. When in doubt about safety, discard it."),

(["how can i make a healthy sandwich", "healthy sandwich ideas", "balanced sandwich"],
 "Use whole-grain bread, a protein filling, vegetables, and a moderate amount of sauce or healthy fat."),

(["what is a healthy evening snack", "night snack ideas", "healthy snack at night"],
 "Options include plain yogurt with fruit, a small handful of nuts, or vegetables with hummus, depending on your hunger and overall diet."),

(["what is a good protein snack", "high protein snack ideas", "protein rich snacks"],
 "Plain Greek yogurt, eggs, cottage cheese, roasted chickpeas, or nuts can provide protein in a snack."),

(["can i eat nuts while trying to lose weight", "nuts for weight loss", "nuts and weight management"],
 "Nuts can fit into a weight-management diet because they provide protein, fiber, and unsaturated fats, but portions matter because they are energy-dense."),

(["what is the difference between hunger and craving", "hunger vs craving", "how to identify hunger"],
 "Physical hunger tends to build gradually and can be satisfied by different foods, while a craving is often more specific and can appear suddenly."),

(["why do i crave salty food", "salty food cravings", "reason for salt cravings"],
 "Food cravings can have many causes, including habits, preferences, stress, and dietary patterns. A craving does not necessarily indicate a nutrient deficiency."),

(["why do i crave sweets", "sugar cravings", "reason for sweet cravings"],
 "Sweet cravings can be influenced by habits, sleep, stress, hunger, and food availability. They do not automatically mean your body lacks sugar."),

(["what should i eat when i crave something crunchy", "healthy crunchy snacks", "crunchy snack ideas"],
 "Roasted chickpeas, carrots, cucumber, air-popped popcorn, or a moderate portion of nuts can provide crunch."),

(["what should i eat when i crave something sweet", "healthy sweet snack", "sweet snack alternatives"],
 "Fresh fruit, plain yogurt with fruit, or a small portion of dark chocolate can satisfy a sweet preference while fitting into a balanced diet."),

(["can i have dessert in a healthy diet", "dessert and healthy eating", "is dessert allowed"],
 "Dessert can fit into a balanced diet when portions are appropriate and overall food intake remains varied and nutrient-rich."),

(["what is food variety", "importance of food variety", "why eat different foods"],
 "Food variety means eating different foods across food groups, which helps provide a broader range of nutrients and reduces reliance on a narrow set of foods."),

(["why should i eat protein at each meal", "protein with every meal", "protein distribution"],
 "Including protein across meals can support muscle maintenance and may improve fullness throughout the day."),

(["can vegetarians get enough protein", "vegetarian protein intake", "protein sources for vegetarians"],
 "Yes. Vegetarians can obtain protein from lentils, beans, soy foods, dairy, eggs, nuts, seeds, and whole grains."),

(["can vegans get enough protein", "vegan protein sources", "protein for vegans"],
 "Yes. Vegan diets can provide adequate protein using legumes, soy foods, nuts, seeds, whole grains, and other plant protein sources."),

(["what is a plant based diet", "plant based diet meaning", "what does plant based mean"],
 "A plant-based diet emphasizes foods such as vegetables, fruits, legumes, whole grains, nuts, and seeds. It does not necessarily mean completely vegan."),

(["is a vegetarian diet healthy", "vegetarian diet benefits", "can vegetarian diet be balanced"],
 "A vegetarian diet can be nutritionally balanced when it includes adequate protein, iron, vitamin B12, calcium, and other essential nutrients."),

(["what nutrients need attention in vegan diets", "vegan nutrients", "vegan diet nutrition"],
 "Vitamin B12 requires particular attention in vegan diets. Protein, iron, calcium, iodine, vitamin D, and omega-3 sources also deserve planning."),

(["what is portion awareness", "portion awareness meaning", "why portion size matters"],
 "Portion awareness means paying attention to how much food you eat, especially for energy-dense foods, while still allowing flexibility and variety."),

(["can drinking water help before meals", "water before meals", "drink water before eating"],
 "Drinking water before meals can contribute to hydration and may help some people feel more satisfied, but it is not a substitute for balanced eating."),

(["is sparkling water healthy", "sparkling water benefits", "can i drink sparkling water"],
 "Plain sparkling water can contribute to hydration and usually contains no calories or added sugar."),

(["is coconut water healthy", "coconut water benefits", "can i drink coconut water"],
 "Coconut water provides fluid and some electrolytes. Unsweetened versions avoid unnecessary added sugar."),

(["is packaged fruit juice healthy", "fruit juice nutrition", "can i drink packaged juice"],
 "Fruit juice can provide some vitamins but usually has less fiber than whole fruit and can contain substantial natural or added sugar."),

(["what is the difference between whole fruit and juice", "fruit vs fruit juice", "whole fruit or juice"],
 "Whole fruit retains its structure and fiber, while juice is easier to consume quickly and is generally less filling."),

(["how can i improve my diet slowly", "small nutrition changes", "improve diet gradually"],
 "Start with manageable changes such as adding vegetables, choosing water more often, increasing whole foods, and improving protein and fiber intake."),

(["what is a balanced breakfast", "healthy breakfast components", "how to build breakfast"],
 "A balanced breakfast can combine protein, fiber-rich carbohydrates, fruit or vegetables, and a moderate amount of healthy fat."),

(["what is a balanced lunch", "healthy lunch components", "how to build lunch"],
 "A balanced lunch can include a protein source, vegetables, a suitable carbohydrate source, and a moderate amount of healthy fat."),

(["what is a balanced dinner", "healthy dinner components", "how to build dinner"],
 "A balanced dinner can include protein, vegetables, a suitable carbohydrate portion, and healthy fats in an amount appropriate for your needs."),

(["why is sleep important for nutrition", "sleep and eating habits", "sleep and diet"],
 "Poor sleep can affect hunger, appetite, food choices, and energy levels. Consistent sleep supports healthy eating habits."),

(["does stress affect eating", "stress and food cravings", "stress eating"],
 "Stress can influence appetite and cravings differently from person to person. Planning balanced meals and noticing eating triggers can help."),

(["what is emotional eating", "emotional eating meaning", "why do people emotionally eat"],
 "Emotional eating means eating in response to feelings rather than physical hunger. Recognizing triggers can help develop healthier coping strategies."),

(["can exercise increase hunger", "workout and appetite", "why am i hungry after exercise"],
 "Exercise can increase hunger for some people, while others experience little change. Adjust meals and snacks according to actual hunger and activity."),

(["what should i eat before a long workout", "pre workout meal", "food before long exercise"],
 "Before longer exercise, a meal or snack containing easily tolerated carbohydrates and some protein can provide useful fuel."),

(["what should i eat after strength training", "post strength workout food", "food after weight training"],
 "After strength training, include a protein source along with carbohydrate and fluids to support recovery."),

(["should i drink water during exercise", "water during workout", "hydration while exercising"],
 "For many normal workouts, drinking water according to thirst is sufficient. Longer or hotter sessions may require more deliberate hydration."),

(["what is a recovery meal", "post workout meal meaning", "exercise recovery food"],
 "A recovery meal usually combines protein for muscle repair with carbohydrate to replenish energy and enough fluid for hydration."),

(["is protein powder necessary", "do i need protein powder", "protein supplement necessity"],
 "Protein powder is not required if you can meet your protein needs through regular foods. It is mainly a convenient supplement."),

(["how should i choose protein powder", "protein powder selection", "what protein powder should i buy"],
 "Compare protein content, added sugar, ingredients, serving size, and your dietary preferences. Choose a product appropriate for your needs."),

(["can protein powder replace meals", "protein shake as meal", "can i use protein powder instead of food"],
 "Protein powder is mainly a protein supplement and does not automatically provide all the nutrients of a complete meal."),

(["what is creatine", "creatine meaning", "what does creatine do"],
 "Creatine is a naturally occurring compound involved in energy production during short, intense activities. It is also available as a dietary supplement."),

(["what are probiotics", "probiotic meaning", "what do probiotics do"],
 "Probiotics are live microorganisms that can provide health benefits when consumed in adequate amounts and in suitable strains."),

(["what are prebiotics", "prebiotic meaning", "foods containing prebiotics"],
 "Prebiotics are substances, often certain types of dietary fiber, that beneficial gut microorganisms can use as food."),

(["what foods support gut health", "foods for gut health", "healthy gut foods"],
 "Fiber-rich vegetables, fruits, legumes, whole grains, nuts, seeds, and suitable fermented foods can support a diverse gut environment."),

(["what is fermented food", "fermented foods meaning", "examples of fermented foods"],
 "Fermented foods are foods transformed by microorganisms. Examples include yogurt, kefir, kimchi, sauerkraut, and some traditional fermented foods."),

(["why is food safety important", "food safety basics", "how to keep food safe"],
 "Food safety reduces the risk of foodborne illness. Clean hands and surfaces, proper cooking, safe storage, and avoiding cross-contamination are important."),

(["how should raw meat be handled", "raw meat safety", "handling raw chicken safely"],
 "Keep raw meat separate from ready-to-eat foods, wash hands after handling it, use clean utensils, and cook it to a safe internal temperature."),

(["how can i avoid cross contamination", "cross contamination prevention", "prevent food contamination"],
 "Use separate boards or utensils for raw and ready-to-eat foods, wash hands, and clean surfaces thoroughly after handling raw ingredients."),

(["is reheating food safe", "reheating leftovers", "can leftovers be reheated"],
 "Properly stored leftovers can generally be reheated safely. Heat them thoroughly and avoid repeatedly cooling and reheating the same food."),

(["what is a food allergy", "food allergy meaning", "what happens in a food allergy"],
 "A food allergy is an immune reaction to a specific food protein. Reactions can be serious and require appropriate medical care."),

(["what is lactose intolerance", "lactose intolerance meaning", "lactose intolerance symptoms"],
 "Lactose intolerance occurs when the body has difficulty digesting lactose, which can cause digestive symptoms after consuming lactose-containing foods."),

(["what is gluten", "gluten meaning", "foods containing gluten"],
 "Gluten is a group of proteins found mainly in wheat, barley, and rye."),

(["is gluten unhealthy for everyone", "gluten and health", "should everyone avoid gluten"],
 "No. Most people do not need to avoid gluten. People with conditions such as celiac disease need medically appropriate gluten avoidance."),

(["what is celiac disease", "celiac disease meaning", "gluten intolerance disease"],
 "Celiac disease is an immune-mediated condition in which eating gluten damages the small intestine. Diagnosis and treatment require medical guidance."),

(["can food labels help weight management", "nutrition labels and weight loss", "using labels for weight management"],
 "Nutrition labels can help compare calories, protein, fiber, added sugar, sodium, and serving sizes when managing overall food intake."),

(["what is calorie density", "calorie density meaning", "foods with low calorie density"],
 "Calorie density describes how much energy a food provides relative to its weight. Water- and fiber-rich foods often have lower calorie density."),

(["what is nutrient density", "nutrient dense food meaning", "what are nutrient dense foods"],
 "Nutrient-dense foods provide substantial vitamins, minerals, protein, fiber, or other useful nutrients relative to their calorie content."),

(["what is a whole food", "whole foods meaning", "examples of whole foods"],
 "Whole foods are foods that are minimally processed and remain close to their original form, such as fruits, vegetables, legumes, nuts, seeds, and whole grains."),

(["are all processed foods unhealthy", "processed food meaning", "is processed food bad"],
 "No. Processing ranges from simple preparation to extensive formulation. Foods such as plain yogurt, frozen vegetables, and canned beans can still be nutritious."),

(["what is ultra processed food", "ultra processed food meaning", "examples of ultra processed foods"],
 "Ultra-processed foods are industrial formulations often containing multiple additives and refined ingredients. Their nutritional quality varies, so labels and overall dietary pattern matter."),

(["how can i eat healthier on a budget", "budget healthy eating", "cheap healthy food ideas"],
 "Use affordable staples such as lentils, beans, eggs, seasonal vegetables, whole grains, and frozen produce, and plan meals before shopping."),

(["how can students eat healthy", "student healthy diet", "healthy food for college students"],
 "Students can focus on simple staples such as eggs, dal, beans, curd, vegetables, fruit, whole grains, and nuts while keeping meals practical and affordable."),

(["what is a healthy college snack", "college snack ideas", "healthy snacks for students"],
 "Fruit with yogurt, roasted chickpeas, nuts, boiled eggs, or a simple whole-grain snack can work well for students."),

(["how can i avoid skipping meals during college", "college meal planning", "busy student eating tips"],
 "Keep simple portable foods available, plan meals around your class schedule, and prepare basic foods in advance when possible."),

(["is homemade food healthier", "homemade food benefits", "home cooked food"],
 "Home cooking can make it easier to control ingredients, salt, oil, and portion sizes, although the nutritional quality still depends on what you prepare."),

(["how can i make indian food healthier", "healthy indian food tips", "make indian meals healthier"],
 "Use more vegetables and legumes, include a suitable protein source, control added oil and salt, and choose whole grains when practical."),

(["is dal a complete meal", "dal meal nutrition", "can dal be a full meal"],
 "Dal is nutritious and provides protein and fiber, but a complete meal can benefit from vegetables, a suitable grain, and other foods depending on your needs."),

(["is roti healthy", "roti nutrition", "can i eat roti daily"],
 "Roti can be part of a balanced diet, especially when made with whole-grain flour and paired with vegetables and a protein source."),

(["is rice unhealthy", "rice and healthy diet", "can i eat rice daily"],
 "Rice is not inherently unhealthy. Portion, preparation, the type of rice, and the foods eaten with it all matter."),

(["can i eat rice and roti together", "rice with roti", "roti and rice in one meal"],
 "Rice and roti can be eaten in the same meal, but portions should match your overall energy needs and the meal should also include protein and vegetables."),

(["is ghee healthy", "ghee benefits", "can i eat ghee"],
 "Ghee provides fat and can add flavor, but it is high in saturated fat and calories, so moderate portions are appropriate."),

(["is butter healthy", "butter nutrition", "can i eat butter"],
 "Butter can fit into a balanced diet in small amounts, but it is high in saturated fat and energy."),

(["ghee vs oil which is healthier", "ghee or oil", "compare ghee and cooking oil"],
 "Both provide fat and calories. Many vegetable oils provide more unsaturated fat than ghee, while the best choice depends on the overall diet and cooking method."),

(["is coconut oil healthy", "coconut oil benefits", "coconut oil vs other oils"],
 "Coconut oil is high in saturated fat. It can be used occasionally, but replacing some saturated fat with unsaturated oils is generally a useful dietary strategy."),

(["what are healthy breakfast drinks", "healthy drinks for breakfast", "what to drink in morning"],
 "Water, unsweetened milk, or unsweetened tea can be simple breakfast drink choices. The best option depends on your dietary needs."),

(["is sugary soda healthy", "soft drinks and health", "can i drink soda"],
 "Sugary soft drinks provide added sugar with little nutritional value, so they are better kept as occasional drinks rather than daily staples."),

(["what is diet soda", "diet soda meaning", "zero sugar soda"],
 "Diet soda is typically sweetened with low- or no-calorie sweeteners instead of sugar. It can reduce sugar intake compared with regular soda."),

(["is energy drink healthy", "energy drink effects", "should i drink energy drinks"],
 "Energy drinks can contain substantial caffeine and added sugar. They are not necessary for routine hydration and should be used cautiously."),

(["how much caffeine is too much", "caffeine daily limit", "safe caffeine intake"],
 "Caffeine tolerance varies. Healthy adults are commonly advised to stay around or below 400 mg per day, while pregnancy and certain medical conditions require different limits."),

(["can caffeine affect sleep", "coffee and sleep", "caffeine before bed"],
 "Caffeine can interfere with sleep, especially when consumed later in the day. Individual sensitivity varies."),

(["what should i eat when i am tired", "food for low energy", "healthy foods for tiredness"],
 "Choose a balanced meal or snack containing carbohydrates, protein, and fluids. Persistent or unusual fatigue should be discussed with a healthcare professional."),

(["what foods can support concentration", "food for focus", "nutrition for concentration"],
 "Regular balanced meals containing protein, whole grains, fruits, vegetables, and adequate fluids can support normal energy and concentration."),

(["what foods are good during exams", "exam diet", "food for students during exams"],
 "During exams, choose regular balanced meals, hydrate well, and use convenient foods such as fruit, yogurt, nuts, eggs, and whole grains."),

(["should i eat while studying", "snacking while studying", "study snacks"],
 "Eat when you are hungry rather than automatically snacking. If needed, choose a portioned snack containing protein, fiber, or fruit."),

(["what is a healthy midnight snack", "late night healthy snack", "midnight food ideas"],
 "If you are genuinely hungry at night, a small snack such as plain yogurt, fruit, or a modest portion of nuts can be appropriate."),

(["how can i stop overeating", "prevent overeating", "tips to avoid overeating"],
 "Eat slowly, reduce distractions, serve a reasonable portion, include protein and fiber, and pay attention to hunger and fullness cues."),

(["why am i hungry soon after eating", "hungry after meal", "why do i feel hungry quickly"],
 "Meals low in protein, fiber, or overall volume may be less filling. Sleep, stress, activity, and individual needs can also affect hunger."),

(["what foods are filling", "foods that keep you full", "high satiety foods"],
 "Protein-rich foods, fiber-rich foods, vegetables, legumes, whole grains, and some healthy fats can contribute to fullness."),

(["what is a high protein breakfast", "protein breakfast ideas", "breakfast with protein"],
 "Eggs, Greek yogurt, cottage cheese, tofu, milk, or legumes can provide protein at breakfast."),

(["what is a high fiber breakfast", "fiber breakfast ideas", "breakfast with fiber"],
 "Oats, whole-grain foods, fruit, chia seeds, flaxseed, and vegetables can increase fiber at breakfast."),

(["can i eat nuts and seeds together", "nuts and seeds combination", "nut seed snack"],
 "Yes. Nuts and seeds can be combined for a nutrient-dense snack, but keep the portion moderate because they are energy-dense."),

(["what are the benefits of sesame seeds", "sesame seed benefits", "why are sesame seeds healthy"],
 "Sesame seeds provide unsaturated fats, protein, fiber, calcium, magnesium, and other nutrients."),

(["what are the benefits of sunflower seeds", "sunflower seeds nutrition", "sunflower seed benefits"],
 "Sunflower seeds provide vitamin E, unsaturated fats, protein, magnesium, and other nutrients."),

(["what are the benefits of hemp seeds", "hemp seed benefits", "why are hemp seeds healthy"],
 "Hemp seeds provide protein, unsaturated fats, fiber, and several minerals."),

(["what are the benefits of dates before exercise", "dates before workout", "eating dates before gym"],
 "Dates provide concentrated carbohydrate and can be useful as a small pre-exercise snack for some people."),

(["are dried fruits healthy", "dried fruit benefits", "can i eat dried fruit"],
 "Dried fruit can provide fiber and micronutrients, but it is more concentrated in calories and sugar than fresh fruit, so portions matter."),

(["how much dried fruit should i eat", "dried fruit serving size", "portion of dried fruit"],
 "A small portion of dried fruit is usually enough because removing water makes the food more calorie-dense."),

(["is popcorn healthy", "popcorn benefits", "can popcorn be a healthy snack"],
 "Plain air-popped popcorn can provide whole-grain carbohydrates and fiber. Large amounts of butter, oil, or salt can change its nutritional profile."),

(["is dark chocolate healthy", "dark chocolate benefits", "can i eat dark chocolate"],
 "Dark chocolate contains cocoa compounds and can fit into a balanced diet, but it is still calorie-dense and may contain added sugar."),

(["how much dark chocolate should i eat", "dark chocolate serving", "portion of dark chocolate"],
 "A small portion can fit into a balanced diet. Check the product label for added sugar and calories."),

(["what are the benefits of cocoa", "cocoa powder benefits", "is cocoa healthy"],
 "Unsweetened cocoa powder provides cocoa polyphenols and minerals and can add flavor without much added sugar."),

(["what is a healthy smoothie", "healthy smoothie ingredients", "how to make a balanced smoothie"],
 "A balanced smoothie can include fruit, vegetables, a protein source such as yogurt or milk, and optional seeds or nuts."),

(["are smoothies as healthy as whole fruit", "smoothie vs whole fruit", "fruit smoothie nutrition"],
 "Smoothies can be nutritious, but whole fruit is often more filling because chewing and food structure are preserved. Added sugar can also change the smoothie."),

(["can smoothies have too much sugar", "smoothie sugar", "high sugar smoothie"],
 "Yes. Large amounts of fruit juice, sweeteners, syrups, or multiple high-sugar ingredients can make a smoothie very high in sugar."),

(["what is a healthy salad", "healthy salad ingredients", "how to make a balanced salad"],
 "A balanced salad can contain vegetables, a protein source, a whole-food carbohydrate if needed, and a moderate amount of healthy fat."),

(["is salad enough for dinner", "can salad be a complete meal", "salad for dinner"],
 "A salad can be a complete meal if it includes enough protein, vegetables, a suitable carbohydrate source, and healthy fats."),

(["what is a healthy salad dressing", "salad dressing choices", "healthy dressing ideas"],
 "A simple dressing made from olive oil, lemon or vinegar, herbs, and modest salt can add flavor without excessive added sugar."),

(["is mayonnaise healthy", "mayonnaise nutrition", "can i eat mayonnaise"],
 "Mayonnaise is energy-dense because it contains fat. It can be used in moderate portions as part of an overall balanced diet."),

(["what is a healthy alternative to mayonnaise", "mayonnaise alternatives", "replace mayonnaise"],
 "Plain yogurt, hummus, mashed avocado, or mustard can be alternatives depending on the recipe and desired flavor."),

(["is ketchup high in sugar", "ketchup nutrition", "sugar in ketchup"],
 "Many ketchup products contain added sugar. Check the nutrition label and use moderate portions."),

(["how can i reduce salt in food", "reduce salt intake", "low salt cooking"],
 "Use herbs, spices, lemon, vinegar, garlic, and other flavorings to reduce reliance on added salt."),

(["why is sodium important", "sodium importance", "what does sodium do"],
 "Sodium is an essential electrolyte involved in fluid balance, nerve function, and muscle function, but excessive intake can be problematic."),

(["what foods contain hidden sodium", "hidden salt foods", "high sodium packaged foods"],
 "Processed meats, instant noodles, packaged snacks, sauces, soups, and some ready-made foods can contain substantial sodium."),

(["is instant noodles healthy", "instant noodles nutrition", "can i eat instant noodles"],
 "Instant noodles can be convenient but are often high in sodium and refined carbohydrates. Adding vegetables and a protein source can improve the meal."),

(["how can i make instant noodles healthier", "healthy instant noodles", "improve instant noodles"],
 "Use less seasoning, add vegetables and a protein source such as egg or tofu, and consider using less of the noodle packet if appropriate."),

(["is bread healthy", "bread nutrition", "can i eat bread daily"],
 "Bread can fit into a balanced diet. Whole-grain varieties generally provide more fiber than refined white bread."),

(["is white bread unhealthy", "white bread nutrition", "can i eat white bread"],
 "White bread can be eaten, but it generally provides less fiber than whole-grain bread. The overall diet matters."),

(["what is sourdough bread", "sourdough benefits", "is sourdough healthy"],
 "Sourdough is bread made using fermentation. Its nutritional profile depends on the flour and recipe, and fermentation can affect flavor and digestibility."),

(["what is multigrain bread", "multigrain bread meaning", "is multigrain bread whole grain"],
 "Multigrain means multiple grains are used, but it does not automatically mean the bread is whole grain. Check the ingredient list."),

(["what is refined grain", "refined grains meaning", "examples of refined grains"],
 "Refined grains have had parts of the grain removed during processing, reducing some fiber and nutrients compared with whole grains."),

(["what are whole grains", "whole grain meaning", "examples of whole grains"],
 "Whole grains retain the bran, germ, and endosperm. Examples include oats, brown rice, whole wheat, barley, and quinoa."),

(["why are whole grains useful", "whole grain benefits", "benefits of eating whole grains"],
 "Whole grains generally provide more fiber and nutrients than refined grains and can contribute to a balanced diet."),

(["what is glycemic index", "glycemic index meaning", "GI meaning in food"],
 "The glycemic index ranks carbohydrate-containing foods according to how quickly they tend to raise blood glucose compared with a reference food."),

(["does low glycemic mean low calorie", "glycemic index and calories", "low GI calories"],
 "No. Glycemic index and calorie content measure different things. A low-GI food can still be high in calories."),

(["what is blood sugar", "blood glucose meaning", "what is glucose"],
 "Blood glucose is the main sugar circulating in the blood and is an important energy source for the body."),

(["how does fiber affect blood sugar", "fiber and blood glucose", "fiber blood sugar"],
 "Fiber, especially soluble fiber, can slow digestion and absorption of carbohydrates and may help moderate blood glucose responses."),

(["what is insulin", "insulin meaning", "what does insulin do"],
 "Insulin is a hormone that helps move glucose from the blood into cells and helps regulate blood glucose levels."),

(["why are regular meals useful", "regular eating benefits", "meal timing"],
 "Regular meals can help some people manage hunger, energy, and food choices, although the ideal schedule varies between individuals."),

(["is intermittent fasting necessary", "intermittent fasting meaning", "do i need intermittent fasting"],
 "Intermittent fasting is one eating pattern and is not required for healthy eating or weight management. Suitability varies by person."),

(["can children follow a diet plan", "diet for children", "nutrition for kids"],
 "Children have specific growth and nutrient needs, so restrictive diets should not be used without guidance from a qualified healthcare professional."),

(["nutrition during pregnancy", "pregnancy nutrition basics", "foods during pregnancy"],
 "Pregnancy increases the need for several nutrients. A balanced diet and guidance from a qualified healthcare professional are important."),

(["what is folate", "folate importance", "why do we need folate"],
 "Folate is a B vitamin needed for DNA synthesis and cell division. It is especially important during pregnancy."),

(["foods high in folate", "folate rich foods", "folate food sources"],
 "Leafy greens, lentils, beans, asparagus, avocado, and fortified foods can provide folate."),

(["what is zinc", "zinc importance", "why do we need zinc"],
 "Zinc supports normal immune function, wound healing, protein synthesis, and many enzyme reactions."),

(["foods high in zinc", "zinc rich foods", "zinc food sources"],
 "Meat, seafood, dairy, eggs, legumes, nuts, and seeds can provide zinc."),

(["what is selenium", "selenium importance", "why do we need selenium"],
 "Selenium is a mineral involved in antioxidant defense and normal thyroid function."),

(["foods high in selenium", "selenium rich foods", "selenium food sources"],
 "Fish, seafood, eggs, meat, dairy, and some nuts can provide selenium."),

(["what is vitamin e", "vitamin e importance", "why do we need vitamin e"],
 "Vitamin E is an antioxidant that helps protect cells from oxidative damage and supports normal immune function."),

(["foods high in vitamin e", "vitamin e rich foods", "vitamin e food sources"],
 "Nuts, seeds, vegetable oils, avocado, and some green vegetables provide vitamin E."),

(["what is vitamin k", "vitamin k importance", "why do we need vitamin k"],
 "Vitamin K is important for normal blood clotting and bone health."),

(["foods high in vitamin k", "vitamin k rich foods", "vitamin k food sources"],
 "Leafy green vegetables such as spinach, kale, and broccoli are good sources of vitamin K."),

(["what is iodine", "iodine importance", "why do we need iodine"],
 "Iodine is required to make thyroid hormones, which help regulate metabolism and development."),

(["foods containing iodine", "iodine rich foods", "iodine food sources"],
 "Iodine can be obtained from iodized salt, seafood, dairy, eggs, and some fortified foods."),

(["why is iodized salt used", "iodized salt benefits", "what is iodized salt"],
 "Iodized salt provides iodine, an essential nutrient needed for thyroid hormone production."),

(["can i get nutrients from sunlight", "sunlight and vitamin d", "does sunlight provide vitamin d"],
 "Sunlight exposure can help the body produce vitamin D, but the amount varies with skin type, location, season, clothing, and other factors."),

(["why is variety important in protein sources", "protein variety", "different protein sources"],
 "Using different protein sources can provide a broader range of nutrients and makes the diet more varied."),

(["can dairy and plant foods be combined", "dairy with plant foods", "mix dairy and plant protein"],
 "Yes. Combining dairy and plant foods can create nutritious meals with a variety of proteins, vitamins, minerals, and fiber."),

(["what is a healthy grocery list", "healthy shopping list", "nutrition grocery list"],
 "A practical grocery list can include vegetables, fruits, legumes, whole grains, protein foods, dairy or alternatives, nuts, seeds, and basic cooking ingredients."),

(["how can i avoid unhealthy impulse buying", "healthy grocery shopping tips", "avoid junk food shopping"],
 "Plan meals, shop with a list, avoid shopping while extremely hungry, and keep convenient nutritious foods available at home."),

(["why should i check ingredients", "ingredient list importance", "how ingredients help choose food"],
 "Ingredient lists help you understand what a packaged food contains and can help compare products with similar nutrition labels."),

(["what does no added sugar mean", "no added sugar meaning", "food label no added sugar"],
 "No added sugar means manufacturers did not add sugar or sugary ingredients during production, although the food may still contain naturally occurring sugars."),

(["what does sugar free mean", "sugar free label meaning", "sugar free foods"],
 "Sugar-free labeling has a specific regulatory meaning and does not necessarily mean a food contains no carbohydrates or calories."),

(["what does low fat mean", "low fat food meaning", "low fat label"],
 "Low-fat means the food meets a defined fat limit per serving under applicable labeling rules. It does not automatically mean the food is healthier."),

(["what does high protein mean on food labels", "high protein label", "protein claim meaning"],
 "A high-protein claim indicates the product meets a defined protein threshold. Compare the complete nutrition label rather than relying on one claim."),

(["what is food fortification", "fortified food meaning", "what does fortified mean"],
 "Food fortification means adding specific vitamins or minerals to a food to increase its nutritional content."),

(["what is enriched food", "enriched food meaning", "what does enriched mean"],
 "Enriched foods have certain nutrients added back after processing, often nutrients that were reduced during refining."),

(["can frozen fruit be healthy", "frozen fruit benefits", "is frozen fruit nutritious"],
 "Plain frozen fruit can be nutritious and convenient, and freezing can preserve many nutrients."),

(["can canned fruit be healthy", "canned fruit nutrition", "healthy canned fruit"],
 "Canned fruit can fit into a balanced diet. Choose versions packed in water or juice rather than heavy syrup when possible."),

(["what is the healthiest way to store vegetables", "vegetable storage tips", "how to store vegetables"],
 "Store vegetables according to their type, keep them clean and dry when appropriate, and use refrigeration when recommended to maintain quality and safety."),

(["does freezing food destroy nutrients", "freezing and nutrition", "does freezing reduce nutrients"],
 "Freezing generally preserves many nutrients well. Some nutrients can change during processing, but frozen foods can still be highly nutritious."),

(["does reheating food destroy protein", "reheating protein", "does cooking reduce protein"],
 "Normal cooking and reheating do not remove all protein. Heat can change protein structure without eliminating its nutritional value."),

(["what is food portion vs serving size", "portion and serving difference", "serving vs portion"],
 "A serving size is a reference amount listed by a food manufacturer or dietary guidance, while a portion is the amount you actually choose to eat."),

(["why is breakfast protein useful", "protein at breakfast", "benefit of protein breakfast"],
 "Including protein at breakfast can improve fullness and helps distribute protein intake across the day."),

(["why should lunch contain vegetables", "vegetables at lunch", "benefits of vegetables with lunch"],
 "Vegetables add fiber, water, vitamins, minerals, and plant compounds while increasing the volume and variety of a meal."),

(["why should dinner include protein", "protein at dinner", "dinner protein importance"],
 "Protein at dinner contributes to daily protein needs and supports normal tissue maintenance and repair."),

(["can i eat fruit with a meal", "fruit with meals", "is fruit after meals okay"],
 "Yes. Fruit can be eaten with or between meals. There is no general requirement to eat fruit only at a particular time."),

(["is fruit at night unhealthy", "fruit before bed", "eating fruit at night"],
 "Eating fruit at night is not inherently unhealthy. Overall diet and individual tolerance matter more than the time of day."),

(["is eating fruit after dinner okay", "fruit after dinner", "dessert fruit"],
 "Yes. Fruit can be a nutritious dessert option after dinner."),

(["what is a healthy lunchbox", "healthy lunch box ideas", "college lunchbox"],
 "A balanced lunchbox can include a protein source, whole-grain carbohydrate, vegetables or fruit, and water."),

(["what should i carry for a long college day", "food for long college day", "college food preparation"],
 "Carry practical foods such as fruit, nuts, yogurt, sandwiches, roasted legumes, or other foods that are safe to store and easy to eat."),

(["how can i eat healthy while traveling", "healthy travel food", "nutrition while traveling"],
 "Carry shelf-stable options such as nuts, roasted legumes, whole-grain snacks, and fruit when practical, and choose balanced meals when eating out."),

(["healthy food at restaurants", "how to eat healthy outside", "restaurant healthy eating"],
 "Look for meals with vegetables and protein, choose reasonable portions, and ask for sauces or dressings separately when possible."),

(["how to choose a healthy restaurant meal", "restaurant meal selection", "healthy restaurant choices"],
 "Compare cooking methods, protein sources, vegetables, portion sizes, sauces, and drinks before choosing your meal."),

(["is grilled food always healthy", "grilled food nutrition", "grilled vs fried food"],
 "Grilling can reduce added oil compared with frying, but heavily charred foods should not be eaten excessively."),

(["what is portion control at restaurants", "restaurant portion control", "large restaurant portions"],
 "Consider sharing large portions, choosing smaller options, or stopping when comfortably satisfied rather than automatically finishing everything."),

(["can i drink water with meals", "water during meals", "drinking water while eating"],
 "Yes. Drinking water with meals is generally fine and contributes to hydration."),

(["does water dilute stomach acid", "water and digestion", "drinking water during digestion"],
 "Normal amounts of water consumed with meals do not meaningfully stop normal digestion."),

(["does lemon water burn fat", "lemon water weight loss", "does lemon water reduce belly fat"],
 "Lemon water can help with hydration, but it does not directly burn body fat or replace a calorie-controlled balanced diet."),

(["does green tea burn fat", "green tea weight loss", "green tea and fat burning"],
 "Green tea contains caffeine and catechins, but its effect on body weight is modest and it is not a substitute for diet and activity."),

(["what is metabolism", "metabolism meaning", "how does metabolism work"],
 "Metabolism refers to the chemical processes that keep the body functioning, including converting food into energy and maintaining tissues."),

(["can metabolism be increased naturally", "increase metabolism", "ways to support metabolism"],
 "Regular physical activity, adequate protein, sufficient sleep, and maintaining muscle mass support normal energy expenditure, but there is no simple food that dramatically increases metabolism."),

(["does skipping meals slow metabolism", "meal skipping and metabolism", "does fasting slow metabolism"],
 "Occasional meal skipping does not automatically damage metabolism. Long-term energy restriction can affect energy expenditure and body functions."),

(["why is muscle important for metabolism", "muscle and metabolism", "muscle mass and calorie burn"],
 "Muscle tissue requires energy to maintain, so maintaining muscle contributes to resting energy expenditure."),

(["can walking help weight management", "walking and weight management", "benefits of walking"],
 "Walking increases physical activity and can support weight management when combined with an appropriate overall eating pattern."),

(["how does strength training affect nutrition", "strength training diet", "nutrition for strength training"],
 "Strength training increases the importance of adequate protein, energy, carbohydrates, hydration, and recovery."),

(["why is recovery important after exercise", "exercise recovery", "recovery nutrition"],
 "Recovery allows the body to restore energy stores and repair tissues. Adequate food, fluids, sleep, and rest all contribute."),

(["can dehydration cause tiredness", "dehydration and fatigue", "water and tiredness"],
 "Dehydration can contribute to fatigue, headache, dizziness, and reduced physical performance."),

(["what are signs of dehydration", "dehydration symptoms", "how to know if dehydrated"],
 "Possible signs include thirst, dark urine, dry mouth, dizziness, headache, and reduced urination. Severe symptoms require prompt medical attention."),

(["what color should urine be for hydration", "urine color hydration", "urine and hydration"],
 "Pale yellow urine commonly indicates reasonable hydration, although urine color can be affected by foods, supplements, and medications."),

(["can too much water be harmful", "excess water drinking", "too much water effects"],
 "Yes. Excessive water intake can dangerously dilute blood sodium. Hydration should be appropriate for your activity, environment, and needs."),

(["what is hyponatremia", "hyponatremia meaning", "low sodium from too much water"],
 "Hyponatremia occurs when blood sodium becomes abnormally low. It can occur in some situations involving excessive fluid intake and requires medical attention when severe."),

(["why do athletes need carbohydrates", "carbohydrates for athletes", "sports carbohydrate needs"],
 "Carbohydrates are an important fuel source for moderate-to-high intensity exercise and help replenish muscle glycogen."),

(["what is glycogen", "glycogen meaning", "what does glycogen do"],
 "Glycogen is the stored form of glucose found mainly in muscles and the liver and is used as an energy source."),

(["what is muscle protein synthesis", "muscle protein synthesis meaning", "MPS meaning"],
 "Muscle protein synthesis is the process of building new muscle proteins. Protein intake and resistance exercise can stimulate this process."),

(["why is protein important after exercise", "protein after workout", "post workout protein"],
 "Protein after exercise provides amino acids that support muscle protein synthesis and tissue repair."),

(["do carbohydrates make you fat", "carbs and weight gain", "are carbohydrates bad"],
 "Carbohydrates do not automatically cause fat gain. Total energy intake, food choices, portions, and activity determine changes in body weight."),

(["do fats make you fat", "dietary fat and weight gain", "are fats bad"],
 "Dietary fat does not automatically cause body-fat gain. Fat is energy-dense, so portions and total energy intake matter."),

(["is protein fattening", "protein and weight gain", "does protein cause fat"],
 "Protein itself does not automatically cause fat gain. Excess total energy intake can contribute to weight gain regardless of the food source."),

(["what is a calorie deficit", "calorie deficit meaning", "how does calorie deficit work"],
 "A calorie deficit occurs when energy intake is lower than energy expenditure over time, which can lead to weight loss."),

(["what is a calorie surplus", "calorie surplus meaning", "how does calorie surplus work"],
 "A calorie surplus occurs when energy intake exceeds energy expenditure over time and can support weight gain."),

(["what is maintenance calories", "maintenance calorie meaning", "calories to maintain weight"],
 "Maintenance calories are the approximate energy intake needed to maintain body weight over time, and they vary by person and activity."),

(["can i lose weight without exercise", "weight loss without gym", "can diet alone reduce weight"],
 "Weight loss can occur through dietary energy reduction, although physical activity provides important health benefits and can help with weight management."),

(["can exercise alone cause weight loss", "exercise for weight loss", "can gym alone reduce weight"],
 "Exercise can increase energy expenditure, but weight change depends on the overall balance between energy intake and expenditure."),

(["why does weight fluctuate daily", "daily weight changes", "weight fluctuation reasons"],
 "Daily weight can change because of water, food in the digestive system, sodium, carbohydrate stores, hormones, and bowel movements."),

(["should i weigh myself every day", "daily weighing", "how often should i check weight"],
 "Daily weighing is optional. If you use it, look at longer-term trends rather than reacting to a single day's change."),

(["what is healthy weight loss", "safe weight loss", "reasonable weight loss"],
 "A gradual approach that maintains adequate nutrition and is sustainable is generally preferable to extreme restriction."),

(["why crash diets are risky", "crash diet effects", "are crash diets healthy"],
 "Crash diets can make it difficult to meet nutrient needs, may increase hunger, and are often difficult to sustain."),

(["what is a sustainable diet", "sustainable eating plan", "how to make diet sustainable"],
 "A sustainable diet provides adequate nutrients, fits your preferences and routine, and can be followed consistently without extreme restriction."),

(["how can i maintain weight after losing it", "weight maintenance tips", "maintain lost weight"],
 "Maintain regular activity, keep a consistent eating pattern, monitor long-term trends, and avoid returning to habits that caused excess intake."),

(["can mood affect food choices", "mood and eating", "emotions and food"],
 "Mood can influence appetite and food choices. Stress, boredom, sadness, and celebration can all affect eating behavior."),

(["does food directly change mood", "food and mood", "nutrition and emotions"],
 "Food can influence energy and well-being, but mood is affected by many factors including sleep, stress, environment, and mental health."),

(["what foods support normal brain function", "brain healthy foods", "nutrition for brain health"],
 "A varied diet containing fish or other omega-3 sources, vegetables, fruits, whole grains, legumes, nuts, and adequate protein supports overall nutrition for brain health."),

(["what foods contain choline", "choline food sources", "foods high in choline"],
 "Eggs, meat, fish, dairy, soybeans, and some legumes provide choline."),

(["why is choline important", "choline benefits", "what does choline do"],
 "Choline is needed for cell membranes, neurotransmitter production, and normal liver and brain function."),

(["what is an antioxidant", "antioxidant meaning", "what do antioxidants do"],
 "Antioxidants are substances that help protect cells from oxidative damage. Many fruits, vegetables, nuts, seeds, and other foods contain antioxidant compounds."),

(["which foods contain antioxidants", "antioxidant rich foods", "foods high in antioxidants"],
 "Fruits, vegetables, nuts, seeds, legumes, tea, cocoa, and many other plant foods contain antioxidant compounds."),

(["does cooking destroy antioxidants", "cooking antioxidants", "are antioxidants lost during cooking"],
 "Cooking affects different antioxidant compounds differently. Some decrease with heat, while others become more available after cooking."),

(["what is a nutrient deficiency", "nutrient deficiency meaning", "what happens with nutrient deficiency"],
 "A nutrient deficiency occurs when the body does not receive or absorb enough of a required nutrient over time."),

(["can supplements replace healthy food", "supplements vs food", "can vitamins replace diet"],
 "Supplements can help when a nutrient gap exists, but they do not replace the variety of nutrients and food components provided by a balanced diet."),

(["when are vitamin supplements needed", "do i need vitamin supplements", "vitamin supplement necessity"],
 "Supplement needs depend on diet, life stage, medical conditions, and laboratory findings. A healthcare professional can help determine whether a supplement is appropriate."),

(["can i take vitamins without food", "vitamins with food", "when to take vitamins"],
 "Some vitamins are better absorbed with food, while others have different requirements. Follow the product instructions or professional guidance."),

(["what is a multivitamin", "multivitamin meaning", "what does multivitamin contain"],
 "A multivitamin is a supplement containing multiple vitamins and sometimes minerals. Formulations vary considerably between products."),

(["are natural supplements always safe", "natural supplement safety", "are herbal supplements safe"],
 "Natural does not automatically mean safe. Supplements can have side effects, interactions, or contamination risks, so use them carefully."),

(["can supplements interact with medicines", "vitamin medicine interactions", "supplement drug interaction"],
 "Yes. Some supplements can interact with medicines or affect medical conditions. Check with a qualified healthcare professional before combining them."),

(["what is hydration during hot weather", "hot weather hydration", "drinking water in heat"],
 "Hot weather can increase fluid losses through sweating. Drink regularly and pay attention to thirst, urine, and activity level."),

(["what should i eat in summer", "summer healthy foods", "summer nutrition"],
 "Choose plenty of fluids, water-rich fruits and vegetables, balanced meals, and safe food-storage practices during hot weather."),

(["what should i eat in winter", "winter healthy foods", "winter nutrition"],
 "In winter, continue eating a varied diet with vegetables, fruits, protein foods, whole grains, and adequate fluids."),

(["why is seasonal food useful", "seasonal fruits benefits", "seasonal vegetables"],
 "Seasonal foods can be affordable, fresh, and varied, although nutritious foods are available in many forms throughout the year."),

(["how can i increase vegetable intake", "eat more vegetables", "ways to add vegetables"],
 "Add vegetables to breakfast, sandwiches, curries, soups, rice dishes, pasta, omelets, and snacks."),

(["how can i increase protein intake naturally", "increase protein from food", "natural protein sources"],
 "Add foods such as eggs, dairy, lentils, beans, tofu, fish, chicken, nuts, and seeds according to your dietary preference."),

(["how can i increase fiber intake", "increase dietary fiber", "ways to eat more fiber"],
 "Increase vegetables, fruits, legumes, whole grains, nuts, and seeds gradually while maintaining adequate fluid intake."),

(["how can i eat less processed food", "reduce processed foods", "eat more whole foods"],
 "Base more meals around vegetables, fruits, legumes, whole grains, nuts, seeds, and minimally processed protein foods."),

(["is home cooked dal healthy", "homemade dal nutrition", "dal at home"],
 "Homemade dal can be nutritious because it provides plant protein and fiber. The amount of added oil and salt affects the final meal."),

(["is homemade paneer healthy", "paneer nutrition", "homemade paneer"],
 "Paneer provides protein and calcium but can also contain substantial saturated fat. Portion size and preparation matter."),

(["can i eat paneer for protein", "paneer as protein source", "paneer protein"],
 "Yes. Paneer can provide protein and calcium, although leaner protein sources may provide less saturated fat."),

(["what is the difference between curd and greek yogurt", "curd vs greek yogurt", "greek yogurt compared with curd"],
 "Both can provide protein and calcium. Greek yogurt is typically strained and therefore often contains more protein per serving."),

(["what is kefir", "kefir meaning", "kefir benefits"],
 "Kefir is a fermented milk drink containing live microorganisms. Nutritional content varies by product."),

(["is buttermilk healthy", "buttermilk benefits", "can i drink buttermilk"],
 "Unsweetened buttermilk can provide fluid, protein, and calcium and can be a refreshing drink with meals."),

(["is lassi healthy", "lassi nutrition", "can i drink lassi"],
 "Plain unsweetened lassi can provide protein and calcium. Sweetened versions can contain considerable added sugar."),

(["is coconut milk healthy", "coconut milk nutrition", "can i drink coconut milk"],
 "Coconut milk varies by type. It can be high in saturated fat, while beverage-style coconut milk may be fortified and much lower in calories."),

(["what is plant milk", "plant based milk meaning", "examples of plant milk"],
 "Plant milks are beverages made from plants such as soy, oats, almonds, or peas. Nutritional content varies greatly between products."),

(["which plant milk has the most protein", "high protein plant milk", "plant milk protein"],
 "Soy milk is generally one of the higher-protein plant milk options. Fortified versions can also provide calcium and vitamin D."),

(["how to choose plant milk", "best plant milk", "plant milk selection"],
 "Compare protein, calcium, vitamin D, added sugar, and ingredients. Unsweetened fortified options are often practical choices."),

(["is soy healthy", "soy benefits", "soy nutrition"],
 "Soy foods provide high-quality plant protein and can be part of a balanced diet."),

(["does soy affect hormones", "soy and hormones", "soy food safety"],
 "Soy contains isoflavones, but normal amounts of soy foods are generally considered safe for most people."),

(["what are the benefits of edamame", "edamame benefits", "why is edamame healthy"],
 "Edamame provides plant protein, fiber, folate, vitamin K, and other nutrients."),

(["can edamame be a protein snack", "edamame snack", "edamame protein"],
 "Yes. Edamame can be a convenient plant-based snack containing protein and fiber."),

(["what are the benefits of tempeh", "tempeh benefits", "why is tempeh healthy"],
 "Tempeh is a fermented soy food that provides protein, fiber, and several minerals."),

(["tofu vs paneer", "compare tofu and paneer", "tofu or paneer"],
 "Tofu is plant-based and can be lower in saturated fat, while paneer provides dairy protein and calcium. The better fit depends on dietary preference and nutrition goals."),

(["egg vs paneer protein", "compare egg and paneer", "egg or paneer protein"],
 "Both provide protein. Eggs provide high-quality protein with relatively little carbohydrate, while paneer also provides calcium but can contain more saturated fat."),

(["chicken vs paneer protein", "compare chicken and paneer", "chicken or paneer"],
 "Chicken is generally a lean protein source, while paneer provides protein and calcium but can contain more saturated fat."),

(["dal vs chicken protein", "compare dal and chicken", "dal or chicken"],
 "Both can provide protein. Dal additionally provides substantial fiber, while chicken provides high-quality animal protein with little carbohydrate."),

(["rice vs roti which is healthier", "rice or roti", "compare rice and roti"],
 "Neither is universally healthier. Whole-grain roti can provide more fiber, while rice can also fit well when portions and the rest of the meal are balanced."),

(["oats vs poha for breakfast", "oats or poha", "compare oats and poha"],
 "Both can be nutritious breakfast choices. Oats are rich in beta-glucan, while poha can provide carbohydrate and can be improved with vegetables and protein."),

(["poha nutrition", "is poha healthy", "poha benefits"],
 "Poha provides carbohydrate and can be made more balanced by adding vegetables, peanuts, and a protein source."),

(["upma nutrition", "is upma healthy", "upma benefits"],
 "Upma provides carbohydrate and can be nutritious when prepared with vegetables and a suitable amount of oil."),

(["idli nutrition", "is idli healthy", "idli benefits"],
 "Idli provides carbohydrate and is relatively light. Pairing it with sambar can add protein, fiber, and vegetables."),

(["dosa nutrition", "is dosa healthy", "dosa benefits"],
 "Dosa can be part of a balanced meal. Pairing it with sambar and vegetables can improve the overall nutrient profile."),

(["sambar nutrition", "is sambar healthy", "sambar benefits"],
 "Sambar can provide vegetables, lentils, protein, fiber, and several micronutrients."),

(["is chutney healthy", "chutney nutrition", "can i eat chutney"],
 "Chutney can add flavor and some nutrients, but ingredients vary. Watch portions of coconut, salt, and added oil depending on the recipe."),

(["is biryani healthy", "biryani nutrition", "can i eat biryani"],
 "Biryani can fit into a balanced diet, but portions and preparation matter because it may contain substantial rice, oil, and salt. Adding vegetables and a protein source can improve the meal."),

(["how to make biryani healthier", "healthy biryani tips", "reduce calories in biryani"],
 "Use a reasonable amount of oil, include vegetables, choose an appropriate protein source, and control the serving size."),

(["is samosa healthy", "samosa nutrition", "can i eat samosa"],
 "Samosas are typically deep-fried and energy-dense. They can be eaten occasionally, with portion size considered."),

(["is vada pav healthy", "vada pav nutrition", "can i eat vada pav"],
 "Vada pav can be enjoyed occasionally, but it is usually high in refined carbohydrates, fat, and sodium. Pairing it with other nutritious foods can balance the overall day."),

(["how to make street food healthier", "healthy street food tips", "eating street food safely"],
 "Choose freshly prepared foods from hygienic places, prefer grilled or steamed options when available, and balance the meal with vegetables and protein."),

(["is roasted chana healthy", "roasted chickpeas snack", "roasted chana benefits"],
 "Roasted chana can be a convenient snack providing plant protein, fiber, and minerals."),

(["is makhana healthy", "makhana nutrition", "fox nuts benefits"],
 "Makhana can be a light snack providing carbohydrate and some protein and minerals. Preparation with excessive ghee or salt can increase calories and sodium."),

(["is murmura healthy", "puffed rice nutrition", "puffed rice snack"],
 "Puffed rice is a light carbohydrate food. Combining it with vegetables, legumes, peanuts, or another protein source makes a more balanced snack."),

(["is peanut chikki healthy", "peanut chikki nutrition", "can i eat peanut chikki"],
 "Peanut chikki provides peanuts and therefore some protein and unsaturated fat, but it also contains concentrated sugar. Portion size matters."),

(["is dark chocolate better than milk chocolate", "dark vs milk chocolate", "dark chocolate or milk chocolate"],
 "Dark chocolate usually contains more cocoa and less milk than milk chocolate, but both can contain substantial sugar and calories."),

(["how can i build a healthy thali", "healthy thali components", "balanced indian thali"],
 "A balanced thali can include vegetables, dal or another protein, a suitable portion of rice or roti, curd if tolerated, and a moderate amount of fat."),

(["is curd rice healthy", "curd rice nutrition", "can i eat curd rice"],
 "Curd rice provides carbohydrate and dairy protein and can be part of a balanced meal. Adding vegetables or a protein-rich side can improve variety."),

(["is khichdi healthy", "khichdi nutrition", "khichdi benefits"],
 "Khichdi can be a balanced and easy-to-digest meal when made with grains, lentils, vegetables, and a moderate amount of oil."),

(["how to make khichdi high protein", "high protein khichdi", "protein rich khichdi"],
 "Increase the proportion of dal or add another suitable protein source while keeping vegetables and grains in the meal."),

(["what is a balanced indian breakfast", "indian healthy breakfast", "healthy indian breakfast ideas"],
 "Options include eggs with whole-grain roti, vegetable poha with peanuts, idli with sambar, or plain curd with oats and fruit."),

(["what is a balanced indian dinner", "healthy indian dinner", "indian dinner nutrition"],
 "A balanced Indian dinner can include dal, paneer, tofu, eggs, chicken, or fish with vegetables and an appropriate portion of rice or roti."),

(["what is a balanced indian lunch", "healthy indian lunch", "indian lunch nutrition"],
 "A balanced Indian lunch can include dal or another protein, vegetables, roti or rice, and curd or another suitable side."),

(["can i eat spicy food", "spicy food health", "is spicy food healthy"],
 "Spicy food can fit into a healthy diet. Individual tolerance varies, especially for people who experience digestive discomfort from spicy foods."),

(["does spicy food burn fat", "spicy food weight loss", "can chili burn fat"],
 "Spicy foods may have small effects on energy expenditure, but they do not meaningfully replace a balanced diet and regular activity for weight management."),

(["what are the benefits of turmeric", "turmeric benefits", "why is turmeric used"],
 "Turmeric contains curcumin and other compounds. It can add flavor and color to meals, but it should not be treated as a cure for disease."),

(["what are the benefits of ginger", "ginger benefits", "why is ginger healthy"],
 "Ginger contains bioactive compounds and can add flavor to food and drinks. It is also commonly used for digestive comfort."),

(["what are the benefits of cinnamon", "cinnamon benefits", "is cinnamon healthy"],
 "Cinnamon contains plant compounds and can add flavor without adding much sugar. It should be used as a spice rather than as a medical treatment."),

(["can spices replace salt", "spices instead of salt", "reduce salt with spices"],
 "Spices and herbs can add flavor and help reduce reliance on added salt, although they do not provide the same electrolyte function as sodium."),

(["what are herbs and spices", "herbs vs spices", "healthy herbs and spices"],
 "Herbs and spices are plant-based flavoring ingredients that can add taste and aroma while helping reduce dependence on excess salt, sugar, or sauces."),

(["is garlic good for food", "garlic nutrition", "garlic benefits"],
 "Garlic adds flavor and contains sulfur-containing plant compounds while contributing very few calories in typical culinary amounts."),

(["is onion healthy", "onion nutrition", "onion benefits"],
 "Onions provide fiber and sulfur-containing plant compounds and can add flavor to meals."),

(["what are cruciferous vegetables", "cruciferous vegetables meaning", "examples of cruciferous vegetables"],
 "Cruciferous vegetables include broccoli, cauliflower, cabbage, kale, Brussels sprouts, and similar vegetables."),

(["why eat leafy greens", "leafy green benefits", "benefits of green vegetables"],
 "Leafy greens provide fiber, folate, vitamin K, carotenoids, and other micronutrients."),

(["what are legumes", "legumes meaning", "examples of legumes"],
 "Legumes include lentils, chickpeas, beans, peas, and soybeans. They are important sources of plant protein and fiber."),

(["why are legumes healthy", "legume benefits", "benefits of eating legumes"],
 "Legumes provide protein, fiber, folate, minerals, and complex carbohydrates, making them useful foods in many eating patterns."),

(["how often should i eat legumes", "legume intake", "eating beans regularly"],
 "Legumes can be eaten regularly as part of a varied diet. Increase intake gradually if you are not accustomed to high-fiber foods."),

(["what is resistant starch", "resistant starch meaning", "foods with resistant starch"],
 "Resistant starch is a type of carbohydrate that resists digestion in the small intestine and can be fermented by gut microbes."),

(["what foods contain resistant starch", "resistant starch foods", "sources of resistant starch"],
 "Foods such as legumes, some whole grains, green bananas, and cooked-and-cooled potatoes or rice can contain resistant starch."),

(["does cooling rice change its starch", "cooled rice nutrition", "rice resistant starch"],
 "Cooling cooked rice can increase the amount of resistant starch to some degree, although the overall nutrition still depends on the complete meal."),

(["is reheated rice safe", "rice food safety", "how to store cooked rice"],
 "Cooked rice should be cooled and refrigerated promptly and handled carefully because improperly stored rice can support bacterial growth."),

(["how to prevent food poisoning", "food poisoning prevention", "avoid foodborne illness"],
 "Wash hands, prevent cross-contamination, cook foods thoroughly, refrigerate perishables promptly, and use safe drinking water."),

(["what is a balanced diet", "balanced diet meaning", "how to eat a balanced diet"],
 "A balanced diet provides adequate energy, protein, fats, carbohydrates, fiber, vitamins, minerals, and fluids through a varied selection of foods."),

(["does healthy eating mean no junk food", "junk food in healthy diet", "can i eat unhealthy food sometimes"],
 "Healthy eating does not require perfection. Less nutritious foods can occasionally fit within an overall varied and balanced diet."),

(["how often can i eat fast food", "fast food frequency", "fast food in a healthy diet"],
 "Fast food can be eaten occasionally, but frequent large portions may make it harder to manage sodium, saturated fat, calories, and fiber."),

(["how can i make fast food healthier", "healthy fast food choices", "reduce fast food calories"],
 "Choose smaller portions, grilled options when available, vegetables or fruit as sides, water or unsweetened drinks, and moderate sauces."),

(["is pizza healthy", "pizza nutrition", "can i eat pizza"],
 "Pizza can fit into a balanced diet. Consider portion size, vegetable toppings, protein, cheese quantity, and the overall meal."),

(["how to make pizza healthier", "healthy pizza tips", "healthier pizza"],
 "Add vegetables and a protein source, choose a reasonable amount of cheese, and keep the portion appropriate for your needs."),

(["is burger healthy", "burger nutrition", "can i eat burgers"],
 "A burger can fit occasionally into a balanced diet. Choose reasonable portions and consider vegetables, leaner fillings, and side options."),

(["how to make burger healthier", "healthy burger tips", "healthier burger"],
 "Use a lean protein filling, add vegetables, choose a whole-grain bun when available, and limit excessive sauces and fried sides."),

(["is french fries healthy", "french fries nutrition", "can i eat fries"],
 "French fries are usually high in calories and fat because they are fried. They can be eaten occasionally in moderate portions."),

(["what is a healthier alternative to fries", "healthy fries alternatives", "replace french fries"],
 "Baked potatoes, roasted vegetables, corn, or a salad can be alternatives depending on the meal."),

(["is ice cream healthy", "ice cream nutrition", "can i eat ice cream"],
 "Ice cream can be enjoyed occasionally, but it is usually high in added sugar and saturated fat, so portion size matters."),

(["how can i control dessert portions", "dessert portion control", "how much dessert should i eat"],
 "Serve a small portion, eat slowly, and consider your overall meal and daily intake rather than avoiding dessert completely."),

(["what is food balance", "balance in nutrition", "how to balance unhealthy food"],
 "Food balance means combining nutrient-rich foods most of the time while allowing flexibility for foods that are mainly enjoyed for taste."),

(["can healthy eating be affordable", "cheap healthy diet", "budget nutrition"],
 "Yes. Affordable foods such as lentils, beans, eggs, seasonal vegetables, grains, and homemade meals can form the foundation of a nutritious diet."),

(["how to reduce food waste", "food waste reduction", "save leftover food"],
 "Plan portions, store leftovers safely, use perishable foods promptly, and repurpose suitable leftovers into new meals."),

(["is meal planning useful", "meal planning benefits", "why plan meals"],
 "Meal planning can reduce last-minute food choices, improve grocery efficiency, and make balanced eating easier to maintain."),

(["how to plan meals for a week", "weekly meal planning", "seven day meal planning"],
 "Choose a few protein sources, grains, vegetables, fruits, and simple recipes, then mix them into different meals throughout the week."),

(["what should i keep in a healthy kitchen", "healthy pantry staples", "nutritious kitchen essentials"],
 "Useful staples include lentils, beans, oats, whole grains, nuts, seeds, spices, canned vegetables, and basic protein foods."),

(["what are healthy pantry foods", "healthy pantry staples", "foods to keep at home"],
 "Oats, lentils, beans, canned tomatoes, whole grains, nuts, seeds, and unsweetened shelf-stable foods can be useful pantry staples."),

(["what should i eat when i have no time to cook", "quick healthy meals", "healthy food when busy"],
 "Quick options include eggs with whole-grain toast, yogurt with fruit and nuts, dal with rice, or a vegetable-and-protein sandwich."),

(["what is a five minute healthy meal", "quick five minute meal", "fast healthy meal"],
 "A quick meal can combine plain yogurt, fruit, oats, and nuts, or a whole-grain sandwich with a protein filling and vegetables."),

(["how can i make healthy food taste better", "make healthy food tasty", "healthy food flavor tips"],
 "Use herbs, spices, garlic, ginger, lemon, vinegar, roasted vegetables, and varied textures to improve flavor without relying heavily on salt or sugar."),

(["why do vegetables taste bitter", "bitter vegetables", "vegetable bitterness"],
 "Some vegetables naturally contain bitter compounds. Cooking, roasting, balancing with acidity, or combining them with other ingredients can make them more palatable."),

(["is raw food always healthier", "raw vs cooked food", "should vegetables be eaten raw"],
 "No. Some foods are more nutritious raw, while cooking can improve digestibility or nutrient availability for others."),

(["is boiling vegetables healthy", "boiled vegetables nutrition", "can i boil vegetables"],
 "Boiling is a valid cooking method, although some water-soluble nutrients can move into the cooking water. Avoid overcooking when possible."),

(["is roasting vegetables healthy", "roasted vegetables benefits", "can i roast vegetables"],
 "Roasting can make vegetables flavorful and nutritious. Use a moderate amount of oil and avoid excessive charring."),

(["is air frying healthier", "air fryer nutrition", "air frying vs deep frying"],
 "Air frying generally uses less oil than deep frying, so it can reduce added fat while still producing a crisp texture."),

(["what is batch cooking", "batch cooking meaning", "batch meal preparation"],
 "Batch cooking means preparing larger quantities of food at once so portions can be stored and used for later meals."),

(["how should i store meal prep food", "meal prep storage", "storing prepared meals"],
 "Use clean covered containers, refrigerate perishable foods promptly, and follow safe storage times and temperatures."),

(["what is portioned meal prep", "portion meal prep", "meal prep portions"],
 "Portioned meal prep means dividing prepared food into individual servings, making it easier to manage meals during busy days."),

(["can meal prep save money", "meal prep budget", "does meal prep save money"],
 "Meal prep can reduce spending by limiting impulse purchases and helping you use groceries efficiently."),

(["what is a healthy food swap", "healthy food substitutions", "nutrition food swaps"],
 "A food swap replaces one ingredient with another that provides a different or more favorable nutrition profile while keeping the meal enjoyable."),

(["healthy swap for sugary cereal", "replace sugary cereal", "breakfast cereal alternative"],
 "Try oats, unsweetened whole-grain cereal, or plain yogurt with fruit and nuts to reduce added sugar."),

(["healthy swap for sugary drinks", "replace soda", "alternatives to sugary drinks"],
 "Water, sparkling water, unsweetened tea, or plain milk can replace sugary drinks depending on your needs."),

(["healthy swap for chips", "replace potato chips", "chip alternatives"],
 "Roasted chickpeas, air-popped popcorn, vegetables with hummus, or a moderate portion of nuts can provide alternatives."),

(["healthy swap for candy", "replace sweets", "candy alternatives"],
 "Fresh fruit, yogurt with fruit, or a small portion of dark chocolate can provide alternatives depending on your preference."),

(["healthy swap for white rice", "alternative to white rice", "rice alternatives"],
 "Brown rice, quinoa, barley, or other whole grains can provide more fiber, although white rice can also fit into a balanced diet."),

(["healthy swap for refined flour", "refined flour alternatives", "whole wheat flour alternative"],
 "Whole-wheat flour or other whole-grain flours can increase fiber compared with refined flour."),

(["healthy swap for fried chicken", "alternative to fried chicken", "healthier chicken preparation"],
 "Grilled, baked, roasted, or air-fried chicken can reduce the amount of added oil compared with deep frying."),

(["what is a nutrition goal", "nutrition goal meaning", "how to set food goals"],
 "A nutrition goal is a specific eating-related target, such as increasing vegetables, improving protein intake, or reducing sugary drinks."),

(["how to set a realistic nutrition goal", "realistic diet goals", "nutrition goal setting"],
 "Choose one or two specific changes that are measurable and realistic for your routine rather than making many extreme changes at once."),

(["what is a food diary", "food diary meaning", "why track food"],
 "A food diary records what and sometimes when you eat and drink. It can help identify patterns and habits."),

(["does tracking calories help", "calorie tracking benefits", "should i count calories"],
 "Calorie tracking can help some people understand intake, but it is not required for everyone. Food quality, hunger, and sustainability also matter."),

(["what is intuitive eating", "intuitive eating meaning", "how does intuitive eating work"],
 "Intuitive eating focuses on recognizing hunger and fullness cues while allowing flexibility and reducing rigid food rules."),

(["how do i recognize fullness", "fullness cues", "signs of being full"],
 "Fullness may feel like reduced hunger, comfortable satisfaction, or less interest in continuing to eat. Eating slowly can make these cues easier to notice."),

(["how do i recognize physical hunger", "hunger cues", "signs of hunger"],
 "Physical hunger can develop gradually and may include stomach sensations, low energy, or increased interest in food."),

(["can eating slowly help", "slow eating benefits", "eat slowly for fullness"],
 "Eating slowly can give your body more time to recognize fullness and may help reduce unintentional overeating."),

(["does chewing food well help digestion", "chewing and digestion", "importance of chewing"],
 "Chewing breaks food into smaller pieces and mixes it with saliva, helping prepare it for digestion."),

(["why is breakfast not mandatory", "is breakfast necessary", "do i have to eat breakfast"],
 "Breakfast is not universally mandatory. Some people prefer it while others do not, as long as their overall diet meets their nutritional needs."),

(["can i exercise on an empty stomach", "fasted exercise", "workout without eating"],
 "Some people tolerate fasted exercise, while others perform better with food. Exercise intensity, duration, health, and personal tolerance matter."),

(["what should i eat before morning workout", "morning pre workout meal", "breakfast before gym"],
 "For a morning workout, a small easily digested carbohydrate-rich snack can be useful if you feel you need fuel."),

(["what should i eat after morning workout", "post morning workout meal", "breakfast after gym"],
 "After a morning workout, a meal containing protein, carbohydrate, and fluids can support recovery."),

(["can i drink milk before bed", "milk at night", "milk before sleep"],
 "Milk can be consumed at night if it fits your diet and you tolerate it. It provides protein and calcium."),

(["does protein before bed help", "bedtime protein", "protein at night"],
 "A protein-containing snack before bed can contribute to daily protein intake. It is optional rather than necessary for everyone."),

(["what are slow digesting carbohydrates", "complex carbs meaning", "slow carbs"],
 "Many high-fiber carbohydrate foods, such as legumes and whole grains, digest more slowly and can provide sustained energy."),

(["what are simple carbohydrates", "simple carbs meaning", "examples of simple carbs"],
 "Simple carbohydrates include sugars such as glucose, fructose, and sucrose. They occur naturally in some foods and are also added to many processed foods."),

(["are complex carbohydrates healthy", "complex carb benefits", "healthy carbohydrate sources"],
 "Many complex carbohydrate foods such as whole grains, legumes, vegetables, and some fruits provide fiber and useful micronutrients."),

(["what is dietary fat", "fat meaning in nutrition", "why do we need fat"],
 "Dietary fat provides energy and is needed for cell membranes and absorption of fat-soluble vitamins A, D, E, and K."),

(["what are omega 3 foods", "foods rich in omega 3", "omega 3 food sources"],
 "Fatty fish, flaxseed, chia seeds, walnuts, and some fortified foods provide omega-3 fatty acids."),

(["what are omega 6 fats", "omega 6 meaning", "foods containing omega 6"],
 "Omega-6 fatty acids are essential polyunsaturated fats found in many nuts, seeds, and vegetable oils."),

(["what is cholesterol", "cholesterol meaning", "why does cholesterol matter"],
 "Cholesterol is a waxy substance used by the body for cell membranes and hormone production. Blood cholesterol levels are influenced by genetics and diet."),

(["what foods contain dietary cholesterol", "dietary cholesterol sources", "cholesterol in food"],
 "Dietary cholesterol is found mainly in animal foods such as eggs, meat, seafood, and dairy products."),

(["what is sodium vs salt", "difference between salt and sodium", "salt and sodium"],
 "Salt contains sodium and chloride. Sodium is the mineral specifically measured on nutrition labels."),

(["how much salt should i eat", "daily salt intake", "salt recommendation"],
 "Most people benefit from keeping salt intake moderate and limiting heavily processed foods. Specific needs can vary with health conditions."),

(["why are vegetables important for weight management", "vegetables and weight management", "vegetables for fullness"],
 "Vegetables often provide high water and fiber content relative to calories, which can help create filling meals."),

(["why are legumes good for weight management", "legumes and weight management", "beans for fullness"],
 "Legumes provide protein and fiber, which can contribute to fullness and help make meals more satisfying."),

(["why are whole grains good for weight management", "whole grains and weight", "whole grains for fullness"],
 "Whole grains generally provide more fiber than refined grains, which can contribute to fullness and better meal quality."),

(["what is a healthy eating pattern", "healthy eating pattern meaning", "how should i eat overall"],
 "A healthy eating pattern emphasizes variety, vegetables and fruits, adequate protein, whole or minimally processed foods, appropriate portions, and limited excess added sugar, sodium, and saturated fat."),

(["can i have cheat meals", "cheat meal meaning", "cheat meals in diet"],
 "You do not need a special cheat meal. Flexible portions of favorite foods can fit into an overall balanced eating pattern."),

(["is one unhealthy meal harmful", "one bad meal", "will one unhealthy meal ruin my diet"],
 "One meal does not determine overall nutrition. Return to your normal balanced eating pattern rather than compensating with extreme restriction."),

(["what should i do after overeating", "overeating recovery", "ate too much what should i do"],
 "Return to normal meals, drink fluids according to thirst, avoid extreme restriction, and pay attention to what triggered the overeating."),

(["can i eat my favorite foods and stay healthy", "favorite foods in healthy diet", "healthy diet with favorite foods"],
 "Yes. Favorite foods can fit into a healthy diet when portions and frequency are appropriate and most meals remain nutrient-rich."),

(["how can nutri ai help with food choices", "how can nutri ai help", "what can nutri ai do for nutrition"],
 "Nutri AI can provide general nutrition information, help organize food choices, and suggest balanced options based on the information provided. It is not a substitute for professional medical advice."),

(["can nutri ai diagnose a disease", "does nutri ai diagnose", "can ai diagnose health problems"],
 "No. Nutri AI should provide general wellness and nutrition guidance and should not claim to diagnose diseases."),

(["should i trust every nutrition answer from ai", "can ai nutrition advice be wrong", "nutrition ai accuracy"],
 "AI-generated nutrition information can contain errors. Important health decisions should be checked with reliable sources or a qualified healthcare professional."),

(["when should i see a nutrition professional", "when to consult dietitian", "need a dietitian"],
 "Consider professional guidance when you have a medical condition, major dietary restriction, persistent symptoms, or a need for a personalized nutrition plan."),

(["can nutrition advice be personalized", "personalized nutrition", "custom diet advice"],
 "Nutrition can be personalized based on age, body size, activity, dietary preferences, goals, health conditions, and other relevant factors."),

(["what information is useful for a nutrition plan", "nutrition profile information", "details needed for diet plan"],
 "Useful information can include age, activity level, dietary preferences, typical meals, goals, allergies, and relevant health information."),

(["why should food allergies be recorded", "food allergy information", "allergy in nutrition profile"],
 "Food allergies are important because avoiding trigger foods can be essential for safety. Severe allergies require professional medical guidance."),

(["why record food preferences", "dietary preference in nutrition app", "why track veg non veg preference"],
 "Recording dietary preferences helps recommendations match foods a person is willing and able to eat."),

(["why track water intake", "water tracking benefits", "should i track water"],
 "Tracking water can help some people notice hydration habits, especially during hot weather or active periods."),

(["why track meals", "meal tracking benefits", "food logging benefits"],
 "Meal tracking can reveal eating patterns, portion habits, and gaps in food variety or nutrient intake."),

(["why track mood with food", "mood and meal tracking", "food mood diary"],
 "Tracking mood alongside meals can help identify personal patterns between emotions, appetite, cravings, and eating behavior, without proving that one directly causes another."),

(["can food cause depression", "food and depression", "does diet cause depression"],
 "Diet is only one factor related to mental health. Depression has many causes, and persistent symptoms should be discussed with a qualified healthcare professional."),

(["can food cure anxiety", "food and anxiety", "diet for anxiety"],
 "No single food cures anxiety. A balanced diet supports general health, while persistent anxiety may require professional mental-health support."),

(["what should i eat when stressed", "stress eating food choices", "food during stress"],
 "Choose a regular balanced meal or snack with protein, fiber-rich carbohydrates, and fluids rather than relying only on highly sugary foods."),

(["what should i eat when feeling low", "food when sad", "nutrition when feeling low"],
 "A regular balanced meal can support energy and routine, but food alone does not treat persistent low mood. Seek professional support when needed."),

(["what should i eat when tired after college", "food after college", "college tiredness food"],
 "Choose a balanced snack or meal containing protein, carbohydrates, vegetables or fruit, and fluids based on your hunger and activity."),

(["healthy food for computer students", "nutrition for computer engineering students", "food for students who study computers"],
 "Students can benefit from regular meals containing protein, whole grains, vegetables, fruits, nuts or seeds, and adequate fluids."),

(["healthy snack during coding", "coding snack ideas", "food while coding"],
 "Fruit with nuts, yogurt, roasted chickpeas, or a simple sandwich can be practical snacks during long study or coding sessions."),

(["does sitting all day affect nutrition", "sedentary lifestyle and diet", "food for sedentary students"],
 "Long periods of sitting reduce daily energy expenditure. Focus on balanced portions, regular movement breaks, and a varied diet."),

(["how often should i take movement breaks", "study movement breaks", "sitting breaks"],
 "Taking regular short movement breaks during long periods of sitting can support general health and reduce prolonged inactivity."),

(["what should i drink while studying", "study drinks", "hydration while studying"],
 "Water is a simple choice. Unsweetened tea can also contribute to fluid intake, while sugary and highly caffeinated drinks should be limited."),

(["does dehydration affect concentration", "water and concentration", "hydration and focus"],
 "Even mild dehydration can make some people feel less comfortable and may affect concentration or performance."),

(["what is brain fog food", "nutrition for brain fog", "food for mental tiredness"],
 "There is no specific food that cures brain fog. Regular balanced meals, adequate fluids, sleep, and addressing underlying causes are more important."),

(["can skipping water affect headaches", "dehydration headache", "water and headache"],
 "Dehydration can contribute to headaches in some people. If headaches are frequent or severe, seek medical evaluation."),

(["what is a food craving trigger", "craving triggers", "why do cravings happen"],
 "Cravings can be triggered by hunger, habits, stress, sleep loss, emotions, environmental cues, and food availability."),

(["how can i manage food cravings", "control cravings", "reduce cravings"],
 "Eat regular balanced meals, include protein and fiber, sleep adequately, stay hydrated, and identify situations that trigger cravings."),

(["can lack of sleep increase hunger", "sleep and hunger", "poor sleep appetite"],
 "Poor sleep can affect hormones and appetite regulation and may increase hunger or cravings in some people."),

(["how does sleep affect weight", "sleep and weight management", "sleep and body weight"],
 "Sleep affects appetite, activity, recovery, and food choices, all of which can influence weight management."),

(["what is recovery sleep", "sleep for recovery", "why sleep matters after exercise"],
 "Sleep supports muscle recovery, energy regulation, immune function, and overall physical and mental health."),

(["can exercise improve appetite regulation", "exercise and appetite", "physical activity appetite"],
 "Regular physical activity can influence appetite and metabolic health, although the effect on hunger varies between individuals."),

(["what is NEAT", "NEAT meaning", "non exercise activity thermogenesis"],
 "NEAT refers to energy used for activities other than structured exercise, such as walking, standing, household tasks, and daily movement."),

(["how can i increase daily movement", "increase daily activity", "move more during day"],
 "Walk during breaks, use stairs when practical, stand periodically, take short walks, and add movement to routine tasks."),

(["is walking after meals useful", "walk after eating", "post meal walking"],
 "A gentle walk after a meal can be a practical way to add movement and may support post-meal blood glucose management."),

(["what is post meal blood sugar", "blood sugar after eating", "postprandial glucose"],
 "Post-meal blood glucose refers to blood glucose levels after eating. The response varies based on the meal, activity, and individual physiology."),

(["does fiber slow digestion", "fiber and digestion speed", "fiber digestion"],
 "Certain types of fiber, especially soluble fiber, can slow digestion and absorption and may increase fullness."),

(["does protein slow digestion", "protein digestion and fullness", "protein and digestion"],
 "Protein can contribute to fullness and may slow gastric emptying when included in a mixed meal."),

(["what is soluble fiber", "soluble fiber meaning", "foods high in soluble fiber"],
 "Soluble fiber dissolves or swells in water and can be found in oats, legumes, some fruits, and seeds."),

(["what is insoluble fiber", "insoluble fiber meaning", "foods high in insoluble fiber"],
 "Insoluble fiber adds bulk to stool and supports normal bowel movement. Whole grains, vegetables, and many plant foods provide it."),

(["how can i prevent constipation with diet", "diet for constipation", "foods for regular bowel movements"],
 "Gradually increase fiber-rich foods, drink adequate fluids, stay physically active, and maintain a regular eating routine."),

(["can yogurt help digestion", "yogurt and digestion", "yogurt for gut health"],
 "Yogurt containing live cultures may support gut health for some people, while individual tolerance varies."),

(["can probiotics help digestion", "probiotics and digestion", "probiotic digestion benefits"],
 "Some probiotic strains may help specific digestive problems, but effects vary by strain and person."),

(["what foods can cause bloating", "bloating foods", "why do some foods cause bloating"],
 "Bloating varies between people. Large portions, carbonated drinks, high-fiber foods introduced suddenly, and certain fermentable carbohydrates can contribute."),

(["how to reduce bloating from beans", "bean bloating", "reduce gas after beans"],
 "Increase beans gradually, rinse canned beans, cook dried beans thoroughly, and drink adequate fluids."),

(["can carbonated drinks cause bloating", "fizzy drinks and bloating", "soda bloating"],
 "Carbonated drinks can increase swallowed gas and may cause bloating in some people."),

(["what is food intolerance", "food intolerance meaning", "food intolerance vs allergy"],
 "Food intolerance is difficulty digesting or reacting to a food without the immune reaction typical of a food allergy. Symptoms and causes vary."),

(["can lactose free milk be healthy", "lactose free milk nutrition", "lactose free milk"],
 "Lactose-free milk can provide similar protein and calcium to regular milk while being easier to digest for people with lactose intolerance."),

(["what are dairy alternatives", "milk alternatives", "non dairy milk options"],
 "Dairy alternatives include soy, oat, almond, pea, and other plant-based beverages. Nutritional content varies, so labels should be compared."),

(["is soy milk better than almond milk for protein", "soy milk vs almond milk", "protein in soy vs almond milk"],
 "Soy milk generally provides more protein than almond milk. Fortification with calcium and vitamin D also matters when comparing products."),

(["can nuts replace meat protein", "nuts as meat replacement", "nuts protein compared with meat"],
 "Nuts provide protein but are also high in fat and calories. Legumes and soy foods are often more substantial plant-based protein replacements."),

(["can lentils replace meat", "lentils as meat replacement", "meat alternative lentils"],
 "Lentils can replace some meat in meals by providing plant protein and fiber, especially when combined with grains and vegetables."),

(["can tofu replace chicken", "tofu as chicken alternative", "tofu meat replacement"],
 "Tofu can replace chicken in many dishes as a plant-based protein source. Seasoning and preparation can be adjusted to the recipe."),

(["what is tempeh vs tofu", "tempeh compared with tofu", "tofu or tempeh"],
 "Both are soy foods providing protein. Tempeh is fermented and generally has a firmer texture and more fiber than many types of tofu."),

(["what is seitan", "seitan meaning", "is seitan a protein source"],
 "Seitan is a wheat-gluten-based protein food. It can be high in protein but is not suitable for people who need to avoid gluten."),

(["what are meat alternatives", "plant based meat alternatives", "vegetarian meat substitutes"],
 "Meat alternatives include tofu, tempeh, seitan, textured vegetable protein, and various plant-based products. Nutrition varies widely between products."),

(["how to choose plant based meat", "plant based meat label", "healthy vegan meat choice"],
 "Compare protein, sodium, saturated fat, calories, and ingredients rather than assuming every plant-based product is automatically healthier."),

(["is canned tuna healthy", "tuna benefits", "canned tuna nutrition"],
 "Canned tuna provides protein and can provide omega-3 fats. Choose products according to your dietary needs and follow local guidance on fish consumption."),

(["how often can i eat tuna", "tuna frequency", "tuna consumption"],
 "Fish can be part of a healthy diet, but variety is useful because mercury levels vary among fish species. Follow current local food-safety guidance."),

(["what is mercury in fish", "fish mercury meaning", "mercury in seafood"],
 "Mercury is an environmental contaminant that can accumulate in some fish. Choosing a variety of lower-mercury fish helps reduce exposure."),

(["which fish are lower in mercury", "low mercury fish", "safe lower mercury fish"],
 "Common lower-mercury choices include salmon, sardines, trout, and some other smaller fish. Check local food-safety guidance for specific recommendations."),

(["is seafood healthy", "seafood benefits", "why eat seafood"],
 "Seafood provides high-quality protein and can provide omega-3 fats, iodine, selenium, vitamin B12, and other nutrients."),

(["what is a healthy portion of fish", "fish serving size", "how much fish should i eat"],
 "A moderate serving of fish can provide substantial protein and nutrients. Exact needs depend on the person's overall diet and local dietary guidance."),

(["what are the benefits of prawns", "prawn benefits", "shrimp nutrition"],
 "Prawns provide high-quality protein and nutrients such as selenium and vitamin B12. Preparation can add substantial sodium or fat."),

(["is seafood high in protein", "seafood protein", "protein in fish"],
 "Many fish and seafood foods are rich in high-quality protein."),

(["what is lean protein", "lean protein meaning", "examples of lean protein"],
 "Lean protein foods provide substantial protein with relatively little fat. Examples include skinless chicken, fish, egg whites, tofu, and some low-fat dairy."),

(["what is plant protein", "plant protein meaning", "plant protein foods"],
 "Plant protein comes from foods such as legumes, soy foods, nuts, seeds, and whole grains."),

(["how to combine plant proteins", "plant protein combinations", "complete protein combinations"],
 "Combining different plant foods across the day, such as legumes and grains, can provide a broad range of essential amino acids."),

(["do i need protein immediately after workout", "protein timing after exercise", "post workout protein timing"],
 "Getting adequate protein across the day is more important than an exact minute-by-minute window after exercise."),

(["how should protein be spread across the day", "protein distribution", "protein per meal"],
 "Spreading protein across meals can be a practical way to meet daily needs and support muscle protein synthesis."),

(["what is muscle recovery food", "foods for muscle recovery", "recovery nutrition"],
 "Recovery meals can combine protein, carbohydrate, fluids, and micronutrient-rich foods to support tissue repair and replenish energy."),

(["what is hydration before exercise", "pre workout hydration", "water before gym"],
 "Start exercise adequately hydrated and drink according to thirst and conditions. Longer or hotter sessions may require more fluid planning."),

(["what is hydration after exercise", "post workout hydration", "water after gym"],
 "Replace fluids after exercise according to the amount lost through sweating. Water is often sufficient for normal workouts."),

(["what should i eat during long exercise", "food during endurance exercise", "nutrition during long workout"],
 "During prolonged endurance exercise, carbohydrate and fluids may help maintain performance. Exact needs depend on duration and intensity."),

(["what are sports drinks", "sports drink meaning", "when are sports drinks useful"],
 "Sports drinks provide fluids and usually carbohydrate and electrolytes. They are mainly useful during prolonged or intense exercise rather than routine daily hydration."),

(["what is carbohydrate loading", "carbohydrate loading meaning", "carb loading"],
 "Carbohydrate loading is a planned increase in carbohydrate intake before certain long endurance events to maximize muscle glycogen stores."),

(["who needs carbohydrate loading", "carb loading for athletes", "should everyone carb load"],
 "Carbohydrate loading is mainly relevant to selected endurance events and is not necessary for ordinary workouts."),

(["what is glycogen depletion", "glycogen depletion meaning", "low glycogen exercise"],
 "Glycogen depletion means reduced stored carbohydrate in muscles and the liver, which can contribute to fatigue during prolonged exercise."),

(["what are recovery carbohydrates", "carbs after workout", "post workout carbohydrates"],
 "Carbohydrates after exercise help replenish muscle glycogen, especially when another demanding workout is scheduled soon."),

(["can fruit help after workout", "fruit post workout", "fruit after exercise"],
 "Fruit provides carbohydrate, fluids, and micronutrients and can be combined with protein for a balanced recovery snack."),

(["what is a pre workout snack", "pre gym snack", "food before exercise"],
 "A pre-workout snack is a small meal or food eaten before exercise to provide fuel and avoid excessive hunger. Easily digested carbohydrates are often useful."),

(["how long before workout should i eat", "meal timing before gym", "when to eat before exercise"],
 "Meal timing depends on the meal size and individual tolerance. Larger meals usually need more time to digest than small snacks."),

(["what foods are easy to digest before exercise", "easy digesting pre workout foods", "pre workout easy foods"],
 "Foods such as bananas, toast, oats, rice, or yogurt may be easier to tolerate before exercise than very fatty or high-fiber meals."),

(["why avoid heavy meals before exercise", "heavy food before workout", "fatty meal before gym"],
 "Large, high-fat, or very high-fiber meals may feel uncomfortable during exercise because they can digest more slowly."),

(["what is recovery nutrition after cardio", "cardio recovery food", "food after running"],
 "After cardio, combine carbohydrate to replenish energy with protein to support tissue recovery and include adequate fluids."),

(["what is nutrition for muscle gain", "diet for muscle gain", "food for gaining muscle"],
 "Muscle gain generally requires adequate energy, sufficient protein, resistance training, carbohydrate for training, and adequate recovery."),

(["what is nutrition for fat loss", "diet for fat loss", "food for losing body fat"],
 "Fat loss generally requires a sustainable calorie deficit while maintaining adequate protein, fiber, micronutrients, and physical activity."),

(["can i gain muscle and lose fat", "muscle gain fat loss", "body recomposition nutrition"],
 "Some people can gain muscle while losing fat, especially with resistance training and adequate protein, but results vary with training status, energy intake, and individual factors."),

(["why is resistance training important", "strength training benefits", "weight training benefits"],
 "Resistance training supports muscle strength, muscle mass, bone health, and physical function."),

(["what is a balanced post workout meal", "post workout meal balance", "complete recovery meal"],
 "A balanced post-workout meal can include a protein source, carbohydrate, vegetables or fruit, and fluids."),

(["can eggs and oats be a balanced breakfast", "egg and oats breakfast", "oats with eggs"],
 "Yes. Eggs provide protein while oats provide carbohydrate and fiber, making them complementary foods for breakfast."),

(["can yogurt and nuts be a balanced snack", "yogurt and nuts snack", "yogurt nut combination"],
 "Yes. Plain yogurt and a moderate portion of nuts can provide protein, healthy fats, and other nutrients."),

(["can fruit and nuts be a balanced snack", "fruit and nuts snack", "fruit nut combination"],
 "Yes. Fruit provides carbohydrate and fiber while nuts provide protein, fat, and minerals."),

(["can hummus and vegetables be a healthy snack", "hummus vegetable snack", "vegetables with hummus"],
 "Yes. Hummus with vegetables provides fiber and plant protein and can be a practical snack."),

(["can boiled eggs be a snack", "boiled egg snack", "egg snack idea"],
 "Yes. Boiled eggs are a convenient protein-rich snack."),

(["are boiled eggs healthier than fried eggs", "boiled vs fried eggs", "egg cooking methods"],
 "Both can be nutritious. Boiled eggs require little added fat, while frying can increase calories depending on the amount of oil used."),

(["is scrambled egg healthy", "scrambled eggs nutrition", "can i eat scrambled eggs"],
 "Scrambled eggs can be nutritious. Use a moderate amount of oil or butter and add vegetables for a more balanced meal."),

(["is omelette healthy", "omelette nutrition", "can i eat omelette"],
 "An omelette can be a nutritious meal when made with eggs, vegetables, and a moderate amount of oil or cheese."),

(["how to make a high protein omelette", "high protein omelette", "protein omelette recipe idea"],
 "Use eggs with vegetables and add a protein-rich ingredient such as paneer, tofu, or low-fat cheese according to your preference."),

(["what is a healthy sandwich filling", "protein sandwich filling", "sandwich filling ideas"],
 "Egg, chicken, tuna, tofu, paneer, hummus, or cottage cheese can provide protein for a sandwich."),

(["can sandwich be a complete meal", "balanced sandwich", "sandwich as a meal"],
 "Yes. A sandwich can be a complete meal when it includes whole-grain bread, protein, vegetables, and a suitable amount of healthy fat."),

(["how to make a high fiber sandwich", "high fiber sandwich", "fiber rich sandwich"],
 "Use whole-grain bread, vegetables, legumes or hummus, and a protein filling to increase fiber."),

(["what is a healthy wrap", "healthy wrap ideas", "balanced wrap"],
 "Use a whole-grain wrap with protein, vegetables, and a moderate amount of sauce or healthy fat."),

(["what is a healthy bowl meal", "healthy bowl recipe idea", "balanced food bowl"],
 "Build a bowl with vegetables, a protein source, a whole-grain or other carbohydrate, and a moderate amount of healthy fat."),

(["how to make a protein bowl", "high protein bowl", "protein bowl ingredients"],
 "Combine a protein source such as chicken, tofu, eggs, fish, beans, or paneer with vegetables and a suitable carbohydrate."),

(["how to make a vegetarian protein bowl", "vegetarian protein bowl", "veg protein bowl"],
 "Use lentils, chickpeas, tofu, paneer, beans, or soy foods with vegetables and a whole grain."),

(["how to make a healthy smoothie bowl", "smoothie bowl nutrition", "balanced smoothie bowl"],
 "Use fruit with yogurt or another protein source and add seeds or nuts. Avoid excessive sweeteners and very large portions."),

(["what is a healthy dessert", "healthy dessert ideas", "nutritious dessert"],
 "Fruit with plain yogurt, baked fruit, or a modest portion of dark chocolate can be simple dessert choices."),

(["can fruit replace dessert", "fruit as dessert", "healthy dessert fruit"],
 "Yes. Whole fruit can be a nutritious dessert option and provides fiber, vitamins, minerals, and natural sweetness."),

(["what is a high protein dessert", "protein dessert ideas", "protein rich dessert"],
 "Plain Greek yogurt with fruit, cottage cheese with fruit, or a homemade yogurt-based dessert can provide protein."),

(["how can i reduce sugar in desserts", "lower sugar dessert", "reduce dessert sugar"],
 "Use whole fruit for sweetness, reduce added sugar gradually, and choose plain dairy or unsweetened ingredients where appropriate."),

(["what is a healthy birthday meal", "birthday food balance", "healthy celebration food"],
 "Celebration meals can include favorite foods in reasonable portions alongside vegetables, protein, and adequate fluids."),

(["can celebrations fit a healthy diet", "celebration eating", "healthy eating at parties"],
 "Yes. Occasional celebration foods can fit into an overall balanced eating pattern without requiring extreme restriction before or after."),

(["how to eat at a buffet", "healthy buffet eating", "buffet portion control"],
 "Survey the options first, prioritize vegetables and protein, take moderate portions, and choose foods you genuinely want rather than taking everything."),

(["how to eat healthy at a wedding", "wedding food nutrition", "healthy wedding eating"],
 "Enjoy the event while choosing reasonable portions, including vegetables or protein when available, and drinking fluids appropriately."),

(["what should i eat before a party", "pre party meal", "avoid overeating at party"],
 "Do not starve yourself before a party. A normal balanced meal or snack beforehand can reduce extreme hunger."),

(["what is a balanced cheat day alternative", "cheat day alternative", "flexible eating"],
 "A full cheat day is not necessary. Flexible portions of favorite foods can be included within normal meals."),

(["why are extreme diets hard to maintain", "extreme diet problems", "restrictive diet sustainability"],
 "Extreme diets often impose rules that are difficult to maintain and may make adequate nutrition and normal social eating harder."),

(["how can i avoid all or nothing eating", "all or nothing diet", "flexible nutrition"],
 "Focus on overall patterns rather than perfection. One higher-calorie meal does not require skipping meals or excessive exercise afterward."),

(["what is a realistic healthy eating habit", "simple nutrition habit", "easy healthy eating habit"],
 "A realistic habit could be adding one vegetable to lunch, drinking more water, or including a protein source at breakfast."),

(["how long does it take to build eating habits", "nutrition habit formation", "healthy eating habits"],
 "Habit formation varies widely. Repeating small, realistic behaviors consistently is more useful than expecting instant change."),

(["how can i stay consistent with diet", "diet consistency tips", "maintain healthy eating"],
 "Use simple meals, plan ahead, keep nutritious foods available, allow flexibility, and focus on habits you can maintain."),

(["why does motivation disappear during dieting", "diet motivation", "staying motivated with diet"],
 "Motivation naturally changes. Building routines and making goals realistic reduces dependence on motivation alone."),

(["what should i do if i miss my diet plan", "missed diet day", "diet mistake"],
 "Resume your normal eating routine at the next meal. Avoid compensating with extreme restriction or excessive exercise."),

(["can Nutri AI suggest meals", "Nutri AI meal suggestions", "does Nutri AI make meal plans"],
 "Nutri AI can provide general meal ideas based on user-provided preferences and goals, while avoiding medical diagnosis or treatment claims."),

(["can Nutri AI calculate calories", "Nutri AI calorie calculation", "does Nutri AI calculate calories"],
 "Nutri AI can estimate or organize calorie information when reliable food and portion data are available, but estimates may not be exact."),

(["can Nutri AI track water", "Nutri AI water tracking", "water tracker in Nutri AI"],
 "Yes. A nutrition app can record daily water intake and display progress toward a user-selected hydration target."),

(["can Nutri AI track meals", "Nutri AI meal tracker", "meal tracking in Nutri AI"],
 "Yes. Nutri AI can record meals and organize food entries so users can review their eating patterns."),

(["can Nutri AI track mood", "Nutri AI mood tracking", "mood tracker in Nutri AI"],
 "Yes. Nutri AI can allow users to record their current mood and compare it with their meal and lifestyle logs."),

(["can Nutri AI recommend food based on mood", "mood based food recommendation", "food recommendation from mood"],
 "Nutri AI can suggest general balanced food options based on a reported mood, but mood alone should not be treated as a medical diagnosis."),

(["can Nutri AI scan food", "Nutri AI food scanner", "food scanning feature"],
 "A food scanner can identify a packaged product using a barcode or image and display available nutrition information."),

(["what does a barcode scanner do", "barcode nutrition scanner", "food barcode feature"],
 "A barcode scanner can use a product identifier to retrieve available information such as calories, protein, carbohydrates, fat, and ingredients."),

(["what should Nutri AI show after scanning food", "food scan results", "nutrition scan information"],
 "A useful scan result can show serving size, calories, protein, carbohydrates, fat, fiber, sugar, sodium, ingredients, and general suitability information."),

(["what is NutriLens", "NutriLens meaning", "NutriLens feature"],
 "NutriLens can be designed as a food-analysis feature that presents nutrition information and a general health-oriented summary of a scanned food."),

(["can a food scanner know if food is healthy", "AI food health score", "food health score accuracy"],
 "A food score is an estimate based on selected nutrition criteria. It should explain the criteria rather than claiming that a food is universally healthy or unhealthy."),

(["can AI detect food ingredients", "AI ingredient detection", "food image ingredient recognition"],
 "AI can attempt to identify foods or ingredients from images, but image recognition can be uncertain and should not replace verified product labels."),

(["can face scan detect mood accurately", "AI face mood detection", "face emotion detection accuracy"],
 "Face-based emotion detection can be uncertain and should not be treated as a reliable medical or psychological assessment."),

(["should Nutri AI diagnose emotions", "emotion diagnosis by AI", "AI emotion diagnosis"],
 "No. Nutri AI should record self-reported mood or provide clearly limited wellness insights rather than diagnosing emotional or mental-health conditions."),

(["what disclaimer should Nutri AI use", "Nutri AI disclaimer", "nutrition app disclaimer"],
 "Nutri AI should state that its information is for general wellness and educational purposes and is not a substitute for professional medical advice."),

(["can Nutri AI replace a doctor", "AI nutrition doctor", "can AI replace doctor"],
 "No. Nutri AI can provide general nutrition and wellness information but should not replace a qualified healthcare professional."),

(["can Nutri AI replace a dietitian", "AI dietitian replacement", "can AI replace nutritionist"],
 "No. AI can provide general suggestions, but personalized clinical nutrition care should come from a qualified dietitian or healthcare professional."),

(["what is the purpose of Nutri AI", "Nutri AI purpose", "purpose of nutrition AI"],
 "Nutri AI is designed to help users understand food, nutrition, hydration, and general wellness through an interactive AI assistant."),

(["what information should Nutri AI collect", "Nutri AI user profile", "nutrition app profile information"],
 "Useful profile information can include age, activity level, dietary preference, goals, meals, hydration, and self-reported mood, while collecting only what is necessary."),

(["why is user privacy important in health apps", "health app privacy", "nutrition app data privacy"],
 "Health and wellness information can be sensitive, so apps should minimize data collection, protect stored information, and clearly explain how data is used."),

(["should Nutri AI store health data", "nutrition app health data", "Nutri AI data storage"],
 "Only necessary data should be stored, with appropriate security and clear user consent and privacy practices."),

(["what is personalized nutrition", "personalized diet meaning", "custom nutrition"],
 "Personalized nutrition adapts general food guidance to factors such as goals, preferences, activity, and relevant health information."),

(["why should Nutri AI ask dietary preference", "diet preference in Nutri AI", "vegetarian preference"],
 "Dietary preference helps Nutri AI suggest foods that match what the user is willing or able to eat."),

(["why should Nutri AI ask activity level", "activity level nutrition", "why track activity level"],
 "Activity level affects estimated energy needs and helps make general nutrition suggestions more relevant."),

(["why should Nutri AI ask health goal", "nutrition goal in Nutri AI", "why ask weight goal"],
 "Knowing whether the user wants to maintain weight, lose weight, gain weight, or improve general nutrition helps tailor general suggestions."),

(["what is a nutrition recommendation", "nutrition recommendation meaning", "food recommendation meaning"],
 "A nutrition recommendation is general guidance about food choices, portions, or eating patterns based on available information."),

(["what is a food database", "nutrition food database", "food database meaning"],
 "A food database stores information such as calories, nutrients, serving sizes, ingredients, and product details for foods."),

(["why does Nutri AI need food data", "nutrition dataset purpose", "why use training data"],
 "Food and nutrition data helps the system recognize common questions and provide consistent responses for known topics."),

(["what is training data in Nutri AI", "Nutri AI training data", "why add training questions"],
 "Training data in this rule-based setup consists of trigger phrases and responses that help the chat system match user questions to appropriate answers."),

(["does adding more questions improve matching", "more training data", "adding questions to Nutri AI"],
 "Adding diverse, relevant trigger phrases can improve matching for a rule-based chatbot, provided the entries are accurate and do not create conflicting matches."),

(["what happens if two triggers match", "duplicate chatbot triggers", "conflicting training data"],
 "If multiple entries match the same user message, the chat engine's matching logic determines which response is selected. Duplicate or overlapping triggers should therefore be minimized."),

(["why use multiple trigger phrases", "multiple chatbot triggers", "trigger phrase purpose"],
 "Multiple trigger phrases help the chatbot recognize different ways users can ask the same question."),

(["what is fallback response", "chatbot fallback meaning", "fallback response purpose"],
 "A fallback response is used when the user's message does not match any known training trigger."),

(["how can i improve Nutri AI fallback", "better chatbot fallback", "fallback response improvement"],
 "A useful fallback can politely explain the supported topics and ask the user to rephrase the question or provide a nutrition-related query."),

(["should nutrition answers be short", "short nutrition responses", "chatbot answer length"],
 "For a chatbot, concise answers are usually easier to read, while important limitations or safety information should still be included."),

(["why should nutrition answers avoid diagnosis", "nutrition chatbot safety", "medical diagnosis in nutrition AI"],
 "Nutrition chatbots should avoid diagnosing diseases because symptoms and medical conditions require proper clinical assessment."),

(["can Nutri AI give medical treatment", "Nutri AI treatment advice", "AI medical treatment"],
 "Nutri AI should provide general wellness information rather than prescribing medical treatment."),

(["what should Nutri AI do for serious symptoms", "serious symptoms nutrition app", "health emergency chatbot"],
 "For severe or urgent symptoms, Nutri AI should encourage the user to seek appropriate medical care rather than attempting to diagnose or treat the condition."),

(["what is evidence based nutrition", "evidence based diet", "nutrition evidence meaning"],
 "Evidence-based nutrition uses reliable scientific research, established dietary guidance, and appropriate clinical evidence rather than unsupported claims."),

(["why should nutrition claims be cautious", "nutrition misinformation", "avoid nutrition myths"],
 "Nutrition information can be oversimplified or misleading. Claims should be supported by reliable evidence and presented with appropriate uncertainty."),

(["is detox diet necessary", "detox diet meaning", "do detox diets work"],
 "The body already has organs that process and remove waste. Extreme detox diets are not necessary for routine health."),

(["does detox water remove toxins", "detox water", "does detox drink detox body"],
 "Infused water can help with hydration, but there is no special detox effect that removes toxins beyond the body's normal processes."),

(["does lemon water detox the body", "lemon water detox", "lemon water toxins"],
 "Lemon water can be a refreshing source of fluids, but it does not have a special ability to detoxify the body."),

(["does apple cider vinegar burn fat", "apple cider vinegar weight loss", "ACV fat burning"],
 "Apple cider vinegar is not a magic fat-burning food. Any effect on weight is likely small, and excessive intake can cause problems."),

(["is apple cider vinegar healthy", "ACV health", "can i drink apple cider vinegar"],
 "Apple cider vinegar can be used in food, but concentrated or excessive intake can irritate the digestive tract and damage tooth enamel."),

(["does warm water burn fat", "warm water weight loss", "hot water and fat burning"],
 "Warm water does not directly burn body fat. Hydration can support normal body function, but fat loss depends on overall energy balance."),

(["does green tea detox the body", "green tea detox", "green tea toxins"],
 "Green tea provides plant compounds and can contribute to hydration, but it does not provide a special detoxification process."),

(["what is a superfood", "superfood meaning", "are superfoods real"],
 "Superfood is a marketing term rather than a scientific category. Many ordinary foods can contribute valuable nutrients as part of a varied diet."),

(["is one food enough for health", "single food diet", "can one food provide everything"],
 "No single food provides every nutrient the body needs. Variety is important for a balanced diet."),

(["why is food variety important", "diet diversity", "variety in healthy eating"],
 "Eating a variety of foods helps provide different nutrients and plant compounds and makes the overall diet more balanced."),

(["can i eat the same meal every day", "same food daily", "repeating meals"],
 "You can repeat convenient meals, but including some variety helps cover a broader range of nutrients and food groups."),

(["what is a nutrient gap", "nutrition gap meaning", "dietary nutrient gap"],
 "A nutrient gap occurs when an eating pattern consistently provides less of a nutrient than the body needs."),

(["how can i identify a nutrient gap", "find nutrient deficiency", "nutrition deficiency check"],
 "Food records and, when appropriate, professional assessment or laboratory testing can help identify nutrient gaps."),

(["can blood tests show nutrient deficiency", "nutrient blood test", "testing vitamin deficiency"],
 "Some nutrient deficiencies can be assessed using blood tests, but the appropriate test depends on the nutrient and clinical situation."),

(["should i take iron without testing", "iron supplement without test", "iron tablets need doctor"],
 "Do not assume you need iron supplements without appropriate guidance because excess iron can be harmful."),

(["should i take vitamin d supplements", "vitamin d supplement need", "vitamin d tablets"],
 "Vitamin D supplementation depends on factors such as diet, sunlight exposure, age, health, and blood levels. Professional guidance can be useful."),

(["should i take b12 supplements as a vegan", "vegan b12", "vitamin b12 for vegans"],
 "People following a vegan diet generally need a reliable vitamin B12 source, often through fortified foods or supplements."),

(["what is fortified cereal", "fortified cereal meaning", "cereal with vitamins"],
 "Fortified cereal has selected vitamins or minerals added during manufacturing to increase its nutrient content."),

(["are breakfast cereals healthy", "cereal nutrition", "can i eat cereal for breakfast"],
 "Some cereals are nutritious while others are high in added sugar and low in fiber. Compare labels for whole grains, fiber, protein, and added sugar."),

(["how to choose healthy cereal", "healthy cereal label", "best breakfast cereal"],
 "Look for higher fiber and lower added sugar, and check that whole grains are prominent in the ingredient list."),

(["what is muesli", "muesli nutrition", "is muesli healthy"],
 "Muesli is typically a mixture of grains, nuts, seeds, and dried fruit. Nutritional quality depends on the ingredients and added sugar."),

(["is granola healthy", "granola nutrition", "can i eat granola"],
 "Granola can contain oats, nuts, and seeds but may also contain substantial added sugar and oil. Check the label and portion size."),

(["granola vs oats", "compare granola and oats", "oats or granola"],
 "Plain oats generally contain less added sugar and oil than many granolas. Granola can still fit into a diet when portions and ingredients are considered."),

(["what is a healthy cereal topping", "cereal toppings", "healthy oats toppings"],
 "Fruit, plain yogurt, nuts, seeds, and cinnamon can add nutrients and flavor to cereal or oats."),

(["can i eat nuts before workout", "nuts before exercise", "nuts pre workout"],
 "Nuts provide fat and protein but digest more slowly than carbohydrate-rich foods. A small portion may work depending on timing and tolerance."),

(["can i eat yogurt before workout", "yogurt pre workout", "yogurt before gym"],
 "Yogurt can provide protein and carbohydrate and may work well before exercise if you tolerate dairy."),

(["can i eat curd before workout", "curd before gym", "curd pre workout"],
 "Plain curd can provide protein and some carbohydrate. Choose a portion and timing that feels comfortable before exercise."),

(["can i eat eggs before workout", "egg before gym", "eggs pre workout"],
 "Eggs provide protein but relatively little carbohydrate. They can work before exercise when included in a meal with suitable carbohydrate."),

(["can i eat rice before workout", "rice pre workout", "rice before gym"],
 "Rice provides carbohydrate and can be useful before exercise, especially when paired with a suitable protein source."),

(["can i eat roti before workout", "roti pre workout", "roti before gym"],
 "Roti provides carbohydrate and can be included in a pre-workout meal with a suitable protein source."),

(["can i eat dal before workout", "dal pre workout", "lentils before gym"],
 "Dal provides protein and carbohydrate but also fiber, which may feel heavy close to exercise. Allow enough digestion time."),

(["what foods are good after running", "post running nutrition", "food after run"],
 "After running, combine carbohydrate and protein with fluids to support energy recovery and tissue repair."),

(["what foods are good after gym", "post gym meal", "gym recovery food"],
 "A balanced post-gym meal can include protein, carbohydrate, vegetables or fruit, and adequate fluids."),

(["is milk good for muscle recovery", "milk muscle recovery", "milk after strength training"],
 "Milk provides protein and carbohydrate and can be a convenient recovery drink after exercise."),

(["is chocolate milk good after workout", "chocolate milk post workout", "chocolate milk recovery"],
 "Chocolate milk provides carbohydrate and protein, but it also contains added sugar. It can be an occasional recovery option depending on the workout and overall diet."),

(["what is hydration status", "hydration status meaning", "how to check hydration"],
 "Hydration status describes how much fluid the body has available. Thirst, urine color, body weight changes, and symptoms can provide clues, but they are not perfect measures."),

(["why do i feel thirsty after salty food", "salt and thirst", "thirst after salty food"],
 "High sodium intake can increase thirst because sodium affects fluid balance."),

(["why do i feel thirsty after exercise", "thirst after workout", "exercise thirst"],
 "Exercise increases fluid loss through sweating, so thirst can increase as the body signals a need for fluids."),

(["what is sweat", "sweating nutrition", "what does sweat contain"],
 "Sweat is mostly water and also contains electrolytes such as sodium and chloride. The amount varies with the person and conditions."),

(["why do people sweat differently", "different sweating rates", "why do i sweat more"],
 "Sweating varies with temperature, humidity, fitness, genetics, body size, clothing, exercise intensity, and acclimatization."),

(["what is sodium replacement", "replace electrolytes after sweating", "electrolyte replacement"],
 "After substantial sweating, replacing fluids and electrolytes may be useful. The amount needed depends on sweat losses and exercise conditions."),

(["can coconut water replace an electrolyte drink", "coconut water vs sports drink", "coconut water electrolytes"],
 "Coconut water provides some electrolytes and carbohydrate but has a different composition from many sports drinks. Suitability depends on the exercise situation."),

(["is plain water enough during gym", "water during gym", "do i need sports drink at gym"],
 "For many ordinary gym sessions, plain water is sufficient. Longer, intense, or very hot sessions may require additional fluids or electrolytes."),

(["what should i eat on a rest day", "rest day nutrition", "food on non workout days"],
 "Continue eating balanced meals on rest days. Energy needs may be somewhat different depending on activity, but protein and nutrient intake remain important."),

(["should i reduce carbs on rest days", "rest day carbohydrates", "carbs on non workout days"],
 "Carbohydrate needs may change with activity, but there is no universal need to eliminate or drastically reduce carbohydrates on rest days."),

(["should protein stay same on rest days", "protein on rest day", "rest day protein"],
 "Protein needs do not disappear on rest days because recovery and tissue maintenance continue."),

(["what is a recovery day", "rest day meaning", "exercise recovery day"],
 "A recovery day is a period of reduced training that allows the body to recover from exercise stress."),

(["why is rest important for muscle", "rest and muscle growth", "muscle recovery rest"],
 "Muscles adapt and recover during periods of rest, making recovery an important part of a training plan."),

(["what are signs of overtraining", "overtraining symptoms", "too much exercise"],
 "Persistent fatigue, declining performance, poor sleep, irritability, and prolonged soreness can be warning signs of excessive training. Professional evaluation may be appropriate."),

(["can too much exercise affect appetite", "excessive exercise appetite", "overtraining and hunger"],
 "High training loads can alter appetite differently between people and may increase energy needs."),

(["what is energy balance", "energy balance meaning", "calories in calories out"],
 "Energy balance describes the relationship between energy consumed from food and energy used by the body and physical activity."),

(["why does calorie need vary", "daily calorie needs", "what changes calorie requirements"],
 "Energy needs vary with age, body size, sex, activity, muscle mass, growth, and other individual factors."),

(["why do taller people need more calories", "height and calorie needs", "body size and calories"],
 "Larger bodies generally require more energy to maintain tissues and perform daily activities, although individual needs vary."),

(["does muscle increase calorie needs", "muscle and calorie requirement", "muscle mass energy needs"],
 "Muscle tissue contributes to resting energy expenditure, so greater muscle mass can modestly increase energy needs."),

(["what is basal metabolic rate", "BMR meaning", "basal metabolism"],
 "Basal metabolic rate is the energy the body uses at rest to maintain essential physiological functions."),

(["what is total daily energy expenditure", "TDEE meaning", "daily calorie expenditure"],
 "Total daily energy expenditure includes resting metabolism, physical activity, digestion, and other daily energy use."),

(["what is activity level in nutrition", "activity level meaning", "why activity level matters"],
 "Activity level describes how much physical movement and exercise a person typically performs and helps estimate energy needs."),

(["what is sedentary lifestyle", "sedentary meaning", "sedentary behavior"],
 "Sedentary behavior involves prolonged periods of sitting or very low energy expenditure, such as long periods at a desk."),

(["how can students reduce sitting time", "student movement tips", "reduce sitting while studying"],
 "Stand during breaks, walk between study sessions, use stairs when practical, and add short movement periods throughout the day."),

(["what is a healthy study routine", "nutrition study routine", "healthy routine for students"],
 "A healthy study routine can include regular meals, adequate hydration, sleep, movement breaks, and nutrient-rich snacks when hungry."),

(["what should i eat before an exam", "exam day breakfast", "food before exam"],
 "Choose a familiar balanced meal with protein and carbohydrate, hydrate normally, and avoid experimenting with unfamiliar foods immediately before an exam."),

(["what should i eat during an exam", "exam snack", "food during long exam"],
 "For a long exam, a simple snack such as fruit, nuts, or a small sandwich can be useful if food is permitted and you are hungry."),

(["does caffeine improve studying", "caffeine for studying", "coffee while studying"],
 "Caffeine can temporarily increase alertness, but excessive intake can cause anxiety, rapid heartbeat, or sleep problems."),

(["how late should i avoid caffeine", "caffeine cutoff time", "coffee before sleep"],
 "Avoid caffeine several hours before bedtime if it affects your sleep. Sensitivity varies between people."),

(["can lack of sleep increase cravings", "sleep deprivation cravings", "sleep and sugar cravings"],
 "Sleep loss can affect appetite regulation and may increase cravings for high-energy foods in some people."),

(["why do i crave junk food when stressed", "stress junk food cravings", "stress and fast food"],
 "Stress can increase preference for highly palatable foods in some people. Regular meals, sleep, and alternative coping strategies can help."),

(["what is a healthy stress snack", "stress snack ideas", "food during stress"],
 "Choose a satisfying snack containing protein or fiber, such as yogurt with fruit, nuts, or roasted chickpeas."),

(["can hydration affect mood", "water and mood", "hydration and emotions"],
 "Dehydration can contribute to discomfort and fatigue, which may affect how you feel. Adequate hydration supports normal body function."),

(["what foods contain tryptophan", "tryptophan food sources", "foods with tryptophan"],
 "Tryptophan is an amino acid found in foods such as eggs, dairy, poultry, fish, soy, nuts, and seeds."),

(["what is tryptophan used for", "tryptophan function", "why is tryptophan important"],
 "Tryptophan is an essential amino acid used to make proteins and serves as a precursor for several important compounds."),

(["what foods contain tyrosine", "tyrosine food sources", "foods with tyrosine"],
 "Tyrosine is found in protein-rich foods such as dairy, eggs, meat, fish, soy, nuts, and seeds."),

(["what is an amino acid", "amino acid meaning", "why are amino acids important"],
 "Amino acids are building blocks of proteins and are required for many functions in the body."),

(["what are essential amino acids", "essential amino acid meaning", "EAA meaning"],
 "Essential amino acids cannot be made in sufficient amounts by the body and therefore must come from food."),

(["what are branched chain amino acids", "BCAA meaning", "what are BCAAs"],
 "Branched-chain amino acids are leucine, isoleucine, and valine. They are found naturally in protein-rich foods."),

(["do i need BCAA supplements", "BCAA supplement necessity", "are BCAA supplements needed"],
 "Most people who consume enough high-quality protein do not need separate BCAA supplements."),

(["what is leucine", "leucine importance", "leucine in protein"],
 "Leucine is an essential amino acid that plays an important role in stimulating muscle protein synthesis."),

(["which foods contain leucine", "leucine rich foods", "foods high in leucine"],
 "Dairy, eggs, meat, fish, soy, and other protein-rich foods provide leucine."),

(["what is collagen", "collagen meaning", "what does collagen do"],
 "Collagen is a structural protein found in connective tissues such as skin, bones, tendons, and cartilage."),

(["what foods provide collagen", "collagen food sources", "foods with collagen"],
 "Animal connective tissues, skin, bones, and certain collagen-containing foods provide collagen. The body also makes collagen from amino acids."),

(["does vitamin c help collagen", "vitamin c and collagen", "collagen vitamin c"],
 "Vitamin C is required for normal collagen synthesis."),

(["what is bone health nutrition", "foods for bones", "nutrition for strong bones"],
 "Calcium, vitamin D, protein, phosphorus, magnesium, and regular weight-bearing activity all contribute to bone health."),

(["what foods support bone health", "bone healthy foods", "foods for strong bones"],
 "Dairy or fortified alternatives, leafy greens, tofu made with calcium, fish with edible bones, nuts, and seeds can contribute nutrients for bone health."),

(["what is muscle health nutrition", "foods for muscle health", "nutrition for muscles"],
 "Muscle health depends on adequate protein, energy, micronutrients, hydration, resistance exercise, and recovery."),

(["what is immune system nutrition", "foods for immune health", "nutrition for immunity"],
 "Adequate protein, vitamins, minerals, fruits, vegetables, whole grains, and overall dietary variety support normal immune function."),

(["does vitamin c prevent colds", "vitamin c and cold", "can vitamin c prevent illness"],
 "Vitamin C is important for normal immune function, but taking extra vitamin C does not guarantee prevention of common colds."),

(["what foods contain antioxidants for immunity", "antioxidant foods for immunity", "immune supportive foods"],
 "Fruits, vegetables, nuts, seeds, legumes, and whole grains provide many nutrients and plant compounds that support normal health."),

(["can food boost immunity instantly", "instant immunity food", "food that boosts immunity fast"],
 "No single food can instantly boost immunity. Adequate nutrition, sleep, physical activity, and other healthy habits support normal immune function."),

(["what is inflammation", "inflammation meaning", "why does inflammation happen"],
 "Inflammation is a normal biological response involved in immune defense and tissue repair. Persistent inflammation can have many causes."),

(["what foods are anti inflammatory", "anti inflammatory foods", "foods for inflammation"],
 "Foods such as vegetables, fruits, whole grains, legumes, nuts, seeds, and fatty fish provide nutrients and compounds associated with healthy dietary patterns."),

(["does turmeric cure inflammation", "turmeric inflammation", "curcumin inflammation"],
 "Turmeric contains curcumin and other compounds, but it should not be treated as a cure for inflammatory diseases."),

(["what is heart healthy eating", "heart healthy diet", "foods for heart health"],
 "A heart-supportive eating pattern emphasizes vegetables, fruits, whole grains, legumes, nuts, fish, and unsaturated fats while limiting excess sodium, saturated fat, and added sugar."),

(["what foods support heart health", "heart healthy foods", "foods good for heart"],
 "Vegetables, fruits, legumes, whole grains, nuts, seeds, fish, and unsaturated plant oils can be part of a heart-supportive diet."),

(["what is blood pressure nutrition", "diet for blood pressure", "foods and blood pressure"],
 "A diet rich in vegetables, fruits, whole grains, legumes, and appropriate protein can support healthy blood pressure. Sodium intake is also relevant."),

(["what is DASH diet", "DASH diet meaning", "DASH eating plan"],
 "The DASH eating pattern emphasizes vegetables, fruits, whole grains, legumes, nuts, low-fat dairy, and appropriate protein while limiting excess sodium."),

(["what is Mediterranean diet", "Mediterranean diet meaning", "Mediterranean eating pattern"],
 "The Mediterranean eating pattern emphasizes vegetables, fruits, whole grains, legumes, nuts, olive oil, fish, and moderate amounts of other foods."),

(["what is a high fiber diet", "high fiber eating", "fiber rich diet"],
 "A high-fiber diet emphasizes vegetables, fruits, legumes, whole grains, nuts, and seeds and should be increased gradually."),

(["what is a high protein diet", "high protein eating", "protein rich diet"],
 "A high-protein diet provides a larger proportion of energy from protein. Appropriate intake depends on individual goals, health, and total diet."),

(["is high protein safe for everyone", "high protein diet safety", "too much protein"],
 "Protein needs vary. People with certain medical conditions may need individualized protein guidance from a healthcare professional."),

(["what is a low carb diet", "low carbohydrate diet meaning", "low carb eating"],
 "A low-carbohydrate diet limits carbohydrate-rich foods to varying degrees and emphasizes protein, fats, and lower-carbohydrate foods."),

(["is low carb necessary for weight loss", "low carb weight loss", "do i need low carb"],
 "Low-carbohydrate eating is not required for weight loss. A sustainable calorie deficit and adequate nutrition are more important."),

(["what is keto diet", "ketogenic diet meaning", "keto diet basics"],
 "A ketogenic diet is very low in carbohydrates and high in fat, designed to produce nutritional ketosis. It is restrictive and may not suit everyone."),

(["is keto diet healthy for everyone", "keto diet safety", "should everyone follow keto"],
 "No. Ketogenic diets are not appropriate for everyone and can require professional guidance, particularly with certain health conditions or medications."),

(["what is vegetarian protein planning", "vegetarian protein diet", "protein planning for vegetarians"],
 "Vegetarian protein planning can include lentils, beans, dairy, eggs, soy foods, nuts, seeds, and whole grains across the day."),

(["what is vegan protein planning", "vegan protein diet", "protein planning for vegans"],
 "Vegan protein planning can use lentils, beans, tofu, tempeh, soy milk, peas, nuts, seeds, and whole grains."),

(["what is balanced vegan meal", "vegan balanced meal", "healthy vegan plate"],
 "A balanced vegan meal can include legumes or soy protein, vegetables, whole grains or another carbohydrate, healthy fats, and appropriate fortified foods."),

(["what is balanced vegetarian meal", "vegetarian balanced meal", "healthy vegetarian plate"],
 "A balanced vegetarian meal can include legumes, dairy or eggs if consumed, vegetables, whole grains, fruit, and healthy fats."),

(["what is a balanced non vegetarian meal", "non veg balanced meal", "healthy non veg plate"],
 "A balanced non-vegetarian meal can include fish, chicken, eggs, or another protein with vegetables, whole grains or other carbohydrates, and healthy fats."),

(["how can i reduce meat intake", "eat less meat", "reduce meat consumption"],
 "Replace some meat meals with lentils, beans, tofu, tempeh, eggs, or other protein-rich foods while keeping meals balanced."),

(["is eating red meat healthy", "red meat nutrition", "can i eat red meat"],
 "Red meat provides protein, iron, zinc, and vitamin B12. Leaner cuts and moderate portions can fit into a varied diet."),

(["what is processed meat", "processed meat meaning", "examples of processed meat"],
 "Processed meat has been transformed through methods such as curing, smoking, salting, or adding preservatives. Examples include some sausages, bacon, and deli meats."),

(["why limit processed meat", "processed meat health", "processed meat concerns"],
 "Frequent high intake of processed meat is associated with health risks, so it is generally better to keep it limited."),

(["what is lean meat", "lean meat meaning", "examples of lean meat"],
 "Lean meat provides protein with relatively less visible fat. Skinless poultry and some lean cuts of meat are examples."),

(["what are healthy protein choices", "best protein foods", "protein food options"],
 "Protein choices include eggs, fish, chicken, dairy, tofu, tempeh, lentils, beans, chickpeas, nuts, and seeds."),

(["what is a protein rich vegetarian breakfast", "vegetarian protein breakfast", "veg high protein breakfast"],
 "Options include eggs if eaten, Greek yogurt with seeds, tofu scramble, or vegetable poha with legumes or peanuts."),

(["what is a protein rich vegan breakfast", "vegan protein breakfast", "vegan high protein breakfast"],
 "Options include tofu scramble, soy yogurt, oats with soy milk and seeds, or a bean-based breakfast."),

(["what is a healthy protein dinner", "high protein dinner", "protein rich dinner"],
 "A protein-rich dinner can include fish, chicken, eggs, tofu, paneer, lentils, or beans with vegetables and a suitable carbohydrate."),

(["what is a healthy protein lunch", "high protein lunch", "protein rich lunch"],
 "A protein-rich lunch can include dal, beans, chicken, fish, eggs, tofu, paneer, or yogurt with vegetables and whole grains."),

(["what is a protein rich snack without meat", "vegetarian protein snack", "meatless protein snack"],
 "Greek yogurt, cottage cheese, roasted chickpeas, soy foods, nuts, seeds, or boiled eggs can provide protein without meat."),

(["what is a vegan protein snack", "vegan protein snack", "plant protein snack"],
 "Roasted chickpeas, edamame, soy yogurt, nuts, seeds, or hummus with vegetables can provide plant protein."),

(["what is a low calorie snack", "low calorie snack ideas", "light snack"],
 "Fruit, cucumber, carrots, air-popped popcorn, or plain vegetables can be relatively light snack choices."),

(["what is a high calorie healthy food", "healthy calorie dense foods", "energy dense nutritious foods"],
 "Nuts, seeds, avocado, nut butter, and some dried fruits provide substantial energy along with useful nutrients."),

(["how can i add calories healthily", "increase calories with healthy food", "healthy weight gain foods"],
 "Add nutrient-dense foods such as nuts, seeds, nut butter, dairy, avocado, whole grains, and legumes while maintaining balanced meals."),

(["how can i reduce calories without hunger", "lower calories and fullness", "reduce calories while staying full"],
 "Prioritize vegetables, fruit, lean protein, legumes, whole grains, and adequate fluids, and reduce calorie-dense extras gradually."),

(["what is volume eating", "volume eating meaning", "high volume foods"],
 "Volume eating emphasizes foods with high water or fiber content and relatively low calorie density to create filling meals."),

(["is soup filling", "soup and fullness", "healthy soup"],
 "Soups containing vegetables, legumes, and protein can be filling. Cream, excess oil, and salt can substantially change the nutrition profile."),

(["what is a healthy soup", "healthy soup ingredients", "nutritious soup"],
 "A nutritious soup can include vegetables, legumes or lean protein, whole grains if desired, herbs, and moderate salt and oil."),

(["can soup replace dinner", "soup as a meal", "is soup enough for dinner"],
 "Soup can be a complete meal when it contains adequate protein, vegetables, and a suitable carbohydrate source."),

(["what is a healthy breakfast for weight loss", "weight loss breakfast", "breakfast for fat loss"],
 "A filling breakfast can include protein, fiber, fruit or vegetables, and a portion appropriate for your overall energy needs."),

(["what is a healthy lunch for weight loss", "weight loss lunch", "lunch for fat loss"],
 "Choose a meal centered on vegetables and protein with a suitable carbohydrate portion and moderate added fats."),

(["what is a healthy dinner for weight loss", "weight loss dinner", "dinner for fat loss"],
 "A balanced dinner can emphasize vegetables and protein while keeping calorie-dense ingredients and portions appropriate."),

(["what is a healthy breakfast for weight gain", "weight gain breakfast", "breakfast for gaining weight"],
 "Use nutrient-dense foods such as oats with milk, nuts, seeds, eggs, yogurt, and fruit to increase energy intake without relying mainly on junk food."),

(["what is a healthy lunch for weight gain", "weight gain lunch", "lunch for gaining weight"],
 "Include adequate portions of rice or roti, protein foods, vegetables, dairy or alternatives, and healthy fats such as nuts or seeds."),

(["what is a healthy dinner for weight gain", "weight gain dinner", "dinner for gaining weight"],
 "A weight-gain dinner can include a larger balanced portion of carbohydrates, protein, vegetables, and healthy fats."),

(["how can i gain weight without junk food", "healthy weight gain", "gain weight naturally"],
 "Increase portions gradually and use nutrient-dense foods such as dairy, nuts, seeds, legumes, whole grains, eggs, and healthy oils."),

(["how can i lose weight without skipping meals", "weight loss without meal skipping", "healthy fat loss"],
 "Use appropriate portions, prioritize protein and fiber, reduce excess calorie-dense foods, and maintain regular meals if that helps control hunger."),

(["why is protein useful during weight loss", "protein during fat loss", "protein weight loss"],
 "Protein can support fullness and help preserve lean tissue when combined with resistance training and an appropriate calorie deficit."),

(["why is fiber useful during weight loss", "fiber during fat loss", "fiber weight management"],
 "Fiber can increase fullness and improve meal volume, making it useful in a calorie-controlled eating pattern."),

(["what should i eat before sleeping if hungry", "hungry before bed", "bedtime hunger snack"],
 "If you are genuinely hungry, choose a small balanced snack such as plain yogurt, milk, or fruit with a modest portion of nuts."),

(["why am i hungry at night", "night hunger", "late night hunger reasons"],
 "Night hunger can result from inadequate food earlier in the day, high activity, habits, stress, or sleep patterns."),

(["how can i stop late night snacking", "night snacking control", "avoid late night eating"],
 "Eat balanced meals during the day, include enough protein and fiber, identify triggers, and keep highly tempting snack foods less accessible."),

(["is eating after dinner bad", "after dinner eating", "snacking after dinner"],
 "Eating after dinner is not automatically unhealthy. Consider whether you are genuinely hungry and whether the snack fits your overall intake."),

(["what is a healthy bedtime routine for nutrition", "bedtime nutrition routine", "healthy night routine"],
 "Finish large meals with enough time before sleep, stay appropriately hydrated, and avoid excessive caffeine late in the day."),

(["does alcohol provide calories", "alcohol calories", "calories in alcohol"],
 "Alcohol provides energy but relatively few essential nutrients. Alcoholic drinks can also contain added sugar depending on the beverage."),

(["can alcohol affect nutrition", "alcohol and diet", "alcohol nutrition effects"],
 "Alcohol can add calories, affect appetite and food choices, and interfere with sleep and recovery."),

(["should i drink alcohol after workout", "alcohol after gym", "alcohol and exercise recovery"],
 "Alcohol can interfere with hydration, sleep, and recovery, so it is not an ideal post-workout choice."),

(["what is a mocktail", "mocktail meaning", "non alcoholic drink"],
 "A mocktail is a non-alcoholic mixed drink. It can still contain substantial added sugar depending on the ingredients."),

(["healthy drink instead of alcohol", "non alcoholic healthy drinks", "alcohol alternatives"],
 "Sparkling water with lemon, unsweetened iced tea, or a low-sugar mocktail can be alternatives to alcoholic drinks."),

(["what is hydration in winter", "winter water intake", "do i need water in winter"],
 "You still need fluids in cold weather even if thirst feels lower. Water, soups, and other unsweetened drinks can contribute."),

(["does cold weather reduce thirst", "thirst in winter", "winter thirst"],
 "Cold weather can reduce the sensation of thirst for some people, so regular drinking habits can help maintain hydration."),

(["can soup count as fluids", "soup hydration", "does soup count toward water"],
 "Soups contain water and can contribute to fluid intake, although their sodium content varies."),

(["can fruits count toward hydration", "fruit hydration", "water from fruits"],
 "Water-rich fruits contribute to total fluid intake along with drinking water and other beverages."),

(["can vegetables count toward hydration", "vegetable hydration", "water in vegetables"],
 "Many vegetables contain substantial water and can contribute to overall hydration."),

(["what is a hydration goal", "daily hydration goal", "water target"],
 "A hydration goal is an approximate daily fluid target based on individual needs, activity, climate, and dietary factors."),

(["should everyone drink eight glasses of water", "eight glasses water rule", "water eight glasses"],
 "There is no single exact amount that suits everyone. Fluid needs vary with body size, activity, climate, diet, and health."),

(["how much water should i drink during summer", "summer water requirement", "water in hot weather"],
 "Fluid needs often increase with heat and sweating. Drink regularly and adjust intake according to thirst and activity."),

(["how much water should i drink during exercise", "water during physical activity", "exercise water needs"],
 "Drink according to thirst and exercise conditions. Longer or hotter sessions may require more deliberate fluid and electrolyte replacement."),

(["what is a healthy morning routine", "morning nutrition routine", "healthy morning habits"],
 "A healthy morning can include hydration, a balanced breakfast if desired, movement, and a consistent sleep-wake routine."),

(["should i drink water immediately after waking", "water after waking", "morning water"],
 "Drinking water after waking can contribute to daily hydration, but there is no requirement for a special detox effect."),

(["is warm water better than cold water", "warm vs cold water", "best water temperature"],
 "Both warm and cold water hydrate the body. The best temperature is largely a matter of comfort and preference."),

(["can drinking water help control appetite", "water and appetite", "water before eating"],
 "Drinking water can support hydration and may reduce thirst that feels like hunger, but it should not be relied on as a primary weight-loss strategy."),

(["what is a healthy hydration habit", "hydration routine", "good water drinking habits"],
 "Keep water accessible, drink regularly, increase attention during heat or exercise, and respond to thirst."),

(["why is fiber important for digestion", "fiber digestion benefits", "fiber and bowel health"],
 "Fiber adds bulk and can support regular bowel movements and a healthy digestive system."),

(["can fruit help constipation", "fruit for constipation", "high fiber fruit"],
 "Fruits such as pears, berries, kiwi, and apples provide fiber and can support regular bowel movements."),

(["can oats help constipation", "oats for constipation", "fiber from oats"],
 "Oats provide soluble fiber and can contribute to a diet that supports normal bowel function."),

(["can chia seeds help bowel movements", "chia seeds constipation", "chia fiber digestion"],
 "Chia seeds provide substantial fiber and can support regularity when consumed with adequate fluids."),

(["what foods help regular digestion", "foods for regular digestion", "digestive health foods"],
 "Fiber-rich fruits, vegetables, legumes, whole grains, nuts, seeds, adequate fluids, and regular physical activity can support digestion."),

(["what is a healthy gut microbiome", "gut microbiome meaning", "gut bacteria health"],
 "The gut microbiome is the community of microorganisms living in the digestive tract. Diet, lifestyle, medications, and other factors influence it."),

(["how does fiber feed gut bacteria", "fiber gut bacteria", "prebiotic fiber"],
 "Certain fibers are fermented by gut microorganisms and can produce short-chain fatty acids and other metabolites."),

(["what are fermented vegetables", "fermented vegetable foods", "examples of fermented vegetables"],
 "Fermented vegetables include foods such as kimchi and sauerkraut. Their nutrition varies, and some can be high in sodium."),

(["is kimchi healthy", "kimchi benefits", "can i eat kimchi"],
 "Kimchi provides vegetables and fermented components, but it can also be high in sodium. Portion and overall diet matter."),

(["is sauerkraut healthy", "sauerkraut benefits", "can i eat sauerkraut"],
 "Sauerkraut provides cabbage and fermented components but may be high in sodium depending on preparation."),

(["what is kefir good for", "kefir nutrition", "kefir and gut health"],
 "Kefir provides protein and calcium and may contain live cultures that can contribute to gut health."),

(["what is probiotic yogurt", "probiotic yogurt meaning", "yogurt with probiotics"],
 "Probiotic yogurt contains selected live microorganisms. The specific strains and amounts vary by product."),

(["how to choose probiotic food", "probiotic food selection", "best probiotic foods"],
 "Choose foods with clearly listed live cultures and appropriate storage, while remembering that effects depend on the specific microorganism and person."),

(["what is prebiotic fiber", "prebiotic fiber meaning", "foods with prebiotic fiber"],
 "Prebiotic fiber is a type of dietary carbohydrate that beneficial gut microorganisms can use as a food source."),

(["what is resistant starch good for", "resistant starch benefits", "resistant starch and gut"],
 "Resistant starch can be fermented by gut microorganisms and may support production of beneficial short-chain fatty acids."),

(["can diet affect bowel movements", "food and bowel movements", "diet digestion"],
 "Yes. Fiber, fluids, meal timing, activity, and individual food tolerance can influence bowel habits."),

(["why should fiber be increased slowly", "gradually increase fiber", "fiber increase slowly"],
 "Increasing fiber too quickly can cause gas and bloating. Gradual increases allow the digestive system to adapt."),

(["how much water with fiber", "fiber and water intake", "drink water with high fiber"],
 "Adequate fluids help fiber function properly and can reduce digestive discomfort when increasing fiber."),

(["what are healthy fats for cooking", "healthy cooking fats", "best fat for meals"],
 "Unsaturated plant oils such as olive, canola, sunflower, and other vegetable oils can be useful cooking fats."),

(["how much oil should i use daily", "daily cooking oil amount", "oil portion"],
 "Oil is energy-dense, so use a measured amount appropriate for your overall dietary needs rather than adding it freely."),

(["does using less oil reduce calories", "less oil calorie reduction", "oil and calories"],
 "Yes. Because oils are energy-dense, reducing the amount used can substantially reduce the calories in a meal."),

(["is olive oil better for salad", "olive oil salad dressing", "olive oil on salad"],
 "Olive oil can be used as a source of unsaturated fat in salad dressing. Keep the amount moderate because it is calorie-dense."),

(["is avocado oil healthy", "avocado oil benefits", "avocado oil nutrition"],
 "Avocado oil is rich in monounsaturated fat and can be used as a cooking or dressing oil."),

(["what is trans fat", "trans fat meaning", "foods containing trans fats"],
 "Trans fats are a type of unsaturated fat that can negatively affect cardiovascular health. Many countries restrict industrial trans fats in foods."),

(["why avoid trans fats", "trans fat health effects", "trans fat risks"],
 "Industrial trans fats can raise LDL cholesterol and lower HDL cholesterol and are associated with increased cardiovascular risk."),

(["how to identify trans fat on label", "trans fat food label", "check trans fat"],
 "Check the nutrition label and ingredient list for trans fat and partially hydrogenated oils where labeling rules require them."),

(["what is cholesterol in eggs", "egg cholesterol", "cholesterol from eggs"],
 "Egg yolks contain dietary cholesterol. For most healthy people, eggs can still fit into a balanced diet."),

(["does dietary cholesterol affect everyone equally", "cholesterol response to food", "dietary cholesterol variation"],
 "People respond differently to dietary cholesterol. Overall dietary pattern and saturated fat intake also influence blood cholesterol."),

(["what is LDL cholesterol", "LDL meaning", "bad cholesterol meaning"],
 "LDL is a type of lipoprotein that carries cholesterol in the blood. Higher LDL levels are associated with increased cardiovascular risk."),

(["what is HDL cholesterol", "HDL meaning", "good cholesterol meaning"],
 "HDL is a lipoprotein involved in transporting cholesterol. Blood HDL is one part of an overall cardiovascular risk profile."),

(["what foods can support healthy cholesterol", "diet for cholesterol", "foods for healthy cholesterol"],
 "Soluble-fiber-rich foods, nuts, legumes, whole grains, vegetables, fruits, and unsaturated fats can support a heart-healthy dietary pattern."),

(["what is soluble fiber for cholesterol", "fiber and cholesterol", "oats cholesterol"],
 "Soluble fiber can help reduce LDL cholesterol when consumed regularly as part of an appropriate diet."),

(["can nuts help cholesterol", "nuts and cholesterol", "almonds cholesterol"],
 "Nuts provide unsaturated fats and fiber and can fit into a diet designed to support healthy cholesterol levels."),

(["can olive oil help cholesterol", "olive oil cholesterol", "unsaturated fats cholesterol"],
 "Replacing some saturated fats with unsaturated fats such as those found in olive oil can support healthier blood cholesterol levels."),

(["why limit saturated fat", "saturated fat cholesterol", "saturated fat health"],
 "High intake of saturated fat can raise LDL cholesterol in many people, so replacing some with unsaturated fats can be beneficial."),

(["what foods are high in saturated fat", "saturated fat foods", "foods containing saturated fat"],
 "Butter, ghee, fatty meats, some full-fat dairy products, coconut oil, and palm oil can contain substantial saturated fat."),

(["what foods are high in unsaturated fat", "unsaturated fat foods", "healthy fat food sources"],
 "Avocado, nuts, seeds, olive oil, other vegetable oils, and fatty fish provide unsaturated fats."),

(["what is a balanced fat intake", "healthy fat balance", "dietary fat balance"],
 "A balanced fat intake emphasizes unsaturated fats while keeping saturated and trans fats appropriately limited."),

(["can i eat butter and olive oil", "butter and olive oil", "mix cooking fats"],
 "Both can be used, but olive oil generally provides more unsaturated fat while butter provides more saturated fat."),

(["what is an energy dense food", "energy dense meaning", "calorie dense foods"],
 "Energy-dense foods provide many calories in a relatively small amount of food, such as oils, nuts, seeds, and some sweets."),

(["what is low energy density food", "low calorie density foods", "low energy density meaning"],
 "Low-energy-density foods provide fewer calories relative to their weight, often because they contain substantial water or fiber."),

(["why vegetables are low calorie density", "vegetable calorie density", "vegetables and calories"],
 "Many vegetables contain a lot of water and fiber relative to their calorie content, making them relatively low in energy density."),

(["what is satiety", "satiety meaning", "what makes food satisfying"],
 "Satiety is the feeling of fullness and satisfaction after eating. Protein, fiber, food volume, and meal composition can influence it."),

(["what is hunger hormone", "hunger hormones", "hormones and appetite"],
 "Hormones such as ghrelin and leptin are involved in appetite and energy regulation, along with many other biological and environmental factors."),

(["what is ghrelin", "ghrelin meaning", "hunger hormone ghrelin"],
 "Ghrelin is a hormone involved in signaling hunger and regulating energy balance."),

(["what is leptin", "leptin meaning", "leptin appetite"],
 "Leptin is a hormone produced mainly by fat tissue that participates in regulating energy balance and appetite."),

(["does protein reduce ghrelin", "protein and hunger hormone", "protein appetite hormones"],
 "Protein can influence appetite-regulating signals and often increases fullness, although responses vary between individuals."),

(["does fiber increase fullness", "fiber and satiety", "fiber keeps you full"],
 "Yes. Fiber can increase meal volume and slow digestion, which can contribute to fullness."),

(["does water increase fullness", "water and satiety", "drinking water for fullness"],
 "Water can add volume and support hydration, and drinking water with meals may increase fullness for some people."),

(["what is mindful snacking", "mindful snack eating", "snacking mindfully"],
 "Mindful snacking means eating with attention to hunger, portion, taste, and fullness instead of eating automatically."),

(["how can i avoid distracted eating", "eating without distractions", "mindful eating tips"],
 "Eat away from screens when possible, slow down, and pay attention to taste and fullness cues."),

(["why do i eat when bored", "boredom eating", "eating from boredom"],
 "Boredom can become associated with eating through habit and environmental cues. Identifying the trigger can help you choose another activity."),

(["how to manage boredom eating", "stop boredom snacking", "boredom food cravings"],
 "Pause and check whether you are physically hungry. If not, try another activity such as walking, studying, or talking to someone."),

(["why do i eat when stressed", "stress eating reasons", "emotional eating stress"],
 "Stress can affect appetite and make highly palatable foods more appealing. Regular meals and non-food coping strategies can help."),

(["how to manage emotional eating", "emotional eating tips", "control emotional eating"],
 "Notice the emotion or situation before eating, keep regular meals, and develop alternative coping strategies. Professional support can help if it becomes frequent or distressing."),

(["what is a food trigger", "food trigger meaning", "eating trigger"],
 "A food trigger is a situation, emotion, habit, or environmental cue that increases the urge to eat."),

(["how to track food triggers", "food trigger journal", "track emotional eating"],
 "Record the time, food, hunger level, emotion, situation, and what happened before eating to identify patterns."),

(["what is hunger scale", "hunger scale meaning", "use hunger scale"],
 "A hunger scale is a self-rating system used to notice hunger and fullness before, during, and after meals."),

(["how to use hunger scale", "hunger fullness scale", "track hunger"],
 "Rate your hunger before eating and fullness afterward, then use the pattern to guide future meal timing and portions."),

(["what is mindful portioning", "mindful portions", "portion awareness eating"],
 "Mindful portioning means serving an amount appropriate to hunger and needs while paying attention to the food and eating pace."),

(["why is breakfast protein important for students", "student breakfast protein", "college breakfast protein"],
 "Protein at breakfast can improve fullness and provide amino acids needed for normal tissue maintenance."),

(["what is an easy protein food for students", "student protein foods", "college protein options"],
 "Eggs, curd, Greek yogurt, milk, roasted chickpeas, paneer, tofu, and nuts are convenient protein options."),

(["what is an easy vegetable for students", "student vegetable options", "easy vegetables for college"],
 "Cucumber, carrots, tomatoes, frozen mixed vegetables, spinach, and pre-cut vegetables can be convenient choices."),

(["what is an easy fruit for students", "student fruit options", "portable fruit for college"],
 "Bananas, apples, oranges, pears, and other whole fruits are portable and require little preparation."),

(["what is an easy healthy dinner for students", "student quick dinner", "college dinner ideas"],
 "Simple options include dal-rice with vegetables, eggs and roti, tofu or paneer with vegetables, or a balanced sandwich."),

(["what is an easy healthy lunch for students", "student lunch ideas", "college lunch ideas"],
 "A dal-roti meal, rice bowl with protein and vegetables, or whole-grain sandwich can be practical lunch options."),

(["what is an easy healthy breakfast for students", "student breakfast ideas", "college breakfast ideas"],
 "Oats with milk and fruit, eggs with roti, yogurt with fruit and nuts, or vegetable poha can be practical breakfasts."),

(["how can Nutri AI help students", "Nutri AI for students", "nutrition app for students"],
 "Nutri AI can help students organize meals, hydration, food information, and general wellness suggestions around a busy schedule."),

(["can Nutri AI suggest budget meals", "budget meals Nutri AI", "cheap meal suggestions AI"],
 "Nutri AI can suggest budget-friendly meal ideas using affordable foods such as lentils, beans, eggs, seasonal vegetables, grains, and curd."),

(["can Nutri AI suggest vegetarian meals", "vegetarian meal suggestions AI", "veg meals Nutri AI"],
 "Yes. Nutri AI can suggest vegetarian meal combinations using foods such as lentils, beans, tofu, paneer, dairy, grains, vegetables, and fruits."),

(["can Nutri AI suggest non vegetarian meals", "non veg meal suggestions AI", "chicken fish meal suggestions"],
 "Yes. Nutri AI can suggest general meal combinations using foods such as eggs, chicken, fish, dairy, vegetables, and grains."),

(["can Nutri AI suggest snacks", "Nutri AI snack suggestions", "AI healthy snack ideas"],
 "Yes. Nutri AI can suggest general snack ideas based on food preferences, activity, hunger, and nutrition goals."),

(["can Nutri AI suggest breakfast", "Nutri AI breakfast suggestions", "AI breakfast ideas"],
 "Yes. Nutri AI can suggest balanced breakfast ideas based on preferences and general nutrition goals."),

(["can Nutri AI suggest dinner", "Nutri AI dinner suggestions", "AI dinner ideas"],
 "Yes. Nutri AI can suggest general balanced dinner combinations using available foods and dietary preferences."),

(["can Nutri AI suggest lunch", "Nutri AI lunch suggestions", "AI lunch ideas"],
 "Yes. Nutri AI can suggest general lunch combinations based on preferences, goals, and available foods."),

(["can Nutri AI explain nutrition labels", "AI nutrition label reader", "Nutri AI label analysis"],
 "Nutri AI can explain common nutrition-label fields such as serving size, calories, protein, carbohydrates, fat, fiber, sugar, and sodium."),

(["can Nutri AI compare two foods", "compare foods with Nutri AI", "food comparison AI"],
 "Yes. Nutri AI can compare available nutrition information between two foods or products and explain the differences."),

(["can Nutri AI explain ingredients", "ingredient explanation AI", "Nutri AI ingredient reader"],
 "Nutri AI can explain common ingredients and their nutritional roles when reliable ingredient information is available."),

(["can Nutri AI detect allergens", "AI allergen detection", "food allergy scanner"],
 "A food scanner can flag listed allergen ingredients, but users with serious allergies should always verify the original product label."),

(["can Nutri AI read calories from barcode", "barcode calorie information", "food barcode calories"],
 "If a reliable product database contains the scanned product, Nutri AI can display its available calorie information and serving size."),

(["what happens if barcode is not found", "unknown barcode Nutri AI", "barcode product not found"],
 "If a barcode is not found, the app should allow manual food search or manual entry rather than inventing nutrition information."),

(["why should Nutri AI show serving size", "serving size in food scanner", "barcode serving size"],
 "Serving size is essential because nutrition values on packaged foods are usually reported relative to a specified serving."),

(["why should Nutri AI show ingredients", "ingredients in food scanner", "show ingredients after scan"],
 "Ingredients help users understand what a packaged product contains and can help identify added sugar, sodium, allergens, and other components."),

(["why should Nutri AI show sodium", "sodium in food scanner", "show salt information"],
 "Sodium information helps users monitor salt intake, especially when comparing packaged or highly processed foods."),

(["why should Nutri AI show added sugar", "added sugar in scanner", "show sugar information"],
 "Added sugar information helps users distinguish naturally occurring sugars from sugars added during food processing."),

(["why should Nutri AI show protein", "protein in food scanner", "show protein information"],
 "Protein information helps users evaluate whether a food can contribute meaningfully to their daily protein intake."),

(["why should Nutri AI show fiber", "fiber in food scanner", "show fiber information"],
 "Fiber information helps users identify foods that can contribute to digestive health and fullness."),

(["why should Nutri AI show fat type", "saturated fat scanner", "fat information in food scanner"],
 "Showing total and saturated fat helps users understand the fat profile of packaged foods."),

(["what is a health score in Nutri AI", "Nutri AI health score", "food health score"],
 "A Nutri AI health score should be treated as a simplified indicator based on defined nutrition criteria, not as a medical judgment."),

(["how should Nutri AI calculate health score", "food health score calculation", "NutriLens score calculation"],
 "A health score can consider factors such as protein, fiber, added sugar, sodium, saturated fat, and ingredient quality using a clearly documented scoring method."),

(["can a health score be personalized", "personalized food score", "Nutri AI personalized score"],
 "A food score can be adjusted to user goals, but the criteria should be transparent so users understand why the score changes."),

(["why should Nutri AI explain its score", "explain health score", "food score explanation"],
 "Explaining the score makes the result more transparent and helps users understand which nutrition factors influenced it."),

(["can one food be unhealthy for one person and healthy for another", "personalized food health", "food suitability differences"],
 "Yes. Dietary goals, allergies, intolerances, medical conditions, portions, and overall diet can change whether a food is appropriate for an individual."),

(["why portion matters in Nutri AI", "personalized portion nutrition", "food portion personalization"],
 "The nutritional effect of a food depends partly on how much is consumed, so portion information makes recommendations more useful."),

(["what is a nutrition recommendation engine", "nutrition recommendation system", "AI recommendation engine"],
 "A nutrition recommendation engine uses user inputs and food information to generate relevant food or wellness suggestions."),

(["what is rule based chatbot", "rule based AI meaning", "training data chatbot"],
 "A rule-based chatbot matches user messages to predefined triggers and returns the associated response rather than generating every answer from scratch."),

(["how does Nutri AI match questions", "chatbot trigger matching", "Nutri AI question matching"],
 "The chat engine compares the user's message with stored trigger phrases and returns a matching response when a suitable trigger is found."),

(["why add multiple variations of a question", "question variations training data", "chatbot training phrases"],
 "Users phrase the same question in many ways, so multiple trigger variations can improve matching in a rule-based chatbot."),

(["what makes good chatbot training data", "good training data", "nutrition chatbot dataset"],
 "Good training data uses accurate answers, diverse natural trigger phrases, minimal duplicates, clear topics, and consistent response quality."),

(["how to avoid duplicate training data", "duplicate dataset entries", "remove chatbot duplicates"],
 "Review trigger phrases for overlapping meanings and combine unnecessary duplicates so one user question does not match conflicting responses."),

(["why should chatbot answers be accurate", "training data accuracy", "nutrition dataset accuracy"],
 "Incorrect training responses can cause the chatbot to repeatedly provide misleading information, so factual accuracy is essential."),

(["how to organize Nutri AI training data", "training data categories", "nutrition dataset organization"],
 "Organize entries into categories such as fruits, vegetables, protein, hydration, exercise nutrition, food labels, wellness, and app features."),

(["what categories can Nutri AI answer", "Nutri AI topics", "nutrition chatbot categories"],
 "Nutri AI can cover food nutrients, meal ideas, hydration, exercise nutrition, food labels, dietary preferences, general wellness, and food safety."),

(["what should Nutri AI say when unsure", "AI uncertain nutrition answer", "unknown nutrition question"],
 "When reliable information is unavailable, Nutri AI should say it is unsure and recommend checking a reliable source rather than inventing an answer."),

(["why should AI avoid making up nutrition facts", "AI hallucination nutrition", "false nutrition information"],
 "Invented nutrition facts can mislead users, so the system should use reliable data and clearly communicate uncertainty."),

(["can Nutri AI give personalized calorie targets", "AI calorie target", "personalized calorie calculation"],
 "It can estimate general energy needs using user information, but personalized targets should be treated as estimates and reviewed carefully, especially for medical conditions."),

(["what factors affect calorie needs", "calorie needs factors", "energy requirement factors"],
 "Calorie needs depend on age, body size, sex, activity level, growth, body composition, and other individual factors."),

(["what factors affect protein needs", "protein need factors", "protein requirement factors"],
 "Protein needs vary with body size, age, activity, training goals, pregnancy, health status, and overall diet."),

(["what factors affect water needs", "hydration need factors", "water requirement factors"],
 "Fluid needs vary with body size, activity, climate, sweating, diet, and health conditions."),

(["what factors affect nutrition recommendations", "personalized nutrition factors", "diet recommendation factors"],
 "Recommendations can depend on goals, age, activity, dietary preferences, allergies, intolerances, health conditions, food availability, and lifestyle."),

(["can Nutri AI recommend meals from available ingredients", "ingredient based meal suggestions", "AI meal from ingredients"],
 "Yes. A meal recommendation feature can use available ingredients to suggest combinations while considering dietary preferences and goals."),

(["can Nutri AI create a grocery list", "AI grocery list", "Nutri AI shopping list"],
 "Yes. A nutrition app can generate a grocery list from selected meals or nutrition goals."),

(["can Nutri AI plan weekly meals", "AI weekly meal planner", "Nutri AI meal planner"],
 "Yes. Nutri AI can organize general breakfast, lunch, dinner, and snack ideas into a weekly plan based on user preferences."),

(["can Nutri AI track calories from meals", "AI meal calorie tracking", "meal calorie tracker"],
 "It can estimate meal calories when food items and portions are available, but estimates may differ from actual values."),

(["can Nutri AI track protein intake", "AI protein tracker", "daily protein tracking"],
 "Yes. If food portions and nutrition values are available, Nutri AI can estimate and summarize daily protein intake."),

(["can Nutri AI track fiber intake", "AI fiber tracker", "daily fiber tracking"],
 "Yes. Food records can be used to estimate daily fiber intake when reliable nutrition information is available."),

(["can Nutri AI track sugar intake", "AI sugar tracker", "daily sugar tracking"],
 "Yes. Nutri AI can summarize sugar intake when food data distinguishes the relevant sugar values."),

(["can Nutri AI track sodium intake", "AI sodium tracker", "daily sodium tracking"],
 "Yes. Nutri AI can estimate sodium intake from logged foods when sodium information is available."),

(["what is a daily nutrition summary", "nutrition dashboard meaning", "daily food summary"],
 "A daily nutrition summary can show meals, calories, protein, carbohydrates, fat, fiber, water, and other selected metrics."),

(["what should a nutrition dashboard show", "nutrition dashboard features", "food tracker dashboard"],
 "A useful dashboard can show meal logs, hydration, nutrient totals, goals, trends, and simple recommendations."),

(["what is a nutrition progress chart", "nutrition chart meaning", "food tracking graph"],
 "A nutrition progress chart visualizes changes in metrics such as water intake, calories, protein, or meal consistency over time."),

(["why use charts in Nutri AI", "nutrition dashboard charts", "charts for nutrition app"],
 "Charts make trends easier to understand than raw numbers and can help users see changes in their eating or hydration patterns."),

(["what is a mood nutrition chart", "mood food tracking graph", "mood meal chart"],
 "A mood-nutrition chart can display self-reported mood alongside meal logs to help users notice personal patterns without claiming causation."),

(["can mood data predict food choices", "mood prediction food", "AI mood food prediction"],
 "Mood data may reveal patterns in food choices, but predictions are uncertain and should not be treated as psychological diagnoses."),

(["why should Nutri AI use self reported mood", "self reported mood tracking", "mood input in nutrition app"],
 "Self-reported mood is more transparent than assuming a person's emotional state from appearance alone."),

(["what is emotional wellness tracking", "emotional wellness tracker", "mood wellness tracking"],
 "Emotional wellness tracking records self-reported feelings over time to help users notice patterns and reflect on well-being."),

(["can nutrition and mood be tracked together", "food mood tracker", "nutrition emotion tracking"],
 "Yes. Tracking meals and mood together can help users observe personal patterns while recognizing that correlation does not prove causation."),

(["why should Nutri AI avoid mental health diagnosis", "mental health safety AI", "emotion AI safety"],
 "Mood and facial-expression data are not sufficient for diagnosing mental-health conditions. The app should provide wellness information and encourage professional help when appropriate."),

(["what is a safe nutrition chatbot", "nutrition chatbot safety", "safe AI nutrition assistant"],
 "A safe nutrition chatbot provides accurate general information, avoids diagnosis, communicates uncertainty, protects user data, and directs serious health concerns to professionals."),

(["what should Nutri AI do with allergies", "Nutri AI allergy safety", "food allergy recommendation"],
 "Nutri AI should use recorded allergies to avoid suggesting known trigger foods and should remind users to verify packaged-food labels."),

(["what should Nutri AI do with dietary restrictions", "diet restriction AI", "restricted diet recommendations"],
 "The app should respect recorded dietary restrictions and avoid recommending foods that conflict with them."),

(["what should Nutri AI do if user has diabetes", "Nutri AI diabetes safety", "AI nutrition diabetes"],
 "Nutri AI should provide general information and avoid prescribing treatment or medication changes. Diabetes-specific plans should be discussed with a healthcare professional."),

(["what should Nutri AI do if user has kidney disease", "AI nutrition kidney disease", "kidney diet chatbot"],
 "Kidney disease can require individualized limits on nutrients such as sodium, potassium, phosphorus, and protein. Professional guidance is important."),

(["what should Nutri AI do if user is pregnant", "pregnancy AI nutrition", "Nutri AI pregnancy safety"],
 "Pregnancy has specific nutrient and food-safety needs. Nutri AI should provide general information and encourage guidance from a qualified healthcare professional."),

(["what should Nutri AI do for children", "Nutri AI child nutrition", "AI nutrition for children"],
 "Children have growth-related nutritional needs, so Nutri AI should avoid restrictive diet recommendations and encourage appropriate professional guidance."),

(["what should Nutri AI do for eating disorders", "AI eating disorder safety", "nutrition chatbot eating disorder"],
 "Nutri AI should avoid calorie restriction or weight-loss coaching when eating-disorder concerns are present and encourage professional support."),

(["what is responsible AI nutrition", "responsible nutrition AI", "safe AI food recommendations"],
 "Responsible nutrition AI should use reliable information, avoid harmful claims, protect privacy, explain uncertainty, and encourage professional care when needed."),

(["why should AI show sources", "nutrition AI sources", "source citations in Nutri AI"],
 "Showing reliable sources can improve transparency and allow users to verify important nutrition information."),

(["what are reliable nutrition sources", "trusted nutrition sources", "nutrition information sources"],
 "Reliable sources include government health agencies, established medical organizations, universities, and peer-reviewed scientific literature."),

(["how can Nutri AI avoid nutrition myths", "nutrition myth detection", "avoid food myths"],
 "Use evidence-based sources, avoid absolute claims, distinguish correlation from causation, and flag uncertain or controversial information."),

(["can one study prove a nutrition claim", "nutrition study evidence", "single study nutrition"],
 "One study rarely proves a broad nutrition claim. Evidence should be evaluated across study quality, consistency, population, and limitations."),

(["what is correlation in nutrition", "nutrition correlation meaning", "correlation vs causation food"],
 "Correlation means two variables are associated; it does not prove that one variable causes the other."),

(["what is causation in nutrition", "nutrition causation meaning", "cause and effect food"],
 "Causation means one factor directly contributes to a change in another. Establishing causation generally requires stronger evidence than simple association."),

(["why are nutrition studies different", "nutrition research differences", "why studies disagree about food"],
 "Nutrition studies can differ in population, methods, food definitions, duration, and measurements, which can produce different findings."),

(["how should Nutri AI handle conflicting studies", "conflicting nutrition evidence", "AI nutrition uncertainty"],
 "Nutri AI should explain that evidence is mixed when appropriate, rely on stronger and more consistent evidence, and avoid presenting uncertain claims as facts."),

(["what is evidence hierarchy", "nutrition evidence hierarchy", "levels of scientific evidence"],
 "Evidence hierarchy ranks study designs by their ability to answer particular questions. Systematic reviews and well-designed trials can provide stronger evidence for some questions than observational studies."),

(["why is randomized trial useful", "randomized trial nutrition", "RCT nutrition study"],
 "Randomized trials can reduce some forms of bias by assigning participants to different interventions, although they also have limitations."),

(["what is observational nutrition study", "observational study food", "nutrition observational research"],
 "Observational studies examine relationships between exposures and outcomes without randomly assigning an intervention."),

(["what is a systematic review", "systematic review meaning", "nutrition systematic review"],
 "A systematic review uses a structured method to identify and synthesize evidence from multiple studies."),

(["what is meta analysis", "meta analysis meaning", "nutrition meta analysis"],
 "A meta-analysis statistically combines results from multiple studies when appropriate to estimate an overall effect."),

(["why should Nutri AI avoid absolute health claims", "absolute nutrition claims", "nutrition claim caution"],
 "Most nutrition effects depend on dose, individual factors, and overall dietary pattern, so absolute claims can be misleading."),

(["what does moderation mean in nutrition", "moderation meaning food", "eat in moderation"],
 "Moderation means keeping portions and frequency appropriate within the context of the overall diet rather than labeling foods as completely forbidden."),

(["what is dietary balance", "diet balance meaning", "balanced food choices"],
 "Dietary balance means meeting nutritional needs while allowing variety, appropriate portions, and flexibility."),

(["what is dietary adequacy", "nutrition adequacy meaning", "adequate diet"],
 "Dietary adequacy means consuming enough essential nutrients and energy to meet the body's needs."),

(["what is dietary variety", "nutrition variety meaning", "variety in diet"],
 "Dietary variety means consuming different foods across and within food groups to obtain a broad range of nutrients."),

(["what is dietary moderation", "moderation in diet", "moderate eating"],
 "Dietary moderation means avoiding excessive amounts of foods or nutrients while allowing flexibility in food choices."),

(["what is nutritional balance", "nutrition balance meaning", "balanced nutrition"],
 "Nutritional balance means getting appropriate amounts of energy, macronutrients, micronutrients, fiber, and fluids."),

(["what is macronutrient", "macronutrients meaning", "three macronutrients"],
 "The main macronutrients are carbohydrates, protein, and fat. They provide energy and perform important functions in the body."),

(["what is micronutrient", "micronutrients meaning", "examples of micronutrients"],
 "Micronutrients are vitamins and minerals needed in smaller amounts but essential for normal body functions."),

(["what are macronutrients used for", "macronutrient functions", "protein carbs fat functions"],
 "Carbohydrates mainly provide energy, protein supports tissue and functional proteins, and fat provides energy and supports cell and hormone-related functions."),

(["what are micronutrients used for", "micronutrient functions", "vitamins minerals function"],
 "Vitamins and minerals support processes such as energy metabolism, immune function, bone health, blood formation, and nervous-system function."),

(["why is a varied diet important for micronutrients", "micronutrient variety", "vitamin mineral diet variety"],
 "Different foods provide different vitamins and minerals, so variety helps reduce the risk of nutritional gaps."),

(["what is nutritional quality", "food nutritional quality", "nutrition quality meaning"],
 "Nutritional quality refers to how well a food or eating pattern provides useful nutrients relative to energy, added sugar, sodium, saturated fat, and other factors."),

(["how can Nutri AI rate nutritional quality", "nutrition quality score", "AI nutrition rating"],
 "A rating can consider nutrient density, protein, fiber, added sugar, sodium, saturated fat, and processing while clearly explaining its criteria."),

(["why should Nutri AI not label food simply good or bad", "food good bad labels", "healthy unhealthy food labels"],
 "Foods contain different nutrients and can play different roles in different diets. Context, portion, frequency, and individual needs matter."),

(["can a high calorie food be nutritious", "calorie dense nutritious foods", "healthy high calorie foods"],
 "Yes. Nuts, seeds, avocado, and some dairy foods can be calorie-dense while also providing valuable nutrients."),

(["can a low calorie food be unhealthy", "low calorie unhealthy food", "calorie count and nutrition"],
 "Yes. Low calorie does not automatically mean nutrient-rich. Nutritional quality depends on the full composition of the food."),

(["what is empty calories", "empty calorie meaning", "foods with low nutrient value"],
 "Empty calories is an informal term for foods or drinks that provide substantial energy with relatively few essential nutrients."),

(["why nutrient density matters", "nutrient density importance", "benefits of nutrient dense foods"],
 "Nutrient-dense foods help provide essential nutrients without requiring large amounts of energy."),

(["what is food composition", "food composition meaning", "nutrition composition"],
 "Food composition describes the amounts of nutrients and other components in a food, such as protein, carbohydrate, fat, fiber, vitamins, minerals, and water."),

(["why portion and composition both matter", "portion vs nutrition quality", "food amount and nutrition"],
 "Both matter because even nutritious foods can provide excess energy in very large portions, while small portions of nutrient-poor foods may provide little nutrition."),

(["what is a balanced snack", "balanced snack meaning", "how to make balanced snack"],
 "A balanced snack can combine a protein source with fruit, vegetables, whole grains, or healthy fats depending on hunger and activity."),

(["what is a balanced breakfast plate", "breakfast plate balance", "healthy breakfast plate"],
 "A balanced breakfast can include protein, a fiber-rich carbohydrate, fruit or vegetables, and an appropriate amount of healthy fat."),

(["what is a balanced lunch plate", "lunch plate balance", "healthy lunch plate"],
 "A balanced lunch can include about half the plate from vegetables or fruit, plus protein and an appropriate carbohydrate portion, adjusted to individual needs."),

(["what is a balanced dinner plate", "dinner plate balance", "healthy dinner plate"],
 "A balanced dinner can emphasize vegetables, include a protein source, and add an appropriate portion of carbohydrate and healthy fat."),

(["how can i make meals more colorful", "colorful healthy meals", "add variety to meals"],
 "Use different colored vegetables and fruits across meals to increase dietary variety and exposure to different plant compounds."),

(["why are dark green vegetables nutritious", "dark green vegetables", "green leafy vegetable benefits"],
 "Dark green vegetables often provide folate, vitamin K, carotenoids, fiber, and other micronutrients."),

(["why are orange vegetables nutritious", "orange vegetable benefits", "orange vegetables nutrition"],
 "Orange vegetables often provide carotenoids such as beta-carotene, along with fiber and other nutrients."),

(["why are red vegetables nutritious", "red vegetable benefits", "red vegetables nutrition"],
 "Red vegetables such as tomatoes and peppers provide vitamin C, carotenoids, and other plant compounds."),

(["why are purple vegetables nutritious", "purple vegetable benefits", "purple vegetables nutrition"],
 "Purple and blue foods often contain plant compounds such as anthocyanins along with fiber and other nutrients."),

(["what is phytonutrient", "phytonutrients meaning", "plant nutrients"],
 "Phytonutrients are naturally occurring compounds in plants that are not always classified as essential nutrients but may contribute to health."),

(["what are polyphenols", "polyphenol meaning", "foods with polyphenols"],
 "Polyphenols are plant compounds found in foods such as berries, tea, cocoa, coffee, fruits, vegetables, and legumes."),

(["what are carotenoids", "carotenoid meaning", "foods containing carotenoids"],
 "Carotenoids are plant pigments found in foods such as carrots, tomatoes, spinach, pumpkin, and other colorful fruits and vegetables."),

(["what are anthocyanins", "anthocyanin meaning", "foods with anthocyanins"],
 "Anthocyanins are plant pigments commonly found in dark red, purple, and blue fruits and vegetables."),

(["what is lycopene", "lycopene meaning", "foods high in lycopene"],
 "Lycopene is a carotenoid found in foods such as tomatoes and watermelon."),

(["what is beta carotene", "beta carotene meaning", "foods with beta carotene"],
 "Beta-carotene is a carotenoid found in foods such as carrots, sweet potatoes, spinach, and pumpkin and can be converted to vitamin A."),

(["what is vitamin a", "vitamin a importance", "why do we need vitamin a"],
 "Vitamin A supports normal vision, immune function, reproduction, and maintenance of tissues."),

(["foods high in vitamin a", "vitamin a rich foods", "vitamin a food sources"],
 "Vitamin A can come from animal foods such as eggs and dairy and from provitamin A carotenoids in foods such as carrots, sweet potatoes, and leafy greens."),

(["what is vitamin b6", "vitamin b6 importance", "why do we need b6"],
 "Vitamin B6 is involved in protein metabolism, red blood cell formation, and normal nervous-system function."),

(["foods high in vitamin b6", "vitamin b6 food sources", "b6 rich foods"],
 "Vitamin B6 is found in foods such as poultry, fish, potatoes, bananas, chickpeas, and fortified foods."),

(["what is niacin", "vitamin b3 meaning", "niacin importance"],
 "Niacin, or vitamin B3, is involved in energy metabolism and normal function of the skin and nervous system."),

(["foods high in niacin", "niacin food sources", "vitamin b3 foods"],
 "Meat, fish, poultry, peanuts, legumes, and fortified grains can provide niacin."),

(["what is riboflavin", "vitamin b2 meaning", "riboflavin importance"],
 "Riboflavin, or vitamin B2, supports energy metabolism and normal cellular function."),

(["foods high in riboflavin", "vitamin b2 food sources", "riboflavin rich foods"],
 "Dairy products, eggs, meat, almonds, and fortified foods can provide riboflavin."),

(["what is thiamine", "vitamin b1 meaning", "thiamine importance"],
 "Thiamine, or vitamin B1, is important for carbohydrate metabolism and normal nerve function."),

(["foods high in thiamine", "vitamin b1 food sources", "thiamine rich foods"],
 "Whole grains, legumes, nuts, seeds, pork, and fortified foods can provide thiamine."),

(["what is phosphorus", "phosphorus importance", "why do we need phosphorus"],
 "Phosphorus is important for bones and teeth, energy metabolism, and cell structures."),

(["foods high in phosphorus", "phosphorus food sources", "phosphorus rich foods"],
 "Dairy, meat, fish, eggs, legumes, nuts, and seeds can provide phosphorus."),

(["what is copper", "copper importance", "why do we need copper"],
 "Copper supports iron metabolism, connective tissue formation, nervous-system function, and antioxidant defense."),

(["foods high in copper", "copper food sources", "copper rich foods"],
 "Nuts, seeds, legumes, seafood, whole grains, and cocoa can provide copper."),

(["what is manganese", "manganese importance", "why do we need manganese"],
 "Manganese supports bone formation, metabolism, and antioxidant enzyme function."),

(["foods high in manganese", "manganese food sources", "manganese rich foods"],
 "Whole grains, nuts, legumes, leafy vegetables, and tea can provide manganese."),

(["what is chromium", "chromium importance", "why do we need chromium"],
 "Chromium is a trace mineral involved in normal nutrient metabolism, although exact biological roles are complex."),

(["what is molybdenum", "molybdenum importance", "why do we need molybdenum"],
 "Molybdenum is a trace mineral needed for the activity of several enzymes."),

(["what is chloride", "chloride importance", "why do we need chloride"],
 "Chloride is an electrolyte involved in fluid balance, nerve function, and the formation of stomach acid."),

(["what is phosphorus in food", "phosphorus nutrition", "phosphorus sources"],
 "Phosphorus is present in dairy, meat, fish, eggs, legumes, nuts, seeds, and many processed foods."),

(["what is sodium in food", "sodium nutrition", "sodium sources"],
 "Sodium naturally occurs in some foods and is also added as salt or other sodium-containing ingredients during processing."),

(["what is potassium sodium balance", "potassium and sodium", "sodium potassium nutrition"],
 "Sodium and potassium both contribute to fluid balance and normal nerve and muscle function. Overall dietary patterns matter more than focusing on one mineral alone."),

(["what is electrolyte balance", "electrolyte balance meaning", "body electrolytes"],
 "Electrolyte balance refers to maintaining appropriate levels of minerals such as sodium, potassium, chloride, calcium, and magnesium in body fluids."),

(["what is water soluble vitamin", "water soluble vitamins", "examples of water soluble vitamins"],
 "Water-soluble vitamins include vitamin C and the B vitamins. The body generally stores them less extensively than fat-soluble vitamins."),

(["what is fat soluble vitamin", "fat soluble vitamins", "examples of fat soluble vitamins"],
 "Fat-soluble vitamins are A, D, E, and K. They can be stored in body tissues and are absorbed along with dietary fat."),

(["why do fat soluble vitamins need fat", "vitamin absorption and fat", "fat soluble vitamin absorption"],
 "Dietary fat helps the body absorb fat-soluble vitamins A, D, E, and K."),

(["can too many vitamins be harmful", "vitamin overdose", "excess vitamins"],
 "Yes. High doses of some vitamins, especially fat-soluble vitamins, can accumulate and cause harm."),

(["can too many minerals be harmful", "mineral overdose", "excess minerals"],
 "Yes. Excess amounts of certain minerals can be harmful, especially when supplements are taken unnecessarily."),

(["why are food supplements not always needed", "supplement necessity", "do i need supplements"],
 "A varied diet can provide many nutrients. Supplements are most useful when there is a specific need or deficiency identified or when recommended by a professional."),

(["what is fortified milk", "fortified milk meaning", "milk with added vitamins"],
 "Fortified milk has selected vitamins or minerals added, commonly vitamin D and sometimes other nutrients."),

(["what is calcium fortified plant milk", "fortified plant milk calcium", "plant milk calcium"],
 "Some plant milks have calcium added to provide a nutrient profile closer to dairy milk. Check the nutrition label."),

(["why check plant milk protein", "plant milk nutrition label", "protein in plant milk"],
 "Plant milk protein varies greatly. Checking the label helps determine whether it contributes meaningful protein to the diet."),

(["what is lactose free food", "lactose free meaning", "lactose free products"],
 "Lactose-free products contain little or no lactose and are designed for people who have difficulty digesting lactose."),

(["what is dairy intolerance", "dairy intolerance meaning", "milk intolerance"],
 "Dairy intolerance can refer to difficulty tolerating components of dairy, commonly lactose. Symptoms and causes vary."),

(["can lactose intolerance eat yogurt", "yogurt lactose intolerance", "curd with lactose intolerance"],
 "Some people with lactose intolerance tolerate yogurt better than milk because fermentation reduces some lactose, but tolerance varies."),

(["can lactose intolerance eat cheese", "cheese lactose intolerance", "cheese and lactose"],
 "Many aged cheeses contain relatively little lactose, but individual tolerance varies."),

(["what foods are naturally lactose free", "lactose free foods", "foods without lactose"],
 "Most fruits, vegetables, grains, legumes, meat, fish, eggs, nuts, and seeds are naturally lactose-free."),

(["what is gluten free", "gluten free meaning", "gluten free foods"],
 "Gluten-free foods contain no gluten from wheat, barley, rye, or contaminated sources. Label verification is important for people with celiac disease."),

(["which grains are naturally gluten free", "gluten free grains", "grains without gluten"],
 "Rice, corn, quinoa, millet, buckwheat, and certified gluten-free oats are examples of naturally gluten-free or gluten-free options."),

(["are oats gluten free", "oats and gluten", "can celiac eat oats"],
 "Pure oats do not contain gluten, but cross-contamination can occur. People with celiac disease should use appropriately certified gluten-free oats if advised."),

(["what is cross contamination with gluten", "gluten cross contamination", "gluten contamination"],
 "Cross-contamination occurs when gluten-free food contacts gluten-containing ingredients or surfaces."),

(["why should food labels be checked for allergies", "allergen label reading", "food allergy labels"],
 "Ingredient and allergen statements help identify potential triggers, but people with severe allergies should follow professional safety guidance."),

(["what are common food allergens", "major food allergens", "food allergy examples"],
 "Common allergens include milk, eggs, peanuts, tree nuts, fish, shellfish, wheat, soy, and others depending on local labeling rules."),

(["what is anaphylaxis", "anaphylaxis meaning", "severe food allergy reaction"],
 "Anaphylaxis is a severe, potentially life-threatening allergic reaction requiring immediate emergency treatment."),

(["what should i do for severe food allergy reaction", "food allergy emergency", "anaphylaxis food"],
 "A severe allergic reaction is an emergency. Use prescribed emergency medication such as an epinephrine auto-injector if available and seek emergency medical care immediately."),

(["what is food intolerance symptom", "food intolerance symptoms", "signs of food intolerance"],
 "Possible symptoms include bloating, gas, abdominal discomfort, or diarrhea after a trigger food, depending on the intolerance."),

(["what is elimination diet", "elimination diet meaning", "food elimination diet"],
 "An elimination diet temporarily removes suspected foods and then systematically reintroduces them, ideally with professional guidance."),

(["should i eliminate foods without reason", "unnecessary elimination diets", "avoid foods without diagnosis"],
 "Avoiding major food groups without a clear reason can create nutrient gaps. Restrictive diets are best planned with appropriate guidance."),

(["what is balanced meal timing", "meal timing nutrition", "when should i eat"],
 "Meal timing can be flexible. A useful schedule is one that supports hunger, energy, activity, sleep, and overall nutritional adequacy."),

(["does meal timing affect weight loss", "meal timing and weight", "when to eat for weight loss"],
 "Meal timing can influence hunger and adherence, but total energy intake and overall dietary quality remain important."),

(["is intermittent fasting good for everyone", "intermittent fasting safety", "who should avoid fasting"],
 "Intermittent fasting is not appropriate for everyone, particularly some children, pregnant people, people with certain medical conditions, and those with eating disorders."),

(["what is time restricted eating", "time restricted eating meaning", "TRE diet"],
 "Time-restricted eating limits the daily eating window without necessarily specifying which foods must be eaten."),

(["what is a healthy eating window", "eating window nutrition", "meal window"],
 "There is no universal ideal eating window. It should fit nutritional needs, lifestyle, sleep, activity, and health status."),

(["can fasting affect exercise", "fasting and exercise", "exercise during fasting"],
 "Fasting can affect energy and exercise tolerance differently between people. Hydration and individual health considerations are important."),

(["what is breakfast skipping", "skipping breakfast meaning", "not eating breakfast"],
 "Breakfast skipping means not eating a morning meal. It can be compatible with some eating patterns but is not necessary for everyone."),

(["can i drink coffee without breakfast", "coffee on empty stomach", "coffee before eating"],
 "Some people tolerate coffee without food, while others experience acidity or discomfort. Individual tolerance matters."),

(["does coffee have calories", "coffee calories", "black coffee nutrition"],
 "Plain black coffee contains very few calories. Milk, sugar, cream, and syrups can add significant calories."),

(["is black coffee healthy", "black coffee benefits", "can i drink black coffee"],
 "Black coffee can fit into a balanced diet and provides caffeine and plant compounds. Excessive intake can cause side effects."),

(["is tea healthy", "tea benefits", "can i drink tea daily"],
 "Unsweetened tea can provide fluids and plant compounds. Added sugar and excessive caffeine can change its nutritional profile."),

(["what is herbal tea", "herbal tea meaning", "herbal tea benefits"],
 "Herbal teas are beverages made from herbs, flowers, spices, or other plants and are generally caffeine-free unless blended with caffeinated tea."),

(["can herbal tea replace water", "herbal tea hydration", "tea for hydration"],
 "Unsweetened herbal tea contributes to fluid intake, but plain water can remain a simple primary hydration choice."),

(["what is green tea", "green tea meaning", "green tea nutrition"],
 "Green tea is made from Camellia sinensis leaves and contains caffeine and plant compounds such as catechins."),

(["what is black tea", "black tea meaning", "black tea nutrition"],
 "Black tea is a caffeinated tea containing polyphenols and can contribute to fluid intake when consumed without excessive added sugar."),

(["does tea contain caffeine", "caffeine in tea", "which tea has caffeine"],
 "Black, green, and many other true teas contain caffeine. The amount varies with type, serving size, and brewing method."),

(["what is decaf coffee", "decaf coffee meaning", "does decaf have caffeine"],
 "Decaffeinated coffee has most of its caffeine removed but usually still contains a small amount."),

(["can caffeine affect anxiety", "coffee and anxiety", "caffeine anxiety"],
 "Caffeine can increase nervousness or anxiety in sensitive people, especially at higher intakes."),

(["can caffeine affect heart rate", "caffeine and heart rate", "coffee heart rate"],
 "Caffeine can temporarily increase heart rate or cause palpitations in some people, especially at high doses or in sensitive individuals."),

(["why should children limit caffeine", "caffeine for children", "kids and caffeine"],
 "Children and adolescents may be more sensitive to caffeine, which can affect sleep, anxiety, and heart rate."),

(["what is hydration for children", "kids hydration", "water for children"],
 "Children need adequate fluids throughout the day, with needs varying by age, activity, climate, and diet."),

(["what is a healthy school snack", "school snack ideas", "healthy snack for students"],
 "Fruit, yogurt, nuts where permitted, roasted chickpeas, or a simple whole-grain sandwich can be practical school snacks."),

(["why is lunch important for students", "student lunch benefits", "school lunch nutrition"],
 "Lunch provides energy and nutrients needed for afternoon activity, concentration, and growth or maintenance."),

(["what is a balanced school lunch", "school lunch ideas", "student balanced lunch"],
 "A balanced school lunch can include a protein source, whole-grain carbohydrate, vegetables or fruit, and water."),

(["what is a healthy college canteen choice", "college canteen healthy food", "canteen nutrition"],
 "Look for meals with vegetables and protein, choose reasonable portions, and prefer water or unsweetened drinks."),

(["how to choose healthier snacks from vending machine", "vending machine healthy snacks", "healthy packaged snacks"],
 "Choose options with more protein or fiber and less added sugar or sodium when available, and check serving sizes."),

(["what is a healthy packaged snack", "packaged snack nutrition", "healthy packaged foods"],
 "Look for useful amounts of protein or fiber and compare added sugar, sodium, saturated fat, and serving size."),

(["how to compare two packaged foods", "food label comparison", "compare nutrition labels"],
 "Compare the same serving size and check calories, protein, fiber, added sugar, sodium, saturated fat, and ingredient lists."),

(["why serving size matters when comparing foods", "compare serving sizes", "nutrition label serving comparison"],
 "Comparisons can be misleading if serving sizes differ, so compare equal amounts whenever possible."),

(["what is percent daily value", "percent daily value meaning", "%DV food label"],
 "Percent Daily Value shows how much a nutrient in one serving contributes to a reference daily amount used on the nutrition label."),

(["how to use percent daily value", "use %DV", "nutrition label daily value"],
 "Use %DV to compare products and identify foods relatively higher or lower in a nutrient, while considering the serving size."),

(["what is ingredient order", "ingredient list order", "how ingredients are listed"],
 "Packaged-food ingredients are generally listed in descending order by weight, so earlier ingredients make up more of the product."),

(["why is ingredient order important", "ingredient list nutrition", "check first ingredients"],
 "The first few ingredients can reveal major components such as refined flour, sugar, oils, or whole grains."),

(["what is whole wheat first ingredient", "whole wheat ingredient label", "check whole wheat bread label"],
 "If whole wheat is listed as the main ingredient, the product is more likely to be substantially whole grain, but the full label should still be checked."),

(["what does no sugar added mean", "no sugar added label", "no added sugar foods"],
 "No added sugar means sugar was not intentionally added during processing, although naturally occurring sugars may still be present."),

(["what is natural sugar", "naturally occurring sugar", "natural sugar in fruit"],
 "Naturally occurring sugars are sugars present in foods such as fruit, milk, and some vegetables without being added during processing."),

(["is natural sugar healthier than added sugar", "natural vs added sugar", "fruit sugar vs added sugar"],
 "Foods with naturally occurring sugar often provide other nutrients and fiber, while added sugars mainly contribute sweetness and calories."),

(["why is fruit different from candy", "fruit vs candy", "fruit sugar compared with candy"],
 "Whole fruit provides sugar along with fiber, water, vitamins, minerals, and plant compounds, while candy is usually much more concentrated in added sugar."),

(["what is a low sugar snack", "low sugar snack ideas", "snacks with less sugar"],
 "Nuts, eggs, plain yogurt, vegetables with hummus, and some whole-grain snacks can be lower in added sugar."),

(["what is a low sodium snack", "low salt snack ideas", "snacks with less sodium"],
 "Fresh fruit, unsalted nuts, plain yogurt, fresh vegetables, and homemade snacks can help limit sodium."),

(["what is a high potassium snack", "potassium snack ideas", "snacks with potassium"],
 "Banana, yogurt, avocado, fruit, or beans can contribute potassium depending on the portion."),

(["what is an iron rich snack", "iron snack ideas", "snacks with iron"],
 "Roasted chickpeas, pumpkin seeds, lentil-based foods, or fortified cereals can contribute dietary iron."),

(["what is a calcium rich snack", "calcium snack ideas", "snacks with calcium"],
 "Plain yogurt, milk, fortified plant milk, or calcium-set tofu can provide calcium."),

(["what is a magnesium rich snack", "magnesium snack ideas", "snacks with magnesium"],
 "Nuts, seeds, whole grains, and legumes can provide magnesium."),

(["what is a vitamin c rich snack", "vitamin c snack ideas", "snacks with vitamin c"],
 "Oranges, guava, kiwi, strawberries, and capsicum can provide vitamin C."),

(["what is a vitamin e rich snack", "vitamin e snack ideas", "snacks with vitamin e"],
 "Almonds, sunflower seeds, peanuts, and avocado can contribute vitamin E."),

(["what is a vitamin b12 rich snack", "b12 snack ideas", "snacks with b12"],
 "Eggs, dairy products, fish, and fortified foods can provide vitamin B12."),

(["what is a folate rich snack", "folate snack ideas", "snacks with folate"],
 "Legumes, avocado, leafy greens, and some fortified foods can provide folate."),

(["what is a zinc rich snack", "zinc snack ideas", "snacks with zinc"],
 "Pumpkin seeds, nuts, dairy, eggs, and legumes can contribute zinc."),

(["what is a selenium rich snack", "selenium snack ideas", "snacks with selenium"],
 "Eggs, dairy, fish, meat, and some nuts can provide selenium."),

(["what is a balanced snack before studying", "study snack balance", "snack before studying"],
 "A balanced study snack can combine protein or healthy fat with fruit, vegetables, or a whole-grain carbohydrate."),

(["what is a balanced snack after studying", "snack after studying", "food after study"],
 "Choose a snack based on hunger and the next meal. Fruit with yogurt, nuts, or a small sandwich can be practical."),

(["what should i eat during a long coding session", "coding session food", "food during long study"],
 "Keep water nearby and choose practical snacks such as fruit, yogurt, nuts, roasted chickpeas, or a balanced sandwich if hungry."),

(["how can i avoid overeating while gaming", "gaming snacks", "food while gaming"],
 "Portion snacks before starting, avoid eating directly from large packets, and take regular breaks to check hunger."),

(["how can i avoid sugary drinks while gaming", "gaming drinks", "healthy drinks while gaming"],
 "Keep water or unsweetened drinks nearby so sugary beverages are not the default choice."),

(["what is a healthy screen time snack", "screen time snack", "healthy snack while watching"],
 "Pre-portioned nuts, fruit, popcorn, vegetables with hummus, or yogurt can be better choices than continuously eating from large packets."),

(["why does screen eating cause overeating", "eating while watching", "distracted eating screen"],
 "Screens can reduce attention to hunger and fullness cues, making it easier to eat more than intended."),

(["how can i stop eating while watching tv", "tv snacking control", "stop screen eating"],
 "Serve a planned portion, eat at a table when possible, and keep meals and snacks separate from continuous screen time."),

(["what is a healthy movie snack", "movie snack ideas", "healthy snacks for movies"],
 "Air-popped popcorn, fruit, roasted chickpeas, or a modest portion of nuts can be practical movie snacks."),

(["can popcorn be high fiber", "popcorn fiber", "is popcorn a whole grain"],
 "Popcorn is a whole grain and can provide fiber, especially when prepared with limited added fat and salt."),

(["what is air popped popcorn", "air popped popcorn meaning", "how to make air popcorn"],
 "Air-popped popcorn is popped using hot air rather than submerged in oil, which can reduce added fat."),

(["what is roasted chickpea snack", "roasted chickpeas", "chana snack nutrition"],
 "Roasted chickpeas provide plant protein and fiber and can be a convenient crunchy snack."),

(["what is a balanced evening snack", "evening snack balance", "healthy evening food"],
 "A balanced evening snack can include protein and fiber, such as yogurt with fruit or hummus with vegetables."),

(["what is a healthy pre sleep snack", "pre sleep snack", "bedtime snack ideas"],
 "If hungry before bed, choose a small snack such as milk, plain yogurt, or fruit with a modest amount of nuts."),

(["can eating protein before sleep build muscle", "bedtime protein muscle", "protein before bed muscle"],
 "Protein before sleep can contribute to daily protein intake and overnight muscle protein synthesis, but total daily protein remains important."),

(["what is casein protein", "casein meaning", "casein food sources"],
 "Casein is a major milk protein that digests relatively slowly compared with whey."),

(["what is whey protein", "whey meaning", "whey protein sources"],
 "Whey is a milk-derived protein that provides all essential amino acids and is commonly used in protein supplements."),

(["whey vs casein", "compare whey and casein", "whey or casein protein"],
 "Whey is generally digested more quickly, while casein digests more slowly. Both can provide high-quality protein."),

(["is whey protein vegetarian", "whey vegetarian", "can vegetarians use whey"],
 "Whey comes from milk, so it is generally considered vegetarian but is not vegan."),

(["is whey protein vegan", "vegan whey protein", "can vegans take whey"],
 "No. Whey is derived from milk and is therefore not vegan."),

(["what is plant protein powder", "plant protein supplement", "vegan protein powder"],
 "Plant protein powders are made from sources such as peas, soy, rice, or other plants and can supplement dietary protein."),

(["is soy protein powder healthy", "soy protein powder benefits", "soy protein supplement"],
 "Soy protein powder can provide high-quality plant protein and can be useful when dietary protein needs are difficult to meet."),

(["how much protein powder should i take", "protein powder serving", "protein supplement amount"],
 "The appropriate amount depends on how much protein you already get from food and your individual needs. Follow the product label and avoid unnecessary excess."),

(["can protein powder cause digestive problems", "protein powder digestion", "protein shake bloating"],
 "Some protein powders can cause bloating or digestive discomfort depending on ingredients, lactose content, sweeteners, and individual tolerance."),

(["how to choose a low sugar protein powder", "low sugar protein powder", "protein powder label"],
 "Check protein per serving, added sugar, total calories, ingredient list, and serving size."),

(["what is creatine monohydrate", "creatine monohydrate meaning", "creatine supplement"],
 "Creatine monohydrate is the most extensively studied common form of creatine supplement and supports rapid energy production during high-intensity activity."),

(["does creatine contain calories", "creatine calories", "creatine nutrition"],
 "Creatine itself contributes little to dietary energy in the way carbohydrates, fats, and proteins do."),

(["does creatine cause water weight", "creatine water retention", "creatine weight increase"],
 "Creatine can increase water stored within muscle cells, which may increase body weight without representing body-fat gain."),

(["when should creatine be taken", "creatine timing", "best time for creatine"],
 "Consistency matters more than a specific time of day for creatine supplementation."),

(["should everyone take creatine", "creatine supplement need", "who should use creatine"],
 "Creatine is optional and is not necessary for everyone. People with medical conditions should discuss supplements with a healthcare professional."),

(["what is pre workout supplement", "pre workout meaning", "pre workout supplement"],
 "Pre-workout supplements are products containing ingredients intended to support exercise performance or alertness. Formulations vary widely."),

(["are pre workout supplements necessary", "do i need pre workout", "pre workout necessity"],
 "No. A balanced meal, hydration, sleep, and appropriate training are more fundamental than pre-workout supplements."),

(["what is caffeine in pre workout", "pre workout caffeine", "caffeine supplement before gym"],
 "Caffeine is commonly included in pre-workout products because it can increase alertness and perceived energy, but excessive amounts can cause side effects."),

(["can pre workout affect sleep", "pre workout sleep", "caffeine before evening workout"],
 "Caffeinated pre-workout products can interfere with sleep if taken too close to bedtime."),

(["what is electrolyte powder", "electrolyte powder meaning", "electrolyte supplement"],
 "Electrolyte powders provide minerals such as sodium and potassium, sometimes with carbohydrate. They are most useful when electrolyte losses are significant."),

(["are electrolyte powders necessary", "do i need electrolyte powder", "electrolyte supplement necessity"],
 "Most people do not need electrolyte powders for ordinary daily hydration. They may be useful in specific situations involving substantial fluid or electrolyte losses."),

(["what is a hydration reminder", "water reminder feature", "Nutri AI hydration reminder"],
 "A hydration reminder can prompt users to drink fluids at intervals and help maintain consistent hydration habits."),

(["what is meal reminder", "meal reminder feature", "Nutri AI meal reminder"],
 "A meal reminder can help users maintain a regular eating routine, especially during busy study or work schedules."),

(["what is nutrition notification", "nutrition app notifications", "Nutri AI notification"],
 "Nutrition notifications can remind users about meals, hydration, food logging, or planned wellness activities."),

(["what is daily food goal", "nutrition goal tracker", "daily nutrition target"],
 "A daily food goal is a target such as adequate protein, vegetables, hydration, or an estimated energy range based on the user's needs."),

(["what is habit tracker in Nutri AI", "nutrition habit tracker", "Nutri AI habits"],
 "A habit tracker can record behaviors such as drinking water, eating vegetables, logging meals, or exercising consistently."),

(["what is streak feature in nutrition app", "Nutri AI streak", "nutrition habit streak"],
 "A streak feature tracks consecutive days of completing selected habits. It should encourage consistency without making users feel guilty for missing a day."),

(["how can gamification help nutrition app", "nutrition app gamification", "Nutri AI gamification"],
 "Simple goals, progress indicators, and optional rewards can make habit tracking more engaging when they encourage healthy behaviors without promoting extreme restriction."),

(["what is a nutrition achievement", "Nutri AI achievements", "nutrition app badges"],
 "An achievement can recognize behaviors such as logging meals consistently, meeting hydration goals, or trying varied foods."),

(["why should Nutri AI avoid weight shame", "nutrition app body image safety", "weight stigma in AI"],
 "Nutrition tools should focus on health behaviors and individual goals rather than shame or negative judgments about body size."),

(["how should Nutri AI talk about weight", "safe weight language", "weight neutral nutrition"],
 "Use neutral, respectful language and focus on measurable health behaviors rather than moral judgments about body size."),

(["what is weight neutral nutrition", "weight neutral approach", "weight neutral eating"],
 "A weight-neutral approach focuses on nutrition, activity, well-being, and sustainable habits without making body weight the sole measure of health."),

(["can Nutri AI support general wellness", "Nutri AI wellness", "AI wellness assistant"],
 "Yes. Nutri AI can provide general food, hydration, activity, and lifestyle information while staying within non-medical wellness guidance."),

(["what is the difference between nutrition and medical advice", "nutrition advice vs medical advice", "medical nutrition guidance"],
 "General nutrition information is educational, while medical nutrition advice is individualized and may require clinical assessment by a qualified professional."),

(["why should Nutri AI ask for consent", "AI health data consent", "nutrition app user consent"],
 "Users should understand and agree to how their personal information is collected and used, especially when sensitive wellness data is involved."),

(["what is data minimization", "health app data minimization", "collect less user data"],
 "Data minimization means collecting only the information necessary for the app's stated purpose."),

(["why is secure storage important for Nutri AI", "nutrition app security", "health data security"],
 "Secure storage helps protect personal and wellness information from unauthorized access."),

(["what is privacy by design", "privacy by design meaning", "secure nutrition app design"],
 "Privacy by design means considering data protection from the beginning of the application's design rather than adding it later."),

(["what is user consent in an AI app", "AI consent meaning", "user consent nutrition app"],
 "User consent means the person is clearly informed about relevant data use and voluntarily agrees to it."),

(["can Nutri AI share user data", "nutrition app data sharing", "Nutri AI privacy"],
 "User data should only be shared according to clearly stated privacy practices and applicable permissions or consent."),

(["what is anonymized health data", "anonymized nutrition data", "anonymous health data"],
 "Anonymized data is processed so it is not reasonably linked back to an identifiable individual, although the effectiveness of anonymization depends on the method."),

(["why should AI recommendations be explainable", "explainable nutrition AI", "AI recommendation explanation"],
 "Explainable recommendations help users understand why a suggestion was made and make errors easier to identify."),

(["what is explainable AI", "XAI meaning", "explainable artificial intelligence"],
 "Explainable AI refers to systems that provide understandable reasons or factors behind their outputs."),

(["what is bias in nutrition AI", "AI nutrition bias", "bias in food recommendations"],
 "Bias can occur when training data, rules, or assumptions do not represent different users fairly. Testing across diverse cases can help identify it."),

(["how can Nutri AI reduce bias", "reduce AI nutrition bias", "fair nutrition recommendations"],
 "Use diverse training examples, avoid unsupported assumptions, test different dietary patterns, and make recommendations transparent."),

(["why should Nutri AI support multiple diets", "diet diversity in AI", "different dietary preferences"],
 "Supporting different dietary preferences makes recommendations more relevant to users with vegetarian, vegan, non-vegetarian, cultural, or other food patterns."),

(["what is culturally appropriate nutrition", "cultural food preferences", "culturally relevant diet"],
 "Culturally appropriate nutrition respects local foods, traditions, preferences, budgets, and eating patterns while maintaining nutritional adequacy."),

(["can Nutri AI recommend Indian foods", "Indian food recommendations AI", "Nutri AI Indian meals"],
 "Yes. Nutri AI can include foods such as dal, roti, rice, idli, dosa, poha, vegetables, curd, paneer, eggs, and other foods according to user preference."),

(["can Nutri AI recommend Maharashtrian food", "Maharashtrian food nutrition", "AI Maharashtrian meals"],
 "Yes. General recommendations can incorporate familiar Maharashtrian foods while considering portions, protein, vegetables, and overall balance."),

(["how can traditional food fit healthy diet", "traditional food nutrition", "healthy traditional meals"],
 "Traditional foods can fit a healthy diet when portions, preparation methods, variety, and overall nutritional balance are considered."),

(["is homemade Indian food healthy", "Indian home food nutrition", "home cooked Indian meals"],
 "Homemade Indian meals can be nutritious when they include vegetables, protein-rich foods, suitable carbohydrates, and moderate oil and salt."),

(["how to reduce oil in Indian cooking", "less oil Indian food", "reduce cooking oil"],
 "Measure oil, use appropriate cookware, sauté with small amounts, and use steaming, pressure cooking, baking, or roasting when suitable."),

(["how to increase protein in Indian meals", "Indian high protein meal", "add protein to Indian food"],
 "Add dal, beans, chickpeas, soy foods, paneer, curd, eggs, fish, or chicken according to dietary preference."),

(["how to increase vegetables in Indian meals", "add vegetables to Indian diet", "more vegetables Indian meals"],
 "Add vegetables to poha, upma, dal, rice, roti meals, curries, sandwiches, soups, and snacks."),

(["how to increase fiber in Indian meals", "Indian high fiber diet", "fiber rich Indian foods"],
 "Use whole-grain roti, oats, brown rice or other whole grains, dal, beans, vegetables, fruits, nuts, and seeds."),

(["how to reduce sugar in Indian diet", "less sugar Indian diet", "reduce sweets"],
 "Limit sugary drinks and frequent sweets, use whole fruit for sweetness, and reduce added sugar gradually in tea and homemade foods."),

(["how to reduce salt in Indian diet", "less salt Indian food", "reduce sodium Indian meals"],
 "Use herbs, spices, lemon, garlic, ginger, and other flavorings while reducing added salt and highly processed foods."),

(["how to make Indian snacks healthier", "healthy Indian snacks", "Indian snack alternatives"],
 "Choose roasted chana, fruit, nuts, yogurt, steamed foods, or homemade snacks instead of relying frequently on deep-fried foods."),

(["is dhokla healthy", "dhokla nutrition", "dhokla benefits"],
 "Dhokla can be a nutritious snack because it is steamed and can provide carbohydrate and some protein, especially when made with legumes."),

(["is handvo healthy", "handvo nutrition", "handvo benefits"],
 "Handvo can provide grains, lentils, and vegetables depending on the recipe. Portion size and added oil affect the final meal."),

(["is thepla healthy", "thepla nutrition", "can i eat thepla"],
 "Thepla can fit into a balanced diet. Using whole-grain flour and moderate oil and pairing it with vegetables or curd can improve the meal."),

(["is paratha healthy", "paratha nutrition", "can i eat paratha"],
 "Paratha can fit into a balanced diet, but added oil or ghee can make it energy-dense. Pair it with vegetables or protein-rich foods."),

(["how to make paratha healthier", "healthy paratha", "lower oil paratha"],
 "Use whole-grain flour, add vegetables when suitable, and use a moderate amount of oil or ghee."),

(["is stuffed paratha healthy", "stuffed paratha nutrition", "healthy stuffed paratha"],
 "Stuffed paratha can be nutritious when filled with vegetables or protein-rich ingredients and prepared with moderate oil."),

(["is dosa good for protein", "dosa protein", "protein in dosa"],
 "Dosa provides some protein from its fermented grain-and-legume batter, but adding sambar or another protein source can make the meal more protein-rich."),

(["is idli good for protein", "idli protein", "protein in idli"],
 "Idli provides some protein from its rice-and-legume batter. Sambar or other protein-rich sides can increase the meal's protein content."),

(["can sambar count as protein", "sambar protein", "protein in sambar"],
 "Yes. Sambar contains lentils, which contribute plant protein, although the total amount depends on the recipe and serving size."),

(["is dal protein enough", "dal protein quality", "protein from dal"],
 "Dal is a useful plant protein source. Combining it with other foods across the day can help meet overall protein needs."),

(["how much dal should i eat", "dal serving size", "portion of dal"],
 "A suitable dal portion depends on your energy and protein needs and what else is included in the meal."),

(["can dal and rice make complete protein", "dal rice protein", "dal rice amino acids"],
 "Dal and rice complement each other in amino acid profiles, making them a useful traditional combination for plant protein."),

(["what is amino acid complementation", "complementary proteins", "protein complementation"],
 "Protein complementation means combining different plant foods whose amino acid patterns complement one another across a meal or day."),

(["can beans and rice be combined", "beans rice protein", "beans with rice"],
 "Yes. Beans and rice provide complementary plant proteins and can form part of a balanced meal."),

(["can peanut butter and bread be healthy", "peanut butter bread", "bread with peanut butter"],
 "Whole-grain bread with a moderate amount of peanut butter can provide carbohydrate, protein, fiber, and unsaturated fat."),

(["can oats and milk be healthy", "oats milk combination", "milk oats breakfast"],
 "Oats with milk can provide carbohydrate, protein, calcium, and fiber and can be a balanced breakfast base."),

(["can yogurt and oats be healthy", "yogurt oats combination", "oats with yogurt"],
 "Yogurt and oats can provide protein, calcium, carbohydrate, and fiber and work well with fruit or seeds."),

(["can eggs and roti be healthy", "egg roti meal", "roti with eggs"],
 "Eggs and roti can form a balanced meal by combining protein with carbohydrate. Adding vegetables can improve variety."),

(["can dal roti be a balanced meal", "dal roti nutrition", "roti with dal"],
 "Dal and roti provide complementary plant proteins, carbohydrates, and fiber. Adding vegetables can make the meal more complete."),

(["can rice dal be a balanced meal", "dal rice nutrition", "rice with dal"],
 "Dal and rice can form a balanced meal providing carbohydrate and plant protein. Vegetables can add fiber and micronutrients."),

(["can curd rice be high protein", "curd rice protein", "increase protein in curd rice"],
 "Curd rice provides some protein, but adding lentils, vegetables, eggs, tofu, or another protein source can increase the meal's protein content."),

(["can poha be high protein", "protein poha", "increase protein in poha"],
 "Add peanuts, peas, soy chunks, eggs, or another protein source to increase the protein content of poha."),

(["can upma be high protein", "protein upma", "increase protein in upma"],
 "Add peas, lentils, peanuts, soy foods, eggs, or yogurt alongside upma to increase protein."),

(["can oats be high protein", "protein oats", "increase protein in oats"],
 "Add milk, Greek yogurt, soy milk, nuts, seeds, or protein powder if appropriate to increase protein in oats."),

(["can smoothie be high protein", "protein smoothie", "high protein smoothie"],
 "Add Greek yogurt, milk, soy milk, tofu, or an appropriate protein powder to increase protein in a smoothie."),

(["how to make smoothie lower sugar", "low sugar smoothie", "reduce smoothie sugar"],
 "Use whole fruit rather than juice, limit added sweeteners, and include vegetables or plain yogurt for balance."),

(["how to make smoothie higher fiber", "high fiber smoothie", "fiber rich smoothie"],
 "Use whole fruit, vegetables, oats, chia seeds, flaxseed, or other fiber-rich ingredients."),

(["how to make smoothie more filling", "filling smoothie", "satiety smoothie"],
 "Include protein, fiber, and a moderate amount of healthy fat, such as yogurt with fruit and seeds."),

(["is fruit smoothie good for breakfast", "smoothie breakfast", "fruit smoothie breakfast"],
 "A fruit smoothie can be a breakfast component, but adding protein and fiber makes it more balanced and filling."),

(["what is a balanced smoothie recipe", "balanced smoothie formula", "smoothie meal balance"],
 "Use a fruit or vegetable base, a protein source, a fiber source, and a suitable liquid while limiting added sugar."),

(["what is a healthy juice", "healthy juice options", "fruit juice choice"],
 "If choosing juice, prefer unsweetened options and moderate portions. Whole fruit generally provides more fiber and fullness."),

(["can vegetable juice replace vegetables", "vegetable juice vs vegetables", "juice instead of vegetables"],
 "Vegetable juice can provide some nutrients but does not fully replace the fiber and chewing benefits of whole vegetables."),

(["is fresh juice healthier than packaged juice", "fresh vs packaged juice", "juice comparison"],
 "Fresh juice may avoid some added ingredients, but both fresh and packaged juice can be concentrated sources of sugar and have less fiber than whole fruit."),

(["what is pulp in juice", "juice pulp meaning", "fiber in fruit juice pulp"],
 "Pulp contains some of the fruit's solid components and can provide more fiber than clear juice."),

(["what is a whole fruit snack", "whole fruit snack meaning", "fruit snack"],
 "A whole fruit snack is an intact fruit eaten as food, providing water, fiber, natural sugars, vitamins, and plant compounds."),

(["why is chewing fruit useful", "whole fruit chewing", "fruit satiety"],
 "Chewing whole fruit takes more time and preserves its food structure, which can contribute to fullness."),

(["can fruit be frozen at home", "freeze fruit", "how to freeze fruit"],
 "Many fruits can be frozen after appropriate washing and preparation. Frozen fruit can be useful for smoothies and snacks."),

(["does freezing fruit add sugar", "frozen fruit sugar", "plain frozen fruit"],
 "Plain frozen fruit does not require added sugar. Check the package if buying processed frozen fruit products."),

(["what is dried fruit", "dried fruit meaning", "how fruit is dried"],
 "Dried fruit is fruit with much of its water removed, making its nutrients and natural sugars more concentrated by weight."),

(["why dried fruit is easy to overeat", "dried fruit calories", "dried fruit portion"],
 "Removing water makes dried fruit smaller and more calorie-dense, so it is easy to eat a larger amount than fresh fruit."),

(["what is a healthy fruit portion", "fruit serving size", "how much fruit should i eat"],
 "A useful approach is to include fruit regularly and vary types and portions according to your overall energy and nutritional needs."),

(["can i eat multiple fruits together", "fruit combination", "mixing fruits"],
 "Yes. Combining different fruits is fine and can increase dietary variety."),

(["is fruit salad healthy", "fruit salad nutrition", "fruit salad benefits"],
 "Fruit salad can be a nutritious way to eat a variety of fruits. Avoid unnecessary added sugar or syrup."),

(["how to make fruit salad healthier", "healthy fruit salad", "fruit salad tips"],
 "Use a variety of fresh fruits and add plain yogurt, nuts, or seeds if you want more protein or healthy fat."),

(["can i add nuts to fruit salad", "fruit salad with nuts", "nuts and fruit"],
 "Yes. Nuts can add protein, unsaturated fats, fiber, and texture to fruit salad."),

(["can yogurt be added to fruit salad", "fruit yogurt bowl", "fruit with yogurt"],
 "Yes. Plain yogurt adds protein and calcium and can make a fruit snack more filling."),

(["what is a yogurt bowl", "yogurt bowl nutrition", "healthy yogurt bowl"],
 "A yogurt bowl can combine plain yogurt with fruit, oats, nuts, seeds, or other nutritious toppings."),

(["how to make yogurt bowl high protein", "high protein yogurt bowl", "protein yogurt bowl"],
 "Use Greek yogurt or another high-protein yogurt and add seeds or nuts for additional protein."),

(["how to make yogurt bowl low sugar", "low sugar yogurt bowl", "healthy low sugar yogurt"],
 "Choose plain yogurt, use whole fruit for sweetness, and avoid large amounts of syrups or sweetened toppings."),

(["what is a healthy nut butter", "nut butter selection", "best nut butter"],
 "Choose nut butter with a simple ingredient list and moderate added sugar and salt."),

(["almond butter vs peanut butter", "compare almond and peanut butter", "almond butter or peanut butter"],
 "Both provide protein and unsaturated fats. Peanut butter is often more affordable and slightly higher in protein, while almond butter provides substantial vitamin E and magnesium."),

(["cashew butter vs peanut butter", "compare cashew butter and peanut butter", "cashew butter or peanut butter"],
 "Both provide unsaturated fats and some protein. Nutrient profiles and calories are similar enough that portion and preference can guide the choice."),

(["what is tahini", "tahini meaning", "sesame paste nutrition"],
 "Tahini is a paste made from sesame seeds and provides unsaturated fats, protein, minerals, and flavor."),

(["is tahini healthy", "tahini benefits", "can i eat tahini"],
 "Tahini can be a nutritious source of unsaturated fats, protein, and minerals, but it is energy-dense so portions matter."),

(["what is hummus made of", "hummus ingredients", "hummus composition"],
 "Traditional hummus commonly contains chickpeas, tahini, lemon, garlic, and oil."),

(["is hummus high in protein", "hummus protein", "protein in hummus"],
 "Hummus provides some plant protein, although its protein content varies and it is not as protein-dense as many dedicated protein foods."),

(["what is falafel", "falafel nutrition", "is falafel healthy"],
 "Falafel is commonly made from ground legumes and spices. Traditional falafel is often fried, which increases its energy content."),

(["baked falafel vs fried falafel", "baked falafel", "falafel cooking method"],
 "Baked falafel generally uses less added oil than deep-fried falafel while retaining the legume-based protein and fiber."),

(["what are benefits of peas", "green peas benefits", "peas nutrition"],
 "Green peas provide carbohydrate, plant protein, fiber, vitamin C, vitamin K, and folate."),

(["are peas a protein source", "pea protein food", "protein in green peas"],
 "Peas provide plant protein and can contribute to total daily protein intake."),

(["what are benefits of edamame", "edamame nutrition", "soybean snack benefits"],
 "Edamame provides plant protein, fiber, folate, vitamin K, and other nutrients."),

(["what are benefits of soy chunks", "soy chunks nutrition", "soy chunks protein"],
 "Soy chunks provide concentrated plant protein and can be useful in vegetarian meals."),

(["are soy chunks high protein", "soy chunk protein", "protein in soy chunks"],
 "Yes. Soy chunks are a relatively concentrated plant protein food."),

(["how to cook soy chunks", "soy chunks preparation", "ways to eat soy chunks"],
 "Soy chunks can be rehydrated and added to curries, pulao, wraps, salads, or stir-fries."),

(["what is textured vegetable protein", "TVP meaning", "textured soy protein"],
 "Textured vegetable protein is commonly made from soy and provides a convenient plant-based protein source."),

(["what are benefits of peas protein", "pea protein benefits", "pea protein source"],
 "Pea protein can provide essential amino acids and is commonly used in plant-based protein foods and supplements."),

(["what is nutritional yeast", "nutritional yeast meaning", "nutritional yeast benefits"],
 "Nutritional yeast is an inactive yeast product used for flavor and can provide protein and B vitamins, especially when fortified."),

(["is nutritional yeast vegan", "nutritional yeast vegan", "can vegans eat nutritional yeast"],
 "Yes. Nutritional yeast is a plant-based food and is commonly used in vegan diets."),

(["what is fortified nutritional yeast", "fortified nutritional yeast", "B12 nutritional yeast"],
 "Fortified nutritional yeast has vitamins such as B12 added to it, depending on the product."),

(["what is a healthy vegan cheese alternative", "vegan cheese nutrition", "plant cheese"],
 "Vegan cheese products vary widely. Compare protein, saturated fat, sodium, and calcium fortification rather than assuming all are nutritionally equivalent to dairy cheese."),

(["what is calcium set tofu", "calcium tofu", "tofu calcium"],
 "Calcium-set tofu is made using calcium salts and can provide a useful amount of calcium."),

(["how to identify calcium set tofu", "tofu calcium label", "check tofu calcium"],
 "Check the nutrition label for calcium content and the ingredient list for calcium salts such as calcium sulfate."),

(["what is tempeh made from", "tempeh ingredients", "tempeh composition"],
 "Tempeh is traditionally made from fermented soybeans and forms a firm, protein-rich food."),

(["what is seitan made from", "seitan ingredients", "seitan composition"],
 "Seitan is primarily made from wheat gluten and is therefore unsuitable for people who need to avoid gluten."),

(["what is plant based yogurt", "plant yogurt meaning", "vegan yogurt"],
 "Plant-based yogurt is made from ingredients such as soy, coconut, oats, or nuts. Protein and calcium content vary by product."),

(["which plant yogurt has most protein", "high protein plant yogurt", "soy yogurt protein"],
 "Soy-based yogurt often provides more protein than many coconut- or almond-based options, but labels should be compared."),

(["what is coconut yogurt nutrition", "coconut yogurt", "coconut yogurt healthy"],
 "Coconut yogurt can be creamy and useful for dairy-free diets, but many versions are low in protein and may contain added sugar."),

(["what is soy yogurt nutrition", "soy yogurt benefits", "soy yogurt protein"],
 "Soy yogurt can provide plant protein and may be fortified with calcium and vitamin D."),

(["what is oat milk nutrition", "oat milk benefits", "oat milk protein"],
 "Oat milk provides carbohydrate and may be fortified with calcium and vitamin D, but it is usually lower in protein than soy milk."),

(["what is almond milk nutrition", "almond milk benefits", "almond milk protein"],
 "Almond milk is typically low in protein but may be fortified with calcium and vitamin D. Unsweetened versions contain less added sugar."),

(["what is pea milk", "pea milk nutrition", "pea protein milk"],
 "Pea milk is a plant-based beverage made using pea protein and is often higher in protein than almond or oat beverages."),

(["what is a balanced dairy free meal", "dairy free balanced meal", "non dairy meal"],
 "A dairy-free meal can include plant protein, vegetables, whole grains, fruit, nuts, seeds, and fortified dairy alternatives."),

(["what is a balanced gluten free meal", "gluten free balanced meal", "healthy gluten free meal"],
 "A gluten-free meal can use rice, quinoa, potatoes, legumes, vegetables, fruit, nuts, seeds, and gluten-free protein foods."),

(["what is a balanced low sodium meal", "low sodium balanced meal", "healthy low salt meal"],
 "A low-sodium meal can emphasize fresh foods, vegetables, legumes, whole grains, and minimally processed protein while limiting salty sauces and packaged foods."),

(["what is a balanced high fiber meal", "high fiber meal", "fiber rich balanced meal"],
 "A high-fiber meal can combine legumes, vegetables, whole grains, fruit, nuts, or seeds while including adequate fluids."),

(["what is a balanced high protein meal", "high protein balanced meal", "protein rich balanced meal"],
 "A high-protein balanced meal can combine a protein source with vegetables, a suitable carbohydrate, and healthy fats."),

(["what is a balanced low calorie meal", "low calorie balanced meal", "lighter meal"],
 "A lower-calorie meal can emphasize vegetables, lean protein, fruit, and moderate portions of carbohydrate and healthy fats."),

(["what is a balanced high calorie meal", "high calorie balanced meal", "energy dense balanced meal"],
 "A higher-calorie meal can include nutrient-dense foods such as whole grains, legumes, dairy, nuts, seeds, avocado, and healthy oils."),

(["how to make food more nutritious", "improve meal nutrition", "upgrade a meal"],
 "Add vegetables, fruit, protein, whole grains, legumes, nuts, or seeds and reduce unnecessary excess sugar, salt, and oil."),

(["how to add protein to any meal", "easy protein additions", "increase meal protein"],
 "Add eggs, yogurt, milk, beans, lentils, tofu, paneer, chicken, fish, nuts, or seeds depending on the meal."),

(["how to add fiber to any meal", "easy fiber additions", "increase meal fiber"],
 "Add vegetables, fruit, legumes, whole grains, nuts, or seeds to meals."),

(["how to add healthy fats to meals", "healthy fat additions", "add healthy fats"],
 "Use moderate portions of nuts, seeds, avocado, olive oil, or other unsaturated-fat-rich foods."),

(["how to reduce calories in meals", "lower calorie meal tips", "reduce meal calories"],
 "Reduce excessive oils, sugary sauces, large portions, and calorie-dense extras while increasing vegetables and maintaining adequate protein."),

(["how to increase calories in meals", "increase meal calories", "add calories healthy"],
 "Increase portions of whole grains, legumes, dairy, nuts, seeds, avocado, or healthy oils while maintaining a balanced meal."),

(["how to make a meal more filling", "increase meal satiety", "make food more filling"],
 "Include protein, fiber-rich foods, vegetables, adequate fluids, and an appropriate portion of carbohydrate."),

(["how to make a meal easier to digest", "easy digestion meal", "digestible food"],
 "Choose familiar foods, moderate portions, appropriate cooking methods, and avoid very heavy or highly fatty meals if they cause discomfort."),

(["what is a light meal", "light meal meaning", "healthy light meal"],
 "A light meal is usually smaller and easier to digest while still providing useful nutrients."),

(["what is a heavy meal", "heavy meal meaning", "why meals feel heavy"],
 "A heavy meal is often large or high in fat, fiber, or other components that may slow digestion and create fullness."),

(["why do fatty meals feel heavy", "fatty food digestion", "high fat meal feeling"],
 "Fat can slow stomach emptying, so large high-fat meals may feel heavier and take longer to digest."),

(["why do large meals cause sleepiness", "food coma meaning", "sleepy after eating"],
 "Large meals can make some people feel sleepy or sluggish due to meal size, digestion, blood glucose changes, and individual responses."),

(["how to avoid feeling sleepy after lunch", "post lunch sleepiness", "avoid food coma"],
 "Choose a moderate lunch, include protein and fiber, avoid very large portions, hydrate normally, and take a short walk if practical."),

(["what is a balanced office lunch", "office lunch nutrition", "healthy work lunch"],
 "A balanced office lunch can include protein, vegetables, whole grains or another carbohydrate, and water."),

(["what is a healthy packed lunch", "packed lunch ideas", "healthy lunch box"],
 "Pack a protein source, whole-grain carbohydrate, vegetables or fruit, and a safe drink such as water."),

(["how to keep packed food safe", "lunchbox food safety", "safe packed lunch"],
 "Use clean containers, keep perishable foods at safe temperatures, and follow appropriate storage times."),

(["what is a thermos meal", "thermos food", "healthy thermos lunch"],
 "A thermos can keep suitable hot foods such as dal, soup, or khichdi warm for later eating when used correctly."),

(["is homemade soup good for lunch", "soup lunch", "homemade soup nutrition"],
 "Homemade soup can be a nutritious lunch when it contains vegetables and adequate protein and carbohydrate."),

(["is dal soup healthy", "lentil soup benefits", "dal soup nutrition"],
 "Lentil soup provides plant protein, fiber, and fluid and can be part of a balanced meal."),

(["is chicken soup healthy", "chicken soup nutrition", "chicken soup benefits"],
 "Chicken soup can provide protein and fluid. Adding vegetables and an appropriate carbohydrate can make it more balanced."),

(["is vegetable soup enough", "vegetable soup meal", "vegetable soup protein"],
 "Vegetable soup alone may be low in protein. Adding beans, lentils, tofu, chicken, or another protein source can make it more complete."),

(["what is a protein soup", "high protein soup", "protein rich soup"],
 "A protein-rich soup can use lentils, beans, chicken, fish, tofu, or other protein foods as a main ingredient."),

(["what is a healthy dinner soup", "soup for dinner", "balanced soup dinner"],
 "A dinner soup can be balanced by including protein, vegetables, and a suitable carbohydrate source."),

(["what is a healthy breakfast bowl", "breakfast bowl nutrition", "balanced breakfast bowl"],
 "A breakfast bowl can combine oats or another whole grain with yogurt or milk, fruit, nuts, and seeds."),

(["what is a savory breakfast bowl", "savory breakfast bowl", "healthy savory breakfast"],
 "A savory breakfast bowl can combine eggs or tofu with vegetables and a whole-grain carbohydrate."),

(["what is a healthy lunch bowl", "lunch bowl nutrition", "balanced lunch bowl"],
 "A lunch bowl can combine vegetables, protein, whole grains or another carbohydrate, and a moderate amount of healthy fat."),

(["what is a healthy dinner bowl", "dinner bowl nutrition", "balanced dinner bowl"],
 "A dinner bowl can combine protein, vegetables, carbohydrate, and healthy fats in portions appropriate for your needs."),

(["what is a balanced plate method", "plate method nutrition", "healthy plate method"],
 "The plate method is a simple way to build meals by emphasizing vegetables and fruit along with protein and a suitable carbohydrate portion."),

(["why use the plate method", "plate method benefits", "how plate method helps"],
 "The plate method provides a visual framework for balanced portions without requiring exact calorie counting."),

(["can plate method work for Indian food", "Indian plate method", "plate method Indian diet"],
 "Yes. Dal, vegetables, roti or rice, curd, and other protein foods can be arranged using the same balanced-plate principles."),

(["what is portion estimation without scale", "estimate food portions", "portion without weighing"],
 "Use familiar household measures, hand-size estimates, or plate proportions when a food scale is unavailable."),

(["can hand method estimate portions", "hand portion method", "portion using hand"],
 "Hand-size estimates can provide a simple rough guide for protein, carbohydrates, fats, and vegetables, though they are not exact."),

(["what is palm size protein portion", "palm protein portion", "hand portion protein"],
 "A palm-size estimate is sometimes used as a simple guide for a protein serving, but exact needs vary by person and food."),

(["what is fist size vegetable portion", "fist vegetable portion", "hand method vegetables"],
 "A fist-size estimate can be used as a rough guide for a vegetable portion, though exact nutritional needs vary."),

(["what is thumb size fat portion", "thumb portion fat", "hand method fats"],
 "A thumb-size estimate is sometimes used as a rough guide for calorie-dense fats such as oils or nut butter."),

(["why portion guides are approximate", "portion estimate accuracy", "hand portion limitations"],
 "Food density and individual needs vary, so hand-based portions are rough guides rather than exact nutritional measurements."),

(["what is a food exchange", "food exchange system", "nutrition food exchanges"],
 "A food exchange system groups foods with similar nutritional characteristics so one food can sometimes be substituted for another."),

(["can i substitute rice with roti", "rice roti substitution", "carb food substitution"],
 "Yes. Rice and roti can often substitute for one another as carbohydrate sources, with portion adjusted to the meal."),

(["can i substitute paneer with tofu", "paneer tofu substitution", "tofu instead of paneer"],
 "Yes. Tofu can replace paneer in many dishes, although their protein, fat, and calcium contents differ."),

(["can i substitute milk with soy milk", "milk soy milk replacement", "soy milk instead of milk"],
 "Fortified soy milk can be a practical dairy alternative and generally provides more protein than many other plant milks."),

(["can i substitute sugar with fruit", "replace sugar with fruit", "fruit instead of sugar"],
 "Whole fruit can add sweetness and nutrients to foods, although it does not behave exactly like sugar in every recipe."),

(["can i substitute butter with oil", "butter oil replacement", "oil instead of butter"],
 "Oil can replace butter in some recipes, but the texture and flavor change. Choose an unsaturated oil when appropriate."),

(["can i substitute cream with yogurt", "yogurt instead of cream", "healthy cream substitute"],
 "Plain yogurt can replace some cream in certain recipes, reducing saturated fat while adding protein, although the cooking properties differ."),

(["can i substitute mayonnaise with yogurt", "yogurt instead of mayonnaise", "healthy mayo substitute"],
 "Plain yogurt can replace mayonnaise in some dressings and sandwiches and can reduce the amount of added fat."),

(["can i substitute refined flour with whole wheat", "whole wheat flour replacement", "whole grain flour swap"],
 "Whole-wheat flour can replace some or all refined flour in many recipes, increasing fiber and changing texture."),

(["can i substitute white rice with brown rice", "brown rice substitution", "brown rice instead of white rice"],
 "Yes. Brown rice can replace white rice and generally provides more fiber."),

(["can i substitute rice with quinoa", "quinoa rice replacement", "quinoa instead of rice"],
 "Yes. Quinoa can replace rice in many meals and provides fiber and relatively high-quality plant protein."),

(["can i substitute meat with beans", "beans instead of meat", "meat replacement beans"],
 "Beans can replace some meat meals by providing plant protein and fiber. Seasoning and meal composition can be adjusted."),

(["can i substitute chicken with tofu", "tofu instead of chicken", "chicken tofu replacement"],
 "Tofu can replace chicken in many recipes as a plant-based protein source."),

(["can i substitute eggs with tofu", "tofu egg replacement", "egg alternative tofu"],
 "Tofu can replace eggs in some savory dishes, though the texture and nutrient profile differ."),

(["what is nutritional yeast used for", "uses of nutritional yeast", "nutritional yeast cooking"],
 "Nutritional yeast is used to add a savory, cheese-like flavor and can provide protein and B vitamins depending on the product."),

(["what is tahini used for", "tahini uses", "how to use tahini"],
 "Tahini can be used in hummus, dressings, sauces, spreads, and bowls to add flavor and unsaturated fats."),

(["what is chia pudding", "chia pudding meaning", "chia pudding nutrition"],
 "Chia pudding is made by soaking chia seeds in a liquid until they form a gel. It provides fiber and healthy fats."),

(["how to make chia pudding", "chia pudding recipe idea", "chia pudding ingredients"],
 "Mix chia seeds with milk or a suitable alternative, refrigerate until thick, and add fruit or nuts if desired."),

(["what is overnight oats", "overnight oats meaning", "how overnight oats work"],
 "Overnight oats are oats soaked in a liquid in the refrigerator for several hours and eaten without traditional stovetop cooking."),

(["how to make overnight oats high protein", "protein overnight oats", "high protein overnight oats"],
 "Use Greek yogurt, milk, soy milk, or another protein-rich ingredient and add seeds or nuts if desired."),

(["how to make overnight oats low sugar", "low sugar overnight oats", "healthy overnight oats"],
 "Use plain oats and unsweetened milk or yogurt, then add fruit and avoid excessive syrups or added sugar."),

(["what is baked oats", "baked oats meaning", "baked oatmeal"],
 "Baked oats are oats combined with liquid and other ingredients and cooked in an oven. They can be made with fruit and protein-rich ingredients."),

(["what is savory oats", "savory oatmeal", "savory oats nutrition"],
 "Savory oats combine oats with vegetables and savory ingredients and can be made more balanced with eggs, tofu, or another protein source."),

(["what is overnight chia oats", "chia oats", "chia overnight oats"],
 "Chia overnight oats combine oats and chia seeds soaked in a liquid, providing carbohydrate, fiber, and healthy fats."),

(["what is a healthy snack before class", "snack before lecture", "college class snack"],
 "Fruit, yogurt, nuts, roasted chickpeas, or a small whole-grain snack can be practical before class."),

(["what is a healthy snack between lectures", "college break snack", "snack between classes"],
 "Choose portable foods such as fruit, nuts, roasted chickpeas, yogurt, or a simple sandwich depending on hunger."),

(["what is a healthy drink between classes", "college hydration", "drink during lectures"],
 "Water is a simple choice. Unsweetened tea can also contribute to fluid intake."),

(["how to stay hydrated during lectures", "hydration during college", "student water intake"],
 "Carry a reusable water bottle and drink regularly through the day, especially in hot weather."),

(["why carry a water bottle", "water bottle hydration", "student hydration bottle"],
 "Having water available makes regular hydration more convenient and can reduce reliance on sugary drinks."),

(["what is a reusable water bottle benefit", "hydration bottle benefit", "water bottle for students"],
 "A reusable bottle makes water accessible during study, travel, and exercise and can reduce single-use plastic use."),

(["how much water should i carry to college", "college water bottle size", "student water bottle"],
 "Bottle size can vary with climate, activity, and access to refills. The important part is having convenient access to fluids."),

(["can dehydration affect exercise performance", "dehydration workout performance", "water and gym performance"],
 "Dehydration can reduce physical performance, particularly during prolonged or hot exercise."),

(["can dehydration affect concentration", "dehydration studying", "water and concentration"],
 "Dehydration can contribute to fatigue and discomfort and may affect concentration in some situations."),

(["what is hydration before an exam", "exam hydration", "water before exam"],
 "Drink normally before an exam and avoid both dehydration and excessive fluid intake that could cause discomfort."),

(["what is a good breakfast before an exam", "exam breakfast ideas", "food before test"],
 "Choose familiar foods containing carbohydrate and protein, such as eggs with toast or oats with yogurt and fruit."),

(["what should i avoid before an exam", "foods before exam", "exam food mistakes"],
 "Avoid unfamiliar foods, very heavy meals, excessive caffeine, and foods that commonly cause you digestive discomfort."),

(["what is a healthy exam snack", "exam snack ideas", "food during exam preparation"],
 "Fruit, nuts, yogurt, roasted chickpeas, or a small sandwich can be practical study snacks."),

(["what should i eat after an exam", "post exam meal", "food after exam"],
 "Return to a normal balanced meal with protein, vegetables or fruit, carbohydrate, and fluids."),

(["how to recover after all night studying", "nutrition after all nighter", "food after no sleep"],
 "Prioritize hydration, regular balanced meals, and sleep recovery. Avoid relying heavily on high-sugar or high-caffeine foods."),

(["can energy drinks replace sleep", "energy drink instead of sleep", "caffeine and sleep deprivation"],
 "No. Energy drinks may increase alertness temporarily but cannot replace the restorative functions of adequate sleep."),

(["what should i eat after an all nighter", "food after staying awake all night", "breakfast after all nighter"],
 "Choose a normal balanced meal and hydrate. The most important recovery step is getting adequate sleep afterward."),

(["what is a healthy study break", "study break ideas", "nutrition study break"],
 "A study break can include a short walk, water, stretching, and a planned snack if you are hungry."),

(["why movement breaks help students", "study movement", "benefits of study breaks"],
 "Movement breaks interrupt prolonged sitting and can support physical comfort, circulation, and general activity levels."),

(["what is a healthy daily routine", "nutrition daily routine", "healthy lifestyle routine"],
 "A healthy routine can include balanced meals, hydration, physical activity, adequate sleep, and regular breaks from prolonged sitting."),

(["why is consistency more important than perfection", "nutrition consistency", "healthy diet consistency"],
 "Long-term habits have a greater influence than a single meal. Flexible consistency is generally easier to maintain than perfection."),

(["what is a realistic healthy lifestyle", "healthy lifestyle meaning", "sustainable healthy lifestyle"],
 "A realistic lifestyle combines nutritious food, regular movement, sufficient sleep, hydration, social well-being, and habits that fit daily life."),

(["how can i start eating healthy tomorrow", "start healthy eating", "first nutrition changes"],
 "Start with simple changes such as drinking more water, adding vegetables to one meal, including protein at breakfast, and reducing sugary drinks."),

(["what is the first step to better nutrition", "first nutrition step", "begin healthy diet"],
 "Start by observing your current eating pattern and choose one realistic improvement rather than changing everything at once."),

(["how can Nutri AI encourage healthy habits", "AI healthy habit coaching", "Nutri AI habit support"],
 "Nutri AI can provide reminders, progress tracking, meal ideas, hydration prompts, and educational information without using shame-based messaging."),

(["what is a nutrition chatbot response", "AI nutrition response", "chatbot nutrition answer"],
 "A nutrition chatbot response should be clear, evidence-based, relevant to the question, and appropriately cautious about medical claims."),

(["why should Nutri AI ask follow up questions", "AI nutrition follow up", "personalized chatbot questions"],
 "Follow-up questions can clarify goals, dietary preferences, portions, activity, or other information needed for a more relevant general suggestion."),

(["what follow up questions can Nutri AI ask", "Nutri AI follow up examples", "nutrition chatbot questions"],
 "It can ask about dietary preference, activity level, meal timing, food allergies, goals, and typical food choices when relevant."),

(["how can Nutri AI avoid too many questions", "AI user experience nutrition", "simple nutrition chatbot"],
 "Ask only questions that are relevant to the user's request and avoid collecting unnecessary personal information."),

(["what is conversational nutrition AI", "conversational nutrition assistant", "AI food assistant"],
 "Conversational nutrition AI lets users ask food and wellness questions in natural language and receive relevant general information."),

(["what makes a nutrition app user friendly", "nutrition app usability", "easy nutrition app"],
 "A user-friendly nutrition app should have simple navigation, clear food logging, readable nutrition information, useful reminders, and understandable recommendations."),

(["what should Nutri AI dashboard include", "Nutri AI dashboard", "nutrition dashboard design"],
 "The dashboard can include today's meals, water intake, selected nutrients, mood log, goals, progress, and recent recommendations."),

(["what should Nutri AI profile include", "Nutri AI profile fields", "nutrition profile design"],
 "A profile can include age, activity level, dietary preference, goals, allergies, and other information necessary for personalization."),

(["what should Nutri AI meal log include", "meal tracker fields", "nutrition meal log"],
 "A meal log can include food name, portion, meal time, optional nutrition values, and notes."),

(["what should Nutri AI water tracker include", "hydration tracker fields", "water tracker design"],
 "A water tracker can record drink amount, time, daily total, and progress toward a user-selected target."),

(["what should Nutri AI mood tracker include", "mood tracker fields", "emotion tracker design"],
 "A mood tracker can record a self-selected mood, optional intensity, time, and notes without claiming to diagnose emotions."),

(["what should Nutri AI recommendation card show", "AI recommendation card", "nutrition suggestion card"],
 "A recommendation card can show the suggestion, reason, relevant nutrition information, and an optional note about limitations."),

(["what should Nutri AI food scan card show", "food scanner result card", "NutriLens result"],
 "A food scan card can show product name, serving size, calories, protein, carbohydrates, fat, fiber, sugar, sodium, ingredients, and an explanatory summary."),

(["what should Nutri AI health score card show", "health score UI", "NutriLens score card"],
 "A score card should show the score, criteria used, key positives, key considerations, and a note that the score is a simplified nutrition indicator."),

(["why should Nutri AI show confidence", "AI confidence nutrition", "confidence score in AI"],
 "Showing uncertainty or confidence can help users understand when an AI result may be less reliable, especially for image or food recognition."),

(["what if Nutri AI cannot identify food image", "unknown food image AI", "food recognition failure"],
 "The app should ask the user to select or enter the food manually rather than inventing a food identity."),

(["what if food barcode has wrong data", "incorrect barcode nutrition", "food database error"],
 "Users should be able to verify product information against the package label and report incorrect database information."),

(["why should Nutri AI allow manual food entry", "manual food entry", "nutrition app manual input"],
 "Manual entry provides a fallback when a barcode or food image cannot be recognized reliably."),

(["what is food search feature", "nutrition food search", "Nutri AI food search"],
 "A food search feature lets users find foods in a nutrition database and manually log portions and meals."),

(["what is portion selector in food app", "food portion selector", "serving selection feature"],
 "A portion selector lets users choose serving size or quantity so nutrient estimates better match what they actually consumed."),

(["why portion selector is important", "portion selection nutrition", "food quantity tracking"],
 "The same food can provide very different amounts of nutrients at different portions, so quantity is essential for meaningful tracking."),

(["what is daily calorie chart", "calorie progress chart", "nutrition calorie graph"],
 "A daily calorie chart displays estimated calorie intake against a selected target or reference."),

(["what is protein progress chart", "protein graph", "daily protein chart"],
 "A protein progress chart shows estimated protein intake and can compare it with a selected daily target."),

(["what is water progress chart", "hydration progress graph", "daily water chart"],
 "A water progress chart shows fluids consumed and progress toward a selected hydration target."),

(["what is mood trend chart", "mood graph", "emotion trend tracker"],
 "A mood trend chart can display self-reported mood entries over time and help users observe personal patterns."),

(["what is weekly nutrition report", "weekly food report", "Nutri AI weekly report"],
 "A weekly nutrition report can summarize meal consistency, hydration, selected nutrients, and general patterns across the week."),

(["what should a weekly nutrition report contain", "weekly nutrition summary", "nutrition report features"],
 "A weekly report can include meal logging frequency, water intake, protein or fiber trends, and practical habit suggestions."),

(["why compare weekly nutrition trends", "weekly food trends", "nutrition trend analysis"],
 "Weekly trends can reveal patterns that are difficult to notice from a single day's food log."),

(["what is a nutrition goal progress percentage", "goal progress nutrition", "nutrition progress percent"],
 "A progress percentage compares a logged amount with a selected goal, but it should be interpreted as an estimate when food data is approximate."),

(["what is hydration goal percentage", "water goal progress", "hydration percentage"],
 "Hydration goal percentage shows how much of a selected fluid target has been logged."),

(["what is protein goal percentage", "protein target progress", "protein goal tracker"],
 "Protein goal percentage compares logged protein with the user's selected or estimated daily protein target."),

(["what is fiber goal percentage", "fiber target progress", "fiber goal tracker"],
 "Fiber goal percentage compares logged fiber with a selected daily reference or target."),

(["what is nutrition streak", "healthy eating streak", "food logging streak"],
 "A nutrition streak tracks consecutive days of completing a chosen behavior such as meal logging or hydration tracking."),

(["should nutrition streak punish missed days", "streak safety nutrition", "missed nutrition streak"],
 "No. A missed day should not encourage guilt or extreme behavior. The app should simply help users resume their routine."),

(["what is a healthy notification in Nutri AI", "nutrition app notification design", "safe nutrition reminder"],
 "A healthy notification should be short, supportive, optional, and focused on practical behaviors rather than guilt or body-image pressure."),

(["why should Nutri AI avoid guilt messages", "nutrition app guilt", "healthy AI messaging"],
 "Guilt-based messages can create unhealthy relationships with food. Neutral and supportive language is safer."),

(["what is positive nutrition feedback", "healthy food feedback", "nutrition encouragement"],
 "Positive feedback can recognize consistent habits, variety, hydration, or meal logging without labeling foods or bodies as morally good or bad."),

(["what is neutral food language", "neutral nutrition language", "food language in AI"],
 "Neutral food language describes nutritional characteristics and context without assigning moral labels such as good, bad, clean, or guilty."),

(["why should Nutri AI avoid calling food bad", "food moralizing", "healthy unhealthy food labels"],
 "Calling foods morally good or bad can encourage rigid eating. It is better to describe nutrients, portions, frequency, and context."),

(["what is balanced nutrition advice", "balanced AI nutrition advice", "healthy nutrition guidance"],
 "Balanced nutrition advice considers the whole eating pattern, individual needs, food preferences, portions, and practical sustainability."),

(["how can Nutri AI give safer recommendations", "safe nutrition recommendations", "AI nutrition safety"],
 "Use evidence-based information, avoid diagnosis, consider user restrictions, show uncertainty, protect privacy, and encourage professional care when necessary."),

(["what is the role of AI in nutrition", "AI nutrition role", "artificial intelligence nutrition"],
 "AI can help organize food information, answer general questions, analyze logs, and provide suggestions, but it should not replace professional clinical care."),

(["what are limitations of nutrition AI", "AI nutrition limitations", "limitations of Nutri AI"],
 "Nutrition AI can have incomplete data, incorrect matches, uncertain estimates, and limited understanding of individual medical conditions."),

(["why should Nutri AI verify food data", "verify nutrition database", "food data accuracy"],
 "Food databases can contain outdated or incorrect information, so important product nutrition should be checked against reliable sources or packaging."),

(["what is a nutrition database API", "food database API", "nutrition API meaning"],
 "A nutrition database API allows an application to retrieve structured food information such as nutrients, serving sizes, and product details."),

(["what is barcode API", "food barcode API", "barcode database"],
 "A barcode API can retrieve product information using a product's barcode when that product exists in the connected database."),

(["what is OpenFoodFacts", "OpenFoodFacts meaning", "food product database"],
 "Open Food Facts is an open food-product database containing information such as ingredients and nutrition for many packaged products."),

(["can Nutri AI use a food database", "nutrition database integration", "food database in AI"],
 "Yes. Integrating a reliable food database can improve product and nutrition lookups compared with relying only on manually written responses."),

(["why use API instead of training data for food facts", "food API vs training data", "nutrition database vs chatbot data"],
 "A current food database can provide structured product information, while training data is better suited to common question-and-answer patterns."),

(["what is static training data", "static chatbot data", "rule based training data"],
 "Static training data is predefined information stored in the application and does not automatically update unless developers change it."),

(["what is dynamic nutrition data", "dynamic food database", "live nutrition information"],
 "Dynamic nutrition data is retrieved from an external or updated database rather than being fixed entirely inside the chatbot code."),

(["why combine training data and food database", "hybrid nutrition AI", "training data plus API"],
 "A hybrid approach can use training data for conversational responses and a food database for current product or nutrient information."),

(["what is intent classification", "chatbot intent meaning", "nutrition intent detection"],
 "Intent classification identifies what the user is trying to ask, such as food benefits, hydration, meal planning, or product nutrition."),

(["what is entity extraction in nutrition", "food entity detection", "nutrition entity extraction"],
 "Entity extraction identifies important items in a message, such as food names, meal types, quantities, goals, or nutrients."),

(["why intent classification helps Nutri AI", "Nutri AI intent detection", "AI question categories"],
 "Intent classification can route different types of questions to the appropriate nutrition logic or response."),

(["what is natural language processing", "NLP meaning", "NLP in nutrition chatbot"],
 "Natural language processing enables software to analyze and respond to human language."),

(["how does NLP help Nutri AI", "NLP nutrition assistant", "AI language processing"],
 "NLP can help Nutri AI recognize different ways users phrase nutrition questions and extract useful information from messages."),

(["what is semantic matching", "semantic chatbot matching", "meaning based question matching"],
 "Semantic matching compares the meaning of text rather than relying only on exact words, allowing more flexible question recognition."),

(["semantic matching vs keyword matching", "keyword vs semantic matching", "chatbot matching methods"],
 "Keyword matching looks for specific words or phrases, while semantic matching attempts to identify similar meaning even when wording differs."),

(["why keyword matching can fail", "keyword chatbot limitations", "trigger matching problems"],
 "Keyword matching can miss questions with unfamiliar wording or incorrectly match messages that contain overlapping words."),

(["how to improve keyword chatbot", "improve rule based chatbot", "better trigger matching"],
 "Use diverse trigger phrases, clear categories, fewer conflicting entries, normalization, and a useful fallback response."),

(["what is text normalization", "chatbot text normalization", "normalize user input"],
 "Text normalization can convert input to a consistent form by handling case, spacing, punctuation, and sometimes common spelling variations."),

(["why lowercase user messages", "case insensitive chatbot", "lowercase text matching"],
 "Lowercasing helps a rule-based chatbot match 'Apple' and 'apple' as the same text when case is not meaningful."),

(["why remove punctuation in chatbot", "punctuation normalization", "chatbot punctuation handling"],
 "Removing or standardizing punctuation can improve matching when users type the same question with different punctuation."),

(["what is partial matching", "partial phrase matching", "chatbot partial match"],
 "Partial matching checks whether a trigger phrase or keyword appears within the user's message, but it can create false matches if used carelessly."),

(["why partial matching can cause wrong answers", "false positive chatbot match", "partial matching problem"],
 "A common word may appear in unrelated questions, causing the chatbot to select an incorrect response."),

(["how to prevent false matches", "chatbot false positive prevention", "better keyword matching"],
 "Use specific multi-word triggers, intent categories, scoring, and avoid overly generic trigger words."),

(["what is response priority", "chatbot response priority", "trigger priority"],
 "Response priority determines which matching rule is selected when several rules match the same user message."),

(["why response priority matters", "multiple chatbot matches", "training data conflicts"],
 "Without clear priority, overlapping triggers can cause inconsistent or unexpected chatbot responses."),

(["what is fallback threshold", "chatbot confidence threshold", "matching threshold"],
 "A matching threshold determines how strong a match must be before the system returns a specific response instead of using a fallback."),

(["why should fallback be friendly", "good fallback message", "chatbot fallback design"],
 "A friendly fallback keeps the conversation useful and guides the user toward supported topics without pretending to know an answer."),

(["what is chatbot testing", "test Nutri AI", "nutrition chatbot testing"],
 "Chatbot testing checks whether different user phrasings produce the intended responses and whether incorrect matches are avoided."),

(["how to test training data", "training data testing", "test chatbot questions"],
 "Test exact triggers, spelling variations, natural paraphrases, unrelated questions, overlapping topics, and unknown questions."),

(["what is regression testing for chatbot", "chatbot regression testing", "training data regression"],
 "Regression testing checks that new training entries do not break responses that previously worked."),

(["why test after adding 100 questions", "test after dataset update", "new training data testing"],
 "New entries can create overlapping triggers or syntax errors, so testing confirms old and new functionality still works."),

(["how many training examples should Nutri AI have", "training data size", "how much chatbot data"],
 "There is no fixed ideal number. Quality, diversity, coverage, and lack of conflicting entries matter more than simply maximizing the count."),

(["is more training data always better", "more chatbot data", "training data quality vs quantity"],
 "No. More data can help coverage, but duplicate, inaccurate, or conflicting entries can make a rule-based chatbot worse."),

(["what makes a diverse nutrition dataset", "diverse nutrition questions", "nutrition dataset diversity"],
 "A diverse dataset includes different foods, goals, phrasings, dietary patterns, meal contexts, and user intents."),

(["why include spelling variations", "misspelled chatbot questions", "spelling variations training"],
 "Users often make spelling mistakes, so common harmless variations can improve recognition in a rule-based chatbot."),

(["should every trigger have same answer", "multiple triggers same response", "chatbot trigger response"],
 "Different phrasings of the same intent can share one accurate response, reducing unnecessary duplicate answers."),

(["why use multiple triggers per answer", "one response multiple questions", "chatbot trigger groups"],
 "Grouping similar trigger phrases around one response improves coverage while keeping the response data compact."),

(["what is data validation", "training data validation", "validate chatbot dataset"],
 "Data validation checks that entries have the correct structure, valid text, no missing responses, and acceptable values before the application uses them."),

(["how to validate training_data.py", "validate Python training data", "check training data syntax"],
 "Run a Python syntax check and load the module to confirm the training list is valid and contains the expected number of entries."),

(["what is a Python list", "Python list meaning", "training data list"],
 "A Python list is an ordered collection of values. In this chatbot, TRAINING_DATA stores multiple question-trigger and response entries."),

(["what is a Python tuple", "Python tuple meaning", "training tuple"],
 "A Python tuple is an ordered collection of values written using parentheses. Each training entry can use a tuple containing triggers and a response."),

(["why use list of tuples for training data", "training data structure", "tuple training entries"],
 "A list of tuples provides a simple structure where each entry can contain trigger phrases and its associated response."),

(["what is a nested list in training data", "trigger list structure", "training trigger list"],
 "A nested list can store several trigger phrases inside one training entry so multiple questions can map to the same response."),

(["why response should be a string", "training response string", "chatbot answer format"],
 "Keeping the response as a string makes it straightforward for the chat engine to return the answer to the user."),

(["what is a syntax error in Python", "Python syntax error meaning", "training data syntax error"],
 "A syntax error occurs when Python code does not follow valid language structure, such as missing brackets, commas, or quotation marks."),

(["what causes training_data.py syntax error", "training file syntax problems", "Python dataset error"],
 "Common causes include missing commas, unmatched brackets, broken quotation marks, or accidentally placing text outside the expected list structure."),

(["how to fix missing comma in training data", "Python comma error", "training data comma"],
 "Check that each tuple entry ends with a comma when followed by another entry and that brackets and quotes are correctly closed."),

(["how to check brackets in training data", "Python bracket matching", "training list brackets"],
 "Make sure every opening bracket or parenthesis has a corresponding closing bracket and that nested structures are properly ordered."),

(["how to check quotes in training data", "Python quote error", "training string quotes"],
 "Make sure every response and trigger string has matching quotation marks and avoid unescaped quotation marks inside strings."),

(["why emojis can cause problems in Python data", "emoji in Python strings", "training data emojis"],
 "Modern Python 3 handles Unicode emojis in strings, but encoding and file-save settings should remain UTF-8."),

(["what encoding should training_data.py use", "Python UTF 8", "training file encoding"],
 "UTF-8 is recommended so the Python file can safely store normal text and Unicode characters such as emojis."),

(["why backup training_data.py", "backup chatbot dataset", "training data backup"],
 "A backup lets you restore the previous working dataset if a large update introduces syntax errors or unwanted matching behavior."),

(["how to safely add new training data", "add chatbot data safely", "training data update"],
 "Add entries without deleting old data, validate syntax, test representative questions, and keep a backup of the working version."),

(["what is dataset versioning", "training data version control", "chatbot dataset versions"],
 "Dataset versioning keeps track of changes so developers can identify when entries were added, changed, or removed."),

(["why count training entries", "training data count", "number of chatbot entries"],
 "Counting entries helps confirm that the intended amount of data was added and that accidental deletion did not occur."),

(["how to count TRAINING_DATA entries", "count Python training list", "training data entry count"],
 "Python can use len(TRAINING_DATA) to count entries, provided TRAINING_DATA is a list containing one tuple per entry."),

(["why test old questions after adding data", "old chatbot regression", "test previous questions"],
 "New triggers can overlap with old ones, so testing previous questions ensures their responses still work correctly."),

(["why test unrelated questions", "chatbot negative testing", "unknown question testing"],
 "Testing unrelated questions checks whether the chatbot incorrectly matches generic triggers instead of using the fallback response."),

(["what is negative testing", "negative chatbot testing", "test invalid questions"],
 "Negative testing checks how the system behaves when inputs are unsupported, ambiguous, or intentionally unrelated."),

(["what is positive testing for chatbot", "positive chatbot testing", "test supported questions"],
 "Positive testing verifies that supported user questions return the intended responses."),

(["what is edge case testing", "chatbot edge cases", "nutrition chatbot edge cases"],
 "Edge-case testing checks unusual wording, very short messages, spelling mistakes, long messages, mixed topics, and ambiguous inputs."),

(["what is chatbot response consistency", "consistent AI responses", "training response consistency"],
 "Response consistency means similar user questions receive appropriately similar and accurate answers."),

(["why should answers avoid contradictions", "contradictory training data", "nutrition chatbot contradiction"],
 "Contradictory responses reduce trust and can confuse users, so overlapping entries should use consistent evidence-based guidance."),

(["how to detect contradictory training entries", "find conflicting responses", "dataset contradiction check"],
 "Search for overlapping triggers and compare their answers, especially for foods or nutrition topics where similar questions may appear."),

(["what is data deduplication", "remove duplicate training data", "dataset deduplication"],
 "Data deduplication removes repeated or unnecessary entries so the dataset remains efficient and less prone to conflicting matches."),

(["why should trigger phrases be natural", "natural chatbot triggers", "user language training"],
 "Natural trigger phrases better represent how real users ask questions and improve the chance of matching their wording."),

(["should triggers include slang", "slang chatbot training", "casual nutrition questions"],
 "Common relevant slang and informal phrasing can be included when it represents realistic user input."),

(["should triggers include misspellings", "misspelling training phrases", "chatbot typo handling"],
 "Common misspellings can be included selectively, but excessive typo entries can make the dataset unnecessarily large."),

(["why should answers avoid excessive technical language", "simple nutrition chatbot answers", "easy nutrition language"],
 "Simple language makes nutrition information easier for users to understand while preserving important accuracy and safety context."),

(["what is user friendly nutrition language", "easy nutrition explanation", "simple nutrition answers"],
 "Use familiar words, short explanations, examples, and clear cautions when discussing nutrition topics."),

(["how should Nutri AI explain calories", "simple calorie explanation", "explain calories to user"],
 "Explain calories as a measure of energy provided by food and avoid treating calories alone as a complete measure of food quality."),

(["how should Nutri AI explain protein", "simple protein explanation", "explain protein"],
 "Explain protein as a nutrient used for building and repairing tissues and performing many body functions."),

(["how should Nutri AI explain carbohydrates", "simple carbohydrate explanation", "explain carbs"],
 "Explain carbohydrates as nutrients that commonly provide energy and are found in foods such as grains, fruits, legumes, and vegetables."),

(["how should Nutri AI explain fats", "simple fat explanation", "explain dietary fat"],
 "Explain dietary fat as an energy source and an important component of cells and vitamin absorption."),

(["how should Nutri AI explain fiber", "simple fiber explanation", "explain dietary fiber"],
 "Explain fiber as a type of carbohydrate found mainly in plant foods that supports digestion and can improve fullness."),

(["how should Nutri AI explain vitamins", "simple vitamin explanation", "explain vitamins"],
 "Explain vitamins as essential micronutrients required in small amounts for many body functions."),

(["how should Nutri AI explain minerals", "simple mineral explanation", "explain minerals"],
 "Explain minerals as essential elements such as calcium, iron, potassium, and magnesium that support many body processes."),

(["how should Nutri AI explain hydration", "simple hydration explanation", "explain hydration"],
 "Explain hydration as maintaining enough body fluid for normal functions such as temperature control, circulation, and digestion."),

(["how should Nutri AI explain portion size", "simple portion explanation", "explain serving size"],
 "Explain portion size as the amount of food a person actually eats, which may differ from the serving size shown on a label."),

(["how should Nutri AI explain balanced diet", "simple balanced diet explanation", "explain balanced eating"],
 "Explain a balanced diet as a varied eating pattern that provides adequate energy, protein, fats, carbohydrates, fiber, vitamins, minerals, and fluids."),

(["what is food literacy", "food literacy meaning", "nutrition literacy"],
 "Food literacy is the ability to understand food information and make practical choices about selecting, preparing, and consuming food."),

(["why is nutrition literacy important", "nutrition knowledge importance", "food education"],
 "Nutrition literacy helps people interpret labels, understand basic nutrients, recognize misinformation, and make informed food choices."),

(["how can Nutri AI improve nutrition literacy", "AI nutrition education", "Nutri AI education"],
 "Nutri AI can explain food labels, nutrients, portions, cooking methods, and balanced meal concepts in simple language."),

(["what is personalized food education", "nutrition education personalization", "custom nutrition education"],
 "Personalized food education adapts examples and explanations to the user's goals, food preferences, knowledge level, and routine."),

(["what is a nutrition myth", "food myth meaning", "nutrition myths"],
 "A nutrition myth is a widely repeated food or health claim that lacks adequate scientific support or oversimplifies the evidence."),

(["does eating after 8 pm cause fat gain", "8 pm eating myth", "late eating weight gain myth"],
 "Eating after a particular clock time does not automatically cause fat gain. Total intake, food choices, activity, and individual routine matter."),

(["does eating carbs at night cause weight gain", "night carbs myth", "carbohydrates at night"],
 "Carbohydrates eaten at night do not automatically cause weight gain. Overall energy intake and dietary pattern matter."),

(["does fruit sugar cause weight gain", "fruit sugar weight gain", "fruit and body fat"],
 "Whole fruit can be part of a healthy diet. Its fiber and water content make it different from concentrated added-sugar foods."),

(["does eating fat at night cause weight gain", "night fat myth", "fat at night"],
 "Eating fat at night does not automatically cause weight gain. Total energy intake and overall diet are more important."),

(["does skipping dinner help weight loss", "skip dinner weight loss", "dinner skipping"],
 "Skipping dinner is not required for weight loss and may increase hunger for some people. A sustainable eating pattern is more important."),

(["does sweating mean fat loss", "sweating and fat burning", "sweat weight loss"],
 "Sweating mainly reflects fluid loss, not direct body-fat loss. Weight can temporarily fall from dehydration and return after rehydration."),

(["does drinking cold water burn calories", "cold water calorie burn", "ice water weight loss"],
 "Cold water requires the body to warm it slightly, but the calorie effect is too small to meaningfully drive weight loss."),

(["does spicy food melt belly fat", "spicy food belly fat", "chili fat loss"],
 "Spicy foods do not specifically melt belly fat. Body-fat reduction depends on overall energy balance and other factors."),

(["does green tea remove belly fat", "green tea belly fat", "tea for belly fat"],
 "Green tea is not a targeted belly-fat treatment. Its effects on body weight are modest."),

(["does fasting remove toxins", "fasting detox", "fasting and toxins"],
 "Fasting does not provide a special detox mechanism. The body already has organs that process and eliminate waste."),

(["does drinking more water speed metabolism", "water metabolism", "extra water calorie burn"],
 "Adequate hydration supports normal body function, but drinking excessive amounts of water does not meaningfully accelerate metabolism."),

(["does lemon water increase metabolism", "lemon water metabolism", "lemon water fat loss"],
 "Lemon water can help with hydration but does not significantly increase metabolism or directly burn fat."),

(["does eating breakfast speed metabolism", "breakfast metabolism", "breakfast fat burning"],
 "Eating breakfast does not automatically speed metabolism enough to determine weight loss. Overall energy intake and dietary pattern matter."),

(["does eating small meals boost metabolism", "small meals metabolism", "frequent meals metabolism"],
 "Eating more frequently does not automatically increase metabolism. Meal frequency can be chosen based on hunger, routine, and preference."),

(["does protein boost metabolism", "protein thermic effect", "protein metabolism"],
 "Protein requires more energy to digest than carbohydrates or fat and can support muscle maintenance, but it is not a magic metabolism booster."),

(["what is thermic effect of food", "TEF meaning", "food digestion calories"],
 "The thermic effect of food is the energy the body uses to digest, absorb, and process nutrients."),

(["which nutrient has highest thermic effect", "protein thermic effect", "food thermic effect"],
 "Protein generally has a higher thermic effect than carbohydrates or fat, although total energy expenditure depends on many factors."),

(["does muscle burn calories at rest", "muscle resting calories", "muscle metabolism"],
 "Muscle tissue uses energy at rest, although the exact contribution to resting energy expenditure varies between individuals."),

(["can strength training help metabolism", "strength training metabolism", "weights and metabolism"],
 "Strength training can help maintain or increase muscle mass, which supports resting energy expenditure and physical function."),

(["why is sleep important for muscle recovery", "sleep muscle repair", "sleep and recovery"],
 "Sleep supports muscle repair, hormonal regulation, immune function, and recovery from exercise."),

(["how much sleep should adults get", "adult sleep requirement", "sleep recommendation adults"],
 "Most adults need around 7 to 9 hours of sleep per night, although individual needs vary."),

(["why does poor sleep affect food choices", "sleep food choices", "sleep and cravings"],
 "Poor sleep can affect appetite regulation, cravings, energy, and decision-making around food."),

(["can stress increase appetite", "stress appetite", "stress hunger"],
 "Stress can increase or decrease appetite depending on the person and situation."),

(["why does stress reduce appetite", "stress no appetite", "loss of appetite stress"],
 "Stress can temporarily reduce appetite in some people through changes in hormones and nervous-system activity."),

(["what should i do if i have no appetite", "low appetite nutrition", "what to eat without appetite"],
 "Choose small, nutrient-dense meals or snacks and maintain fluids. Persistent or unexplained loss of appetite should be discussed with a healthcare professional."),

(["what should i eat when recovering from illness", "food during recovery", "nutrition during illness recovery"],
 "During recovery, focus on adequate fluids, protein, energy, and nutrient-rich foods that are tolerated comfortably."),

(["what should i drink when sick", "hydration during illness", "fluids when sick"],
 "Water, soups, and other appropriate fluids can help maintain hydration. Severe vomiting, diarrhea, or dehydration requires medical attention."),

(["what is easy food when sick", "easy to digest food illness", "food during sickness"],
 "Depending on symptoms, simple foods such as rice, toast, bananas, yogurt, soup, or other tolerated foods may be easier to eat."),

(["should i force myself to eat when sick", "eating during illness", "no appetite while sick"],
 "You do not need to force large meals, but maintaining fluids and getting some nutrition as tolerated is important during recovery."),

(["what is oral rehydration solution", "ORS meaning", "oral rehydration"],
 "Oral rehydration solution contains water, salts, and glucose in specific proportions to help replace fluids and electrolytes during dehydration from conditions such as diarrhea."),

(["when is ORS useful", "when to use ORS", "oral rehydration use"],
 "ORS can be useful when significant fluid and electrolyte losses occur, especially with diarrhea or vomiting. Severe dehydration needs medical care."),

(["can sports drink replace ORS", "sports drink vs ORS", "ORS alternative"],
 "Sports drinks are not formulated the same way as oral rehydration solutions and should not automatically be treated as equivalent for treating dehydration from illness."),

(["why is sodium in ORS", "ORS sodium purpose", "electrolytes in ORS"],
 "Sodium helps replace electrolyte losses and supports glucose-assisted water absorption in the intestine."),

(["why is glucose in ORS", "ORS glucose purpose", "sugar in ORS"],
 "Glucose helps promote sodium and water absorption in the intestine when present in the appropriate concentration."),

(["what is dehydration from diarrhea", "diarrhea dehydration", "fluid loss diarrhea"],
 "Diarrhea can cause substantial fluid and electrolyte loss. Oral rehydration solution may help, while severe symptoms require medical attention."),

(["what should i eat after diarrhea", "food after diarrhea", "recovery diet diarrhea"],
 "After rehydration, gradually return to tolerated normal foods and include easy-to-digest meals with adequate nutrition."),

(["what is a BRAT diet", "BRAT diet meaning", "banana rice toast diet"],
 "The BRAT diet refers to bananas, rice, applesauce, and toast. It is restrictive and is not generally considered a complete long-term recovery diet."),

(["is BRAT diet enough", "BRAT diet nutrition", "should i follow BRAT diet"],
 "The BRAT diet does not provide enough variety or nutrients for prolonged use. More balanced foods can usually be reintroduced as tolerated."),

(["what is food poisoning", "food poisoning meaning", "foodborne illness"],
 "Food poisoning is illness caused by consuming contaminated food or drink. Symptoms can include vomiting, diarrhea, abdominal pain, and fever."),

(["what should i do after food poisoning", "food poisoning recovery", "eating after food poisoning"],
 "Focus on fluids and gradually return to tolerated foods. Severe dehydration, blood in stool, persistent vomiting, or serious symptoms require medical attention."),

(["how to prevent food poisoning at home", "home food safety", "prevent foodborne illness"],
 "Wash hands, separate raw and cooked foods, cook foods thoroughly, refrigerate promptly, and use safe water."),

(["what is the danger zone for food", "food temperature danger zone", "unsafe food temperature"],
 "Certain temperatures allow bacteria to multiply rapidly. Follow local food-safety guidance for safe cooking, cooling, and storage temperatures."),

(["why refrigerate leftovers", "leftover refrigeration", "food storage fridge"],
 "Refrigeration slows bacterial growth and helps keep perishable foods safer for later consumption."),

(["how quickly should leftovers be refrigerated", "refrigerate cooked food", "leftover storage safety"],
 "Perishable foods should be refrigerated promptly rather than left at room temperature for long periods. Follow local food-safety guidance."),

(["can i refreeze thawed food", "refreezing food safety", "refreeze thawed meat"],
 "Whether food can be safely refrozen depends on how it was thawed and handled. Follow food-safety guidance for the specific food."),

(["why wash fruits and vegetables", "washing produce", "clean fruits vegetables"],
 "Washing produce can remove dirt and some surface contaminants. It does not eliminate all pathogens or pesticides."),

(["should i wash chicken", "washing raw chicken", "wash chicken before cooking"],
 "Washing raw chicken can spread bacteria through splashes. It is safer to cook chicken thoroughly without washing it."),

(["how to safely thaw meat", "thawing meat safely", "safe meat thawing"],
 "Thaw meat in the refrigerator, in cold water using safe procedures, or in a microwave followed by immediate cooking, according to food-safety guidance."),

(["what is cross contamination in kitchen", "kitchen cross contamination", "raw food contamination"],
 "Cross-contamination occurs when harmful microorganisms move from raw foods or contaminated surfaces to ready-to-eat foods."),

(["why separate raw meat and vegetables", "raw meat vegetables safety", "separate raw food"],
 "Separating raw meat from vegetables and ready-to-eat foods reduces the risk of transferring harmful microorganisms."),

(["what is safe cooking temperature", "food cooking temperature", "cook meat safely"],
 "Safe cooking temperatures depend on the food. Use a food thermometer and follow reliable food-safety guidance for the specific food."),

(["why use food thermometer", "food thermometer benefits", "check meat temperature"],
 "A food thermometer helps verify that foods have reached a safe internal temperature rather than relying only on appearance."),

(["what is expired food", "food expiry meaning", "expired food safety"],
 "Expired food may no longer be safe or may have reduced quality, depending on the product and the type of date shown."),

(["best before vs use by", "best before meaning", "use by meaning"],
 "Best-before dates generally relate to quality, while use-by dates are more closely associated with safety for certain perishable foods. Follow local labeling rules."),

(["can i eat food after best before date", "best before expired food", "food after best before"],
 "For some foods, a best-before date is primarily about quality, but safety depends on the product and storage. Inspect and follow local food-safety guidance."),

(["should i eat food after use by date", "use by expired food", "food after use by"],
 "For foods carrying a safety-related use-by date, follow the label and avoid consuming them after the stated date."),

(["what is food quality", "food freshness meaning", "food quality indicators"],
 "Food quality includes freshness, flavor, texture, appearance, nutritional value, and safety."),

(["how to tell if milk is spoiled", "spoiled milk signs", "milk freshness"],
 "Signs can include an unusual smell, curdling, off texture, or an abnormal appearance. When in doubt about safety, discard it."),

(["how to tell if egg is spoiled", "spoiled egg signs", "egg freshness"],
 "Egg freshness can be assessed using storage dates and proper food-safety practices. A strong abnormal odor after cracking is a reason to discard the egg."),

(["how to store eggs", "egg storage", "keep eggs fresh"],
 "Keep eggs refrigerated according to local food-safety guidance and avoid leaving them at unsafe temperatures for long periods."),

(["how to store milk", "milk storage", "keep milk fresh"],
 "Keep milk refrigerated and return it to the refrigerator promptly after use."),

(["how to store yogurt", "yogurt storage", "keep yogurt fresh"],
 "Keep yogurt refrigerated and follow the package's storage and use-by guidance."),

(["how to store nuts", "nut storage", "keep nuts fresh"],
 "Store nuts in a cool, dry place and refrigerate or freeze them for longer storage to reduce rancidity."),

(["why nuts become rancid", "rancid nuts", "nut spoilage"],
 "Nuts contain fats that can oxidize over time, causing stale or rancid flavors, especially when exposed to heat, light, or air."),

(["how to store seeds", "seed storage", "keep seeds fresh"],
 "Store seeds in an airtight container in a cool place. Refrigeration can extend the life of many seeds."),

(["how to store whole grains", "grain storage", "keep grains fresh"],
 "Store dry grains in clean, dry, airtight containers away from moisture and pests."),

(["how to store bread", "bread storage", "keep bread fresh"],
 "Store bread according to its type and local conditions. Freezing can help preserve bread for longer periods."),

(["can bread be frozen", "freeze bread", "frozen bread"],
 "Yes. Bread can generally be frozen in an airtight package and thawed when needed."),

(["how to reduce food waste from vegetables", "use vegetables before spoilage", "vegetable food waste"],
 "Plan meals, store produce correctly, use older vegetables first, and freeze suitable produce before it spoils."),

(["how to use overripe bananas", "overripe banana recipes", "use old bananas"],
 "Overripe bananas can be used in oats, smoothies, homemade baked foods, or frozen for later use."),

(["how to use leftover rice", "leftover rice ideas", "rice leftovers"],
 "Safely refrigerated rice can be reused in dishes such as fried rice or rice bowls, provided it has been stored and reheated safely."),

(["how to use leftover vegetables", "leftover vegetable ideas", "use cooked vegetables"],
 "Leftover vegetables can be added to omelets, sandwiches, soups, rice dishes, wraps, or grain bowls."),

(["how to use leftover dal", "leftover dal ideas", "reuse dal"],
 "Leftover dal can be used in a new meal with rice or roti, vegetables, or as a base for soup or other dishes."),

(["how to use leftover chicken", "leftover chicken ideas", "reuse cooked chicken"],
 "Safely stored leftover chicken can be added to sandwiches, salads, wraps, soups, or rice bowls."),

(["how to use leftover paneer", "leftover paneer ideas", "reuse paneer"],
 "Leftover paneer can be added to wraps, salads, curries, rice dishes, or vegetable combinations."),

(["what is batch meal prep for students", "student batch cooking", "college meal prep"],
 "Students can batch-cook staples such as dal, rice, vegetables, or eggs and combine them into different meals during the week."),

(["how to meal prep on Sunday", "weekly meal prep", "Sunday meal preparation"],
 "Prepare a few staple proteins, grains, and vegetables, portion them safely, and combine them into different meals throughout the week."),

(["how long does meal prep last", "meal prep shelf life", "prepared food storage"],
 "Storage time depends on the food and temperature. Follow local food-safety guidance and discard food that has been stored unsafely."),

(["can meal prep be frozen", "freeze meal prep", "freezer meal prep"],
 "Many cooked meals can be frozen safely when cooled and packaged appropriately, although texture may change after thawing."),

(["what foods freeze well", "foods good for freezing", "freezer friendly foods"],
 "Cooked grains, beans, many soups, some curries, and certain vegetables can freeze well. Texture varies by food."),

(["what foods do not freeze well", "foods bad for freezing", "freezing food texture"],
 "Some high-water vegetables, certain dairy-based sauces, and foods with delicate textures may change noticeably after freezing."),

(["why meal prep helps healthy eating", "meal prep and healthy diet", "meal preparation benefits"],
 "Meal prep reduces decision-making during busy days and makes balanced foods more convenient."),

(["how to meal prep without getting bored", "meal prep variety", "different meal prep ideas"],
 "Prepare versatile ingredients and change sauces, spices, vegetables, or combinations so the same staples become different meals."),

(["what is ingredient prep", "food ingredient preparation", "prep ingredients ahead"],
 "Ingredient prep means washing, chopping, cooking, or portioning foods ahead of time without necessarily making complete meals."),

(["what is batch cooking", "batch meal cooking", "cook food in bulk"],
 "Batch cooking means preparing larger amounts of food at once and safely storing portions for later meals."),

(["what is portioned snack prep", "snack meal prep", "prepare snacks ahead"],
 "Portioned snack prep means dividing foods such as nuts, fruit, roasted chickpeas, or vegetables into ready-to-eat servings."),

(["why portion snacks ahead", "snack portion control", "pre portion snacks"],
 "Pre-portioning can make it easier to notice how much you are eating and reduce unintentional overeating from large packages."),

(["what is a healthy emergency meal", "emergency healthy food", "quick backup meal"],
 "A backup meal can use shelf-stable or quick foods such as oats, eggs, canned beans, whole-grain bread, or frozen vegetables."),

(["what should i keep for emergency snacks", "emergency snack foods", "backup healthy snacks"],
 "Nuts, roasted chickpeas, whole-grain crackers, fruit, shelf-stable milk, or protein-rich packaged foods can be useful depending on storage conditions."),

(["how to eat healthy when hostel food is poor", "hostel healthy eating", "student hostel nutrition"],
 "Add practical foods such as fruit, curd, eggs, nuts, roasted chickpeas, milk, and simple vegetables to improve meal variety."),

(["healthy foods to keep in hostel", "hostel food essentials", "college hostel nutrition"],
 "Useful options include oats, nuts, seeds, fruit, roasted chickpeas, peanut butter, shelf-stable foods, and suitable dairy products."),

(["healthy no cook meals for hostel", "no cook student meals", "hostel no cooking food"],
 "Options include yogurt with fruit and oats, peanut butter sandwiches, fruit with nuts, and ready-to-eat salads with a protein source."),

(["what is a healthy hostel breakfast", "hostel breakfast ideas", "student hostel breakfast"],
 "Oats with milk, fruit and nuts, eggs if available, yogurt with fruit, or whole-grain sandwiches can be practical choices."),

(["what is a healthy hostel snack", "hostel snack ideas", "college hostel snacks"],
 "Fruit, nuts, roasted chickpeas, yogurt, peanut butter with whole-grain bread, or popcorn can be convenient."),

(["what is a healthy hostel dinner", "hostel dinner ideas", "student hostel dinner"],
 "Choose meals containing protein, vegetables, and an appropriate carbohydrate, and supplement with simple foods if the available meal is incomplete."),

(["how to eat healthy during college fest", "college fest food", "healthy college event eating"],
 "Enjoy the event while choosing reasonable portions, drinking water, and balancing heavier foods with nutrient-rich meals later."),

(["how to eat healthy during travel", "travel nutrition", "healthy travel meals"],
 "Pack practical snacks, stay hydrated, and choose meals with protein, vegetables, and suitable carbohydrates when eating out."),

(["healthy airport food", "airport healthy eating", "travel airport food"],
 "Look for meals or snacks containing protein, fruit or vegetables, whole grains, and water when available."),

(["healthy train travel food", "train travel nutrition", "food for train journey"],
 "Portable options include fruit, nuts, roasted chickpeas, sandwiches, and safe packaged foods with reasonable sodium and sugar."),

(["healthy road trip snacks", "road trip food", "travel snack ideas"],
 "Fruit, nuts, roasted legumes, whole-grain snacks, and water are practical road-trip options."),

(["how to keep food safe while traveling", "travel food safety", "safe food during travel"],
 "Keep perishable foods at safe temperatures, use clean containers, and choose freshly prepared foods from hygienic sources."),

(["what is travel hydration", "hydration while traveling", "water during travel"],
 "Carry water when practical and drink regularly, especially during hot weather or long journeys."),

(["can flying cause dehydration", "air travel hydration", "water on flights"],
 "Cabin air is dry and travel routines can reduce drinking, so regular fluid intake can help maintain hydration."),

(["what should i eat before a flight", "food before flying", "pre flight meal"],
 "Choose a familiar balanced meal and avoid foods that you know cause digestive discomfort before travel."),

(["what should i eat during a flight", "airplane food choices", "flight meal nutrition"],
 "Choose meals with protein, vegetables, and suitable carbohydrates when available, and drink fluids regularly."),

(["what should i eat after travel", "post travel meal", "food after long journey"],
 "Return to regular balanced meals, hydrate normally, and prioritize sleep and recovery after travel."),

(["why is routine important for nutrition", "nutrition routine benefits", "consistent meal routine"],
 "A consistent routine can make it easier to plan meals, manage hunger, stay hydrated, and maintain healthy habits."),

(["can weekends affect diet", "weekend eating habits", "weekend nutrition"],
 "Weekend eating can be more flexible, but maintaining some regular meal and activity habits can support consistency."),

(["why do people overeat on weekends", "weekend overeating", "weekend food cravings"],
 "Changes in routine, social events, alcohol, larger portions, and increased availability of highly palatable foods can contribute."),

(["how to maintain healthy eating on weekends", "healthy weekend diet", "weekend nutrition tips"],
 "Keep regular meals, allow favorite foods in reasonable portions, stay active, and avoid extreme restriction before social events."),

(["what is social eating", "social eating meaning", "eating with friends"],
 "Social eating means eating in social situations. It can affect food choices, portions, and timing through social cues."),

(["how to eat healthy at social events", "healthy party eating", "social event nutrition"],
 "Eat normally beforehand, survey the options, choose foods you enjoy, and use reasonable portions without unnecessary restriction."),

(["why do social events cause overeating", "social overeating", "party overeating"],
 "Social events often involve large portions, prolonged eating, alcohol, and constant food availability, which can encourage overeating."),

(["what is mindful party eating", "party mindful eating", "mindful social eating"],
 "Mindful party eating means choosing foods intentionally, eating slowly, and paying attention to hunger and fullness."),

(["can i enjoy sweets during festivals", "festival sweets", "healthy festival eating"],
 "Festival sweets can fit into an overall balanced diet when portions are moderate and everyday meals remain varied and nutritious."),

(["how to manage sweets during festivals", "festival sugar control", "festival nutrition tips"],
 "Enjoy small portions, choose favorite sweets rather than taking everything, and balance the day with regular nutritious meals."),

(["what is healthy festive eating", "festival healthy food", "healthy celebration diet"],
 "Healthy festive eating allows favorite foods while maintaining variety, reasonable portions, hydration, and normal meals."),

(["can i eat dessert every day", "daily dessert", "dessert daily healthy"],
 "A small dessert can fit into some diets, but frequent sugary desserts should not displace nutrient-rich foods."),

(["how much added sugar is too much", "added sugar daily limit", "recommended added sugar"],
 "Recommended limits vary by guideline, but keeping added sugar relatively low is generally encouraged, especially when it replaces nutrient-rich foods."),

(["why sugary drinks are easy to overconsume", "liquid calories", "sugary drink overeating"],
 "Liquid calories are often less filling than solid foods, making it easy to consume a large amount of sugar without feeling equally full."),

(["what are liquid calories", "liquid calories meaning", "calories in drinks"],
 "Liquid calories are energy from beverages such as sugary drinks, milk-based drinks, alcohol, or juices."),

(["why water has no calories", "water calories", "does water contain calories"],
 "Plain water contains no meaningful calories because it does not provide carbohydrates, protein, or fat."),

(["what drinks contain hidden calories", "hidden drink calories", "high calorie beverages"],
 "Sugary sodas, sweetened coffee, milkshakes, some smoothies, juices, and alcoholic drinks can contain substantial calories."),

(["how to reduce liquid calories", "reduce drink calories", "low calorie drinks"],
 "Choose water, sparkling water, unsweetened tea, or other lower-calorie beverages and reduce added sugar in drinks."),

(["is coconut water lower sugar than soda", "coconut water vs soda", "compare coconut water and soft drink"],
 "Plain coconut water usually has less added sugar than soda but still contains natural sugar and calories."),

(["is fruit juice better than soda", "juice vs soda", "fruit juice comparison"],
 "Unsweetened fruit juice can provide vitamins, but both drinks can contain substantial sugar and juice has less fiber than whole fruit."),

(["what is unsweetened beverage", "unsweetened drink meaning", "no sugar drink"],
 "An unsweetened beverage contains no added sugar, although it may naturally contain small amounts of carbohydrates depending on the drink."),

(["what is sugar free beverage", "sugar free drink meaning", "zero sugar drink"],
 "A sugar-free beverage contains little or no sugar under applicable labeling rules and may use non-sugar sweeteners."),

(["are artificial sweeteners safe", "non sugar sweeteners", "sweetener safety"],
 "Approved non-sugar sweeteners are considered safe within established acceptable intake levels, though individual responses and preferences vary."),

(["what are natural sweeteners", "natural sweetener meaning", "examples natural sweeteners"],
 "Natural sweeteners include honey, maple syrup, dates, and some plant-derived sweeteners. Natural does not automatically mean low-calorie or healthier."),

(["what is stevia", "stevia meaning", "stevia sweetener"],
 "Stevia is a low-calorie sweetener derived from steviol glycosides found in the Stevia plant."),

(["what is sucralose", "sucralose meaning", "sucralose sweetener"],
 "Sucralose is a low-calorie sweetener used in many foods and beverages."),

(["what is aspartame", "aspartame meaning", "aspartame sweetener"],
 "Aspartame is a low-calorie sweetener used in some foods and beverages. People with phenylketonuria need to avoid it."),

(["what is erythritol", "erythritol meaning", "erythritol sweetener"],
 "Erythritol is a sugar alcohol used as a low-calorie sweetener. Large amounts can cause digestive symptoms in some people."),

(["what are sugar alcohols", "sugar alcohol meaning", "examples of sugar alcohols"],
 "Sugar alcohols are sweeteners such as erythritol, xylitol, and sorbitol that are used in some reduced-sugar foods."),

(["can sugar alcohols cause bloating", "sugar alcohol digestion", "erythritol bloating"],
 "Some sugar alcohols can cause gas, bloating, or diarrhea when consumed in large amounts, with individual tolerance varying."),

(["what is xylitol", "xylitol meaning", "xylitol sweetener"],
 "Xylitol is a sugar alcohol used as a sweetener. It can cause digestive symptoms in large amounts and is highly toxic to dogs."),

(["why is xylitol dangerous for dogs", "xylitol dog toxicity", "xylitol pets"],
 "Xylitol can cause dangerous low blood sugar and other serious effects in dogs and should be kept away from pets."),

(["what is a food label serving", "food label serving information", "serving information"],
 "The serving listed on a food label is the reference amount used to calculate the displayed nutrition values."),

(["why calories differ by brand", "food calorie differences", "brand nutrition variation"],
 "Different brands can use different ingredients, recipes, serving sizes, and processing methods, causing nutrition values to vary."),

(["why protein differs between yogurts", "yogurt protein variation", "different yogurt protein"],
 "Straining, milk type, added ingredients, and serving size can change the protein content of yogurt."),

(["why cereal sugar differs by brand", "cereal sugar comparison", "different cereal sugar"],
 "Recipes vary between brands, so added sugar and total carbohydrate can differ substantially."),

(["why bread fiber differs", "bread fiber variation", "different bread fiber"],
 "Bread fiber varies with flour type, whole-grain content, added ingredients, and processing."),

(["why milk nutrition differs", "milk nutrition variation", "different milk calories"],
 "Milk products differ in fat content, fortification, added sugar, and processing, which changes their nutrition."),

(["why plant milk nutrition differs", "plant milk comparison", "different plant milk nutrition"],
 "Plant milks are made from different ingredients and may be fortified differently, so protein, calories, sugar, and micronutrients can vary."),

(["why packaged food portions can be small", "small serving sizes", "label serving trick"],
 "Serving sizes are standardized or defined for labeling purposes and may be smaller than what a person typically eats, so actual intake should be considered."),

(["how to calculate calories from multiple servings", "multiple servings calories", "food label servings calculation"],
 "Multiply the calories per serving by the number of servings you actually consume."),

(["how to calculate protein from multiple servings", "multiple serving protein", "food label protein calculation"],
 "Multiply protein per serving by the number of servings eaten."),

(["how to calculate sugar from multiple servings", "multiple serving sugar", "food label sugar calculation"],
 "Multiply sugar per serving by the number of servings consumed."),

(["how to calculate sodium from multiple servings", "multiple serving sodium", "food label sodium calculation"],
 "Multiply sodium per serving by the number of servings consumed."),

(["what is a nutrition fact panel", "nutrition facts label", "food nutrition panel"],
 "A nutrition facts panel summarizes serving size and selected nutrients such as calories, fat, carbohydrate, protein, sodium, and sometimes vitamins and minerals."),

(["why ingredients matter more than marketing claims", "food marketing claims", "nutrition marketing labels"],
 "Marketing claims can highlight one feature while leaving out other important nutrition information, so the complete label is more informative."),

(["what does high fiber claim mean", "high fiber label", "fiber claim on food"],
 "A high-fiber claim indicates the product meets a defined regulatory threshold, but the exact amount should still be checked on the nutrition label."),

(["what does low sodium claim mean", "low sodium label", "low sodium food claim"],
 "A low-sodium claim indicates the food meets a defined sodium limit under applicable labeling regulations."),

(["what does reduced sugar mean", "reduced sugar label", "less sugar claim"],
 "Reduced sugar means the product contains less sugar than a comparison product or reference according to labeling rules; it does not necessarily mean low sugar."),

(["what does reduced fat mean", "reduced fat label", "less fat food claim"],
 "Reduced fat means the product contains less fat than a reference product under applicable labeling rules."),

(["what does organic food mean", "organic food meaning", "organic label"],
 "Organic labeling refers to production standards defined by the relevant certification system. Organic does not automatically mean lower calorie or more nutritious."),

(["is organic food always healthier", "organic vs conventional", "organic food nutrition"],
 "Organic foods are not automatically more nutritious or lower in calories. Nutritional quality depends on the food and overall diet."),

(["what is minimally processed food", "minimally processed meaning", "examples minimally processed"],
 "Minimally processed foods have undergone limited processing while retaining much of their original structure and nutritional characteristics."),

(["examples of minimally processed foods", "minimally processed food examples", "healthy minimally processed foods"],
 "Fresh or frozen vegetables, whole fruits, plain yogurt, eggs, dried legumes, whole grains, nuts, and seeds are examples."),

(["what is processed food", "processed food meaning", "processed foods examples"],
 "Processed foods have been altered from their original form through methods such as cooking, drying, fermenting, or adding ingredients."),

(["what is ultra processed food example", "ultra processed examples", "highly processed food examples"],
 "Examples can include some packaged snacks, sugary drinks, instant foods, and ready-to-eat products with multiple refined ingredients and additives."),

(["does processing always reduce nutrition", "food processing nutrition", "processed food nutrients"],
 "Processing can increase, decrease, or preserve different nutrients depending on the food and method."),

(["can freezing improve convenience", "frozen food convenience", "benefits of frozen foods"],
 "Freezing can extend shelf life and make nutritious foods such as vegetables and fruits convenient to use."),

(["can canned beans save time", "canned beans convenience", "quick beans"],
 "Canned beans are a convenient source of protein and fiber and can reduce cooking time. Rinsing can reduce some sodium."),

(["can frozen vegetables save time", "frozen vegetables convenience", "quick vegetables"],
 "Frozen vegetables can reduce preparation time while still providing useful nutrients."),

(["what is convenience food", "convenience food meaning", "easy food"],
 "Convenience foods are designed to reduce preparation time. Their nutritional quality varies widely."),

(["how to choose convenience food", "healthy convenience foods", "convenient healthy meals"],
 "Choose convenience foods that provide useful protein or fiber and compare sodium, added sugar, saturated fat, and serving size."),

(["what is ready to eat food", "ready to eat meaning", "ready to eat nutrition"],
 "Ready-to-eat foods can be consumed without additional cooking but may vary widely in nutritional quality and food-safety requirements."),

(["what is ready to cook food", "ready to cook meaning", "ready to cook meals"],
 "Ready-to-cook foods require some preparation or cooking before consumption. Follow package instructions and food-safety guidance."),

(["what is frozen meal", "frozen meal meaning", "frozen ready meal"],
 "Frozen meals are prepared foods stored frozen. Check nutrition labels for protein, fiber, sodium, saturated fat, and serving size."),

(["how to choose healthy frozen meal", "healthy frozen meals", "frozen meal label"],
 "Choose meals with useful protein and vegetables while comparing sodium, calories, saturated fat, and fiber."),

(["what is a balanced ready meal", "ready meal nutrition", "healthy ready meal"],
 "A balanced ready meal ideally includes a protein source, vegetables, suitable carbohydrate, and reasonable sodium and saturated fat."),

(["can ready meals be healthy", "healthy ready meals", "prepared meals nutrition"],
 "Some ready meals can be nutritious. Check the full nutrition label rather than judging by packaging alone."),

(["what is a healthy food environment", "food environment meaning", "healthy eating environment"],
 "A healthy food environment makes nutritious foods accessible, affordable, convenient, and appealing."),

(["how can home environment affect eating", "home food environment", "food availability and eating"],
 "Foods that are easily visible and accessible can influence eating habits, so keeping nutritious options convenient can help."),

(["how can college environment affect eating", "college food environment", "student food choices"],
 "Class schedules, canteen options, social activities, stress, and food availability can all influence student eating patterns."),

(["how can budget affect nutrition", "income and food choices", "healthy food budget"],
 "Food budgets influence choices. Planning, buying seasonal produce, using legumes and grains, and cooking at home can help stretch a budget."),

(["what are affordable protein foods", "cheap protein sources", "budget protein"],
 "Lentils, beans, eggs, milk, curd, roasted chickpeas, soy foods, and some canned fish can be affordable protein sources."),

(["what are affordable vegetables", "cheap vegetables", "budget vegetables"],
 "Seasonal and locally available vegetables are often more affordable. Frozen vegetables can also be economical."),

(["what are affordable fruits", "cheap fruits", "budget fruit"],
 "Seasonal local fruits and bananas are often economical options, though prices vary by location and season."),

(["what are affordable whole grains", "cheap grains", "budget grains"],
 "Rice, oats, whole wheat, and other locally available grains can provide affordable carbohydrate and fiber."),

(["how to make healthy meals cheap", "cheap healthy meals", "budget healthy cooking"],
 "Build meals around affordable staples such as lentils, beans, grains, seasonal vegetables, eggs, and homemade foods."),

(["why meal planning saves money", "meal planning budget", "save money with meal prep"],
 "Planning meals can reduce food waste, impulse purchases, and repeated restaurant spending."),

(["what is food budgeting", "food budget meaning", "nutrition budget"],
 "Food budgeting means planning grocery and meal spending so that nutritious foods remain affordable within available resources."),

(["how to make a grocery budget", "grocery budgeting", "food shopping budget"],
 "Set a weekly budget, plan meals, compare prices, buy useful staples, and prioritize foods that provide good nutritional value for their cost."),

(["what is seasonal produce", "seasonal fruits vegetables", "seasonal food meaning"],
 "Seasonal produce is food harvested during its natural local growing season, which can affect availability, freshness, and price."),

(["why local food can be affordable", "local seasonal food", "local produce benefits"],
 "Local produce may have shorter supply chains and can be affordable when in season, although prices vary by region."),

(["what is sustainable eating", "sustainable diet meaning", "sustainable food choices"],
 "Sustainable eating considers nutrition, environmental impact, food availability, culture, affordability, and long-term practicality."),

(["what foods have lower environmental impact", "sustainable food choices", "environment friendly foods"],
 "Plant foods such as legumes, grains, vegetables, fruits, nuts, and seeds can generally have lower environmental impacts than many animal foods."),

(["why legumes are sustainable", "beans sustainability", "lentils environmental benefits"],
 "Legumes provide protein and nutrients while generally requiring fewer resources than many animal protein sources."),

(["is plant based eating sustainable", "plant based sustainability", "environment plant diet"],
 "Plant-based eating can reduce environmental impact, although sustainability depends on food production, transport, waste, and overall dietary pattern."),

(["what is food waste impact", "food waste nutrition", "why reduce food waste"],
 "Reducing food waste saves resources and money and helps make food systems more efficient."),

(["how can Nutri AI reduce food waste", "AI food waste reduction", "Nutri AI leftover feature"],
 "Nutri AI could suggest recipes based on available leftovers and remind users to use foods before they spoil."),

(["can Nutri AI suggest recipes from leftovers", "leftover recipe AI", "AI leftover meal suggestions"],
 "Yes. A recipe feature can use available ingredients to suggest practical meal combinations while considering dietary preferences."),

(["what is smart grocery list", "AI grocery list feature", "smart food shopping"],
 "A smart grocery list can generate ingredients from planned meals and organize them by food category."),

(["can Nutri AI track grocery inventory", "food inventory AI", "pantry tracker"],
 "A pantry feature can track available ingredients and suggest meals before foods expire."),

(["what is pantry management", "pantry tracker meaning", "food inventory management"],
 "Pantry management tracks stored foods, quantities, and expiry information to make shopping and meal planning easier."),

(["why expiry reminders help", "food expiry reminder", "Nutri AI expiry notification"],
 "Expiry reminders can reduce food waste and encourage users to consume or freeze suitable foods before quality declines."),

(["what is recipe nutrition analysis", "recipe calorie calculator", "recipe nutrition AI"],
 "Recipe nutrition analysis estimates calories and nutrients from ingredients and portions used in a recipe."),

(["can Nutri AI calculate recipe calories", "AI recipe calorie calculation", "recipe nutrition calculator"],
 "Yes. If ingredient quantities and reliable nutrition data are available, Nutri AI can estimate recipe nutrition."),

(["why recipe portions matter", "recipe serving size", "recipe nutrition portions"],
 "Total recipe nutrition must be divided by the number of servings to estimate nutrition per serving."),

(["how to calculate recipe protein", "recipe protein calculation", "protein per serving recipe"],
 "Add the protein from each ingredient and divide the total by the number of servings."),

(["how to calculate recipe calories", "recipe calorie calculation", "calories per serving recipe"],
 "Add calories from all ingredients and divide the total by the number of servings."),

(["how to make a recipe higher protein", "high protein recipe tips", "increase recipe protein"],
 "Add legumes, tofu, paneer, eggs, dairy, fish, chicken, soy foods, nuts, or seeds depending on the recipe."),

(["how to make a recipe higher fiber", "high fiber recipe tips", "increase recipe fiber"],
 "Add vegetables, legumes, whole grains, fruits, nuts, or seeds to increase fiber."),

(["how to reduce recipe sodium", "low sodium recipe", "reduce salt in recipe"],
 "Use less added salt and salty sauces and add herbs, spices, lemon, vinegar, garlic, or ginger for flavor."),

(["how to reduce recipe sugar", "low sugar recipe", "reduce sugar in recipe"],
 "Reduce added sugar gradually and use fruit, spices, or unsweetened ingredients where suitable."),

(["how to reduce recipe fat", "low fat recipe", "reduce oil in recipe"],
 "Use less oil, choose leaner protein, and use cooking methods such as steaming, baking, grilling, or air frying."),

(["how to increase calories in a recipe", "high calorie recipe", "increase recipe energy"],
 "Add nutrient-dense ingredients such as nuts, seeds, nut butter, avocado, dairy, whole grains, or healthy oils."),

(["what is meal customization", "custom meal plan", "personalized meal customization"],
 "Meal customization adjusts ingredients, portions, and meal types according to dietary preferences, goals, allergies, and practical constraints."),

(["why food preferences matter", "diet preference importance", "personal food choices"],
 "Food preferences affect adherence and enjoyment, so practical nutrition plans should consider foods a person likes and can access."),

(["why cultural foods matter in diet planning", "culture and nutrition", "cultural food preferences"],
 "Including familiar cultural foods can make nutrition plans more realistic, enjoyable, and sustainable."),

(["why budget matters in meal planning", "budget meal planning", "affordable nutrition plan"],
 "A meal plan must fit a person's budget to be realistic and sustainable."),

(["why cooking skill matters in nutrition", "cooking skills and diet", "meal plan cooking ability"],
 "Meal recommendations should match the person's available time, equipment, and cooking skills."),

(["why time matters in meal planning", "busy schedule nutrition", "meal planning for busy people"],
 "Meal plans that fit the user's schedule are more practical and easier to maintain."),

(["what is a practical nutrition plan", "practical diet plan", "realistic meal plan"],
 "A practical nutrition plan uses accessible foods, manageable preparation, appropriate portions, and habits that fit daily life."),

(["what is a flexible meal plan", "flexible diet plan", "flexible nutrition"],
 "A flexible meal plan provides structure while allowing substitutions, social meals, preferences, and changes in schedule."),

(["why meal substitutions matter", "meal replacement options", "food substitution planning"],
 "Substitutions help users maintain nutritional balance when a preferred or available food is different from the original plan."),

(["what is a food preference profile", "diet profile", "nutrition preference profile"],
 "A food preference profile records dietary choices such as vegetarian, vegan, non-vegetarian, allergies, intolerances, and disliked foods."),

(["why allergy and preference are different", "food allergy vs preference", "diet preference vs allergy"],
 "An allergy is a medical immune reaction, while a preference is a personal choice. Allergies require stronger safety precautions."),

(["what is a food intolerance profile", "intolerance in nutrition app", "food intolerance tracking"],
 "An intolerance profile records foods that cause digestive or other non-allergic symptoms for the user."),

(["should Nutri AI remember disliked foods", "food dislikes in AI", "nutrition app food preferences"],
 "If users choose to provide food dislikes, the app can use them to make recommendations more relevant."),

(["what is adaptive nutrition recommendation", "adaptive food recommendation", "AI adaptive diet"],
 "Adaptive nutrition recommendations change based on updated user preferences, logged foods, goals, and feedback."),

(["what is feedback loop in nutrition AI", "AI nutrition feedback", "recommendation feedback"],
 "A feedback loop uses user responses and outcomes to improve future suggestions while avoiding unsupported medical conclusions."),

(["why ask user if recommendation was useful", "nutrition recommendation feedback", "AI suggestion feedback"],
 "User feedback helps identify whether recommendations are practical and relevant and can improve the user experience."),

(["what is recommendation personalization", "personalized AI recommendations", "custom food recommendations"],
 "Personalization adjusts suggestions to relevant user information such as dietary preferences, activity, goals, and available foods."),

(["what is recommendation transparency", "AI recommendation transparency", "explain food recommendations"],
 "Recommendation transparency means explaining the main factors behind a suggestion rather than presenting it as an unexplained decision."),

(["what is safe personalization", "safe AI personalization", "personalized nutrition safety"],
 "Safe personalization uses relevant information while avoiding diagnosis, harmful restrictions, unsupported claims, and unnecessary sensitive-data collection."),

(["what is human oversight in nutrition AI", "human review AI nutrition", "nutrition AI human oversight"],
 "Human oversight means qualified people can review or guide important nutrition recommendations, especially when health risks are involved."),

(["why should Nutri AI have professional referral", "AI referral to dietitian", "nutrition professional referral"],
 "Referral options help users seek qualified care when their needs go beyond general wellness information."),

(["what is escalation in health chatbot", "health chatbot escalation", "AI health escalation"],
 "Escalation means directing a user to appropriate professional or emergency support when the issue is beyond the chatbot's safe scope."),

(["when should a nutrition chatbot stop answering", "AI nutrition boundaries", "chatbot limits"],
 "A nutrition chatbot should avoid diagnosing or treating serious conditions and should direct urgent or medically complex concerns to appropriate professionals."),

(["what is emergency nutrition question", "nutrition emergency", "health emergency chatbot"],
 "Emergency symptoms should be handled through medical emergency services rather than a nutrition chatbot."),

(["can Nutri AI interpret blood tests", "AI lab nutrition", "nutrition blood test interpretation"],
 "AI can explain general meanings of some lab values, but medical interpretation and diagnosis should be handled by qualified healthcare professionals."),

(["can Nutri AI prescribe supplements", "AI supplement prescription", "supplement recommendation safety"],
 "Nutri AI should not prescribe supplements or treatment. Supplement decisions should consider individual health and professional guidance."),

(["can Nutri AI recommend medication", "AI medication advice", "nutrition chatbot medicine"],
 "Nutri AI should not recommend, stop, or change medications. Medication decisions require a qualified healthcare professional."),

(["can food replace medicine", "food instead of medicine", "nutrition treatment replacement"],
 "Food supports nutrition and health but should not be presented as a replacement for prescribed medical treatment."),

(["can diet cure disease", "diet cure illness", "food cure disease"],
 "Diet can influence health and disease risk, but no single food should be presented as a universal cure for disease."),

(["can healthy food prevent every disease", "diet disease prevention", "food prevents all disease"],
 "Healthy eating can reduce risk for some conditions, but it cannot prevent every disease and does not guarantee a specific health outcome."),

(["what is preventive nutrition", "preventive nutrition meaning", "nutrition for prevention"],
 "Preventive nutrition focuses on eating patterns and habits that support health and may reduce risk factors for certain diseases."),

(["what is clinical nutrition", "clinical nutrition meaning", "medical nutrition"],
 "Clinical nutrition uses nutrition assessment and individualized dietary care as part of managing health conditions, usually under professional supervision."),

(["what is sports nutrition", "sports nutrition meaning", "athlete nutrition"],
 "Sports nutrition focuses on energy, carbohydrates, protein, hydration, recovery, and other nutritional factors related to physical performance."),

(["what is pediatric nutrition", "child nutrition meaning", "nutrition for children"],
 "Pediatric nutrition focuses on meeting children's growth, development, energy, and nutrient needs."),

(["what is geriatric nutrition", "older adult nutrition", "nutrition for elderly"],
 "Nutrition for older adults considers changes in energy needs, muscle mass, appetite, hydration, and nutrient requirements."),

(["what is nutrition for seniors", "senior diet", "older people nutrition"],
 "Older adults benefit from adequate protein, fiber, fluids, micronutrients, and energy while considering individual health conditions."),

(["what is nutrition for athletes", "athlete diet", "sports nutrition basics"],
 "Athletes generally need adequate energy, carbohydrate, protein, fluids, micronutrients, and recovery depending on their sport and training load."),

(["what is endurance nutrition", "endurance athlete diet", "long distance nutrition"],
 "Endurance nutrition emphasizes adequate carbohydrate, hydration, electrolytes when needed, and recovery protein."),

(["what is strength athlete nutrition", "strength training nutrition", "bodybuilding nutrition basics"],
 "Strength-focused nutrition emphasizes adequate energy, protein, carbohydrate for training, hydration, and recovery."),

(["what is recovery nutrition for athletes", "athlete recovery food", "sports recovery nutrition"],
 "Recovery nutrition combines carbohydrate, protein, fluids, and adequate overall energy to support training adaptation and recovery."),

(["what is competition day nutrition", "competition day food", "sports event nutrition"],
 "Competition-day nutrition should use familiar foods and hydration strategies that have already been tested during training."),

(["why avoid new foods before competition", "new food before competition", "sports competition food"],
 "Unfamiliar foods may cause digestive problems or unpredictable energy levels, so athletes generally benefit from familiar choices before competition."),

(["what is carb timing", "carbohydrate timing", "carbs around exercise"],
 "Carbohydrate timing means adjusting carbohydrate intake around training or competition to support energy and recovery."),

(["what is protein timing", "protein timing meaning", "protein around exercise"],
 "Protein timing refers to distributing protein around the day and exercise sessions to support recovery and muscle protein synthesis."),

(["what is hydration timing", "fluid timing exercise", "water timing workout"],
 "Hydration timing involves drinking before, during, and after exercise according to individual needs and fluid losses."),

(["what is sweat rate", "sweat rate meaning", "calculate sweat rate"],
 "Sweat rate estimates how much fluid a person loses during exercise and can help personalize hydration strategies."),

(["how to estimate sweat rate", "calculate sweat loss", "sweat rate calculation"],
 "Sweat rate can be estimated by comparing body weight before and after exercise while accounting for fluids consumed and urine output."),

(["why body weight changes after workout", "post workout weight change", "exercise weight fluctuation"],
 "Short-term weight changes after exercise are often due to fluid loss or gain rather than changes in body fat."),

(["what is rehydration after exercise", "post exercise rehydration", "replace fluids after workout"],
 "Rehydration replaces fluids lost during exercise. The amount needed depends on sweat loss, exercise duration, and environmental conditions."),

(["what is electrolyte replacement after exercise", "post workout electrolytes", "replace sodium after sweating"],
 "Electrolyte replacement can be useful after substantial sweating, especially in prolonged or hot exercise."),

(["why sodium is lost in sweat", "sodium sweat loss", "electrolytes in sweat"],
 "Sweat contains sodium and chloride along with water. Sweat sodium concentration varies significantly between people."),

(["what is a salty sweater", "high sodium sweat", "sweat sodium"],
 "A 'salty sweater' informally refers to someone whose sweat contains relatively more sodium, often noticed through salt residue on skin or clothing."),

(["does everyone need electrolyte supplements", "electrolytes for everyone", "electrolyte supplement need"],
 "No. Many people can meet electrolyte needs through regular food and fluids, especially during normal daily activity."),

(["what is nutrition periodization", "sports nutrition periodization", "nutrition around training phases"],
 "Nutrition periodization adjusts food and energy intake according to different training phases, workloads, and competition periods."),

(["what is training day nutrition", "workout day diet", "nutrition on training days"],
 "Training-day nutrition should provide enough energy, carbohydrate, protein, fluids, and micronutrients to support the workload."),

(["what is rest day nutrition", "rest day diet", "nutrition on rest days"],
 "Rest-day nutrition still needs adequate protein and micronutrients while energy needs may differ according to reduced activity."),

(["what is deload week nutrition", "deload nutrition", "food during deload"],
 "During a deload, maintain adequate protein and nutrient intake while adjusting energy and carbohydrate to the lower training workload if needed."),

(["what is recovery meal timing", "recovery food timing", "post exercise meal timing"],
 "Recovery nutrition can begin soon after exercise when practical, but total daily nutrient intake remains the larger priority."),

(["what is pre competition meal", "competition meal", "food before competition"],
 "A pre-competition meal should provide familiar carbohydrates, moderate protein, fluids, and foods that are easy for the athlete to tolerate."),

(["what is post competition meal", "food after competition", "post event nutrition"],
 "After competition, focus on fluids, carbohydrate to restore energy, and protein to support recovery."),

(["what is travel nutrition for athletes", "athlete travel food", "sports travel nutrition"],
 "Athletes traveling should plan portable familiar foods, hydration, and reliable meal options to maintain nutrition during travel."),

(["what is nutrition period in training", "training nutrition phase", "sports diet phases"],
 "Training nutrition phases adjust food intake based on workload, goals, and recovery demands."),

(["what is energy availability", "energy availability meaning", "athlete energy availability"],
 "Energy availability refers to the energy remaining for body functions after accounting for exercise expenditure."),

(["why low energy availability is risky", "low energy availability", "underfueling athletes"],
 "Chronically inadequate energy availability can impair recovery, performance, hormones, bone health, and other body functions."),

(["what is underfueling", "underfueling meaning", "not eating enough for exercise"],
 "Underfueling occurs when food and energy intake are insufficient to support training and normal body functions."),

(["how to avoid underfueling", "prevent underfueling", "athlete eating enough"],
 "Match food intake to activity, include regular meals and snacks, and seek professional guidance if training demands are high or symptoms occur."),

(["what is overfueling", "overfeeding exercise", "too much energy intake"],
 "Overfueling means consistently consuming more energy than needed for the individual's activity and goals."),

(["what is nutritional periodization for weight goals", "diet phases weight management", "nutrition phases"],
 "Nutrition phases can adjust energy and food intake according to changing goals, activity levels, and personal needs."),

(["why body composition matters", "body composition nutrition", "fat muscle composition"],
 "Body composition describes the relative amounts of fat, muscle, bone, and other tissues and can provide information beyond body weight alone."),

(["what is BMI", "BMI meaning", "body mass index"],
 "BMI is a screening measure based on height and weight. It does not directly measure body fat or distinguish muscle from fat."),

(["are BMI categories perfect", "BMI limitations", "BMI accuracy"],
 "BMI is useful as a population-level screening tool but has limitations for individuals because it does not directly measure body composition."),

(["what is waist circumference", "waist measurement meaning", "waist health"],
 "Waist circumference is one measure of central body fat and can provide additional health information alongside other assessments."),

(["why body measurements fluctuate", "waist fluctuation", "body measurement changes"],
 "Measurements can change due to food, fluids, bloating, bowel contents, posture, and measurement technique."),

(["why scale weight fluctuates", "body weight fluctuation", "daily weight changes"],
 "Scale weight changes with hydration, sodium, carbohydrate stores, food in the digestive system, hormones, and other factors."),

(["why carbohydrate causes water weight", "carbs water retention", "glycogen water"],
 "Stored carbohydrate in the form of glycogen is associated with water, so changes in carbohydrate intake can cause short-term changes in body water and scale weight."),

(["why salty food increases weight temporarily", "salt water retention", "sodium weight gain"],
 "Higher sodium intake can temporarily increase water retention, causing scale weight to rise without equivalent fat gain."),

(["why menstrual cycle changes weight", "period weight changes", "menstrual cycle water weight"],
 "Hormonal changes during the menstrual cycle can affect fluid retention, appetite, digestion, and body weight temporarily."),

(["should i worry about one day weight gain", "single day weight increase", "daily scale increase"],
 "A single day's weight change is usually not a reliable measure of body-fat change because water and digestive contents can vary substantially."),

(["how to track weight trend", "weight trend tracking", "body weight average"],
 "Track measurements under similar conditions and look at longer-term trends rather than reacting to individual readings."),

(["what is weekly average weight", "weight weekly average", "average body weight"],
 "A weekly average reduces the effect of day-to-day fluctuations and can make longer-term trends easier to interpret."),

(["what is healthy weight management", "weight management meaning", "healthy weight control"],
 "Healthy weight management focuses on sustainable eating, regular physical activity, sleep, and overall well-being rather than extreme restriction."),

(["why crash dieting causes rebound eating", "crash diet overeating", "restrictive diet rebound"],
 "Severe restriction can increase hunger and make the diet difficult to sustain, which may contribute to rebound eating for some people."),

(["how to avoid restrictive dieting", "avoid extreme dieting", "flexible diet approach"],
 "Set realistic goals, eat enough nutrient-rich foods, allow flexibility, and avoid unnecessary elimination or extreme calorie restriction."),

(["what is sustainable calorie deficit", "sustainable calorie deficit meaning", "safe calorie deficit"],
 "A sustainable calorie deficit is a moderate reduction in energy intake that still allows adequate nutrition and can be maintained over time."),

(["why protein matters during calorie deficit", "protein calorie deficit", "protein during dieting"],
 "Adequate protein during a calorie deficit can support fullness and help preserve lean tissue."),

(["why strength training matters during fat loss", "weights during weight loss", "resistance training fat loss"],
 "Strength training helps maintain or build muscle while reducing body fat and supports physical function."),

(["why sleep matters during weight loss", "sleep during diet", "weight loss sleep"],
 "Adequate sleep supports appetite regulation, recovery, activity, and adherence to healthy habits."),

(["why stress matters during weight management", "stress and weight", "stress weight management"],
 "Stress can affect appetite, food choices, sleep, and activity, which can influence weight management."),

(["what is healthy body image", "body image meaning", "positive body image"],
 "Healthy body image involves treating your body with respect and avoiding self-worth being determined solely by appearance or weight."),

(["why body image matters in nutrition", "body image and diet", "nutrition body image"],
 "A healthy relationship with food and body image can support sustainable eating habits and reduce harmful restriction or guilt."),

(["what is disordered eating", "disordered eating meaning", "unhealthy eating behaviors"],
 "Disordered eating refers to problematic eating behaviors or attitudes that may not meet criteria for a diagnosed eating disorder but can still affect health and well-being."),

(["when should i seek help for eating problems", "eating problem support", "nutrition mental health help"],
 "Seek professional help if eating behaviors cause distress, significant restriction, bingeing, purging, fear around food, or major changes in health."),

(["what is binge eating", "binge eating meaning", "binge eating behavior"],
 "Binge eating involves episodes of consuming unusually large amounts of food with a sense of loss of control. Recurrent episodes warrant professional support."),

(["what is emotional hunger", "emotional hunger meaning", "feelings and eating"],
 "Emotional hunger is eating driven mainly by feelings or situations rather than physical energy needs."),

(["what is physical hunger", "physical hunger meaning", "real hunger"],
 "Physical hunger is the body's signal that it needs energy or food and often develops gradually."),

(["how to tell emotional hunger from physical hunger", "emotional vs physical hunger", "hunger comparison"],
 "Physical hunger tends to build gradually and accepts many foods, while emotional hunger can be sudden and focused on specific foods."),

(["what is mindful eating practice", "mindful eating exercise", "mindful food practice"],
 "Try eating without distractions, noticing flavor and texture, slowing down, and checking hunger and fullness during the meal."),

(["what is hunger journaling", "hunger diary", "track hunger"],
 "Hunger journaling records hunger, fullness, emotions, meal timing, and food choices to identify patterns."),

(["why nutrition apps should not shame users", "food tracking shame", "healthy nutrition app design"],
 "Shame can harm the relationship with food and reduce healthy engagement. Supportive feedback is more appropriate."),

(["what is compassionate nutrition coaching", "supportive nutrition advice", "kind nutrition coaching"],
 "Compassionate nutrition coaching focuses on practical changes, flexibility, and learning rather than guilt or punishment."),

(["what is behavior change in nutrition", "nutrition behavior change", "changing eating habits"],
 "Nutrition behavior change involves developing sustainable habits around food, activity, hydration, sleep, and planning."),

(["what is SMART nutrition goal", "SMART diet goal", "smart nutrition goals"],
 "A SMART nutrition goal is specific, measurable, achievable, relevant, and time-bound."),

(["example of SMART nutrition goal", "nutrition SMART goal example", "healthy habit goal example"],
 "An example is: 'For the next two weeks, I will include a vegetable with lunch at least five days per week.'"),

(["why small goals work", "small nutrition goals", "tiny diet changes"],
 "Small goals are easier to practice consistently and can build confidence before adding more changes."),

(["how to track nutrition habits", "habit tracking food", "nutrition habit log"],
 "Track a few specific behaviors such as water intake, vegetables, protein at breakfast, meal logging, or movement."),

(["what is habit stacking", "habit stacking nutrition", "food habit stacking"],
 "Habit stacking links a new behavior to an existing routine, such as drinking water after brushing your teeth."),

(["example of nutrition habit stacking", "nutrition habit stack example", "healthy habit routine"],
 "For example, after your morning class starts, drink water; or after dinner, take a short walk if practical."),

(["what is implementation intention", "if then nutrition plan", "nutrition if then plan"],
 "An implementation intention uses an 'if-then' plan, such as 'If I want a sugary drink, then I will first drink water and decide afterward.'"),

(["how can Nutri AI use habit stacking", "AI habit stacking", "Nutri AI routine reminders"],
 "Nutri AI can suggest linking simple nutrition behaviors to existing routines, such as drinking water with meals."),

(["what is progress tracking", "nutrition progress tracking", "health habit progress"],
 "Progress tracking records behaviors or measurements over time so users can identify trends and adjust routines."),

(["why progress is not linear", "nutrition progress fluctuations", "weight progress not linear"],
 "Body weight, appetite, energy, and habits naturally fluctuate, so progress should be evaluated over longer periods rather than single days."),

(["what is a setback in nutrition", "diet setback meaning", "nutrition setback"],
 "A setback is a temporary deviation from a planned habit. It does not erase previous progress and can be used as a learning opportunity."),

(["how to recover from a diet setback", "nutrition setback recovery", "restart healthy eating"],
 "Resume your normal routine at the next opportunity and identify what made the previous plan difficult."),

(["why flexibility matters in diet", "flexible nutrition benefits", "diet flexibility"],
 "Flexibility makes it easier to handle social events, travel, preferences, and unexpected schedule changes without abandoning healthy habits."),

(["what is an 80 20 diet", "80 20 eating approach", "flexible 80 20 diet"],
 "The 80/20 idea is an informal approach emphasizing nutrient-rich foods most of the time while allowing flexibility. It is not a strict scientific rule."),

(["is 80 20 diet necessary", "do i need 80 20 diet", "80 20 nutrition"],
 "No. It is simply one way to think about flexible eating and is not required for healthy nutrition."),

(["what is food freedom", "food freedom meaning", "flexible relationship with food"],
 "Food freedom generally refers to having a flexible, less fearful relationship with food while still supporting nutritional needs."),

(["what is balanced indulgence", "indulgent food balance", "treat foods in diet"],
 "Balanced indulgence means enjoying favorite foods in reasonable portions without letting them consistently replace nutrient-rich foods."),

(["can Nutri AI suggest healthy alternatives", "food alternative AI", "Nutri AI food swaps"],
 "Yes. Nutri AI can suggest alternatives based on similar ingredients, dietary preferences, protein, fiber, or lower added sugar."),

(["can Nutri AI suggest recipes by calorie target", "calorie target recipes AI", "AI recipes by calories"],
 "If reliable nutrition data and portions are available, Nutri AI can estimate recipes that fit a selected calorie range, but estimates are not exact."),

(["can Nutri AI suggest high protein recipes", "high protein recipes AI", "Nutri AI protein recipes"],
 "Yes. It can suggest recipes using protein-rich foods such as eggs, dairy, legumes, soy, fish, or chicken."),

(["can Nutri AI suggest low sodium recipes", "low sodium recipes AI", "Nutri AI low salt recipes"],
 "Yes. It can suggest recipes using fresh ingredients, herbs, spices, and limited added salt while considering the user's overall diet."),

(["can Nutri AI suggest high fiber recipes", "high fiber recipes AI", "Nutri AI fiber recipes"],
 "Yes. It can build recipes around legumes, vegetables, fruits, whole grains, nuts, and seeds."),

(["can Nutri AI suggest vegan recipes", "vegan recipes AI", "Nutri AI vegan meals"],
 "Yes. It can suggest plant-based meals using legumes, tofu, tempeh, whole grains, vegetables, fruits, nuts, and seeds."),

(["can Nutri AI suggest vegetarian recipes", "vegetarian recipes AI", "Nutri AI vegetarian meals"],
 "Yes. It can suggest meals using vegetables, legumes, dairy, eggs, soy foods, grains, nuts, and seeds."),

(["can Nutri AI suggest student recipes", "student recipes AI", "easy recipes for students"],
 "Yes. It can suggest simple, affordable recipes that require limited equipment and preparation time."),

(["can Nutri AI suggest Indian recipes", "Indian recipes AI", "Nutri AI Indian recipe ideas"],
 "Yes. It can suggest general Indian meal ideas while considering dietary preferences, portions, protein, vegetables, and cooking methods."),

(["can Nutri AI suggest quick recipes", "quick recipes AI", "Nutri AI fast meals"],
 "Yes. It can prioritize meals with short preparation times and simple ingredients."),

(["can Nutri AI suggest no cook recipes", "no cook recipes AI", "Nutri AI no cooking meals"],
 "Yes. It can suggest options such as yogurt bowls, sandwiches, salads, fruit and nuts, and other foods that require minimal preparation."),

(["can Nutri AI suggest budget recipes", "budget recipes AI", "cheap recipes Nutri AI"],
 "Yes. It can prioritize affordable staples such as lentils, beans, eggs, grains, seasonal vegetables, and curd."),

(["can Nutri AI suggest recipes from pantry", "pantry recipe AI", "recipes from available food"],
 "Yes. A pantry-based recipe feature can generate meal ideas from ingredients the user already has."),

(["can Nutri AI suggest recipes from leftovers", "leftover recipe generator", "AI leftover recipes"],
 "Yes. Users can enter leftover ingredients and the system can suggest combinations while considering food safety."),

(["can Nutri AI identify calories from photo", "food photo calorie estimate", "AI food image calories"],
 "Image-based calorie estimation can provide a rough estimate, but portion size and hidden ingredients make photo estimates uncertain."),

(["can AI identify portion size from photo", "food portion image AI", "portion detection from photo"],
 "AI can attempt to estimate portion size from images, but accuracy can be limited by camera angle, food shape, and scale."),

(["can AI identify ingredients from food photo", "food image ingredient detection", "ingredient recognition photo"],
 "AI may identify visible ingredients from an image, but hidden ingredients and similar-looking foods can cause errors."),

(["why food photo nutrition is approximate", "photo nutrition accuracy", "AI food scan limitations"],
 "Images do not reliably reveal exact ingredients, cooking oils, serving weights, or hidden calories, so nutrition estimates from photos are approximate."),

(["what is barcode accuracy", "barcode food accuracy", "food barcode reliability"],
 "Barcode identification can be accurate for products present in a reliable database, but users should verify the returned data against the package."),

(["what if barcode product is outdated", "outdated food database", "barcode nutrition outdated"],
 "The app should allow users to verify the product label and report or update incorrect information when possible."),

(["what is food database update", "update nutrition database", "food data freshness"],
 "Database updates add or correct product information so nutrition and ingredient data stays more current."),

(["why Nutri AI needs fallback response", "Nutri AI fallback", "fallback in nutrition chatbot"],
 "A fallback prevents the chatbot from inventing answers when the user's question does not match supported training data."),

(["what is unknown question handling", "unknown query chatbot", "unsupported nutrition question"],
 "Unknown questions should receive a clear fallback message rather than an unrelated or fabricated response."),

(["how to make Nutri AI say i don't know", "AI uncertainty response", "unknown answer Nutri AI"],
 "Add fallback responses that openly say when the system does not have enough information and suggest supported nutrition topics."),

(["why fallback should not give random nutrition advice", "fallback hallucination", "unsafe fallback response"],
 "A random answer can be misleading. The fallback should acknowledge the limitation and guide the user toward supported topics."),

(["how to improve Nutri AI over time", "improve nutrition chatbot", "Nutri AI improvement"],
 "Collect testing feedback, add diverse high-quality training phrases, remove conflicts, improve food data, and regularly test the chatbot."),

(["what is chatbot evaluation", "Nutri AI evaluation", "nutrition chatbot performance"],
 "Chatbot evaluation measures whether questions are matched correctly, answers are accurate, and unsupported questions are handled safely."),

(["what is accuracy in chatbot", "chatbot accuracy meaning", "nutrition AI accuracy"],
 "Chatbot accuracy measures how often the system provides the intended correct response for supported questions."),

(["what is precision in chatbot matching", "chatbot precision", "AI matching precision"],
 "Precision measures how often selected matches are correct rather than false matches."),

(["what is recall in chatbot matching", "chatbot recall", "AI matching recall"],
 "Recall measures how many relevant user questions the system successfully recognizes."),

(["why balance precision and recall", "chatbot precision recall", "matching quality"],
 "High recall helps recognize more questions, while high precision reduces wrong matches. A useful chatbot needs a practical balance."),

(["what is chatbot test dataset", "testing dataset chatbot", "evaluation questions"],
 "A test dataset is a separate set of user questions used to evaluate the chatbot without changing its training entries."),

(["why keep test data separate", "training vs testing data", "chatbot test separation"],
 "Keeping test data separate gives a more realistic measure of how well the chatbot handles unseen questions."),

(["what is unseen question testing", "unseen chatbot questions", "test new wording"],
 "Unseen testing checks whether the chatbot can handle new phrasings that were not copied directly from the training triggers."),

(["why paraphrase testing matters", "chatbot paraphrase test", "different wording testing"],
 "Users rarely use exactly the same wording, so paraphrase testing shows whether the matching system generalizes to realistic variations."),

(["what is chatbot robustness", "nutrition chatbot robustness", "AI robustness"],
 "Robustness is the ability of the chatbot to handle variations, unexpected input, and minor errors without producing inappropriate responses."),

(["how to make Nutri AI robust", "robust nutrition chatbot", "improve chatbot robustness"],
 "Use diverse triggers, normalization, intent-aware matching, clear fallbacks, testing, and reliable nutrition data."),

(["what is multilingual nutrition chatbot", "multilingual Nutri AI", "nutrition chatbot languages"],
 "A multilingual nutrition chatbot can understand and respond in multiple languages while maintaining consistent nutrition information."),

(["can Nutri AI understand Hinglish", "Hinglish nutrition chatbot", "Hindi English Nutri AI"],
 "Yes, a chatbot can be designed with Hinglish trigger phrases so users can ask nutrition questions using mixed Hindi and English."),

(["why include Hinglish training data", "Hinglish chatbot training", "Indian user language"],
 "Including realistic Hinglish phrases can improve recognition for users who naturally mix Hindi and English in conversation."),

(["can Nutri AI understand misspelled English", "typo nutrition chatbot", "English spelling mistakes AI"],
 "Adding common spelling variations and using normalization can help the chatbot handle minor typing mistakes."),

(["can Nutri AI understand short questions", "short nutrition questions", "one word food question"],
 "Yes. Training triggers can include concise phrases such as 'protein in egg' or 'banana calories' to handle short queries."),

(["why short triggers can be dangerous", "generic trigger problem", "short chatbot triggers"],
 "Very short triggers can match unrelated questions, so specific multi-word phrases are usually safer."),

(["what is trigger specificity", "specific chatbot trigger", "good trigger phrase"],
 "Trigger specificity means using enough meaningful words to identify the intended question without accidentally matching unrelated messages."),

(["what is keyword collision", "chatbot keyword collision", "trigger collision"],
 "Keyword collision occurs when the same word or phrase appears in different intents and causes the chatbot to choose the wrong response."),

(["how to prevent keyword collision", "avoid trigger collision", "chatbot collision prevention"],
 "Use multi-word triggers, intent categories, matching scores, and avoid overly broad keywords."),

(["what is response ranking", "chatbot response ranking", "best matching trigger"],
 "Response ranking assigns scores or priorities to possible matches so the most appropriate rule can be selected."),

(["why exact match can be useful", "exact chatbot matching", "exact trigger matching"],
 "Exact matching can provide predictable results for common questions, although it may fail when users phrase the question differently."),

(["why fuzzy matching can help", "fuzzy chatbot matching", "typo matching"],
 "Fuzzy matching can recognize small spelling or wording differences, but it should be carefully tuned to avoid false matches."),

(["what is fuzzy matching", "fuzzy match meaning", "approximate text matching"],
 "Fuzzy matching compares text similarity rather than requiring exact wording."),

(["what is semantic search", "semantic search meaning", "meaning based search"],
 "Semantic search retrieves text based on meaning and context rather than only exact keywords."),

(["can semantic search improve Nutri AI", "semantic nutrition chatbot", "AI semantic matching"],
 "Semantic matching can improve recognition of varied user wording, especially when keyword triggers do not overlap with the user's exact phrasing."),

(["what is an embedding", "text embedding meaning", "AI embeddings"],
 "A text embedding represents text as numerical values that capture aspects of its meaning and can be used for similarity search."),

(["what is vector search", "vector database meaning", "semantic vector search"],
 "Vector search finds items with similar numerical representations, often enabling meaning-based retrieval."),

(["should Nutri AI use vector search", "semantic search for Nutri AI", "vector database nutrition chatbot"],
 "Vector search can improve flexible question matching as the dataset grows, while a simple rule-based approach may be sufficient for a small prototype."),

(["what is hybrid chatbot architecture", "hybrid AI chatbot", "rule based plus AI chatbot"],
 "A hybrid chatbot can combine deterministic rules for known topics with AI or semantic retrieval for more flexible questions."),

(["why use rules for safety", "rule based safety nutrition", "AI safety rules"],
 "Deterministic rules can provide predictable responses for sensitive topics and prevent unsupported actions."),

(["why use AI for natural language", "AI language understanding", "natural language nutrition chatbot"],
 "AI language models can understand varied phrasing and context more flexibly than simple keyword matching."),

(["what is retrieval augmented generation", "RAG meaning", "nutrition RAG chatbot"],
 "Retrieval-augmented generation retrieves relevant information from a trusted knowledge source and uses it to help generate a response."),

(["can RAG improve nutrition chatbot", "RAG nutrition AI", "retrieval nutrition assistant"],
 "RAG can improve factual grounding when connected to a reliable nutrition knowledge base, but retrieved information still needs quality control."),

(["what is a trusted knowledge base", "nutrition knowledge base", "AI nutrition knowledge source"],
 "A trusted knowledge base contains reviewed, reliable information that the chatbot can retrieve when answering user questions."),

(["why use verified food database", "verified nutrition data", "trusted food data"],
 "Verified data reduces the risk of incorrect nutrient values and improves consistency in food-related responses."),

(["what is data provenance", "nutrition data provenance", "food data source"],
 "Data provenance records where information came from, helping developers evaluate reliability and update incorrect data."),

(["why record nutrition data source", "food data source tracking", "nutrition source tracking"],
 "Recording sources makes it easier to verify, update, and explain where nutrition information came from."),

(["what is data freshness", "nutrition data freshness", "updated food information"],
 "Data freshness refers to how recently information was updated. Current product data can be important when ingredients or formulations change."),

(["why food products change nutrition", "product formulation changes", "food label changes"],
 "Manufacturers can change recipes, serving sizes, fortification, or ingredients, so packaged-food nutrition information can change over time."),

(["why Nutri AI should show last updated date", "food database update date", "nutrition data timestamp"],
 "A last-updated date helps users and developers understand how current the displayed information may be."),

(["what is version control for training data", "Git training data", "dataset version control"],
 "Version control records changes to training data and makes it possible to compare or restore earlier versions."),

(["why use Git for Nutri AI", "Git nutrition chatbot", "version control chatbot"],
 "Git can track code and training-data changes, making it easier to review updates and recover from mistakes."),

(["how to back up Nutri AI data", "backup training_data", "chatbot dataset backup"],
 "Keep a copy of the working training file before adding large datasets and use version control when possible."),

(["what is deployment testing", "test chatbot before deployment", "production nutrition AI testing"],
 "Deployment testing checks that the application works correctly in its actual runtime environment before users rely on it."),

(["what should be tested before Nutri AI demo", "Nutri AI demo testing", "project demo testing"],
 "Test chatbot questions, fallback behavior, food scanning, meal logging, hydration tracking, UI navigation, API connections, and error handling."),

(["what should i show in Nutri AI project demo", "Nutri AI presentation demo", "nutrition AI project demonstration"],
 "A demo can show user profile, meal logging, AI chat, food scanning, nutrition analysis, hydration tracking, mood logging, and recommendations."),

(["what is the main workflow of Nutri AI", "Nutri AI workflow", "nutrition AI process"],
 "A basic workflow is user input → food or mood information → AI/rule analysis → nutrition insight → personalized general recommendation."),

(["what is Nutri AI input", "nutrition AI user input", "Nutri AI data input"],
 "Inputs can include meals, food items, portions, water intake, dietary preferences, activity, goals, and self-reported mood."),

(["what is Nutri AI output", "nutrition AI output", "Nutri AI response"],
 "Outputs can include nutrition information, meal suggestions, hydration feedback, food comparisons, and general wellness recommendations."),

(["what is Nutri AI recommendation logic", "nutrition recommendation logic", "AI food recommendation process"],
 "Recommendation logic can consider the user's stated goals, preferences, food information, portions, activity, and available nutrition data."),

(["why should recommendations have limitations", "AI recommendation limitations", "nutrition recommendation disclaimer"],
 "Nutrition recommendations are estimates and may not account for every medical or personal factor, so important decisions should be professionally reviewed."),

(["what is a safe food score", "safe nutrition scoring", "food scoring safety"],
 "A safe food score is a transparent educational indicator based on defined nutrition criteria and should not be treated as a medical judgment."),

(["why food scores can be misleading", "nutrition score limitations", "food health score problem"],
 "A single score can hide important differences in portions, dietary goals, allergies, and individual needs."),

(["how to improve NutriLens score", "NutriLens improvement", "better food score"],
 "Use transparent criteria, show individual nutrient details, account for serving size, and avoid presenting the score as an absolute health judgment."),

(["what is NutriLens intelligence report", "NutriLens report", "food intelligence report"],
 "A NutriLens report can summarize product nutrition, ingredients, key nutrients, possible concerns, and general suitability for the user's stated preferences."),

(["what should NutriLens report include", "NutriLens report fields", "food scan report"],
 "It can include product name, serving size, calories, protein, carbs, fat, fiber, sugar, sodium, ingredients, score criteria, and general recommendations."),

(["why should NutriLens show serving size", "NutriLens serving size", "food scan serving"],
 "Serving size is necessary to interpret calories and nutrient values correctly and compare them with the amount actually eaten."),

(["why should NutriLens show sodium", "NutriLens sodium", "food scanner sodium"],
 "Sodium can be important when comparing packaged foods, especially for people who need to monitor sodium intake."),

(["why should NutriLens show fiber", "NutriLens fiber", "food scanner fiber"],
 "Fiber helps users identify foods that may contribute to fullness and digestive health."),

(["why should NutriLens show protein", "NutriLens protein", "food scanner protein"],
 "Protein information helps users evaluate whether the product contributes meaningfully to their protein needs."),

(["why should NutriLens show added sugar", "NutriLens sugar", "food scanner added sugar"],
 "Added sugar information helps users identify products with significant added sweeteners."),

(["why should NutriLens show saturated fat", "NutriLens saturated fat", "food scanner saturated fat"],
 "Saturated-fat information helps users compare the fat profile of packaged foods."),

(["why should NutriLens show ingredients", "NutriLens ingredients", "food scanner ingredients"],
 "The ingredient list can reveal major ingredients, sweeteners, oils, allergens, and other components that nutrition numbers alone may not show."),

(["what is AI verdict in NutriLens", "NutriLens AI verdict", "food scan verdict"],
 "An AI verdict can summarize the nutrition information in simple language, but it should clearly state that it is a general nutrition assessment rather than medical advice."),

(["can NutriLens say food is suitable", "food suitability AI", "NutriLens suitability"],
 "NutriLens can describe general suitability based on stated dietary preferences and nutrition criteria, but it should avoid universal health claims."),

(["can NutriLens recommend alternatives", "food alternatives NutriLens", "better product alternatives"],
 "Yes. When reliable nutrition information is available, NutriLens can compare products and suggest alternatives based on selected criteria."),

(["what is product comparison in NutriLens", "compare scanned foods", "NutriLens compare products"],
 "Product comparison can show differences in calories, protein, fiber, sugar, sodium, saturated fat, ingredients, and serving size."),

(["why compare products per serving", "food comparison serving size", "compare nutrition per serving"],
 "Comparing equal serving sizes prevents misleading conclusions caused by different serving amounts."),

(["why compare products per 100g", "nutrition per 100g", "food comparison 100 grams"],
 "Per-100-gram comparisons can help compare foods with different serving sizes, although actual portions still matter."),

(["what is nutrition per 100g", "100 gram nutrition", "food label per 100g"],
 "Nutrition per 100 grams standardizes the amount of food and can make comparisons between products easier."),

(["serving size vs 100g nutrition", "per serving vs 100g", "nutrition comparison methods"],
 "Per-serving values reflect the amount a product defines as one serving, while per-100-gram values standardize comparisons across foods."),

(["why food portion affects AI verdict", "NutriLens portion", "food score portion"],
 "A product may have different nutritional impact depending on how much is eaten, so portion should be considered alongside the product's nutrient profile."),

(["can Nutri AI recommend portion based on goal", "personalized portion AI", "portion recommendation"],
 "It can provide general portion guidance based on goals and food characteristics, but individualized medical nutrition needs professional assessment."),

(["what is portion personalization", "personalized serving size", "custom portion recommendation"],
 "Portion personalization adjusts suggested amounts based on factors such as goals, activity, meal composition, and dietary needs."),

(["why activity affects food portions", "exercise and food portions", "activity based portions"],
 "More physical activity can increase energy and carbohydrate needs, although the exact effect varies by person and activity."),

(["why age affects nutrition", "age and nutrition needs", "nutrition changes with age"],
 "Age affects energy needs, growth, muscle maintenance, and some nutrient requirements."),

(["why sex affects calorie needs", "sex and energy needs", "calorie needs by sex"],
 "Average energy needs can differ by sex due to differences in body size and composition, but individual needs vary substantially."),

(["why height affects calorie needs", "height nutrition needs", "height and calories"],
 "Height is one factor related to body size and energy needs, although activity, body composition, age, and other factors also matter."),

(["why weight affects calorie needs", "body weight calorie needs", "weight and energy needs"],
 "Body weight contributes to energy needs, but it is only one factor among activity, body composition, age, and other characteristics."),

(["why activity level matters in Nutri AI", "activity profile nutrition", "activity level food recommendations"],
 "Activity level helps estimate energy needs and choose meal suggestions that better match a person's routine."),

(["what is sedentary activity level", "sedentary nutrition profile", "low activity level"],
 "A sedentary activity level generally means most daily time is spent sitting with limited structured exercise or movement."),

(["what is moderately active", "moderate activity level", "moderately active nutrition"],
 "Moderately active generally describes regular physical activity beyond basic daily movement, although exact definitions vary by guideline."),

(["what is highly active", "high activity level", "very active nutrition"],
 "Highly active generally means substantial daily physical activity or frequent demanding training, which can increase energy and nutrient needs."),

(["what is an activity multiplier", "calorie activity multiplier", "activity factor"],
 "An activity multiplier is a factor used in some calorie-estimation formulas to approximate total energy needs from resting metabolism and activity."),

(["are calorie formulas exact", "calorie calculator accuracy", "estimated calorie needs"],
 "Calorie formulas provide estimates rather than exact measurements because individual energy expenditure varies."),

(["why calorie calculators differ", "different calorie calculators", "energy calculator variation"],
 "Different formulas use different assumptions and inputs, so estimated calorie needs can vary between calculators."),

(["how accurate are nutrition labels", "food label accuracy", "nutrition label accuracy"],
 "Nutrition labels are regulated but can have allowable variation and may differ from actual nutrient content."),

(["why nutrition labels are estimates", "label nutrition estimates", "food label variation"],
 "Food composition naturally varies and laboratory and manufacturing processes have limits, so label values are not always exact."),

(["what is database food estimate", "food database estimates", "nutrition database accuracy"],
 "Food database values are estimates based on analyzed or reported food composition and may vary by brand, preparation, and source."),

(["why cooked food calories differ", "raw vs cooked calories", "cooking changes food weight"],
 "Cooking changes water content and sometimes added ingredients, so nutrient values per gram can differ between raw and cooked forms."),

(["raw rice vs cooked rice calories", "rice cooked calories", "raw cooked rice nutrition"],
 "Cooked rice contains more water by weight than dry rice, so calories per 100 grams are lower than in dry rice even though the total calories of the original rice remain."),

(["raw chicken vs cooked chicken nutrition", "cooked chicken calories", "raw vs cooked chicken"],
 "Cooking changes water content and weight, so nutrition per 100 grams can differ between raw and cooked chicken."),

(["why food weight changes after cooking", "cooking weight changes", "food loses water cooking"],
 "Cooking can add or remove water and sometimes fat, changing the final weight without changing all nutrients proportionally."),

(["what is edible portion", "edible portion meaning", "food edible part"],
 "Edible portion is the part of a food that is actually consumed after removing bones, shells, peels, or other inedible parts."),

(["why edible portion matters", "food edible percentage", "nutrition edible portion"],
 "Nutrition calculations should use the amount actually eaten rather than the total weight of food that includes inedible parts."),
]

# ── FALLBACK RESPONSE ──────────────────────────────────────────────────────────
FALLBACK_RESPONSES = [
    "That's an interesting question! 🤔 I'm still learning. Could you rephrase or ask me about nutrition, meals, or your diet plan?",
    "Hmm, I'm not sure about that one! 😊 But I'm great at nutrition advice — try asking about meals, calories, or healthy eating!",
    "I don't have an answer for that yet, but I'm always improving! 🌱 Ask me about nutrition, diet plans, or healthy food choices!",
    "Great question! I'm focused on nutrition and wellness topics. 🌿 Try asking about healthy foods, calorie tracking, or meal planning!",
    "I didn't quite catch that! 😊 Remember, I'm your Nutri AI assistant — ask me about food, nutrition, diet plans, and healthy living! Nutri AI provides general wellness information and is not medical advice.",
]

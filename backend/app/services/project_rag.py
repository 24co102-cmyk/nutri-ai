# backend/app/services/project_rag.py
"""
NutriLens AI — Project-Aware Retrieval Engine (RAG)
Indexes repository components, FastAPI endpoints, models, architecture,
and deployment configuration for sub-millisecond retrieval.
"""

import re
from typing import List, Dict, Any, Optional

class KnowledgeChunk:
    def __init__(
        self,
        chunk_id: str,
        title: str,
        file_path: str,
        category: str,
        content: str,
        keywords: List[str],
        code_snippet: Optional[str] = None
    ):
        self.chunk_id = chunk_id
        self.title = title
        self.file_path = file_path
        self.category = category
        self.content = content
        self.keywords = [k.lower() for k in keywords]
        self.code_snippet = code_snippet

PROJECT_KNOWLEDGE_INDEX: List[KnowledgeChunk] = [
    # ── FRONTEND ARCHITECTURE & ROUTING ──
    KnowledgeChunk(
        chunk_id="fe_app_routes",
        title="Application Routing & Entry Point",
        file_path="frontend/src/App.tsx",
        category="frontend_routing",
        content=(
            "NutriLens AI React frontend uses react-router-dom with lazy-loaded code-splitting. "
            "Primary routes include: /dashboard (HealthDashboard), /diet-plan (DietPlan), /add-meal (AddMeal), "
            "/meals (MealHistory), /scan/photo (PhotoScan), /scan/barcode (BarcodeScan), /chat (Chat), "
            "/onboarding and /profile (Profile), /settings (Settings). "
            "A demo session with username 'AHAD SHAIKH' and default access token is auto-initialized in localStorage. "
            "A background warmup ping to /api/health wakes up the Render backend container silently on initial load."
        ),
        keywords=["app.tsx", "routes", "routing", "pages", "navigation", "warmup", "lazy load", "react router", "entry point"],
        code_snippet=(
            "// frontend/src/App.tsx\n"
            "<Routes>\n"
            "  <Route path=\"/\" element={<Navigate to=\"/dashboard\" replace />} />\n"
            "  <Route path=\"/dashboard\" element={<Dashboard />} />\n"
            "  <Route path=\"/diet-plan\" element={<DietPlan />} />\n"
            "  <Route path=\"/add-meal\" element={<AddMeal />} />\n"
            "  <Route path=\"/meals\" element={<Meals />} />\n"
            "  <Route path=\"/scan/photo\" element={<PhotoScan />} />\n"
            "  <Route path=\"/scan/barcode\" element={<BarcodeScan />} />\n"
            "  <Route path=\"/chat\" element={<Chat />} />\n"
            "  <Route path=\"/settings\" element={<Settings />} />\n"
            "</Routes>"
        )
    ),
    KnowledgeChunk(
        chunk_id="fe_sidebar_nav",
        title="Sidebar Navigation & Menu Categories",
        file_path="frontend/src/components/Sidebar.tsx",
        category="frontend_components",
        content=(
            "Defines the application navigation organized into 4 categories: "
            "OVERVIEW (Dashboard), NUTRITION (Diet Plan, Log Meal, Meal History), "
            "SMART TOOLS (Photo Scanner, Barcode Scanner, AI Assistant), and SYSTEM (My Profile, Settings). "
            "Supports responsive collapsing on desktop and slide-over drawer on mobile devices with body scroll lock."
        ),
        keywords=["sidebar", "navigation", "menu", "smart tools", "categories", "layout"],
        code_snippet=(
            "// frontend/src/components/Sidebar.tsx\n"
            "{\n"
            "  name: t('cat_smart_tools'),\n"
            "  items: [\n"
            "    { path: '/scan/photo', label: t('nav_photo'), icon: Camera },\n"
            "    { path: '/scan/barcode', label: t('nav_barcode'), icon: Barcode },\n"
            "    { path: '/chat', label: t('nav_chat'), icon: MessageSquare, badge: 'PRO' },\n"
            "  ]\n"
            "}"
        )
    ),
    KnowledgeChunk(
        chunk_id="fe_barcode_scanner",
        title="Barcode Scanner & Product Lookup Page",
        file_path="frontend/src/pages/BarcodeScan.tsx",
        category="frontend_pages",
        content=(
            "NutriLens Barcode Scanner supports live WebRTC camera scanning, manual barcode entry, and quick 1-click test barcodes. "
            "When a barcode is entered or scanned, it calls fetchProductByBarcode to search the backend registry or Open Food Facts. "
            "Displays verified product photo, NutriScore grade, calories/protein/carbs/fat per 100g and per serving, ingredients list, "
            "and dynamic allergen alerts matched against the user's personal profile. "
            "Includes a 1-click 'Log Food to Meal' button to add the item directly into the user's daily meal history."
        ),
        keywords=["barcode", "barcodescan", "scanner", "open food facts", "gtin", "upc", "ean", "allergens", "log to meal"],
        code_snippet=(
            "// frontend/src/pages/BarcodeScan.tsx\n"
            "const handlePerformLookup = async (codeToSearch: string) => {\n"
            "  setLoading(true);\n"
            "  const result = await fetchProductByBarcode(cleaned);\n"
            "  if (result) setProduct(result);\n"
            "  else setNotFound(true);\n"
            "};"
        )
    ),
    KnowledgeChunk(
        chunk_id="fe_vision_camera",
        title="Ultra-Clear Vision Camera Component",
        file_path="frontend/src/components/VisionCamera.tsx",
        category="frontend_components",
        content=(
            "Hardware-accelerated camera scanner supporting high-resolution WebRTC capture (1080p Full HD ideal, 720p HD fallback). "
            "Applies continuous autofocus (focusMode: 'continuous'), tap-to-focus macro focus trigger, "
            "1x/2x digital zoom toggle, and flashlight/torch control via MediaStreamTrack. "
            "Uses dual-engine decoding: Engine 1 utilizes native browser window.BarcodeDetector (5-15ms), "
            "Engine 2 falls back to @zxing/browser. Video renders at 60 FPS while detection loop is throttled to 12 FPS to avoid heating."
        ),
        keywords=["visioncamera", "camera", "barcodecamera", "autofocus", "1080p", "torch", "zoom", "barcodedetector", "zxing"],
        code_snippet=(
            "// frontend/src/components/VisionCamera.tsx\n"
            "const resolutionCandidates = [\n"
            "  { width: { ideal: 1920, min: 1280 }, height: { ideal: 1080, min: 720 }, frameRate: { ideal: 30 } },\n"
            "  { width: { ideal: 1280, min: 640 }, height: { ideal: 720, min: 480 } }\n"
            "];"
        )
    ),
    KnowledgeChunk(
        chunk_id="fe_dashboard",
        title="Health Dashboard & Nutrition Tracking",
        file_path="frontend/src/pages/Dashboard.tsx",
        category="frontend_pages",
        content=(
            "The central overview displaying daily calorie consumption vs target, macronutrient distribution rings "
            "(Protein, Carbs, Fat, Healthy Fats), water intake tracker, health score, and today's recent meal list. "
            "Fetches data from GET /api/profile/ and GET /api/meals/ concurrently."
        ),
        keywords=["dashboard", "calories", "macros", "water intake", "health score", "overview"],
        code_snippet="const [profileRes, mealsRes] = await Promise.all([api.get('/profile/'), api.get('/meals/')]);"
    ),
    KnowledgeChunk(
        chunk_id="fe_diet_plan",
        title="Diet Plan & AI Meal Generation",
        file_path="frontend/src/pages/DietPlan.tsx",
        category="frontend_pages",
        content=(
            "Displays personalized meal plan schedules (Breakfast, Morning Snack, Lunch, Evening Snack, Dinner) "
            "tailored to the user's daily calorie limits, dietary restrictions (vegetarian/vegan/keto), and allergies. "
            "Sends POST /api/diet-plan/generate to backend to recalculate meals."
        ),
        keywords=["diet plan", "dietplan.tsx", "generate plan", "meal schedule", "breakfast", "lunch", "dinner"],
        code_snippet="const res = await api.post('/diet-plan/generate');"
    ),
    KnowledgeChunk(
        chunk_id="fe_meal_logging",
        title="Add Meal & Meal History Management",
        file_path="frontend/src/pages/AddMeal.tsx",
        category="frontend_pages",
        content=(
            "AddMeal allows searching verified foods from GET /api/foods/search?q=..., specifying serving portions, "
            "and submitting POST /api/meals/ with line items. Meals.tsx lists historical meal entries grouped by date "
            "and provides deletion via DELETE /api/meals/{id}."
        ),
        keywords=["addmeal", "meals", "log meal", "food search", "meal history", "servings"],
        code_snippet="await api.post('/meals/', { meal_type: 'Lunch', items: [{ food_id: 1, quantity: 1.5 }] });"
    ),
    KnowledgeChunk(
        chunk_id="fe_api_axios",
        title="Axios HTTP Client & Render Cold-Start Detection",
        file_path="frontend/src/api/axios.ts",
        category="frontend_api",
        content=(
            "Configures Axios with base URL pointing to Render (https://nutri-ai-y70w.onrender.com/api) or VITE_API_URL. "
            "Includes 30s timeout, automatic Bearer JWT injection from localStorage, in-flight GET request deduplication, "
            "and a 5s cold-start timer that dispatches 'nutrilens:backend-status' to display the BackendStatusIndicator banner."
        ),
        keywords=["axios", "api", "render", "cold start", "deduplication", "token", "jwt", "timeout"],
        code_snippet="const api = axios.create({ baseURL: getBaseUrl(), timeout: 30000 });"
    ),

    # ── BACKEND ARCHITECTURE & ENDPOINTS ──
    KnowledgeChunk(
        chunk_id="be_main",
        title="FastAPI Application Entry Point & Database Seeding",
        file_path="backend/app/main.py",
        category="backend_core",
        content=(
            "FastAPI app instance configured with CORS middleware for localhost and Vercel domains. "
            "Executes seed_initial_data() on startup to migrate missing SQLite columns (sugar, sodium, ingredients, "
            "allergens, nutrition_grade) and seed 20 staple foods (Eggs, Milk, Oats, Banana, Paneer, Chicken Breast, etc.) "
            "as well as default demo/guest user credentials. "
            "Registers all routers: /api/auth, /api/profile, /api/foods, /api/meals, /api/diet-plan, /api/chat, "
            "/api/photo, /api/barcode, /api/nutrilens."
        ),
        keywords=["main.py", "fastapi", "cors", "seed_initial_data", "startup", "routers", "uvicorn"],
        code_snippet=(
            "# backend/app/main.py\n"
            "app.include_router(profile.router, prefix=\"/api/profile\", tags=[\"profile\"])\n"
            "app.include_router(foods.router, prefix=\"/api/foods\", tags=[\"foods\"])\n"
            "app.include_router(meals.router, prefix=\"/api/meals\", tags=[\"meals\"])\n"
            "app.include_router(diet_plan.router, prefix=\"/api/diet-plan\", tags=[\"diet-plan\"])\n"
            "app.include_router(chat.router, prefix=\"/api/chat\", tags=[\"chat\"])\n"
            "app.include_router(barcode.router, prefix=\"/api/barcode\", tags=[\"barcode\"])"
        )
    ),
    KnowledgeChunk(
        chunk_id="be_models",
        title="SQLAlchemy Database Models",
        file_path="backend/app/models.py",
        category="backend_database",
        content=(
            "Defines database schema:\n"
            "• User: id, name, email, hashed_password, is_active, created_at.\n"
            "• Profile: user_id, age, sex, height_cm, weight_kg, activity_level, goal, diet_type, "
            "allergies, foods_to_avoid, bmr, daily_calorie_target, protein_target, carbs_target, fat_target.\n"
            "• Food: id, name, serving_size, calories, protein, carbs, fat, sugar, sodium, ingredients, allergens, nutrition_grade.\n"
            "• Meal & MealItem: user_id, meal_type, date, total_calories, total_protein, total_carbs, total_fat.\n"
            "• DietPlan: user_id, created_at, description, meals.\n"
            "• ManagedProduct: serial_number, barcode, product_name, brand_name, category, calories, protein, carbs, fat."
        ),
        keywords=["models.py", "sqlalchemy", "user", "profile", "food", "meal", "mealitem", "dietplan", "managedproduct", "schema"],
        code_snippet=(
            "class Profile(Base):\n"
            "    __tablename__ = 'profiles'\n"
            "    bmr = Column(Float)\n"
            "    daily_calorie_target = Column(Float)\n"
            "    protein_target = Column(Float)\n"
            "    carbs_target = Column(Float)\n"
            "    fat_target = Column(Float)"
        )
    ),
    KnowledgeChunk(
        chunk_id="be_api_profile",
        title="Profile & Nutrition Formula Endpoints",
        file_path="backend/app/api/profile.py",
        category="backend_api",
        content=(
            "GET /api/profile/ and PUT /api/profile/.\n"
            "When user biometrics (sex, weight_kg, height_cm, age, activity_level, goal) are provided, "
            "it calculates BMR using the Mifflin-St Jeor / Harris-Benedict equation via backend/app/utils/nutrition.py: "
            "Men: 10 * weight + 6.25 * height - 5 * age + 5. "
            "Women: 10 * weight + 6.25 * height - 5 * age - 161. "
            "Multiplies by activity factor (Sedentary: 1.2, Light: 1.375, Moderate: 1.55, Very Active: 1.725) "
            "and adjusts calories for goal (-500 kcal for Weight Loss, +400 kcal for Muscle Gain)."
        ),
        keywords=["profile.py", "bmr", "tdee", "calorie target", "nutrition formulas", "mifflin", "macros"],
        code_snippet="bmr = nutrition.calculate_bmr(profile.sex, profile.weight_kg, profile.height_cm, profile.age)"
    ),
    KnowledgeChunk(
        chunk_id="be_api_barcode",
        title="Barcode Inspection & Open Food Facts Service",
        file_path="backend/app/api/barcode.py",
        category="backend_api",
        content=(
            "GET /api/barcode/{barcode}.\n"
            "Priority resolution:\n"
            "1. Checks local ManagedProduct table (support for 20 custom test products / slots 1-20).\n"
            "2. If not found locally, asynchronously queries Open Food Facts API v2 (world.openfoodfacts.org/api/v2/product/{barcode}.json).\n"
            "Normalizes nutrition facts to standard 100g values (calories, protein, carbs, fat, sugar, fiber, sodium, salt), "
            "extracts allergens and ingredient tags, and returns a verified ScannedProduct schema."
        ),
        keywords=["barcode.py", "managedproduct", "open food facts", "barcode lookup", "grocery api", "allergens"],
        code_snippet="off_url = f'https://world.openfoodfacts.org/api/v2/product/{clean_code}.json'"
    ),
    KnowledgeChunk(
        chunk_id="be_api_meals_foods",
        title="Foods & Meals Endpoints",
        file_path="backend/app/api/meals.py",
        category="backend_api",
        content=(
            "Foods: GET /api/foods/ (list with skip/limit) and GET /api/foods/search?q= (substring ilike search).\n"
            "Meals: POST /api/meals/ creates a meal and automatically aggregates total_calories, total_protein, "
            "total_carbs, and total_fat from item quantities. GET /api/meals/ fetches descending chronological meals for the user. "
            "DELETE /api/meals/{meal_id} removes a specific meal record."
        ),
        keywords=["meals.py", "foods.py", "create meal", "search food", "meal aggregation", "delete meal"],
        code_snippet="new_meal.total_calories = total_cal; new_meal.total_protein = total_prot; db.commit()"
    ),
    KnowledgeChunk(
        chunk_id="be_api_diet_plan",
        title="Diet Plan Generation Endpoint",
        file_path="backend/app/api/diet_plan.py",
        category="backend_api",
        content=(
            "POST /api/diet-plan/generate.\n"
            "Splits the user's daily calorie target into 5 structured meals: "
            "Breakfast (25%), Morning Snack (10%), Lunch (30%), Evening Snack (10%), Dinner (25%). "
            "Filters available foods based on diet_type (vegetarian, vegan) and excludes items matching "
            "the user's allergy tags (e.g. peanuts, dairy, gluten)."
        ),
        keywords=["diet_plan.py", "generate plan", "fractions", "breakfast", "lunch", "dinner", "vegetarian", "vegan"],
        code_snippet="fractions = [0.25, 0.10, 0.30, 0.10, 0.25]"
    ),
    KnowledgeChunk(
        chunk_id="be_config_security",
        title="Backend Configuration, JWT & Environment",
        file_path="backend/app/config.py",
        category="backend_core",
        content=(
            "Reads .env variables: DATABASE_URL, JWT_SECRET, GEMINI_API_KEY, VISION_API_KEY, FOOD_API_KEY. "
            "backend/app/utils/security.py handles bcrypt password hashing and python-jose JWT token creation. "
            "backend/app/dependencies.py provides get_current_user with default guest/demo user resolution."
        ),
        keywords=["config.py", "env", "jwt_secret", "gemini_api_key", "security.py", "dependencies.py"],
        code_snippet="GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')"
    ),
    KnowledgeChunk(
        chunk_id="be_deployment",
        title="Deployment Architecture & Free-Tier Optimization",
        file_path="README.md",
        category="deployment",
        content=(
            "Frontend: Deployed on Vercel at https://nutri-ai-eight-iota.vercel.app/ (Vite + React 19 + Tailwind v4).\n"
            "Backend: Deployed on Render at https://nutri-ai-y70w.onrender.com/ (FastAPI + Uvicorn + SQLite).\n"
            "Free Render containers spin down after 15 minutes of inactivity; initial wakeup requires ~45-50s. "
            "The frontend includes a background warmup ping and cold-start detector banner to handle wakeups gracefully."
        ),
        keywords=["deployment", "vercel", "render", "hosting", "production", "cold start", "url"],
        code_snippet="Live frontend: https://nutri-ai-eight-iota.vercel.app\nLive backend: https://nutri-ai-y70w.onrender.com"
    ),
]

def search_project_knowledge(query: str, top_k: int = 3) -> List[Dict[str, Any]]:
    """
    Sub-millisecond token-based BM25 relevance search over NutriLens codebase index.
    Returns ranked knowledge chunks with metadata and source code snippets.
    """
    cleaned_query = query.lower()
    query_tokens = set(re.findall(r"\w+", cleaned_query))
    if not query_tokens:
        return []

    scored_results = []
    for chunk in PROJECT_KNOWLEDGE_INDEX:
        score = 0.0

        # Exact file path match boost
        if any(token in chunk.file_path.lower() for token in query_tokens):
            score += 15.0

        # Keyword matches
        for kw in chunk.keywords:
            if kw in cleaned_query:
                score += 8.0
            elif any(token == kw for token in query_tokens):
                score += 5.0

        # Title match
        title_lower = chunk.title.lower()
        for token in query_tokens:
            if token in title_lower:
                score += 4.0

        # Content match
        content_lower = chunk.content.lower()
        for token in query_tokens:
            if len(token) > 2 and token in content_lower:
                score += 1.5

        if score > 0:
            scored_results.append((score, chunk))

    scored_results.sort(key=lambda x: x[0], reverse=True)
    top_chunks = scored_results[:top_k]

    return [
        {
            "chunk_id": chunk.chunk_id,
            "title": chunk.title,
            "file_path": chunk.file_path,
            "category": chunk.category,
            "content": chunk.content,
            "code_snippet": chunk.code_snippet,
            "score": round(score, 2),
        }
        for score, chunk in top_chunks
    ]

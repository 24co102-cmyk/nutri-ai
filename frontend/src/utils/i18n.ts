// src/utils/i18n.ts
import { useState, useEffect } from 'react';

export type SupportedLanguage = 'English (US)' | 'Spanish' | 'French' | 'German' | 'Hindi';

export const LANGUAGES: SupportedLanguage[] = [
  'English (US)',
  'Spanish',
  'French',
  'German',
  'Hindi',
];

export const translations: Record<SupportedLanguage, Record<string, string>> = {
  'English (US)': {
    // Navigation
    nav_dashboard: 'Dashboard',
    nav_diet_plan: 'Diet Plan',
    nav_add_meal: 'Add Meal',
    nav_meals: 'Meal History',
    nav_photo: 'Photo Scanner',
    nav_barcode: 'Barcode Scanner',
    nav_chat: 'AI Assistant',
    nav_profile: 'My Profile',
    nav_settings: 'Settings',
    cat_overview: 'OVERVIEW',
    cat_nutrition: 'NUTRITION',
    cat_smart_tools: 'SMART TOOLS',
    cat_system: 'SYSTEM',

    // Settings Header & Tabs
    settings_title: 'Settings Center',
    settings_desc: 'Customize system account parameters, alerts, nutrition goals, and privacy options.',
    changes_saved: 'Changes Saved!',
    tab_account: 'ACCOUNT',
    tab_preferences: 'PREFERENCES',
    tab_nutrition: 'NUTRITION',
    tab_security: 'SECURITY',

    // Account Tab
    account_header: 'Account & Profile Information',
    user_display_name: 'User Display Name',
    edit_name: 'Edit Name',
    save_name: 'Save',
    cancel: 'Cancel',
    email_address: 'Email Address',
    verified: 'Verified',
    subscription_tier: 'Subscription Tier',
    pro_active: 'Pro Active',

    // Preferences Tab
    preferences_header: 'App Preferences',
    meal_reminders: 'Meal Logging Reminders',
    meal_reminders_desc: 'Push alerts for breakfast, lunch & dinner logging.',
    dark_mode: 'Dark Mode',
    dark_mode_desc: 'Enable dark mode across the application interface.',
    primary_language: 'Primary Language',
    primary_language_desc: 'Select regional language preference.',

    // Nutrition Tab
    nutrition_header: 'Nutrition & Calorie Goals',
    calorie_target: 'Daily Calorie Limit Target',
    diet_pref: 'Dietary Preference',
    allergies_list: 'Allergies List',
    save_nutrition: 'Save Nutrition Goals',

    // Security Tab
    security_header: 'Security & Privacy Controls',
    account_password: 'Account Password',
    change_password: 'Change Password',
    password_updated: 'Last updated 30 days ago.',
    data_privacy: 'Health Data Privacy',
    privacy_desc: 'Your nutrition database entries are encrypted locally.',
    encrypted: 'Encrypted',
    logout_gmail_title: 'Log Out & Redirect to Gmail',
    logout_gmail_desc: 'Clears all local auth state and opens Gmail (mail.google.com).',
    logout_gmail_btn: 'Logout to Gmail',

    // Dashboard & Profile
    daily_nutrition: 'Your Daily Nutrition',
    greeting_morning: 'Good morning',
    greeting_afternoon: 'Good afternoon',
    greeting_evening: 'Good evening',
    log_meal: 'Log Meal',
    target: 'Target',
    calorie_limit: 'CALORIE LIMIT',
    protein: 'Protein',
    carbs: 'Carbs',
    fats: 'Fats',
    healthy_fats: 'Healthy Fats',
    health_score: 'HEALTH SCORE',
    quick_add_glass: '+ Quick Add Glass',
    water_intake: 'Water Intake',
    recent_meals: 'Recent Meals Logged',
    no_meals_today: 'No Meals Logged Today',
    syncing: 'syncing',
  },

  'Spanish': {
    // Navigation
    nav_dashboard: 'Panel Principal',
    nav_diet_plan: 'Plan de Dieta',
    nav_add_meal: 'Añadir Comida',
    nav_meals: 'Historial de Comidas',
    nav_photo: 'Escáner de Fotos',
    nav_barcode: 'Escáner de Código',
    nav_chat: 'Asistente IA',
    nav_profile: 'Mi Perfil',
    nav_settings: 'Configuración',
    cat_overview: 'VISIÓN GENERAL',
    cat_nutrition: 'NUTRICIÓN',
    cat_smart_tools: 'HERRAMIENTAS IA',
    cat_system: 'SISTEMA',

    // Settings Header & Tabs
    settings_title: 'Centro de Configuración',
    settings_desc: 'Personalice parámetros de cuenta, alertas, objetivos de nutrición y privacidad.',
    changes_saved: '¡Cambios Guardados!',
    tab_account: 'CUENTA',
    tab_preferences: 'PREFERENCIAS',
    tab_nutrition: 'NUTRICIÓN',
    tab_security: 'SEGURIDAD',

    // Account Tab
    account_header: 'Información de Cuenta y Perfil',
    user_display_name: 'Nombre de Usuario',
    edit_name: 'Editar Nombre',
    save_name: 'Guardar',
    cancel: 'Cancelar',
    email_address: 'Correo Electrónico',
    verified: 'Verificado',
    subscription_tier: 'Nivel de Suscripción',
    pro_active: 'Pro Activo',

    // Preferences Tab
    preferences_header: 'Preferencias de la Aplicación',
    meal_reminders: 'Recordatorios de Comidas',
    meal_reminders_desc: 'Notificaciones para desayuno, almuerzo y cena.',
    dark_mode: 'Modo Oscuro',
    dark_mode_desc: 'Activar modo nocturno en toda la aplicación.',
    primary_language: 'Idioma Principal',
    primary_language_desc: 'Seleccionar preferencia de idioma regional.',

    // Nutrition Tab
    nutrition_header: 'Objetivos de Nutrición y Calorías',
    calorie_target: 'Límite Diario de Calorías',
    diet_pref: 'Preferencia Dietética',
    allergies_list: 'Lista de Alergias',
    save_nutrition: 'Guardar Objetivos',

    // Security Tab
    security_header: 'Controles de Seguridad y Privacidad',
    account_password: 'Contraseña de la Cuenta',
    change_password: 'Cambiar Contraseña',
    password_updated: 'Actualizado hace 30 días.',
    data_privacy: 'Privacidad de Datos de Salud',
    privacy_desc: 'Sus datos de nutrición están cifrados localmente.',
    encrypted: 'Cifrado',
    logout_gmail_title: 'Cerrar Sesión y Abrir Gmail',
    logout_gmail_desc: 'Borra estado local y abre Gmail (mail.google.com).',
    logout_gmail_btn: 'Salir a Gmail',

    // Dashboard & Profile
    daily_nutrition: 'Tu Nutrición Diaria',
    greeting_morning: 'Buenos días',
    greeting_afternoon: 'Buenas tardes',
    greeting_evening: 'Buenas noches',
    log_meal: 'Registrar Comida',
    target: 'Meta',
    calorie_limit: 'LÍMITE CALÓRICO',
    protein: 'Proteína',
    carbs: 'Carbohidratos',
    fats: 'Grasas',
    healthy_fats: 'Grasas Saludables',
    health_score: 'PUNTUACIÓN DE SALUD',
    quick_add_glass: '+ Añadir Vaso',
    water_intake: 'Consumo de Agua',
    recent_meals: 'Comidas Recientes',
    no_meals_today: 'Sin comidas hoy',
    syncing: 'sincronizando',
  },

  'French': {
    // Navigation
    nav_dashboard: 'Tableau de Bord',
    nav_diet_plan: 'Plan Alimentaire',
    nav_add_meal: 'Ajouter Repas',
    nav_meals: 'Historique Repas',
    nav_photo: 'Scanner Photo',
    nav_barcode: 'Scanner Code-barres',
    nav_chat: 'Assistant IA',
    nav_profile: 'Mon Profil',
    nav_settings: 'Paramètres',
    cat_overview: 'APERÇU',
    cat_nutrition: 'NUTRITION',
    cat_smart_tools: 'OUTILS INTELLIGENTS',
    cat_system: 'SYSTÈME',

    // Settings Header & Tabs
    settings_title: 'Centre de Paramètres',
    settings_desc: 'Personnalisez vos paramètres de compte, alertes, objectifs et confidentialité.',
    changes_saved: 'Modifications Enregistrées !',
    tab_account: 'COMPTE',
    tab_preferences: 'PRÉFÉRENCES',
    tab_nutrition: 'NUTRITION',
    tab_security: 'SÉCURITÉ',

    // Account Tab
    account_header: 'Informations du Compte & Profil',
    user_display_name: 'Nom d’utilisateur',
    edit_name: 'Modifier le Nom',
    save_name: 'Enregistrer',
    cancel: 'Annuler',
    email_address: 'Adresse E-mail',
    verified: 'Vérifié',
    subscription_tier: 'Niveau d’abonnement',
    pro_active: 'Pro Actif',

    // Preferences Tab
    preferences_header: 'Préférences de l’Application',
    meal_reminders: 'Rappels de Repas',
    meal_reminders_desc: 'Alertes pour le petit déjeuner, déjeuner et dîner.',
    dark_mode: 'Mode Sombre',
    dark_mode_desc: 'Activer le mode sombre sur toute l’application.',
    primary_language: 'Langue Principale',
    primary_language_desc: 'Sélectionner la langue régionale.',

    // Nutrition Tab
    nutrition_header: 'Objectifs Caloriques & Nutrition',
    calorie_target: 'Limite Calorique Quotidienne',
    diet_pref: 'Préférence Alimentaire',
    allergies_list: 'Liste des Allergies',
    save_nutrition: 'Sauvegarder Objectifs',

    // Security Tab
    security_header: 'Sécurité et Confidentialité',
    account_password: 'Mot de Passe',
    change_password: 'Changer le Mot de Passe',
    password_updated: 'Mis à jour il y a 30 jours.',
    data_privacy: 'Confidentialité Santé',
    privacy_desc: 'Vos données nutritionnelles sont chiffrées localement.',
    encrypted: 'Chiffré',
    logout_gmail_title: 'Déconnexion & Redirection Gmail',
    logout_gmail_desc: 'Efface la session et ouvre Gmail (mail.google.com).',
    logout_gmail_btn: 'Quitter vers Gmail',

    // Dashboard & Profile
    daily_nutrition: 'Votre Nutrition Quotidienne',
    greeting_morning: 'Bonjour',
    greeting_afternoon: 'Bon après-midi',
    greeting_evening: 'Bonsoir',
    log_meal: 'Enregistrer Repas',
    target: 'Objectif',
    calorie_limit: 'LIMITE CALORIES',
    protein: 'Protéines',
    carbs: 'Glucides',
    fats: 'Lipides',
    healthy_fats: 'Bonnes Graisses',
    health_score: 'SCORE SANTÉ',
    quick_add_glass: '+ Ajouter Verre',
    water_intake: 'Consommation d’Eau',
    recent_meals: 'Repas Récents',
    no_meals_today: 'Aucun repas aujourd’hui',
    syncing: 'synchronisation',
  },

  'German': {
    // Navigation
    nav_dashboard: 'Übersicht',
    nav_diet_plan: 'Ernährungsplan',
    nav_add_meal: 'Mahlzeit erfassen',
    nav_meals: 'Mahlzeitenverlauf',
    nav_photo: 'Foto-Scanner',
    nav_barcode: 'Barcode-Scanner',
    nav_chat: 'KI-Assistent',
    nav_profile: 'Mein Profil',
    nav_settings: 'Einstellungen',
    cat_overview: 'ÜBERSICHT',
    cat_nutrition: 'ERNÄHRUNG',
    cat_smart_tools: 'SMARTE TOOLS',
    cat_system: 'SYSTEM',

    // Settings Header & Tabs
    settings_title: 'Einstellungszentrum',
    settings_desc: 'Kontoparameter, Benachrichtigungen, Ernährungsziele und Datenschutz anpassen.',
    changes_saved: 'Änderungen Gespeichert!',
    tab_account: 'KONTO',
    tab_preferences: 'EINSTELLUNGEN',
    tab_nutrition: 'ERNÄHRUNG',
    tab_security: 'SICHERHEIT',

    // Account Tab
    account_header: 'Konto- und Profilinformationen',
    user_display_name: 'Benutzername',
    edit_name: 'Name bearbeiten',
    save_name: 'Speichern',
    cancel: 'Abbrechen',
    email_address: 'E-Mail-Adresse',
    verified: 'Verifiziert',
    subscription_tier: 'Abonnement-Stufe',
    pro_active: 'Pro Aktiv',

    // Preferences Tab
    preferences_header: 'App-Einstellungen',
    meal_reminders: 'Mahlzeiten-Erinnerungen',
    meal_reminders_desc: 'Erinnerungen für Frühstück, Mittag- und Abendessen.',
    dark_mode: 'Dunkelmodus',
    dark_mode_desc: 'Dunkles Design für die gesamte Benutzeroberfläche aktivieren.',
    primary_language: 'Hauptsprache',
    primary_language_desc: 'Regionale Spracheinstellung auswählen.',

    // Nutrition Tab
    nutrition_header: 'Ernährungs- und Kalorienziele',
    calorie_target: 'Tägliches Kalorienziel',
    diet_pref: 'Ernährungspräferenz',
    allergies_list: 'Allergieliste',
    save_nutrition: 'Ziele Speichern',

    // Security Tab
    security_header: 'Sicherheit & Datenschutz',
    account_password: 'Passwort',
    change_password: 'Passwort Ändern',
    password_updated: 'Vor 30 Tagen aktualisiert.',
    data_privacy: 'Gesundheitsdatenschutz',
    privacy_desc: 'Ihre Ernährungsdaten werden lokal verschlüsselt.',
    encrypted: 'Verschlüsselt',
    logout_gmail_title: 'Abmelden & zu Gmail weiterleiten',
    logout_gmail_desc: 'Löscht alle lokalen Daten und öffnet Gmail (mail.google.com).',
    logout_gmail_btn: 'Abmelden zu Gmail',

    // Dashboard & Profile
    daily_nutrition: 'Ihre Tägliche Ernährung',
    greeting_morning: 'Guten Morgen',
    greeting_afternoon: 'Guten Tag',
    greeting_evening: 'Guten Abend',
    log_meal: 'Mahlzeit eintragen',
    target: 'Ziel',
    calorie_limit: 'KALORIENLIMIT',
    protein: 'Eiweiß',
    carbs: 'Kohlenhydrate',
    fats: 'Fette',
    healthy_fats: 'Gesunde Fette',
    health_score: 'GESUNDHEITSWERT',
    quick_add_glass: '+ Glas Hinzufügen',
    water_intake: 'Wasserzufuhr',
    recent_meals: 'Letzte Mahlzeiten',
    no_meals_today: 'Heute keine Mahlzeiten',
    syncing: 'synchronisieren',
  },

  'Hindi': {
    // Navigation
    nav_dashboard: 'डैशबोर्ड',
    nav_diet_plan: 'डाइट प्लान',
    nav_add_meal: 'भोजन जोड़ें',
    nav_meals: 'भोजन इतिहास',
    nav_photo: 'फोटो स्कैनर',
    nav_barcode: 'बारकोड स्कैनर',
    nav_chat: 'AI सहायक',
    nav_profile: 'मेरी प्रोफाइल',
    nav_settings: 'सेटिंग्स',
    cat_overview: 'अवलोकन',
    cat_nutrition: 'पोषण',
    cat_smart_tools: 'स्मार्ट टूल्स',
    cat_system: 'सिस्टम',

    // Settings Header & Tabs
    settings_title: 'सेटिंग्स केंद्र',
    settings_desc: 'खाता पैरामीटर, अलर्ट, पोषण लक्ष्य और गोपनीयता विकल्प अनुकूलित करें।',
    changes_saved: 'परिवर्तन सहेजे गए!',
    tab_account: 'खाता',
    tab_preferences: 'प्राथमिकताएं',
    tab_nutrition: 'पोषण लक्ष्य',
    tab_security: 'सुरक्षा',

    // Account Tab
    account_header: 'खाता और प्रोफाइल जानकारी',
    user_display_name: 'प्रदर्शित नाम',
    edit_name: 'नाम बदलें',
    save_name: 'सहेजें',
    cancel: 'रद्द करें',
    email_address: 'ईमेल पता',
    verified: 'सत्यापित',
    subscription_tier: 'सदस्यता स्तर',
    pro_active: 'प्रो एक्टिव',

    // Preferences Tab
    preferences_header: 'ऐप प्राथमिकताएं',
    meal_reminders: 'भोजन ट्रैकिंग रिमाइंडर',
    meal_reminders_desc: 'नाश्ता, दोपहर और रात के खाने की ट्रैकिंग के लिए सूचनाएं।',
    dark_mode: 'डार्क मोड',
    dark_mode_desc: 'पूरे ऐप इंटरफेस में डार्क थीम सक्षम करें।',
    primary_language: 'प्राथमिक भाषा',
    primary_language_desc: 'अपनी पसंदीदा क्षेत्रीय भाषा चुनें।',

    // Nutrition Tab
    nutrition_header: 'पोषण और कैलोरी लक्ष्य',
    calorie_target: 'दैनिक कैलोरी सीमा लक्ष्य',
    diet_pref: 'आहार प्राथमिकता',
    allergies_list: 'एलर्जी सूची',
    save_nutrition: 'पोषण लक्ष्य सहेजें',

    // Security Tab
    security_header: 'सुरक्षा और गोपनीयता नियंत्रण',
    account_password: 'खाता पासवर्ड',
    change_password: 'पासवर्ड बदलें',
    password_updated: '30 दिन पहले अपडेट किया गया।',
    data_privacy: 'स्वास्थ्य डेटा गोपनीयता',
    privacy_desc: 'आपकी पोषण प्रविष्टियां स्थानीय रूप से एन्क्रिप्टेड हैं।',
    encrypted: 'एन्क्रिप्टेड',
    logout_gmail_title: 'लॉग आउट और Gmail पर जाएं',
    logout_gmail_desc: 'स्थानीय सत्र साफ़ करता है और Gmail (mail.google.com) खोलता है।',
    logout_gmail_btn: 'Gmail पर जाएं',

    // Dashboard & Profile
    daily_nutrition: 'आपका दैनिक पोषण',
    greeting_morning: 'शुभ प्रभात',
    greeting_afternoon: 'नमस्कार',
    greeting_evening: 'शुभ संध्या',
    log_meal: 'भोजन दर्ज करें',
    target: 'लक्ष्य',
    calorie_limit: 'कैलोरी सीमा',
    protein: 'प्रोटीन',
    carbs: 'कार्ब्स',
    fats: 'फैट्स',
    healthy_fats: 'स्वस्थ वसा',
    health_score: 'हेल्थ स्कोर',
    quick_add_glass: '+ गिलास जोड़ें',
    water_intake: 'पानी की मात्रा',
    recent_meals: 'हालिया भोजन',
    no_meals_today: 'आज कोई भोजन दर्ज नहीं है',
    syncing: 'सिंक हो रहा है',
  },
};

export const getStoredLanguage = (): SupportedLanguage => {
  if (typeof window === 'undefined') return 'English (US)';
  const saved = localStorage.getItem('nutrilens:language') as SupportedLanguage;
  if (saved && translations[saved]) return saved;
  return 'English (US)';
};

export const setStoredLanguage = (lang: SupportedLanguage) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('nutrilens:language', lang);
    window.dispatchEvent(new CustomEvent('nutrilens:language-changed', { detail: { language: lang } }));
  }
};

export const useTranslation = () => {
  const [currentLang, setCurrentLang] = useState<SupportedLanguage>(getStoredLanguage);

  useEffect(() => {
    const handleLangChange = (e: any) => {
      const newLang = e.detail?.language as SupportedLanguage;
      if (newLang && translations[newLang]) {
        setCurrentLang(newLang);
      }
    };

    window.addEventListener('nutrilens:language-changed', handleLangChange);
    return () => window.removeEventListener('nutrilens:language-changed', handleLangChange);
  }, []);

  const t = (key: string): string => {
    return translations[currentLang]?.[key] || translations['English (US)'][key] || key;
  };

  const changeLanguage = (lang: SupportedLanguage) => {
    setCurrentLang(lang);
    setStoredLanguage(lang);
  };

  return { t, currentLang, changeLanguage };
};

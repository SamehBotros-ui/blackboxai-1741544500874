// Language dictionaries
const translations = {
    en: {
        // Navigation
        search: 'Search',
        postJob: 'Post Job',
        learn: 'Learn',
        market: 'Market',
        community: 'Community',
        chat: 'Chat',
        
        // Sidebar
        profile: 'Profile',
        settings: 'Settings',
        notifications: 'Notifications',
        help: 'Help',
        
        // Search
        searchPlaceholder: 'Search for work...',
        development: 'Development',
        design: 'Design',
        marketing: 'Marketing',
        writing: 'Writing',
        
        // Auth
        signUp: 'Sign Up',
        mobileNumber: 'Mobile Number',
        enterOTP: 'Enter OTP',
        sendOTP: 'Send OTP',
        verifyOTP: 'Verify OTP',
        
        // Post Job
        postNewJob: 'Post New Job',
        jobTitle: 'Job Title',
        jobDescription: 'Job Description',
        budget: 'Budget',
        deadline: 'Deadline',
        
        // Learn
        courses: 'Courses',
        freeCourses: 'Free Courses',
        training: 'Training',
        
        // Marketplace
        microProjects: 'Micro Projects',
        startingAt: 'Starting at',
        buyNow: 'Buy Now',
        
        // Community
        posts: 'Posts',
        comments: 'Comments',
        likes: 'Likes',
        share: 'Share',
        
        // Chat
        messages: 'Messages',
        typeMessage: 'Type a message...',
        send: 'Send',
        
        // Common
        loading: 'Loading...',
        error: 'Error',
        success: 'Success',
        cancel: 'Cancel',
        save: 'Save',
        edit: 'Edit',
        delete: 'Delete'
    },
    ar: {
        // Navigation
        search: 'بحث',
        postJob: 'نشر وظيفة',
        learn: 'تعلم',
        market: 'السوق',
        community: 'المجتمع',
        chat: 'دردشة',
        
        // Sidebar
        profile: 'الملف الشخصي',
        settings: 'الإعدادات',
        notifications: 'الإشعارات',
        help: 'المساعدة',
        
        // Search
        searchPlaceholder: 'ابحث عن عمل...',
        development: 'تطوير',
        design: 'تصميم',
        marketing: 'تسويق',
        writing: 'كتابة',
        
        // Auth
        signUp: 'تسجيل',
        mobileNumber: 'رقم الجوال',
        enterOTP: 'أدخل رمز التحقق',
        sendOTP: 'إرسال رمز التحقق',
        verifyOTP: 'تحقق من الرمز',
        
        // Post Job
        postNewJob: 'نشر وظيفة جديدة',
        jobTitle: 'عنوان الوظيفة',
        jobDescription: 'وصف الوظيفة',
        budget: 'الميزانية',
        deadline: 'الموعد النهائي',
        
        // Learn
        courses: 'الدورات',
        freeCourses: 'دورات مجانية',
        training: 'تدريب',
        
        // Marketplace
        microProjects: 'مشاريع صغيرة',
        startingAt: 'يبدأ من',
        buyNow: 'اشتر الآن',
        
        // Community
        posts: 'المنشورات',
        comments: 'التعليقات',
        likes: 'الإعجابات',
        share: 'مشاركة',
        
        // Chat
        messages: 'الرسائل',
        typeMessage: 'اكتب رسالة...',
        send: 'إرسال',
        
        // Common
        loading: 'جاري التحميل...',
        error: 'خطأ',
        success: 'نجاح',
        cancel: 'إلغاء',
        save: 'حفظ',
        edit: 'تعديل',
        delete: 'حذف'
    }
};

let currentLang = 'en';

export function initI18n() {
    const langToggle = document.getElementById('lang-toggle');
    
    // Language toggle handler
    langToggle.addEventListener('click', () => {
        currentLang = currentLang === 'en' ? 'ar' : 'en';
        document.documentElement.lang = currentLang;
        document.body.classList.toggle('rtl');
        updateTranslations();
        
        // Save preference
        localStorage.setItem('lang', currentLang);
        
        // Update language toggle text
        langToggle.textContent = currentLang === 'en' ? 'EN/عربي' : 'عربي/EN';
        
        // Dispatch event for components to update
        window.dispatchEvent(new CustomEvent('languagechange', { detail: { language: currentLang } }));
    });
    
    // Initial load
    const savedLang = localStorage.getItem('lang');
    if (savedLang) {
        currentLang = savedLang;
        document.documentElement.lang = currentLang;
        if (currentLang === 'ar') {
            document.body.classList.add('rtl');
            langToggle.textContent = 'عربي/EN';
        }
        updateTranslations();
    }
}

function updateTranslations() {
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[currentLang][key]) {
            if (element.tagName === 'INPUT' && element.getAttribute('placeholder')) {
                element.placeholder = translations[currentLang][key];
            } else {
                element.textContent = translations[currentLang][key];
            }
        }
    });
}

// Export translation utilities
export const i18n = {
    translate: (key) => translations[currentLang][key] || key,
    getCurrentLang: () => currentLang,
    setLang: (lang) => {
        if (translations[lang]) {
            currentLang = lang;
            document.documentElement.lang = lang;
            document.body.classList.toggle('rtl', lang === 'ar');
            updateTranslations();
            localStorage.setItem('lang', lang);
        }
    },
    isRTL: () => currentLang === 'ar'
};

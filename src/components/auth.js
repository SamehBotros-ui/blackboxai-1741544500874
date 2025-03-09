import { i18n } from '../services/i18n.js';

export function initAuth() {
    // Check if user is authenticated
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    
    if (!isAuthenticated) {
        showAuthModal();
    }
}

function showAuthModal() {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    modal.innerHTML = `
        <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-11/12 max-w-md">
            <h2 class="text-2xl font-bold mb-4" data-i18n="signUp">${i18n.translate('signUp')}</h2>
            <form id="auth-form" class="space-y-4">
                <div>
                    <label class="block text-sm font-medium mb-1" data-i18n="mobileNumber">
                        ${i18n.translate('mobileNumber')}
                    </label>
                    <div class="relative">
                        <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">+20</span>
                        <input type="tel" id="phone" 
                               class="w-full pl-12 pr-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-primary" 
                               placeholder="1XX XXX XXXX"
                               pattern="[0-9]{10}"
                               maxlength="10"
                               required>
                    </div>
                    <p id="phone-error" class="text-red-500 text-sm mt-1 hidden">Please enter a valid mobile number</p>
                </div>
                
                <div id="otp-section" class="hidden space-y-2">
                    <label class="block text-sm font-medium mb-1" data-i18n="enterOTP">
                        ${i18n.translate('enterOTP')}
                    </label>
                    <div class="flex justify-between space-x-2">
                        <input type="text" maxlength="1" class="w-12 h-12 text-center border rounded dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-primary text-xl">
                        <input type="text" maxlength="1" class="w-12 h-12 text-center border rounded dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-primary text-xl">
                        <input type="text" maxlength="1" class="w-12 h-12 text-center border rounded dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-primary text-xl">
                        <input type="text" maxlength="1" class="w-12 h-12 text-center border rounded dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-primary text-xl">
                        <input type="text" maxlength="1" class="w-12 h-12 text-center border rounded dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-primary text-xl">
                        <input type="text" maxlength="1" class="w-12 h-12 text-center border rounded dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-primary text-xl">
                    </div>
                    <p id="otp-error" class="text-red-500 text-sm mt-1 hidden">Invalid OTP code</p>
                    <div class="text-center text-sm">
                        <span class="text-gray-500" data-i18n="otpTimer">Code expires in: </span>
                        <span id="otp-timer" class="font-medium">02:00</span>
                    </div>
                </div>
                
                <button type="submit" 
                        class="w-full bg-primary text-white py-3 rounded-lg hover:bg-blue-600 transition duration-200 flex items-center justify-center space-x-2">
                    <span data-i18n="sendOTP">${i18n.translate('sendOTP')}</span>
                    <i class="fas fa-arrow-right"></i>
                </button>
            </form>
        </div>
    `;

    document.body.appendChild(modal);

    const form = modal.querySelector('#auth-form');
    const phoneInput = modal.querySelector('#phone');
    const phoneError = modal.querySelector('#phone-error');
    const otpSection = modal.querySelector('#otp-section');
    const otpInputs = otpSection.querySelectorAll('input');
    const otpError = modal.querySelector('#otp-error');
    const submitButton = modal.querySelector('button[type="submit"]');
    const otpTimer = modal.querySelector('#otp-timer');
    
    let isOtpSent = false;
    let timerInterval;

    // Phone number validation
    phoneInput.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/\D/g, '');
        phoneError.classList.add('hidden');
    });

    // OTP input handling
    otpInputs.forEach((input, index) => {
        input.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/\D/g, '');
            
            if (e.target.value) {
                if (index < otpInputs.length - 1) {
                    otpInputs[index + 1].focus();
                }
            }
        });

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Backspace' && !e.target.value && index > 0) {
                otpInputs[index - 1].focus();
            }
        });
    });

    function startOtpTimer() {
        let timeLeft = 120; // 2 minutes
        
        timerInterval = setInterval(() => {
            timeLeft--;
            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;
            otpTimer.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
            
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                // Handle OTP expiration
                otpError.textContent = 'OTP has expired. Please request a new code.';
                otpError.classList.remove('hidden');
            }
        }, 1000);
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        if (!isOtpSent) {
            // Validate phone number
            if (phoneInput.value.length !== 10) {
                phoneError.classList.remove('hidden');
                return;
            }
            
            // Simulate sending OTP
            submitButton.disabled = true;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
            
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            otpSection.classList.remove('hidden');
            submitButton.disabled = false;
            submitButton.innerHTML = `
                <span data-i18n="verifyOTP">${i18n.translate('verifyOTP')}</span>
                <i class="fas fa-arrow-right"></i>
            `;
            otpInputs[0].focus();
            startOtpTimer();
            isOtpSent = true;
            
        } else {
            // Validate OTP
            const otp = Array.from(otpInputs).map(input => input.value).join('');
            
            if (otp.length !== 6) {
                otpError.classList.remove('hidden');
                return;
            }
            
            // Simulate OTP verification
            submitButton.disabled = true;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
            
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            clearInterval(timerInterval);
            localStorage.setItem('isAuthenticated', 'true');
            modal.remove();
        }
    });
}

// Export auth utilities
export const auth = {
    isAuthenticated: () => Boolean(localStorage.getItem('isAuthenticated')),
    logout: () => {
        localStorage.removeItem('isAuthenticated');
        window.location.reload();
    }
};

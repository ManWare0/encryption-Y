// Enhanced Playfair Cipher with Modern Animations and UX

// DOM Elements
const convertBtn = document.getElementById('convertBtn');
const resetBtn = document.getElementById('resetBtn');
const keywordInput = document.getElementById('keyword');
const userInput = document.getElementById('inputs');
const resultSection = document.getElementById('resultSection');
const resultText = document.getElementById('resultText');
const copyBtn = document.getElementById('copyBtn');
const loadingOverlay = document.getElementById('loadingOverlay');
const charCounter = document.querySelector('.char-count');

// Playfair Cipher configuration
const letters = "abcdefghiklmnopqrstuvwxyz";  // بدون 'j'

// State management
let isEncrypting = false;
let currentResult = "";

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    startParticleAnimation();
});

function initializeApp() {
    // Add initial animation to container
    const container = document.querySelector('.container');
    container.style.opacity = '0';
    container.style.transform = 'translateY(30px)';
    
    setTimeout(() => {
        container.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
        container.style.opacity = '1';
        container.style.transform = 'translateY(0)';
    }, 100);
}

function setupEventListeners() {
    // Convert button with enhanced animations
    convertBtn.addEventListener('click', handleEncryption);
    
    // Reset button with smooth transitions
    resetBtn.addEventListener('click', handleReset);
    
    // Copy button with feedback
    copyBtn.addEventListener('click', handleCopy);
    
    // Real-time character counter
    userInput.addEventListener('input', updateCharCounter);
    
    // Enter key support for textarea
    userInput.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.key === 'Enter') {
            handleEncryption();
        }
    });
    
    // Auto-resize textarea
    userInput.addEventListener('input', autoResizeTextarea);
    
    // Focus animations
    userInput.addEventListener('focus', function() {
        this.parentElement.style.transform = 'translateY(-2px)';
    });
    
    userInput.addEventListener('blur', function() {
        this.parentElement.style.transform = 'translateY(0)';
    });
    
    // Keyword input focus effects
    keywordInput.addEventListener('focus', function() {
        this.parentElement.style.transform = 'translateY(-2px)';
    });
    
    keywordInput.addEventListener('blur', function() {
        this.parentElement.style.transform = 'translateY(0)';
    });
}

function handleEncryption() {
    if (isEncrypting) return;
    
    const keyword = keywordInput.value.trim();
    const inputValue = userInput.value.trim();
    
    if (!keyword) {
        showNotification('Please enter a keyword!', 'warning');
        shakeElement(keywordInput);
        return;
    }
    
    if (!inputValue) {
        showNotification('Please enter some text to encrypt!', 'warning');
        shakeElement(userInput);
        return;
    }
    
    startEncryptionAnimation();
    
    // Simulate encryption process with realistic timing
    setTimeout(() => {
        try {
            const encryptedText = encryptPlayfair(inputValue, keyword);
            displayResult(encryptedText);
            showNotification('Text encrypted successfully!', 'success');
        } catch (error) {
            showNotification('Encryption failed: ' + error.message, 'error');
        } finally {
            stopEncryptionAnimation();
        }
    }, 1500);
}

// Playfair Cipher Functions
function createMatrix(keyword) {
    /** بناء مصفوفة 5x5 */
    keyword = keyword.toLowerCase();
    let seen = [];
    for (let ch of keyword) {
        if (ch === 'j') {
            ch = 'i';
        }
        if (letters.includes(ch) && !seen.includes(ch)) {
            seen.push(ch);
        }
    }
    for (let ch of letters) {
        if (!seen.includes(ch)) {
            seen.push(ch);
        }
    }
    
    let matrix = [];
    for (let i = 0; i < 25; i += 5) {
        matrix.push(seen.slice(i, i + 5));
    }
    
    let pos = {};
    for (let r = 0; r < 5; r++) {
        for (let c = 0; c < 5; c++) {
            pos[matrix[r][c]] = [r, c];
        }
    }
    
    return { matrix, pos };
}

function preprocessPlaintext(text) {
    /** تحويل الكلمة إلى أزواج حسب قواعد Playfair */
    text = text.toLowerCase();
    let cleaned = [];
    for (let ch of text) {
        if (/[a-z]/.test(ch)) {
            if (ch === 'j') {
                ch = 'i';
            }
            cleaned.push(ch);
        }
    }
    cleaned = cleaned.join("");

    let result = [];
    let i = 0;
    while (i < cleaned.length) {
        let a = cleaned[i];
        if (i + 1 < cleaned.length) {
            let b = cleaned[i + 1];
            if (a === b) {
                result.push(a + 'x');
                i += 1;
            } else {
                result.push(a + b);
                i += 2;
            }
        } else {
            result.push(a + 'x');
            i += 1;
        }
    }
    return result;
}

function encryptPair(pair, matrix, pos) {
    let a = pair[0], b = pair[1];
    let [ra, ca] = pos[a];
    let [rb, cb] = pos[b];
    
    if (ra === rb) {  // نفس الصف
        return matrix[ra][(ca + 1) % 5] + matrix[rb][(cb + 1) % 5];
    } else if (ca === cb) {  // نفس العمود
        return matrix[(ra + 1) % 5][ca] + matrix[(rb + 1) % 5][cb];
    } else {  // مستطيل
        return matrix[ra][cb] + matrix[rb][ca];
    }
}

function encryptPlayfair(plaintext, keyword) {
    let { matrix, pos } = createMatrix(keyword);
    let words = plaintext.split(" ");  // تقسيم حسب المسافات
    let cipherWords = [];

    for (let word of words) {
        if (!word.trim()) {
            cipherWords.push("");  // مسافة فارغة
            continue;
        }
        let pairs = preprocessPlaintext(word);
        let cipherPairs = pairs.map(p => encryptPair(p, matrix, pos));
        cipherWords.push(cipherPairs.join(""));
    }

    return cipherWords.join(" ");
}

function displayResult(encryptedText) {
    currentResult = encryptedText;
    
    // Show result section with animation
    resultSection.style.display = 'block';
    setTimeout(() => {
        resultSection.classList.add('show');
    }, 10);
    
    // Typewriter effect for result
    typewriterEffect(resultText, encryptedText);
    
    // Scroll to result
    setTimeout(() => {
        resultSection.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'nearest' 
        });
    }, 500);
}

function typewriterEffect(element, text, speed = 30) {
    element.textContent = '';
    let i = 0;
    
    const typeInterval = setInterval(() => {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
        } else {
            clearInterval(typeInterval);
        }
    }, speed);
}

function handleReset() {
    // Animate reset
    const elements = [userInput, keywordInput, resultSection];
    
    elements.forEach((element, index) => {
        setTimeout(() => {
            element.style.transition = 'all 0.3s ease';
            element.style.transform = 'scale(0.95)';
            element.style.opacity = '0.7';
            
            setTimeout(() => {
                if (element === userInput || element === keywordInput) {
                    element.value = '';
                    if (element === userInput) updateCharCounter();
                } else {
                    element.style.display = 'none';
                    element.classList.remove('show');
                }
                
                element.style.transform = 'scale(1)';
                element.style.opacity = '1';
            }, 150);
        }, index * 100);
    });
    
    // Reset button animation
    animateButton(resetBtn);
    showNotification('All fields cleared!', 'success');
}

function handleCopy() {
    if (!currentResult) {
        showNotification('No text to copy!', 'warning');
        return;
    }
    
    navigator.clipboard.writeText(currentResult).then(() => {
        showNotification('Copied to clipboard!', 'success');
        animateButton(copyBtn);
        
        // Visual feedback
        copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
        copyBtn.style.background = 'linear-gradient(135deg, #4ecdc4, #26a69a)';
        
        setTimeout(() => {
            copyBtn.innerHTML = '<i class="fas fa-copy"></i> Copy';
            copyBtn.style.background = '';
        }, 2000);
    }).catch(() => {
        showNotification('Failed to copy!', 'error');
    });
}

function startEncryptionAnimation() {
    isEncrypting = true;
    
    // Show loading overlay
    loadingOverlay.classList.add('show');
    
    // Disable convert button
    convertBtn.disabled = true;
    convertBtn.classList.add('loading');
    
    // Add loading text
    const span = convertBtn.querySelector('span');
    span.textContent = 'Encrypting...';
}

function stopEncryptionAnimation() {
    isEncrypting = false;
    
    // Hide loading overlay
    loadingOverlay.classList.remove('show');
    
    // Re-enable convert button
    convertBtn.disabled = false;
    convertBtn.classList.remove('loading');
    
    // Reset button text
    const span = convertBtn.querySelector('span');
    span.textContent = 'Encrypt';
    
    // Button success animation
    animateButton(convertBtn);
}

function updateCharCounter() {
    const count = userInput.value.length;
    if (charCounter) {
        charCounter.textContent = count;
        
        // Color coding for character count
        if (count > 1000) {
            charCounter.style.color = '#ff6b6b';
        } else if (count > 500) {
            charCounter.style.color = '#f7b731';
        } else {
            charCounter.style.color = '#6c757d';
        }
    }
}

function autoResizeTextarea() {
    userInput.style.height = 'auto';
    userInput.style.height = Math.min(userInput.scrollHeight, 200) + 'px';
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${getNotificationIcon(type)}"></i>
        <span>${message}</span>
    `;
    
    // Style the notification
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '12px 20px',
        borderRadius: '8px',
        color: 'white',
        fontWeight: '500',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        zIndex: '3000',
        transform: 'translateX(400px)',
        transition: 'all 0.3s ease',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
    });
    
    // Set background based on type
    const colors = {
        success: 'linear-gradient(135deg, #4ecdc4, #26a69a)',
        warning: 'linear-gradient(135deg, #f7b731, #ffa726)',
        error: 'linear-gradient(135deg, #ff6b6b, #e74c3c)'
    };
    notification.style.background = colors[type] || colors.success;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 10);
    
    // Remove after delay
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

function getNotificationIcon(type) {
    const icons = {
        success: 'check-circle',
        warning: 'exclamation-triangle',
        error: 'times-circle'
    };
    return icons[type] || 'info-circle';
}

function animateButton(button) {
    button.style.transform = 'scale(0.95)';
    setTimeout(() => {
        button.style.transform = 'scale(1.05)';
        setTimeout(() => {
            button.style.transform = 'scale(1)';
        }, 100);
    }, 50);
}

function shakeElement(element) {
    element.style.animation = 'shake 0.5s ease-in-out';
    setTimeout(() => {
        element.style.animation = '';
    }, 500);
}

function startParticleAnimation() {
    const particles = document.querySelectorAll('.particle');
    
    particles.forEach((particle, index) => {
        // Randomize initial positions
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        
        // Add random animation delays
        particle.style.animationDelay = Math.random() * 6 + 's';
        particle.style.animationDuration = (Math.random() * 4 + 4) + 's';
    });
}

// Add shake animation to CSS dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
`;
document.head.appendChild(style);

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl + E for encrypt
    if (e.ctrlKey && e.key === 'e') {
        e.preventDefault();
        handleEncryption();
    }
    
    // Ctrl + R for reset
    if (e.ctrlKey && e.key === 'r') {
        e.preventDefault();
        handleReset();
    }
    
    // Escape to clear
    if (e.key === 'Escape') {
        handleReset();
    }
});

// Add ripple effect to buttons
function addRippleEffect(button) {
    button.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
        `;
        
        this.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
}

// Add ripple effect to all buttons
document.querySelectorAll('button').forEach(addRippleEffect);

// Add ripple animation
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleStyle);

// Performance optimization: Debounce input events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Debounced character counter update
const debouncedCharUpdate = debounce(updateCharCounter, 100);
userInput.addEventListener('input', debouncedCharUpdate);

// Add smooth scrolling for better UX
document.documentElement.style.scrollBehavior = 'smooth';
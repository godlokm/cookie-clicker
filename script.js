// Game variables
let cookieCount = 0;
let cookiesPerClick = 1;
let upgradeLevels = {};
let autoClickerInterval = null;
let autoClickerRate = 1000; // Initial rate for Auto Clicker (1 second)
let clickCount = 0; // Counter for clicks

// Upgrade definitions, including new Nuke upgrade
const upgrades = {
    'Auto Clicker': { cost: 50, perSecond: 1 },
    'Grandma': { cost: 100, perSecond: 2 },
    'Farm': { cost: 500, perSecond: 10 },
    'Factory': { cost: 2000, perSecond: 50 },
    'Bank': { cost: 10000, perSecond: 200 },
    'Temple': { cost: 50000, perSecond: 1000 },
    'Wizard Tower': { cost: 100000, perSecond: 5000 },
    'Shipment': { cost: 200000, perSecond: 10000 },
    'Alchemy Lab': { cost: 400000, perSecond: 20000 },
    'Portal': { cost: 800000, perSecond: 50000 },
    'Time Machine': { cost: 1600000, perSecond: 100000 },
    'Antimatter Condenser': { cost: 3200000, perSecond: 200000 },
    'Prism': { cost: 6400000, perSecond: 500000 },
    'Chancemaker': { cost: 12800000, perSecond: 1000000 },
    'Fractal Engine': { cost: 25600000, perSecond: 2000000 },
    'Javascript Console': { cost: 51200000, perSecond: 5000000 },
    'Golden Cookie': { cost: 102400000, perSecond: 10000000 },
    'Cookie Mine': { cost: 204800000, perSecond: 20000000 },
    'Cookie Factory': { cost: 409600000, perSecond: 40000000 },
    'Cookie Kingdom': { cost: 819200000, perSecond: 80000000 },
    'Cookie Empire': { cost: 1638400000, perSecond: 160000000 },
    'Cookie Universe': { cost: 3276800000, perSecond: 320000000 },
    'Cookie Galaxy': { cost: 6553600000, perSecond: 640000000 },
    'Cookie Multiverse': { cost: 13107200000, perSecond: 1280000000 },
    'Cookie Singularity': { cost: 26214400000, perSecond: 2560000000 },
    'Cookie Infinity': { cost: 52428800000, perSecond: 5120000000 },
    'Cookie Omnipotence': { cost: 104857600000, perSecond: 10240000000 },
    'Nuke': { cost: 1000000, powerUp: 700000 } // New upgrade
};

// Select elements
const dropdownMenuButton = document.getElementById('dropdown-menu-button');
const dropdownMenu = document.getElementById('dropdown-menu');
const cookieElement = document.getElementById('cookie');
const cookieCountElement = document.getElementById('cookie-count');
const cookiesPerClickElement = document.getElementById('cookies-per-click');
const usernamePopup = document.getElementById('username-popup');
const usernameInput = document.getElementById('username-input');
const createUsernameButton = document.getElementById('create-username-button');
const adminLoginButton = document.getElementById('admin-login-button');
const adminLoginPopup = document.getElementById('admin-login-popup');
const adminUsernameInput = document.getElementById('admin-username');
const adminPasswordInput = document.getElementById('admin-password');
const adminLoginSubmit = document.getElementById('admin-login-submit');
const adminMenu = document.getElementById('admin-menu');
const setCookiesInput = document.getElementById('set-cookies');
const removeCookiesInput = document.getElementById('remove-cookies');
const setCookiesButton = document.getElementById('set-cookies-button');
const removeCookiesButton = document.getElementById('remove-cookies-button');
const resetCookiesPerClickButton = document.getElementById('reset-cookies-per-click-button');
const resetUpgradesButton = document.getElementById('reset-upgrades-button');
const adminMenuCloseButton = document.getElementById('admin-menu-close');

// Show or hide the dropdown menu
dropdownMenuButton.addEventListener('click', () => {
    dropdownMenu.style.display = dropdownMenu.style.display === 'block' ? 'none' : 'block';
});

// Show or hide the admin login popup
adminLoginButton.addEventListener('click', () => {
    adminLoginPopup.style.display = 'block'; // Show admin login popup
});

// Admin login event
adminLoginSubmit.addEventListener('click', () => {
    const username = adminUsernameInput.value.trim();
    const password = adminPasswordInput.value.trim();

    if (username === 'marco' && password === '1797') {
        adminLoginPopup.style.display = 'none';
        adminMenu.style.display = 'block'; // Show admin menu
    } else {
        alert('Incorrect username or password.');
    }
});

// Cookie click event
cookieElement.addEventListener('click', () => {
    const username = localStorage.getItem('username');
    if (username && !isBanned(username)) {
        clickCount += 1; // Increment click counter
        cookieCount += cookiesPerClick;
        updateCookieImage(); // Check and update cookie image
        updateUI();
        saveGame();
    } else if (!username) {
        usernamePopup.style.display = 'block'; // Show username creation popup
    } else {
        alert('You were banned due to exploiting and cheating.');
    }
});

// Function to update the cookie image based on click count
function updateCookieImage() {
    if (clickCount >= 1000) {
        cookieElement.src = 'https://c7.alamy.com/comp/M6T99K/close-up-of-an-half-eaten-cookie-with-crumb-against-a-white-background-M6T99K.jpg';
    }
}

// Upgrade button click event
document.addEventListener('click', (event) => {
    if (event.target.classList.contains('upgrade-button')) {
        const username = localStorage.getItem('username');
        if (username && !isBanned(username)) {
            const name = event.target.getAttribute('data-name');
            const baseCost = upgrades[name]?.cost || 0;

            if (name === 'Nuke') {
                if (cookieCount >= baseCost) {
                    cookieCount -= baseCost;
                    cookieCount += upgrades['Nuke'].powerUp; // Grant power-up cookies
                    updateUI();
                    saveGame();
                } else {
                    alert('Not enough cookies for Nuke!');
                }
            } else {
                const level = upgradeLevels[name] || 0;
                const currentCost = Math.floor(baseCost * Math.pow(2, level));

                if (cookieCount >= currentCost) {
                    cookieCount -= currentCost;
                    upgradeLevels[name] = (level || 0) + 1;

                    if (name === 'Auto Clicker') {
                        clearInterval(autoClickerInterval);
                        autoClickerRate = Math.max(1000 - (upgradeLevels[name] * 100), 100); // Minimum rate of 100ms
                        autoClickerInterval = setInterval(() => {
                            cookieCount += upgrades['Auto Clicker'].perSecond; // Adjust based on Auto Clicker level
                            updateUI();
                            saveGame();
                        }, autoClickerRate);
                    } else {
                        // Handle other upgrades
                        if (name in upgrades) {
                            cookiesPerClick += upgrades[name].perSecond; // Increase cookies per click with each upgrade
                        }
                    }

                    updateUI();
                    saveGame();
                } else {
                    alert('Not enough cookies!');
                }
            }
        } else if (isBanned(username)) {
            alert('You were banned due to exploiting and cheating.');
        } else {
            alert('Please create a username to play.');
        }
    }
});

// Handle admin menu actions
setCookiesButton.addEventListener('click', () => {
    const amount = parseInt(setCookiesInput.value, 10);
    if (!isNaN(amount)) {
        cookieCount = amount;
        updateUI();
        saveGame();
    }
});

removeCookiesButton.addEventListener('click', () => {
    const amount = parseInt(removeCookiesInput.value, 10);
    if (!isNaN(amount) && amount <= cookieCount) {
        cookieCount -= amount;
        updateUI();
        saveGame();
    } else {
        alert('Invalid amount or too much to remove.');
    }
});

resetCookiesPerClickButton.addEventListener('click', () => {
    cookiesPerClick = 1; // Reset to initial value
    updateUI();
    saveGame();
});

resetUpgradesButton.addEventListener('click', () => {
    upgradeLevels = {}; // Reset upgrades
    cookiesPerClick = 1; // Reset cookies per click to initial value
    updateUI();
    saveGame();
});

adminMenuCloseButton.addEventListener('click', () => {
    adminMenu.style.display = 'none'; // Hide admin menu
});

// Username creation event
createUsernameButton.addEventListener('click', () => {
    const username = usernameInput.value.trim();
    if (username && !localStorage.getItem('username')) {
        if (!isBanned(username)) {
            localStorage.setItem('username', username);
            usernamePopup.style.display = 'none';
            loadGame(); // Load the game state
            dropdownMenuButton.style.display = 'block'; // Show dropdown menu button
            updateDropdownMenu(); // Update dropdown menu on page load
        } else {
            alert('This username is banned.');
        }
    } else {
        alert('Username is required or already set.');
    }
});

// Function to update the user interface
function updateUI() {
    cookieCountElement.textContent = cookieCount;
    cookiesPerClickElement.textContent = cookiesPerClick;
}

// Function to update the dropdown menu
function updateDropdownMenu() {
    dropdownMenu.innerHTML = ''; // Clear existing items
    for (const name in upgrades) {
        const baseCost = upgrades[name].cost;
        const level = upgradeLevels[name] || 0;
        const currentCost = Math.floor(baseCost * Math.pow(2, level));
        const button = document.createElement('button');
        button.classList.add('upgrade-button');
        button.textContent = `${name} (Cost: ${currentCost})`;
        button.setAttribute('data-name', name);
        dropdownMenu.appendChild(button);
    }
}

// Function to save the game state to localStorage
function saveGame() {
    localStorage.setItem('cookieCount', cookieCount);
    localStorage.setItem('cookiesPerClick', cookiesPerClick);
    localStorage.setItem('upgradeLevels', JSON.stringify(upgradeLevels));
}

// Function to load the game state from localStorage
function loadGame() {
    const savedCookieCount = localStorage.getItem('cookieCount');
    const savedCookiesPerClick = localStorage.getItem('cookiesPerClick');
    const savedUpgradeLevels = localStorage.getItem('upgradeLevels');

    if (savedCookieCount) {
        cookieCount = parseInt(savedCookieCount);
    }
    if (savedCookiesPerClick) {
        cookiesPerClick = parseInt(savedCookiesPerClick);
    }
    if (savedUpgradeLevels) {
        upgradeLevels = JSON.parse(savedUpgradeLevels);
    }

    updateUI();
}

// Function to check if a username is banned (dummy implementation)
function isBanned(username) {
    const bannedUsers = ['bannedUser1', 'bannedUser2']; // Example banned usernames
    return bannedUsers.includes(username);
}

// Load the game state and check username on page load
window.addEventListener('load', () => {
    const username = localStorage.getItem('username');
    if (!username) {
        usernamePopup.style.display = 'block'; // Show username creation popup if no username
        dropdownMenuButton.style.display = 'none'; // Hide dropdown menu button
    } else {
        loadGame(); // Load game state if username exists
        dropdownMenuButton.style.display = 'block'; // Show dropdown menu button
        updateDropdownMenu(); // Update dropdown menu on page load
    }
});

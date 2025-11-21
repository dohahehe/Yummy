// ================== CLOSE SIDE NAV =================
function closeSideNav() {
    const sideNavContainer = document.querySelector('.side-nav-container');
    const sideNavTrigger = document.getElementById('side-nav-trigger');
    const icon = sideNavTrigger?.querySelector('i');
    const CLOSED_LEFT = '-277px';

    if (sideNavContainer) {
        sideNavContainer.style.left = CLOSED_LEFT;
    }
    
    if (icon) {
        icon.classList.remove('fa-xmark');
        icon.classList.add('fa-bars');
    }
    
    if (sideNavTrigger) {
        sideNavTrigger.setAttribute('aria-label', 'Open menu');
    }

    // Close any visible links
    const links = document.querySelectorAll('.extended-nav .nav-link.visible');
    links.forEach(link => {
        link.classList.remove('visible');
    });
}

// ================== FETCH DATA  =================
async function fetchAllMeals() {
        try {
            // console.log('Starting to fetch meals...');
            showLoading();
            const response = await fetch('https://www.themealdb.com/api/json/v1/1/search.php?s=');
            const data = await response.json();
            // console.log('API Response:', data);
            
            if (data.meals) {
                // console.log(`Found ${data.meals.length} meals`);
                displayMeals(data.meals);
            } else {
                console.log('No meals found in response');
                showError('No meals found');
            }
        } catch (error) {
            console.error('Error fetching meals:', error);
            showError('Error loading meals');
        }
}

// ================== DISPLAY MEALS =================
function displayMeals(meals) {
    const rowData = document.getElementById('data');
    // console.log('rowData element:', rowData);
    
    if (!rowData) {
        console.error('Element with id "rowData" not found');
        return;
    }
    
    // console.log('Displaying meals:', meals);
    rowData.innerHTML = ''; 
    
    meals.forEach(meal => {
        // console.log('Creating card for meal:', meal.strMeal);
        const mealCard = `
            <div class="col-md-3">
                <div onclick="getMealDetails('${meal.idMeal}')" class="meal position-relative overflow-hidden rounded-2 cursor-pointer">
                    <img class="w-100" src="${meal.strMealThumb}" alt="${meal.strMeal}">
                    <div class="meal-layer position-absolute d-flex align-items-center text-black p-2">
                        <h3>${meal.strMeal}</h3>
                    </div>
                </div>
            </div>
        `;
        rowData.innerHTML += mealCard;
    });
    
    // console.log('Finished displaying meals');
}

// ================== UTILITY FUNCTIONS =================
function showLoading() {
    const rowData = document.getElementById('data');
    rowData.innerHTML = `
        <div class="col-12 text-center min-vh-100 d-flex justify-content-center align-items-center">
            <i class="fa fa-spinner fa-spin fa-5x"></i>
        </div>
    `;
}

function showError(message) {
    const rowData = document.getElementById('data');
    if (!rowData) {
        console.error('Element with id "rowData" not found');
        return;
    }
    rowData.innerHTML = `
        <div class="col-12 text-center">
            <div class="alert alert-danger" role="alert">
                ${message}
            </div>
            <button onclick="fetchAllMeals()" class="btn btn-primary mt-2">Back to Meals</button>
        </div>
    `;
}

// ================== MEAL DETAILS FUNCTIONS =================
async function getMealDetails(id) {
    // console.log('Fetching details for meal ID:', id);
    
    try {
        showLoading();
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
        const data = await response.json();
        // console.log(data);
        
        
        if (data.meals && data.meals[0]) {
            displayMealDetails(data.meals[0]);
        } else {
            showError('Meal details not found');
        }
    } catch (error) {
        console.error('Error fetching meal details:', error);
        showError('Error loading meal details');
    }
}

function displayMealDetails(meal) {
    const rowData = document.getElementById('data');
    
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
        const ingredient = meal[`strIngredient${i}`];
        const measure = meal[`strMeasure${i}`];
        
        if (ingredient && ingredient.trim() !== '') {
            ingredients.push({
                ingredient: ingredient,
                measure: measure || ''
            });
        }
    }
    // console.log(meal.strInstructions);
    // console.log(meal.strTags);
    
    
    // Format instructions with line breaks
    const formattedInstructions = formatInstructions(meal.strInstructions);

    const mealDetailsHTML = `
        <div class="row mt-4">
            <div class="col-md-4">
                <img class="w-100 rounded-3" src="${meal.strMealThumb}" alt="${meal.strMeal}">
                <h2 class="mt-3 text-white">${meal.strMeal}</h2>
            </div>
            <div class="col-md-8 text-white">
                <h2>Instructions</h2>
                <div class="instructions">
                    ${formattedInstructions}
                </div>
                
                <h3 class="mt-4"><span class="fw-bolder">Area : </span>${meal.strArea || 'Not specified'}</h3>
                <h3><span class="fw-bolder">Category : </span>${meal.strCategory || 'Not specified'}</h3>
                
                <h3 class="mt-4">Recipes :</h3>
                <ul class="list-unstyled d-flex g-3 flex-wrap">
                    ${ingredients.map(item => 
                        `<li class="alert alert-info m-2 p-1">${item.measure} ${item.ingredient}</li>`
                    ).join('')}
                </ul>

                <h3 class="mt-4">Tags :</h3>

                <div class="mt-4">
                    ${meal.strSource ? `<a target="_blank" href="${meal.strSource}" class="btn btn-success">Source</a>` : ''}
                    ${meal.strYoutube ? `<a target="_blank" href="${meal.strYoutube}" class="btn btn-danger ms-2">YouTube</a>` : ''}
                </div>
                <button onclick="fetchAllMeals()" class="btn btn-primary mt-2">Back to Meals</button>
            </div>
        </div>
    `;
    
    rowData.innerHTML = mealDetailsHTML;
}
// ================== FORMAT INSTRUCTIONS =================
function formatInstructions(instructions) {
    if (!instructions) return '<p>No instructions available</p>';
    
    let formatted = instructions
    .replace(/\r\n|\n|\r/g, ' ') 
    .replace(/\s+/g, ' ')
    .trim();
    
    formatted = formatted.replace(/(\d)([a-zA-Z])/g, '$1 $2');
    
    return `<p class="mb-2">${formatted}</p>`;
}

// ============================= NAVIGATION ============================

// ================== SEARCH =================

window.showSearch = function () {
    displaySearchInterface()
    closeSideNav();
};

function displaySearchInterface() {
    const mainContainer = document.getElementById('data');
    if (!mainContainer) {
        console.error('Element with id "data" not found');
        return;
    }

    mainContainer.innerHTML = `
        <div class="inputs-container row mt-1 justify-content-center g-4 w-100">
            <div class="col-md-6">
                <input id="searchByNameInput" class="form-control bg-transparent text-white" type="text" placeholder="Search By Name">
            </div>
            <div class="col-md-6">
                <input id="searchByLetterInput" maxlength="1" class="form-control bg-transparent text-white" type="text" placeholder="Search By First Letter">
            </div>
        </div>
        <div id="searchResults" class="row g-4 py-4"></div>
    `;

    document.getElementById('searchByNameInput').addEventListener('input', function(e) {
        if (e.target.value.trim()) {
            searchByName();
        }
    });

    document.getElementById('searchByLetterInput').addEventListener('input', function(e) {
        if (e.target.value.trim()) {
            searchByFirstLetter();
        }
    });
}

async function searchByName() {
    const searchTerm = document.getElementById('searchByNameInput').value.trim();
    const resultsContainer = document.getElementById('searchResults');

    if (!searchTerm) {
        if (resultsContainer) {
            resultsContainer.innerHTML = '<div class="col-12"><div class="alert alert-warning">Please enter a meal name</div></div>';
        }
        return;
    }

    try {
        showSearchLoading();
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchTerm}`);
        const data = await response.json();
        
        if (data.meals) {
            displaySearchResults(data.meals);
        } else {
            if (resultsContainer) {
                resultsContainer.innerHTML = `
                    <div class="col-12">
                        <div class="alert alert-danger">No meals found for "${searchTerm}"</div>
                    </div>
                `;
            }
        }
    } catch (error) {
        console.error('Error searching by name:', error);
        if (resultsContainer) {
            resultsContainer.innerHTML = `
                <div class="col-12">
                    <div class="alert alert-danger">Error searching for meals</div>
                </div>
            `;
        }
    }
}

async function searchByFirstLetter() {
    const letter = document.getElementById('searchByLetterInput').value.trim();
    const resultsContainer = document.getElementById('searchResults');

    if (!letter) {
        if (resultsContainer) {
            resultsContainer.innerHTML = '<div class="col-12"><div class="alert alert-warning">Please enter a letter</div></div>';
        }
        return;
    }

    if (letter.length !== 1 || !letter.match(/[a-zA-Z]/)) {
        if (resultsContainer) {
            resultsContainer.innerHTML = '<div class="col-12"><div class="alert alert-warning">Please enter a single letter (A-Z)</div></div>';
        }
        return;
    }

    try {
        showSearchLoading();
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`);
        const data = await response.json();
        
        if (data.meals) {
            displaySearchResults(data.meals);
        } else {
            if (resultsContainer) {
                resultsContainer.innerHTML = `
                    <div class="col-12">
                        <div class="alert alert-info">No meals found starting with "${letter.toUpperCase()}"</div>
                    </div>
                `;
            }
        }
    } catch (error) {
        console.error('Error searching by letter:', error);
        if (resultsContainer) {
            resultsContainer.innerHTML = `
                <div class="col-12">
                    <div class="alert alert-danger">Error searching for meals</div>
                </div>
            `;
        }
    }
}

function displaySearchResults(meals) {
    const container = document.getElementById('searchResults');
    
    if (!container) {
        console.error('Search results container not found');
        return;
    }
    
    let html = ``;

    meals.forEach(meal => {
        html += `
            <div class="col-md-3">
                <div onclick="getMealDetails('${meal.idMeal}')" class="meal position-relative overflow-hidden rounded-2 cursor-pointer">
                    <img class="w-100" src="${meal.strMealThumb}" alt="${meal.strMeal}">
                    <div class="meal-layer position-absolute d-flex align-items-center text-black p-2">
                        <h3>${meal.strMeal}</h3>
                    </div>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
}

function showSearchLoading() {
    const container = document.getElementById('searchResults');
    if (container) {
        container.innerHTML = `
            <div class="col-12 text-center min-vh-100 d-flex justify-content-center align-items-center">
            <i class="fa fa-spinner fa-spin fa-5x"></i>
        </div>
        `;
    }
}
// ================== CATEGORIES =================

window.showCategories = function () {
    // console.log('categories');
    closeSideNav();
    fetchCategories(); 
}

async function fetchCategories() {
    try {
        showLoading();
        const response = await fetch('https://www.themealdb.com/api/json/v1/1/categories.php');
        const data = await response.json();
        
        if (data.categories) {
            displayCategories(data.categories);
        } else {
            showError('No categories found');
        }
    } catch (error) {
        console.error('Error fetching categories:', error);
        showError('Error loading categories');
    }
}

function displayCategories(categories) {
    const rowData = document.getElementById('data');
    if (!rowData) {
        console.error('Element with id "rowData" not found');
        return;
    }
    
    rowData.innerHTML = '';
    
    categories.forEach(category => {
        const categoryCard = `
            <div class="col-md-3">
                <div onclick="getCategoryMeals('${category.strCategory}')" class="meal position-relative overflow-hidden rounded-2 cursor-pointer">
                    <img class="w-100" src="${category.strCategoryThumb}" alt="${category.strCategory}">
                    <div class="meal-layer position-absolute text-center text-black p-2">
                        <h3>${category.strCategory}</h3>
                        <p>${category.strCategoryDescription ? category.strCategoryDescription.split(" ").slice(0,20).join(" ") + '...' : 'No description available'}</p>
                    </div>
                </div>
            </div>
        `;
        rowData.innerHTML += categoryCard;
    });
}

async function getCategoryMeals(categoryName) {
    // console.log('Fetching meals for category:', categoryName);
    
    try {
        showLoading();
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${categoryName}`);
        const data = await response.json();
        // console.log(data);
        
        
        if (data.meals) {
            displayMeals(data.meals);
        } else {
            showError(`No meals found in ${categoryName} category`);
        }
    } catch (error) {
        console.error('Error fetching category meals:', error);
        showError('Error loading meals');
    }
}

// ================== AREAS =================

window.showAreas = function () {
    closeSideNav();
    fetchAreas();
}

async function fetchAreas() {
    try {
        showLoading();
        const response = await fetch('https://www.themealdb.com/api/json/v1/1/list.php?a=list');
        const data = await response.json();
        // console.log(data.meals);
        
        
        if (data.meals) {
            displayAreas(data.meals);
        } else {
            showError('No areas found');
        }
    } catch (error) {
        console.error('Error fetching areas:', error);
        showError('Error loading areas');
    }
}

function displayAreas(areas) {
    const rowData = document.getElementById('data');
    if (!rowData) {
        console.error('Element with id "data" not found');
        return;
    }
    
    rowData.innerHTML = '';
    
    areas.forEach(area => {
        const areaCard = `
            <div class="col-md-3 cursor-pointer">
                <div onclick="getAreaMeals('${area.strArea}')" class="rounded-2 text-center cursor-pointer area-card">
                    <i class="fa-solid fa-house-laptop fa-4x"></i>
                    <h3>${area.strArea}</h3>
                </div>
            </div>
        `;
        rowData.innerHTML += areaCard;
    });
}

async function getAreaMeals(areaName) {
    // console.log('Fetching meals for area:', areaName);
    
    try {
        showLoading();
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${areaName}`);
        const data = await response.json();
        
        if (data.meals) {
            displayMeals(data.meals);
        } else {
            showError(`No meals found from ${areaName}`);
        }
    } catch (error) {
        console.error('Error fetching area meals:', error);
        showError('Error loading meals');
    }
}

// ================== INGREDIENTS =================

window.showIngredients = function () {
    closeSideNav();
    fetchIngredients();
}

async function fetchIngredients() {
    try {
        showLoading();
        const response = await fetch('https://www.themealdb.com/api/json/v1/1/list.php?i=list');
        const data = await response.json();
        // console.log(data.meals);
        
        
        if (data.meals) {
            displayIngredients(data.meals.slice(0, 20)); 
        } else {
            showError('No ingredients found');
        }
    } catch (error) {
        console.error('Error fetching Ingredients:', error);
        showError('Error loading Ingredients');
    }
}

function displayIngredients(ingredients) {
    const rowData = document.getElementById('data');
    if (!rowData) {
        console.error('Element with id "data" not found');
        return;
    }
    
    rowData.innerHTML = '';
    
    ingredients.forEach(ingredient => {
        const ingredientCard = `
            <div class="col-md-3">
                <div onclick="getIngredientMeals('${ingredient.strIngredient}')" class="rounded-2 text-center cursor-pointer">
                    <i class="fa-solid fa-drumstick-bite fa-4x"></i>
                    <h3>${ingredient.strIngredient}</h3>
                    <p>${ingredient.strDescription ? ingredient.strDescription.split(' ')
                        .slice(0, 20).join(' ') + '...' : 'No description available'}</p>
                </div>
            </div>
        `;
        rowData.innerHTML += ingredientCard;
    });
}

async function getIngredientMeals(ingredientName) {
    // console.log('Fetching meals with ingredient:', ingredientName);
    
    try {
        showLoading();
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredientName}`);
        const data = await response.json();
        
        if (data.meals) {
            displayMeals(data.meals);
        } else {
            showError(`No meals found with ${ingredientName}`);
        }
    } catch (error) {
        console.error('Error fetching ingredient meals:', error);
        showError('Error loading meals');
    }
}

// ================== CONTACT US =================

window.showContact = function () {
    closeSideNav();
    displayContactForm();
}

function displayContactForm() {
    const rowData = document.getElementById('data');
    if (!rowData) {
        console.error('Element with id "data" not found');
        return;
    }

    rowData.innerHTML = `
        <div class="contact min-vh-100 d-flex justify-content-center align-items-center">
            <div class="container w-75 text-center">
                <div class="row g-4">
                    <div class="col-md-6">
                        <input name="name" id="nameInput" onkeyup="inputsValidation()" type="text" class="form-control" placeholder="Enter Your Name">
                        <div id="nameAlert" class="alert alert-danger w-100 mt-2 d-none">
                            Special characters and numbers not allowed
                        </div>
                    </div>
                    <div class="col-md-6">
                        <input name="emial" id="emailInput" onkeyup="inputsValidation()" type="email" class="form-control" placeholder="Enter Your Email">
                        <div id="emailAlert" class="alert alert-danger w-100 mt-2 d-none">
                            Email not valid *exemple@yyy.zzz
                        </div>
                    </div>
                    <div class="col-md-6">
                        <input name="phone" id="phoneInput" onkeyup="inputsValidation()" type="text" class="form-control" placeholder="Enter Your Phone">
                        <div id="phoneAlert" class="alert alert-danger w-100 mt-2 d-none">
                            Enter valid Phone Number
                        </div>
                    </div>
                    <div class="col-md-6">
                        <input name="age" id="ageInput" onkeyup="inputsValidation()" type="number" class="form-control" placeholder="Enter Your Age">
                        <div id="ageAlert" class="alert alert-danger w-100 mt-2 d-none">
                            Enter valid age (18-100)
                        </div>
                    </div>
                    <div class="col-md-6">
                        <input name="password" id="passwordInput" onkeyup="inputsValidation()" type="password" class="form-control" placeholder="Enter Your Password">
                        <div id="passwordAlert" class="alert alert-danger w-100 mt-2 d-none">
                            Enter a valid password *Minimum eight characters, at least one letter and one number.*
                        </div>
                    </div>
                    <div class="col-md-6">
                        <input name="repassword" id="repasswordInput" onkeyup="inputsValidation()" type="password" class="form-control" placeholder="Repassword">
                        <div id="repasswordAlert" class="alert alert-danger w-100 mt-2 d-none">
                            Passwords do not match
                        </div>
                    </div>
                </div>
                <button id="submitBtn" disabled class="btn btn-outline-danger px-4 mt-4">Submit</button>
            </div>
        </div>
    `;
}

function inputsValidation() {
    // Get input values
    const name = document.getElementById('nameInput').value;
    const email = document.getElementById('emailInput').value;
    const phone = document.getElementById('phoneInput').value;
    const age = document.getElementById('ageInput').value;
    const password = document.getElementById('passwordInput').value;
    const repassword = document.getElementById('repasswordInput').value;
    
    // Get alert elements
    const nameAlert = document.getElementById('nameAlert');
    const emailAlert = document.getElementById('emailAlert');
    const phoneAlert = document.getElementById('phoneAlert');
    const ageAlert = document.getElementById('ageAlert');
    const passwordAlert = document.getElementById('passwordAlert');
    const repasswordAlert = document.getElementById('repasswordAlert');
    const submitBtn = document.getElementById('submitBtn');
    
    // Validation flags
    let isValid = true;
    
    // Name: Only letters and spaces, 2-50 characters
    const nameRegex = /^[A-Za-z\s]{2,50}$/;
    if (!nameRegex.test(name)) {
        nameAlert.classList.remove('d-none');
        isValid = false;
    } else {
        nameAlert.classList.add('d-none');
    }
    
    // Email: email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        emailAlert.classList.remove('d-none');
        isValid = false;
    } else {
        emailAlert.classList.add('d-none');
    }
    
    // Phone: International phone format
    const phoneRegex = /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,4}[-\s\.]?[0-9]{1,9}$/;
    if (!phoneRegex.test(phone)) {
        phoneAlert.classList.remove('d-none');
        isValid = false;
    } else {
        phoneAlert.classList.add('d-none');
    }
    
    // Age: Between 18 and 100
    const ageNum = parseInt(age);
    if (ageNum < 18 || ageNum > 100 || isNaN(ageNum)) {
        ageAlert.classList.remove('d-none');
        isValid = false;
    } else {
        ageAlert.classList.add('d-none');
    }
    
    // Password: Minimum 8 characters, at least one letter and one number
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!passwordRegex.test(password)) {
        passwordAlert.classList.remove('d-none');
        isValid = false;
    } else {
        passwordAlert.classList.add('d-none');
    }
    
    // Repassword: Must match password
    if (password !== repassword || repassword === '') {
        repasswordAlert.classList.remove('d-none');
        isValid = false;
    } else {
        repasswordAlert.classList.add('d-none');
    }
    
    // Enable/disable submit button
    if (isValid) {
        submitBtn.disabled = false;
        submitBtn.classList.remove('btn-outline-danger');
        submitBtn.classList.add('btn-success');
    } else {
        submitBtn.disabled = true;
        submitBtn.classList.remove('btn-success');
        submitBtn.classList.add('btn-outline-danger');
    }
}

document.addEventListener('click', function(e) {
    if (e.target && e.target.id === 'submitBtn') {
        e.preventDefault();
        handleFormSubmission();
    }
});

function handleFormSubmission() {
    const name = document.getElementById('nameInput').value;
    const email = document.getElementById('emailInput').value;
    const phone = document.getElementById('phoneInput').value;
    const age = document.getElementById('ageInput').value;
    
    // Show success message
    alert(`Thank you for contacting us, ${name}! We'll get back to you soon at ${email}.`);
    
    // Reset form
    document.getElementById('nameInput').value = '';
    document.getElementById('emailInput').value = '';
    document.getElementById('phoneInput').value = '';
    document.getElementById('ageInput').value = '';
    document.getElementById('passwordInput').value = '';
    document.getElementById('repasswordInput').value = '';
    
    // Reset button
    const submitBtn = document.getElementById('submitBtn');
    submitBtn.disabled = true;
    submitBtn.classList.remove('btn-success');
    submitBtn.classList.add('btn-outline-danger');
}

// =============================== DOMContentLoaded ======================================

// 

document.addEventListener('DOMContentLoaded', () => {

    // ======================== SIDE NAV =========================
    const sideNavContainer = document.getElementById('side-nav-container');
    const sideNavTrigger = document.getElementById('side-nav-trigger');
    const icon = sideNavTrigger?.querySelector('i');
    const LINKS_STAGGER = 80; 
    let closedLeft = '-277px';
    let isOpen = false;

    function updateOffsets() {
        if (!sideNavContainer) return;
        sideNavContainer.style.width = ''; // keep default width from CSS
        if (!isOpen) sideNavContainer.style.left = closedLeft;
    }
    updateOffsets();
    window.addEventListener('resize', updateOffsets);

    function revealLinks() {
        if (!sideNavContainer) return;
        const links = sideNavContainer.querySelectorAll('.extended-nav .nav-link');
        links.forEach((link, i) => {
            setTimeout(() => link.classList.add('visible'), i * LINKS_STAGGER + 40);
        });
    }

    function hideLinksThenClose() {
        if (!sideNavContainer) return;
        const links = Array.from(sideNavContainer.querySelectorAll('.extended-nav .nav-link'));
        links.reverse().forEach((link, i) => {
            setTimeout(() => link.classList.remove('visible'), i * LINKS_STAGGER);
        });
        const totalDelay = Math.max(links.length * LINKS_STAGGER, 120) + 80;
        setTimeout(() => {
            sideNavContainer.style.left = closedLeft;
            if (icon) { icon.classList.remove('fa-xmark'); icon.classList.add('fa-bars'); }
            if (sideNavTrigger) sideNavTrigger.setAttribute('aria-label', 'Open menu');
            isOpen = false;
        }, totalDelay);
    }

     function openNavImmediate() {
        if (!sideNavContainer) return;
        isOpen = true;
        sideNavContainer.style.left = '0';
        if (icon) { icon.classList.remove('fa-bars'); icon.classList.add('fa-xmark'); }
        if (sideNavTrigger) sideNavTrigger.setAttribute('aria-label', 'Close menu');
        revealLinks();
    }

    function closeNavImmediate() {
        // hide links first
        hideLinksThenClose();
    }

    window.closeSideNav = function () {
        closeNavImmediate();
    };

    if (sideNavTrigger && sideNavContainer) {
        sideNavTrigger.addEventListener('click', (e) => {
            e.preventDefault();
            if (isOpen) closeNavImmediate();
            else openNavImmediate();
        });
    }

    if (sideNavContainer) {
        sideNavContainer.addEventListener('click', (e) => {
            const target = e.target.closest('.extended-nav .nav-link');
            if (target) {
                setTimeout(() => closeNavImmediate(), 40);
            }
        });
    }

    // Close when clicking outside the nav container on small screens
    document.addEventListener('click', (e) => {
        if (!sideNavContainer) return;
        if (!isOpen) return;
        const inside = e.target.closest('#side-nav-container');
        const triggerClicked = e.target.closest('#side-nav-trigger');
        if (!inside && !triggerClicked) closeNavImmediate();
    });

     // Ensure initial hidden state
    if (sideNavContainer) sideNavContainer.style.left = closedLeft;

    (async () => {
        try {
            if (typeof showLoading === 'function') {
                showLoading();
            }
            await fetchAllMeals();
        } catch (err) {
            console.error('Initial fetch error:', err);
        }
    })();

    // ======================== GLOBAL NAV FUNCTIONS =========================
    if (typeof displaySearchInterface === 'function' && !window.showSearch) {
        window.showSearch = function () { displaySearchInterface(); closeNavImmediate(); };
    }
    if (typeof fetchCategories === 'function' && !window.showCategories) {
        window.showCategories = function () { closeNavImmediate(); fetchCategories(); };
    }
    if (typeof fetchAreas === 'function' && !window.showAreas) {
        window.showAreas = function () { closeNavImmediate(); fetchAreas(); };
    }
    if (typeof fetchIngredients === 'function' && !window.showIngredients) {
        window.showIngredients = function () { closeNavImmediate(); fetchIngredients(); };
    }
    if (typeof displayContactForm === 'function' && !window.showContact) {
        window.showContact = function () { closeNavImmediate(); displayContactForm(); };
    }
});




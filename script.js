class FoodExpiryTracker {
    constructor() {
        this.foodItems = JSON.parse(localStorage.getItem('foodItems')) || [];
        this.recipes = [
            { name: 'Pancakes', ingredients: ['milk', 'eggs'], description: 'Fluffy breakfast pancakes' },
            { name: 'Scrambled Eggs', ingredients: ['eggs', 'milk'], description: 'Creamy scrambled eggs' },
            { name: 'Omelette', ingredients: ['eggs'], description: 'Simple egg omelette' },
            { name: 'Fruit Salad', ingredients: ['apple', 'banana'], description: 'Fresh fruit mix' },
            { name: 'Sandwich', ingredients: ['bread', 'cheese'], description: 'Classic cheese sandwich' },
            { name: 'Pasta', ingredients: ['pasta', 'cheese'], description: 'Cheesy pasta dish' },
            { name: 'French Toast', ingredients: ['bread', 'eggs', 'milk'], description: 'Sweet breakfast treat' },
            { name: 'Smoothie', ingredients: ['banana', 'milk'], description: 'Healthy fruit smoothie' },
            { name: 'Grilled Cheese', ingredients: ['bread', 'cheese'], description: 'Crispy grilled sandwich' }
        ];
        this.currentFilter = '';
        this.init();
    }

    init() {
        this.bindEvents();
        this.updateStats();
        this.setDefaultDates();
        this.displayFoodItems();
        this.checkExpiryNotifications();
    }

    bindEvents() {
        // Form submission
        document.getElementById('food-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addFoodItem();
        });

        // Tab navigation
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tabName = e.currentTarget.dataset.tab;
                this.showTab(tabName);
            });
        });

        // Search functionality
        document.getElementById('search').addEventListener('input', (e) => {
            this.currentFilter = e.target.value.toLowerCase();
            this.displayFoodItems();
        });

        // Modal close
        document.querySelector('.close').addEventListener('click', () => {
            this.closeModal();
        });

        // Date validation
        document.getElementById('expiry-date').addEventListener('change', this.validateDates);
        document.getElementById('purchase-date').addEventListener('change', this.validateDates);
    }

    setDefaultDates() {
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('purchase-date').value = today;
        
        const nextWeek = new Date();
        nextWeek.setDate(nextWeek.getDate() + 7);
        document.getElementById('expiry-date').value = nextWeek.toISOString().split('T')[0];
    }

    validateDates() {
        const purchaseDate = new Date(document.getElementById('purchase-date').value);
        const expiryDate = new Date(document.getElementById('expiry-date').value);
        
        if (expiryDate <= purchaseDate) {
            document.getElementById('expiry-date').setCustomValidity('Expiry date must be after purchase date');
        } else {
            document.getElementById('expiry-date').setCustomValidity('');
        }
    }

    addFoodItem() {
        const name = document.getElementById('name').value.trim();
        const quantity = document.getElementById('quantity').value.trim();
        const purchaseDate = document.getElementById('purchase-date').value;
        const expiryDate = document.getElementById('expiry-date').value;

        // Validation
        if (!name || !quantity || !purchaseDate || !expiryDate) {
            this.showNotification('Please fill in all fields', 'error');
            return;
        }

        if (new Date(expiryDate) <= new Date(purchaseDate)) {
            this.showNotification('Expiry date must be after purchase date', 'error');
            return;
        }

        const item = {
            id: Date.now(),
            name: this.capitalizeWords(name),
            quantity,
            purchaseDate,
            expiryDate,
            addedDate: new Date().toISOString()
        };

        this.foodItems.push(item);
        this.saveData();
        this.resetForm();
        this.updateStats();
        this.showNotification('Food item added successfully!');
    }

    showTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // Update tab content
        document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
        document.getElementById(`${tabName}-tab`).classList.add('active');

        // Load content based on tab
        switch(tabName) {
            case 'view':
                this.displayFoodItems();
                break;
            case 'alerts':
                this.displayAlerts();
                break;
            case 'recipes':
                this.displayRecipes();
                break;
        }
    }

    displayFoodItems() {
        const list = document.getElementById('food-list');
        let items = this.foodItems;

        // Apply search filter
        if (this.currentFilter) {
            items = items.filter(item => 
                item.name.toLowerCase().includes(this.currentFilter) ||
                item.quantity.toLowerCase().includes(this.currentFilter)
            );
        }

        if (items.length === 0) {
            list.innerHTML = this.getEmptyState('No food items found', 'utensils');
            return;
        }

        // Sort by expiry date
        items.sort((a, b) => new Date(a.expiryDate) - new Date(b.expiryDate));

        list.innerHTML = items.map(item => {
            const daysUntilExpiry = this.getDaysUntilExpiry(item.expiryDate);
            const status = this.getItemStatus(daysUntilExpiry);
            
            return `
                <div class="food-item ${status.class}">
                    <h3>${item.name}</h3>
                    <div class="food-item-details">
                        <span><i class="fas fa-weight"></i> Quantity: ${item.quantity}</span>
                        <span><i class="fas fa-calendar-plus"></i> Purchased: ${this.formatDate(item.purchaseDate)}</span>
                        <span><i class="fas fa-calendar-times"></i> Expires: ${this.formatDate(item.expiryDate)}</span>
                        <span class="status-badge ${status.class}"><i class="${status.icon}"></i> ${status.text}</span>
                    </div>
                    <div class="food-item-actions">
                        <button class="btn-small btn-danger" onclick="app.deleteItem(${item.id})">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    }

    displayAlerts() {
        const list = document.getElementById('alerts-list');
        const alerts = this.getExpiryAlerts();

        if (alerts.length === 0) {
            list.innerHTML = this.getEmptyState('No expiry alerts', 'check-circle');
            return;
        }

        list.innerHTML = alerts.map(alert => `
            <div class="food-item ${alert.class}">
                <h3><i class="${alert.icon}"></i> ${alert.title}</h3>
                <p>${alert.message}</p>
                <div class="food-item-details">
                    <span>Quantity: ${alert.item.quantity}</span>
                    <span>Expires: ${this.formatDate(alert.item.expiryDate)}</span>
                </div>
            </div>
        `).join('');
    }

    displayRecipes() {
        const list = document.getElementById('recipes-list');
        const availableIngredients = this.getAvailableIngredients();
        
        if (availableIngredients.length === 0) {
            list.innerHTML = this.getEmptyState('Add some food items to get recipe suggestions', 'utensils');
            return;
        }

        list.innerHTML = `
            <div class="recipe-header">
                <h3>Recipe Suggestions</h3>
                <button class="btn-primary" onclick="app.getAIRecipes()">
                    <i class="fas fa-magic"></i> Get AI Suggestions
                </button>
            </div>
            <div id="recipe-results">
                ${this.getLocalRecipes(availableIngredients)}
            </div>
        `;
    }

    getLocalRecipes(availableIngredients) {
        const possibleRecipes = this.recipes.filter(recipe => 
            recipe.ingredients.every(ingredient => 
                availableIngredients.some(available => 
                    available.includes(ingredient.toLowerCase())
                )
            )
        );

        if (possibleRecipes.length === 0) {
            return '<p class="local-recipes-empty">No local recipes match your ingredients. Try AI suggestions!</p>';
        }

        return `
            <div class="recipe-section">
                <h4><i class="fas fa-book"></i> Local Recipe Database</h4>
                ${possibleRecipes.map(recipe => `
                    <div class="food-item recipe-item">
                        <h3><i class="fas fa-utensils"></i> ${recipe.name}</h3>
                        <p>${recipe.description}</p>
                        <div class="food-item-details">
                            <span><strong>Ingredients:</strong> ${recipe.ingredients.join(', ')}</span>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    getExpiryAlerts() {
        const today = new Date();
        const alerts = [];

        this.foodItems.forEach(item => {
            const daysUntilExpiry = this.getDaysUntilExpiry(item.expiryDate);
            
            if (daysUntilExpiry < 0) {
                alerts.push({
                    item,
                    title: 'Expired Item',
                    message: `${item.name} expired ${Math.abs(daysUntilExpiry)} day(s) ago`,
                    class: 'expired-item',
                    icon: 'fas fa-times-circle',
                    priority: 1
                });
            } else if (daysUntilExpiry === 0) {
                alerts.push({
                    item,
                    title: 'Expires Today',
                    message: `${item.name} expires today!`,
                    class: 'expired-item',
                    icon: 'fas fa-exclamation-triangle',
                    priority: 2
                });
            } else if (daysUntilExpiry <= 3) {
                alerts.push({
                    item,
                    title: 'Expiring Soon',
                    message: `${item.name} will expire in ${daysUntilExpiry} day(s)`,
                    class: 'alert-item',
                    icon: 'fas fa-clock',
                    priority: 3
                });
            }
        });

        return alerts.sort((a, b) => a.priority - b.priority);
    }

    getAvailableIngredients() {
        const today = new Date();
        return this.foodItems
            .filter(item => new Date(item.expiryDate) >= today)
            .map(item => item.name.toLowerCase());
    }

    getDaysUntilExpiry(expiryDate) {
        const today = new Date();
        const expiry = new Date(expiryDate);
        return Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
    }

    getItemStatus(daysUntilExpiry) {
        if (daysUntilExpiry < 0) {
            return { class: 'expired-item', text: 'Expired', icon: 'fas fa-times-circle' };
        } else if (daysUntilExpiry === 0) {
            return { class: 'expired-item', text: 'Expires Today', icon: 'fas fa-exclamation-triangle' };
        } else if (daysUntilExpiry <= 3) {
            return { class: 'alert-item', text: `${daysUntilExpiry} days left`, icon: 'fas fa-clock' };
        } else {
            return { class: '', text: `${daysUntilExpiry} days left`, icon: 'fas fa-check-circle' };
        }
    }

    deleteItem(id) {
        if (confirm('Are you sure you want to delete this item?')) {
            this.foodItems = this.foodItems.filter(item => item.id !== id);
            this.saveData();
            this.updateStats();
            this.displayFoodItems();
            this.showNotification('Item deleted successfully!');
        }
    }

    updateStats() {
        const totalItems = this.foodItems.length;
        const expiringSoon = this.getExpiryAlerts().length;
        
        document.getElementById('total-items').textContent = totalItems;
        document.getElementById('expiring-soon').textContent = expiringSoon;
    }

    checkExpiryNotifications() {
        const alerts = this.getExpiryAlerts();
        const criticalAlerts = alerts.filter(alert => alert.priority <= 2);
        
        if (criticalAlerts.length > 0) {
            setTimeout(() => {
                this.showNotification(
                    `You have ${criticalAlerts.length} item(s) that need attention!`,
                    'warning'
                );
            }, 1000);
        }
    }

    resetForm() {
        document.getElementById('food-form').reset();
        this.setDefaultDates();
    }

    saveData() {
        localStorage.setItem('foodItems', JSON.stringify(this.foodItems));
    }

    formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    capitalizeWords(str) {
        return str.replace(/\w\S*/g, (txt) => 
            txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
        );
    }

    getEmptyState(message, icon) {
        return `
            <div class="empty-state">
                <i class="fas fa-${icon}"></i>
                <p>${message}</p>
            </div>
        `;
    }

    showNotification(message, type = 'success') {
        const notification = document.getElementById('notification');
        notification.textContent = message;
        notification.className = `notification ${type}`;
        notification.classList.add('show');
        
        setTimeout(() => {
            notification.classList.remove('show');
        }, 4000);
    }

    async getAIRecipes() {
        const availableIngredients = this.getAvailableIngredients();
        const resultsDiv = document.getElementById('recipe-results');
        
        if (availableIngredients.length === 0) {
            this.showNotification('Add some food items first!', 'error');
            return;
        }

        // Show loading state
        resultsDiv.innerHTML = `
            ${this.getLocalRecipes(availableIngredients)}
            <div class="recipe-section">
                <h4><i class="fas fa-robot"></i> AI Recipe Suggestions</h4>
                <div class="loading-recipes">
                    <i class="fas fa-spinner fa-spin"></i>
                    <p>Getting AI recipe suggestions...</p>
                </div>
            </div>
        `;

        try {
            const aiRecipes = await this.fetchAIRecipes(availableIngredients);
            
            resultsDiv.innerHTML = `
                ${this.getLocalRecipes(availableIngredients)}
                <div class="recipe-section">
                    <h4><i class="fas fa-robot"></i> AI Recipe Suggestions</h4>
                    ${aiRecipes.map(recipe => `
                        <div class="food-item recipe-item ai-recipe">
                            <h3><i class="fas fa-magic"></i> ${recipe.name}</h3>
                            <p>${recipe.description}</p>
                            <div class="food-item-details">
                                <span><strong>Ingredients:</strong> ${recipe.ingredients.join(', ')}</span>
                                <span><strong>Prep Time:</strong> ${recipe.prepTime || '15-30 mins'}</span>
                                <span><strong>Difficulty:</strong> ${recipe.difficulty || 'Easy'}</span>
                            </div>
                            ${recipe.instructions ? `
                                <div class="recipe-instructions">
                                    <strong>Instructions:</strong>
                                    <ol>
                                        ${recipe.instructions.map(step => `<li>${step}</li>`).join('')}
                                    </ol>
                                </div>
                            ` : ''}
                        </div>
                    `).join('')}
                </div>
            `;
            
            this.showNotification('AI recipes loaded successfully!');
        } catch (error) {
            resultsDiv.innerHTML = `
                ${this.getLocalRecipes(availableIngredients)}
                <div class="recipe-section">
                    <h4><i class="fas fa-robot"></i> AI Recipe Suggestions</h4>
                    <div class="error-state">
                        <i class="fas fa-exclamation-triangle"></i>
                        <p>Unable to fetch AI recipes. Using mock suggestions instead.</p>
                    </div>
                    ${this.getMockAIRecipes(availableIngredients)}
                </div>
            `;
            this.showNotification('Using offline AI suggestions', 'warning');
        }
    }

    async fetchAIRecipes(ingredients) {
        // Mock AI API call - replace with actual AI service
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(this.generateMockAIRecipes(ingredients));
            }, 2000);
        });
        
        // Uncomment and modify for real AI integration:
        /*
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer YOUR_API_KEY'
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: [{
                    role: 'user',
                    content: `Create 3 simple recipes using these ingredients: ${ingredients.join(', ')}. Return as JSON array with name, description, ingredients, prepTime, difficulty, and instructions fields.`
                }],
                max_tokens: 1000
            })
        });
        
        const data = await response.json();
        return JSON.parse(data.choices[0].message.content);
        */
    }

    generateMockAIRecipes(ingredients) {
        const aiRecipes = [
            {
                name: `${ingredients[0]} Fusion Bowl`,
                description: `A creative fusion dish featuring ${ingredients[0]} as the star ingredient`,
                ingredients: ingredients.slice(0, 3),
                prepTime: '20 mins',
                difficulty: 'Easy',
                instructions: [
                    `Prepare your ${ingredients[0]} by washing and chopping`,
                    'Heat a pan with a little oil',
                    'Combine all ingredients and cook for 10-15 minutes',
                    'Season to taste and serve hot'
                ]
            },
            {
                name: `Quick ${ingredients[0]} Delight`,
                description: `A fast and delicious way to use up your ${ingredients[0]}`,
                ingredients: ingredients.slice(0, 2),
                prepTime: '15 mins',
                difficulty: 'Beginner',
                instructions: [
                    'Gather all ingredients',
                    'Mix ingredients in a bowl',
                    'Cook or serve as needed',
                    'Enjoy your creation!'
                ]
            }
        ];
        
        return aiRecipes.filter(recipe => recipe.ingredients.length > 0);
    }

    getMockAIRecipes(ingredients) {
        const mockRecipes = this.generateMockAIRecipes(ingredients);
        return mockRecipes.map(recipe => `
            <div class="food-item recipe-item ai-recipe">
                <h3><i class="fas fa-magic"></i> ${recipe.name}</h3>
                <p>${recipe.description}</p>
                <div class="food-item-details">
                    <span><strong>Ingredients:</strong> ${recipe.ingredients.join(', ')}</span>
                    <span><strong>Prep Time:</strong> ${recipe.prepTime}</span>
                    <span><strong>Difficulty:</strong> ${recipe.difficulty}</span>
                </div>
                <div class="recipe-instructions">
                    <strong>Instructions:</strong>
                    <ol>
                        ${recipe.instructions.map(step => `<li>${step}</li>`).join('')}
                    </ol>
                </div>
            </div>
        `).join('');
    }

    closeModal() {
        document.getElementById('modal').style.display = 'none';
    }
}

// Initialize the application
const app = new FoodExpiryTracker();
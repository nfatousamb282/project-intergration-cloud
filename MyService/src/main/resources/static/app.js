const API_BASE_URL = '/api/products';

// Charger les produits au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    setupForm();
});

// Configuration du formulaire
function setupForm() {
    const form = document.getElementById('productForm');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        await saveProduct();
    });
}

// Charger tous les produits
async function loadProducts() {
    try {
        const response = await fetch(API_BASE_URL);
        if (!response.ok) throw new Error('Erreur lors du chargement');
        const products = await response.json();
        displayProducts(products);
    } catch (error) {
        console.error('Erreur:', error);
        document.getElementById('productsList').innerHTML = 
            '<p class="empty">Erreur lors du chargement des produits</p>';
    }
}

// Afficher les produits
function displayProducts(products) {
    const container = document.getElementById('productsList');
    
    if (products.length === 0) {
        container.innerHTML = '<p class="empty">Aucun produit trouvé</p>';
        return;
    }

    container.innerHTML = products.map(product => `
        <div class="product-card">
            <h3>${escapeHtml(product.name)}</h3>
            <p>${escapeHtml(product.description)}</p>
            <div class="product-price">${product.price.toFixed(2)} €</div>
            <span class="product-quantity">Stock: ${product.quantity}</span>
            <div class="product-actions">
                <button class="btn-edit" onclick="editProduct(${product.id})">Modifier</button>
                <button class="btn-delete" onclick="deleteProduct(${product.id})">Supprimer</button>
            </div>
        </div>
    `).join('');
}

// Rechercher des produits
async function searchProducts() {
    const keyword = document.getElementById('searchInput').value.trim();
    
    if (!keyword) {
        loadProducts();
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/search?q=${encodeURIComponent(keyword)}`);
        if (!response.ok) throw new Error('Erreur lors de la recherche');
        const products = await response.json();
        displayProducts(products);
    } catch (error) {
        console.error('Erreur:', error);
        document.getElementById('productsList').innerHTML = 
            '<p class="empty">Erreur lors de la recherche</p>';
    }
}

// Sauvegarder un produit (créer ou mettre à jour)
async function saveProduct() {
    const id = document.getElementById('productId').value;
    const product = {
        name: document.getElementById('name').value,
        description: document.getElementById('description').value,
        price: parseFloat(document.getElementById('price').value),
        quantity: parseInt(document.getElementById('quantity').value)
    };

    try {
        let response;
        if (id) {
            // Mise à jour
            response = await fetch(`${API_BASE_URL}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(product)
            });
        } else {
            // Création
            response = await fetch(API_BASE_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(product)
            });
        }

        if (!response.ok) throw new Error('Erreur lors de la sauvegarde');
        
        resetForm();
        loadProducts();
    } catch (error) {
        console.error('Erreur:', error);
        alert('Erreur lors de la sauvegarde du produit');
    }
}

// Modifier un produit
async function editProduct(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/${id}`);
        if (!response.ok) throw new Error('Erreur lors du chargement');
        const product = await response.json();

        document.getElementById('productId').value = product.id;
        document.getElementById('name').value = product.name;
        document.getElementById('description').value = product.description;
        document.getElementById('price').value = product.price;
        document.getElementById('quantity').value = product.quantity;

        document.getElementById('formTitle').textContent = 'Modifier le produit';
        document.getElementById('submitBtn').textContent = 'Mettre à jour';
        document.getElementById('cancelBtn').style.display = 'block';

        // Scroll vers le formulaire
        document.querySelector('.form-section').scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
        console.error('Erreur:', error);
        alert('Erreur lors du chargement du produit');
    }
}

// Supprimer un produit
async function deleteProduct(id) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) throw new Error('Erreur lors de la suppression');
        
        loadProducts();
    } catch (error) {
        console.error('Erreur:', error);
        alert('Erreur lors de la suppression du produit');
    }
}

// Réinitialiser le formulaire
function resetForm() {
    document.getElementById('productForm').reset();
    document.getElementById('productId').value = '';
    document.getElementById('formTitle').textContent = 'Ajouter un nouveau produit';
    document.getElementById('submitBtn').textContent = 'Ajouter';
    document.getElementById('cancelBtn').style.display = 'none';
}

// Échapper le HTML pour éviter les injections XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Permettre la recherche avec la touche Entrée
document.getElementById('searchInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchProducts();
    }
});


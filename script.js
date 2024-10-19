const siteId = 'scmq7n';
let currentPage = 1;
const resultsContainer = document.getElementById('results-container');
const prevPageBtn = document.getElementById('prev-page');
const nextPageBtn = document.getElementById('next-page');
const currentPageEl = document.getElementById('current-page');
const cart = []; // Array to hold products in the cart
const cartCountElement = document.getElementById('cart-count'); // Cart count element
let cartCount = 0; // To track the total count of items in the cart

// Function to fetch products from the API
async function fetchProducts(query, page = 1) {
    const url = `https://api.searchspring.net/api/search/search.json?siteId=${siteId}&q=${query}&resultsFormat=native&page=${page}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        displayResults(data.results);
        handlePagination(data.pagination, query);
    } catch (error) {
        console.error('Error fetching data:', error);
        resultsContainer.innerHTML = '<p>Something went wrong while fetching results.</p>';
    }
}

// Function to display products in the results container
function displayResults(products) {
  resultsContainer.innerHTML = ''; // Clear previous results

  products.forEach(product => {
      const productCard = document.createElement('div');
      productCard.classList.add('product-card');

      productCard.innerHTML = `
          <img src="${product.thumbnailImageUrl}" alt="${product.name}">
          <h2>${product.name}</h2>
          <p>
              ${product.msrp > product.price ? `<span class="msrp">$${product.msrp}</span>` : ''}
              <span class="price">$${product.price}</span>
          </p>
          <button class="add-to-cart-btn" data-id="${product.id}" data-name="${product.name}" data-price="${product.price}">Add to Cart<img src="https://img.icons8.com/ios-glyphs/30/ffffff/shopping-cart.png" alt="Cart" class="cart-icon"</button>
      `;

      resultsContainer.appendChild(productCard);
  });



    // Add event listeners to "Add to Cart" buttons inside displayResults
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = e.target.getAttribute('data-id');
            const productName = e.target.getAttribute('data-name');
            const productPrice = parseFloat(e.target.getAttribute('data-price'));
            addToCart({ id: productId, name: productName, price: productPrice });
        });
    });
}

// Function to handle adding products to the cart
function addToCart(product) {
    // Check if the product is already in the cart
    const existingProduct = cart.find(item => item.id === product.id);
    if (existingProduct) {
        existingProduct.quantity += 1; // Increase quantity
    } else {
        product.quantity = 1; // Initialize quantity
        cart.push(product); // Add new product to cart
    }

    cartCount++; // Increment the total items count
    updateCartCount(); // Update the cart count display
}

// Function to update the cart count display
function updateCartCount() {
    cartCountElement.textContent = cartCount; // Update the displayed cart count
}

// Function to handle pagination controls
function handlePagination(pagination, query) {
    currentPage = pagination.currentPage;
    currentPageEl.textContent = `Page ${currentPage}`;

    prevPageBtn.disabled = currentPage === 1;
    nextPageBtn.disabled = currentPage === pagination.totalPages;

    prevPageBtn.onclick = () => fetchProducts(query, currentPage - 1);
    nextPageBtn.onclick = () => fetchProducts(query, currentPage + 1);
}

// Event listener for the search button
document.getElementById('search-button').addEventListener('click', () => {
    const query = document.getElementById('search-input').value.trim();
    if (query) {
        fetchProducts(query, 1);
    }
});

// Event listener for pressing Enter in the search input
document.getElementById('search-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const query = e.target.value.trim();
        if (query) {
            fetchProducts(query, 1);
        }
    }
});

// Function to handle predefined category searches
function searchCategory(category) {
    document.getElementById('search-input').value = category;
    fetchProducts(category, 1);
}

// Initial fetch to display products (optional)
fetchProducts(''); // Optionally, you can call this to show initial products

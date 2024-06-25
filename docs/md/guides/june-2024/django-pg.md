> :MetaOverride property=og:title
>
> Integrate Cashfree Payments' Payment Gateway in Your Django App Effortlessly

> :MetaOverride property=og:description
>
> In this tutorial, we'll integrate Cashfree Payments' payment gateway into a basic e-commerce application built with Django.

> :MetaOverride property=og:image
>
> /assets/images/og.png

# Integrate Cashfree Payments' Payment Gateway in Your Django App Effortlessly

In this tutorial, we'll integrate Cashfree Payments' payment gateway into a basic e-commerce application built with Django. This tutorial will walk you through the steps to set up the application, create orders, and handle payments using the Cashfree Python SDK.

We'll use a basic e-commerce app as our example, which you can find in the [GitHub repository](https://github.com/withshubh/fakeazon) for your reference.

## Overview of the E-commerce App

Our e-commerce app has the following features:

1. **Landing Page**: Displays a list of products fetched from an API.
2. **Cart Functionality**: Allows users to add products to the cart, adjust quantities, and view the cart.
3. **Checkout Process**: Uses Cashfree Payments' gateway to handle payments.

![ecommerce-demo](/assets/images/django-pg/demo1.gif)

> [**Try Cashfree Dev Studio**](https://www.cashfree.com/devstudio): Cashfree offers an SDK & API playground for developers. You can freely explore, experiment, and play with various APIs and SDKs offered by Cashfree Payments.

## Step 1: Set Up Your Django Project

First, ensure you have Django installed. If not, install it using pip:

```bash
pip install django
```

Create a new Django project and app:

```bash
django-admin startproject ecommerce
cd ecommerce
django-admin startapp shop
```

## Step 2: Install Cashfree Python SDK

Install the Cashfree Python SDK using pip:

```bash
pip install cashfree_pg
```

## Step 3: Configure Cashfree in Your Django Project

Create a file named `cashfree_config.py` in your Django app directory (`shop`) and add the following configuration:

```python
# shop/cashfree_config.py
from cashfree_pg.api_client import Cashfree

Cashfree.XClientId = 'YOUR_CLIENT_ID'
Cashfree.XClientSecret = 'YOUR_CLIENT_SECRET'
Cashfree.XEnvironment = Cashfree.SANDBOX  # Use Cashfree.PRODUCTION for live environment

```

Replace `'YOUR_CLIENT_ID'` and `'YOUR_CLIENT_SECRET'` with your actual Cashfree credentials. You can find the Client ID and Secret from the Developers section of the Cashfree Payments’ [Merchant Dashboard](https://merchant.cashfree.com).

## Step 4: Update Views to Handle Orders and Payments

In `views.py`, add the necessary imports and views to handle creating orders and processing payments.

```python
# shop/views.py
import requests
from django.shortcuts import render, redirect
from django.http import JsonResponse
from cashfree_pg.models.create_order_request import CreateOrderRequest
from cashfree_pg.api_client import Cashfree
from cashfree_pg.models.customer_details import CustomerDetails
from cashfree_pg.models.order_meta import OrderMeta
from django.views.decorators.csrf import csrf_exempt
import json

# Import Cashfree configuration
from .cashfree_config import Cashfree

def landing_page(request):
    response = requests.get('<https://fakestoreapi.com/products>')
    products = response.json()
    return render(request, 'shop/landing_page.html', {'products': products})

def cart_page(request):
    cart = request.session.get('cart', {})
    cart_items = []
    for product_id, details in cart.items():
        cart_items.append({
            'id': product_id,
            'title': details.get('title', 'No Title'),
            'description': details.get('description', ''),
            'image': details.get('image', '<https://via.placeholder.com/80>'),  # Default placeholder image
            'price': details.get('price', 0.0),
            'quantity': details.get('quantity', 1)
        })
    return render(request, 'shop/cart_page.html', {'cart_items': cart_items})

@csrf_exempt
def create_order(request):
    if request.method == 'POST':
        cart_data = request.POST.get('cart')
        if not cart_data:
            return JsonResponse({'status': 'error', 'message': 'Cart is empty'})

        try:
            cart = json.loads(cart_data)
        except json.JSONDecodeError:
            return JsonResponse({'status': 'error', 'message': 'Invalid cart data'})

        total_amount = 0.0
        for item in cart.values():
            try:
                price = float(item['price'])
                quantity = int(item['quantity'])
                total_amount += price * quantity
            except ValueError as e:
                return JsonResponse({'status': 'error', 'message': f"Error parsing price or quantity for item {item['id']}"})

        if total_amount < 1:
            return JsonResponse({'status': 'error', 'message': 'Total amount must be at least 1'})

        customer_details = CustomerDetails(customer_id="123", customer_phone="9999999999")
        create_order_request = CreateOrderRequest(order_amount=total_amount, order_currency="INR", customer_details=customer_details)
        order_meta = OrderMeta(return_url="<http://localhost:8000/successfull/>")
        create_order_request.order_meta = order_meta

        try:
            api_response = Cashfree().PGCreateOrder("2023-08-01", create_order_request, None, None)
            payment_session_id = api_response.data.payment_session_id
            return JsonResponse({'status': 'success', 'payment_session_id': payment_session_id})
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': f'Error creating order: {str(e)}'})

    return JsonResponse({'status': 'error', 'message': 'Invalid request method'})

def success_page(request):
    cart = request.session.get('cart', {})
    cart_items = []
    for product_id, details in cart.items():
        cart_items.append({
            'id': product_id,
            'title': details.get('title', 'No Title'),
            'price': details.get('price', 0.0),
            'quantity': details.get('quantity', 1)
        })
    request.session['cart'] = {}
    return render(request, 'shop/successfull.html', {'cart_items': cart_items})
```

- `landing_page`: Fetches and displays products from the API.
- `cart_page`: Displays the items in the cart.
- `create_order`: Creates an order using the Cashfree API and returns the payment session ID. This method is hit when the "Pay Now" button is clicked.
  - **Creating an Order**: We create an order by calculating the total amount of the cart, creating `CustomerDetails`, and using `CreateOrderRequest` to make an API call to Cashfree.
  - **Order Meta**: `order_meta` is used to set a return URL that Cashfree will redirect to after payment.
  - **API Call**: `PGCreateOrder` is called to create the order, and the `payment_session_id` is obtained from the response.
- `success_page`: Displays the success message and order details, and clears the cart after successful order completion.

## Step 5: Create Templates

Create the necessary HTML templates to handle the cart, payment, and success pages.

### 1. `landing_page.html`

```html
<!-- shop/templates/shop/landing_page.html -->
load static
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Landing Page</title>
    <link rel="stylesheet" type="text/css" href="static/css/styles.css" />
    <script src="<https://code.jquery.com/jquery-3.6.0.min.js>"></script>
  </head>
  <body>
    <div class="navbar">
      <div class="logo">Fakeazon</div>
      <a href="{% url 'cart_page' %}" class="cart">Cart (<span id="cart-count">0</span>)</a>
    </div>
    <div class="container">
      <div class="header">
        <h1>Get Inspired</h1>
        <p>
          Browsing for your next long-haul trip, everyday journey, or just fancy a look at what's new? From community favourites to about-to-sell-out items, see
          them all here.
        </p>
      </div>
      <div class="filters">
        <select>
          <option>All Categories</option>
        </select>
        <select>
          <option>All Colors</option>
        </select>
        <select>
          <option>All Features</option>
        </select>
        <select>
          <option>From ₹0 - ₹1000</option>
        </select>
        <select>
          <option>New In</option>
        </select>
      </div>
      <div class="product-grid">
        {% for product in products %}
        <div class="product-item">
          <img src="{{ product.image }}" alt="{{ product.title }}" />
          <h2>{{ product.title }}</h2>
          <p>₹{{ product.price }}</p>
          <div class="product-actions">
            <button
              class="add-to-cart"
              data-id="{{ product.id }}"
              data-title="{{ product.title }}"
              data-description="{{ product.description }}"
              data-image="{{ product.image }}"
              data-price="{{ product.price }}"
            >
              Add to cart
            </button>
            <div class="quantity-selector" data-id="{{ product.id }}" style="display: none;">
              <button class="decrease" data-id="{{ product.id }}">-</button>
              <span class="quantity" data-id="{{ product.id }}">1</span>
              <button class="increase" data-id="{{ product.id }}">+</button>
            </div>
          </div>
        </div>
        {% endfor %}
      </div>
    </div>
    <script>
      let cart = JSON.parse(localStorage.getItem("cart")) || {};

      function updateCartCount() {
        let count = 0;
        for (let id in cart) {
          count += cart[id].quantity;
        }

        $("#cart-count").text(count);
      }

      function updateQuantity(productId, quantity) {
        if (quantity <= 0) {
          delete cart[productId];
          $(`.product-item .add-to-cart[data-id=${productId}]`).show();
          $(`.product-item .quantity-selector[data-id=${productId}]`).hide();
        } else {
          cart[productId].quantity = quantity;
          $(`.product-item .quantity[data-id=${productId}]`).text(quantity);
        }
        localStorage.setItem("cart", JSON.stringify(cart));
        updateCartCount();
      }

      $(document).ready(function () {
        // Update cart count on page load
        updateCartCount();

        $(".add-to-cart").click(function () {
          const productId = $(this).data("id");
          const title = $(this).data("title");
          const description = $(this).data("description");
          const image = $(this).data("image");
          const price = $(this).data("price");

          if (!cart[productId]) {
            cart[productId] = { id: productId, title, description, image, price, quantity: 1 };
          }

          localStorage.setItem("cart", JSON.stringify(cart));
          updateCartCount();

          $(this).hide();
          $(`.product-item .quantity-selector[data-id=${productId}]`).show();
        });

        $(".increase").click(function () {
          const productId = $(this).data("id");
          const quantity = cart[productId].quantity + 1;
          updateQuantity(productId, quantity);
        });

        $(".decrease").click(function () {
          const productId = $(this).data("id");
          const quantity = cart[productId].quantity - 1;
          updateQuantity(productId, quantity);
        });
      });
    </script>
  </body>
</html>
```

This template displays a list of products. It handles adding products to the cart and updating quantities.

### 2. `cart_page.html`

```html
<!-- shop/templates/shop/cart_page.html -->
 load static 
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Cart Page</title>
    <link rel="stylesheet" type="text/css" href="static/css/styles.css'" />
    <script src="<https://code.jquery.com/jquery-3.6.0.min.js>"></script>
    <script src="<https://sdk.cashfree.com/js/v3/cashfree.js>"></script>
  </head>

  <body>
    <div class="navbar">
      <div class="logo">Fakeazon</div>
      <a href="{% url 'cart_page' %}" class="cart">Cart (<span id="cart-count">0</span>)</a>
    </div>
    <div class="container">
      <div class="cart-container">
        <div class="cart-header">
          <a href="{% url 'landing_page' %}">Continue Shopping</a>
          <h1>Shopping Cart</h1>
        </div>
        <div class="cart-items">
          <!-- Cart items will be dynamically loaded here -->
        </div>
        <form>
          {% csrf_token %}
          <div class="cart-total">
            <div class="total-amount">Total: ₹<span id="total-amount">0.00</span></div>
            <button type="button" class="pay-now" disabled>Pay Now</button>
          </div>
        </form>
      </div>
    </div>
    <script>
      const cashfree = Cashfree({
        mode: "sandbox",
      });

      let cart = JSON.parse(localStorage.getItem("cart")) || {};

      function updateCartCount() {
        let count = 0;
        for (let id in cart) {
          count += cart[id].quantity;
        }
        $("#cart-count").text(count);
      }

      function updateTotalAmount() {
        let total = 0;
        for (let id in cart) {
          total += parseFloat(cart[id].price) * parseInt(cart[id].quantity);
        }
        $("#total-amount").text(total.toFixed(2));
        if (total > 0) {
          $(".pay-now").prop("disabled", false);
        } else {
          $(".pay-now").prop("disabled", true);
        }
      }

      function updateQuantity(productId, quantity) {
        if (quantity <= 0) {
          delete cart[productId];
          $(`.cart-item[data-id=${productId}]`).remove();
        } else {
          cart[productId].quantity = quantity;
          $(`.cart-item .quantity[data-id=${productId}]`).text(quantity);
        }
        localStorage.setItem("cart", JSON.stringify(cart));
        updateCartCount();
        updateTotalAmount();
      }

      function loadCartItems() {
        const cartContainer = $(".cart-items");
        cartContainer.empty();

        for (let id in cart) {
          const item = cart[id];
          const cartItemHtml = `
          <div class="cart-item" data-id="${item.id}">
            <img src="${item.image}" alt="${item.title}">
            <div class="cart-item-details">
              <h2>${item.title}</h2>
              <p>${item.description}</p>
            </div>
            <div class="cart-item-actions">
              <button class="decrease" data-id="${item.id}">-</button>
              <span class="quantity" data-id="${item.id}">${item.quantity}</span>
              <button class="increase" data-id="${item.id}">+</button>
              <span class="price">₹${item.price}</span>
              <button class="delete" data-id="${item.id}">&#128465;</button>
            </div>
          </div>
        `;
          cartContainer.append(cartItemHtml);
        }
      }

      $(document).ready(function () {
        // Load cart items on page load
        loadCartItems();
        updateCartCount();
        updateTotalAmount();

        // Handle increase and decrease buttons
        $(document).on("click", ".increase", function () {
          const productId = $(this).data("id");
          const quantity = cart[productId].quantity + 1;
          updateQuantity(productId, quantity);
        });

        $(document).on("click", ".decrease", function () {
          const productId = $(this).data("id");
          const quantity = cart[productId].quantity - 1;
          updateQuantity(productId, quantity);
        });

        // Handle delete button
        $(document).on("click", ".delete", function () {
          const productId = $(this).data("id");
          updateQuantity(productId, 0);
        });

        // Handle Pay Now button click
        $(".pay-now").click(function () {
          const csrftoken = $('input[name="csrfmiddlewaretoken"]').val();
          const cartData = JSON.stringify(cart);
          console.log("Cart data being sent:", cart);
          $.ajax({
            url: "/create-order/",
            method: "POST",
            headers: { "X-CSRFToken": csrftoken },
            data: { cart: cartData },
            success: function (response) {
              if (response.status === "success") {
                const paymentSessionId = response.payment_session_id;
                const checkoutOptions = {
                  paymentSessionId: paymentSessionId,
                  redirectTarget: "_self",
                };
                cashfree.checkout(checkoutOptions);
              } else {
                alert("Failed to create order: " + response.message);
              }
            },
            error: function () {
              alert("Failed to create order. Please try again.");
            },
          });
        });
      });
    </script>
  </body>
</html>
```

This template includes the necessary JavaScript to handle cart operations and initiate the payment process. On clicking the "Pay Now" button, it creates an order and opens the Cashfree checkout page.

### 3. `success_page.html`

```html
<!-- shop/templates/shop/successfull.html -->
load static
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Order Successful</title>
    <link rel="stylesheet" type="text/css" href="static/css/styles.css" />
  </head>
  <body>
    <div class="container">
      <div class="success-container">
        <h1>Order Successful</h1>
        <p>Thank you for your purchase! Here are your order details:</p>
        <ul>
          {% for item in cart_items %}
          <li>{{ item.title }} - Quantity: {{ item.quantity }} - Price: ₹{{ item.price }}</li>
          {% endfor %}
        </ul>
        <p>Redirecting to the landing page in <span id="countdown">10</span> seconds...</p>
      </div>
    </div>
    <script>
      let countdown = 10;
      const countdownElement = document.getElementById("countdown");

      setInterval(() => {
        countdown -= 1;
        countdownElement.textContent = countdown;
        if (countdown <= 0) {
          localStorage.removeItem("cart");
          window.location.href = "/";
        }
      }, 1000);
    </script>
  </body>
</html>
```

This template shows the order success details and redirects the user back to the landing page after 10 seconds, clearing the cart.

![ecommerce-demo](/assets/images/django-pg/demo2.gif)

## Styling

To style your e-commerce application, you can use the provided CSS file. Ensure you create a `styles.css` file in your static folder and link it to your HTML templates. Here is how you can do it:

1. Create a CSS file named `styles.css` in the `static/css` directory of your Django project.
2. Link the CSS file in your HTML templates by adding the following line in the `<head>` section:

```html
<link rel="stylesheet" type="text/css" href="static/css/styles.css" />
```

For a detailed CSS styling reference, you can check the `styles.css` file in the [GitHub repository](https://github.com/withshubh/fakeazon/blob/main/shop/static/css/styles.css).

This CSS file will include styles for:

Ensure your Django settings are correctly configured to serve static files during development by including `STATICFILES_DIRS` in your `settings.py`.

```python
STATICFILES_DIRS = [
    os.path.join(BASE_DIR, 'shop/static'),
]
```

## Conclusion

In this tutorial, we've walked through the integration of Cashfree Payments' payment gateway into a Django e-commerce application. By following these steps, you can seamlessly handle payments in your Django projects using the Cashfree Python SDK.

You can find the complete source code for this project in the [GitHub repository](https://github.com/withshubh/fakeazon). Feel free to clone it and use it as a reference for your projects.

If you have any questions or run into issues, refer to the [Cashfree Documentation](https://docs.cashfree.com/) for more details or join the [Discord community](https://discord.gg/ed9VWDnrh7) for developer support.

> :Author name= Shubhendra Singh Chauhan, date=24th June 2024, avatar=https://camelcaseguy.com/assets/images/shubhendra.jpeg, url= https://camelcaseguy.com

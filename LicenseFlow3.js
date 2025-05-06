$(document).ready(function () {
	console.log("script updated");
    $('a[data-button-type="add-cart"]').on('click', function (e) {
        e.preventDefault();

        // ✅ Use reliable login detection
        if (!isCustomerLoggedIn()) {
                alert("🚫 You must be logged in to add this item.");
				window.location.href = "/login.php";
            return;
        }
		 
        const productId = new URLSearchParams(this.href.split('?')[1]).get('product_id');

        if (!productId) {
            alert('Product ID missing!');
            return;
        }

        $.post('/cart.php', {
            action: 'add',
            product_id: productId,
            qty: 1
        }, function () {
            alert('✅ Product added to cart!');
        }).fail(function (xhr) {
            console.error('❌ Error:', xhr.responseText);
            alert('Failed to add product.');
        });
    });
});

function isCustomerLoggedIn() {
    return !!document.querySelector('a[href*="logout"], a[href*="account.php"]');
}

$(document).ready(function () {
    $('a[data-button-type="add-cart"]').on('click', function (e) {
        e.preventDefault();

        if (!window.Customer || !window.Customer.id) {
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
        });
    });
});

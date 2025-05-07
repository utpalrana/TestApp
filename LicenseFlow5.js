$(document).ready(function () {
    // Inject the modal HTML dynamically into the <body>
    $('body').append(`
      <div id="performanceModal" style="display:none; position:fixed; z-index:9999; background:#fff; border:1px solid #ccc; padding:20px; top:20%; left:50%; transform:translateX(-50%); box-shadow:0 0 10px rgba(0,0,0,0.3); max-width:90%; width:400px;">
        <h3 style="margin-top:0;">🎭 Enter Performance Info</h3>
        <label>Theater Name:<br><input type="text" id="theaterName" style="width:100%"></label><br><br>
        <label>Start Date:<br><input type="date" id="startDate" style="width:100%"></label><br><br>
        <label>End Date:<br><input type="date" id="endDate" style="width:100%"></label><br><br>
        <label>Location:<br><input type="text" id="location" style="width:100%"></label><br><br>
        <button id="submitPerformance" style="background:#000;color:#fff;padding:8px 16px;border:none;cursor:pointer;">Submit</button>
      </div>
    `);

    console.log("script updated");

    $('a[data-button-type="add-cart"]').on('click', function (e) {
        e.preventDefault();

        if (!isCustomerLoggedIn()) {
            alert("You must be logged in to add this item.");
            window.location.href = "/login.php";
            return;
        }

        const productId = new URLSearchParams(this.href.split('?')[1]).get('product_id');

        if (!productId) {
            alert('Product ID missing!');
            return;
        }

        $('#performanceModal').fadeIn();

        $('#submitPerformance').off('click').on('click', function () {
            const theaterName = $('#theaterName').val().trim();
            const startDate = $('#startDate').val();
            const endDate = $('#endDate').val();
            const location = $('#location').val().trim();

            if (!theaterName || !startDate || !endDate || !location) {
                alert('Please fill in all fields.');
                return;
            }

            // Call validation API
            $.ajax({
                url: 'https://blvalidate112.free.beeceptor.com/todos',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({
                    productId: productId,
                    theaterName: theaterName,
                    startDate: startDate,
                    endDate: endDate,
                    location: location
                }),
                success: function (response) {
                    console.log('Validation response:', response);
                    alert('Validation Success:\n' + JSON.stringify(response));

                    // Proceed to add to cart
                    $.post('/cart.php', {
                        action: 'add',
                        product_id: productId,
                        qty: 1
                    }, function () {
                        alert('Product added to cart!');
                        location.reload();
                    }).fail(function (xhr) {
                        console.error('Add to cart error:', xhr.responseText);
                        alert('Failed to add product.');
                    });

                    $('#performanceModal').fadeOut();
                },
                error: function (xhr) {
                    console.error('Validation error:', xhr.responseText);
                    alert('Validation Failed:\n' + xhr.responseText);
                }
            });
        });
    });

    function isCustomerLoggedIn() {
        return !!document.querySelector('a[href*="logout"], a[href*="account.php"]');
    }
});

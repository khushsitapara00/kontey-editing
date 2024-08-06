document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const bookingForm = document.getElementById('booking-form');
    const adminPage = document.getElementById('admin-page');
    const customerPage = document.getElementById('customer-page');
    const logoutButton = document.getElementById('logout');
    const bookingList = document.getElementById('booking-list');
    const cancelButton = document.getElementById('cancel-booking');
    const registeredUsersList = document.getElementById('registered-users-list');
    const notBookedUsersList = document.getElementById('not-booked-users-list');

    let isAdmin = false;

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        if (username === 'admin@info.com' && password === 'Khush@1205') {
            isAdmin = true;
            showAdminPage();
        } else {
            const users = JSON.parse(localStorage.getItem('users')) || [];
            const user = users.find(user => user.username === username && user.password === password);

            if (user) {
                isAdmin = false;
                bookingForm.style.display = 'block';

                // Store login history
                const loginHistory = JSON.parse(localStorage.getItem('loginHistory')) || [];
                loginHistory.push({ username, loginTime: new Date().toISOString() });
                localStorage.setItem('loginHistory', JSON.stringify(loginHistory));
            } else {
                alert('Invalid credentials');
            }
        }
    });

    bookingForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const customerName = document.getElementById('customer-name').value;
        const customerMobile = document.getElementById('customer-mobile').value;
        const videoDuration = document.getElementById('video-duration').value;
        const workDescription = document.getElementById('work-description').value;
        const bookingTime = document.getElementById('booking-time').value;

        const booking = {
            customerName,
            customerMobile,
            videoDuration,
            workDescription,
            bookingTime,
            status: 'pending'
        };

        // Store booking data in localStorage (simulating a backend)
        let bookings = JSON.parse(localStorage.getItem('bookings')) || [];
        bookings.push(booking);
        localStorage.setItem('bookings', JSON.stringify(bookings));

        // Mark the user as having booked
        markUserAsBooked(customerMobile);

        addBookingToList(booking);
        bookingForm.reset();
        cancelButton.style.display = 'block';
    });

    cancelButton.addEventListener('click', () => {
        bookingForm.style.display = 'block';
        cancelButton.style.display = 'none';
        // Clear the form or reset to initial state
    });

    logoutButton.addEventListener('click', () => {
        isAdmin = false;
        showCustomerPage();
    });

    function showAdminPage() {
        adminPage.style.display = 'block';
        customerPage.style.display = 'none';
        loadBookings();
        loadRegisteredUsers();
        loadNotBookedUsers();
    }

    function showCustomerPage() {
        adminPage.style.display = 'none';
        customerPage.style.display = 'block';
    }

    function loadBookings() {
        const bookings = JSON.parse(localStorage.getItem('bookings')) || [];
        bookingList.innerHTML = '';
        bookings.forEach(booking => addBookingToList(booking));
    }

    function addBookingToList(booking) {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            <span>Name: ${booking.customerName}, Mobile: ${booking.customerMobile}, Duration: ${booking.videoDuration}, Work: ${booking.workDescription}, Time: ${booking.bookingTime}</span>
            <span class="${booking.status}">${booking.status}</span>
            <button class="button done-button">✔</button>
            <button class="button cancel-button">✖</button>
            <button class="button delete-button">🗑</button>
        `;
        bookingList.appendChild(listItem);

        listItem.querySelector('.done-button').addEventListener('click', () => {
            booking.status = 'done';
            updateBookingStatus(listItem, booking);
        });

        listItem.querySelector('.cancel-button').addEventListener('click', () => {
            booking.status = 'cancelled';
            updateBookingStatus(listItem, booking);
        });

        listItem.querySelector('.delete-button').addEventListener('click', () => {
            deleteBooking(listItem, booking);
        });
    }

    function updateBookingStatus(listItem, booking) {
        const bookings = JSON.parse(localStorage.getItem('bookings')) || [];
        const updatedBookings = bookings.map(b => {
            if (b.bookingTime === booking.bookingTime && b.customerMobile === booking.customerMobile) {
                return booking;
            }
            return b;
        });
        localStorage.setItem('bookings', JSON.stringify(updatedBookings));
        listItem.querySelector('span:nth-child(2)').className = booking.status;
        listItem.querySelector('span:nth-child(2)').textContent = booking.status;
    }

    function deleteBooking(listItem, booking) {
        let bookings = JSON.parse(localStorage.getItem('bookings')) || [];
        bookings = bookings.filter(b => !(b.bookingTime === booking.bookingTime && b.customerMobile === booking.customerMobile));
        localStorage.setItem('bookings', JSON.stringify(bookings));
        listItem.remove();
    }

    function loadRegisteredUsers() {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        registeredUsersList.innerHTML = '';
        users.forEach(user => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <span>Username: ${user.username}, City: ${user.city}, Area: ${user.area}, Gender: ${user.gender}</span>
            `;
            registeredUsersList.appendChild(listItem);
        });
    }

    function loadNotBookedUsers() {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const bookings = JSON.parse(localStorage.getItem('bookings')) || [];
        const bookedUserMobiles = bookings.map(booking => booking.customerMobile);
        const notBookedUsers = users.filter(user => !bookedUserMobiles.includes(user.username));

        notBookedUsersList.innerHTML = '';
        notBookedUsers.forEach(user => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <span>Username: ${user.username}, City: ${user.city}, Area: ${user.area}, Gender: ${user.gender}</span>
            `;
            notBookedUsersList.appendChild(listItem);
        });
    }

    function markUserAsBooked(mobile) {
        // Function to mark the user as having booked a slot
        // This is a placeholder; you can use it to update the user status if necessary
    }
});

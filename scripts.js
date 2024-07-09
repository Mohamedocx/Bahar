document.addEventListener('DOMContentLoaded', () => {
    let currentPage = 1;
    const itemsPerPage = 6;

    fetch('http://localhost:3000/products')
        .then(response => response.json())
        .then(data => {
            loadContent(data, currentPage, itemsPerPage);

            document.getElementById('load-more-123').addEventListener('click', () => {
                currentPage++;
                loadContent(data, currentPage, itemsPerPage);
            });
        });

    function loadContent(content, page, itemsPerPage) {
        const contentSection = document.getElementById('content-123');
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const itemsToLoad = content.slice(startIndex, endIndex);

        itemsToLoad.forEach(item => {
            const div = document.createElement('div');
            div.className = 'content-item-123';
            div.innerHTML = `
                <img style="width: 100%; height:250px;"   src="${item.image}" alt="Product Image">
                <div class="content-description-123">
                    <a style="color: brown; text-decoration: none; " href="postdetails.html?id=${item.id}"><h3>${item.title}</h3></a>
                    <a style="color: blue; text-decoration: none;" href="#"><p>${item.publisher}</p></a>
                    <a style="color: green; text-decoration: none;" href="#"><p>${item.category}</p></a>
                    <div class="icons-123">
    
                        <p><img style="width: 20px; height:20px;" src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Circle-icons-calendar.svg/1200px-Circle-icons-calendar.svg.png">${item.date}</p>
                        <p><img style="width: 20px; height:20px;" src="https://cdn-icons-png.flaticon.com/512/10308/10308895.png">${item.location}</p>
                    </div>
                    <p>${item.description}</p>
                </div>
            `;
            contentSection.appendChild(div);
        });
    }
});

// Registration Form Handling
document.getElementById('registration-form-123')?.addEventListener('submit', function(event) {
    event.preventDefault();

    const name = document.getElementById('name-123').value;
    const username = document.getElementById('username-123').value;
    const phone = document.getElementById('phone-123').value;
    const address = document.getElementById('address-123').value;
    const password = document.getElementById('password-123').value;
    const confirmPassword = document.getElementById('confirm-password-123').value;
    const terms = document.getElementById('terms-123').checked;
    const profileImage = document.getElementById('profile-img-upload-123').files[0];
    const bannerImage = document.getElementById('banner-img-upload-123').files[0];

    if (password !== confirmPassword) {
        alert('كلمتا المرور غير متطابقتين');
        return;
    }

    if (!terms) {
        alert('يجب الموافقة على بنود سياسة الموقع');
        return;
    }

    const newUser = {
        name,
        username,
        phone,
        address,
        password,
        socialMedia: [],
        socialMediaLinks: [],
        profileImage: '',
        bannerImage: ''
    };

    if (profileImage) {
        const reader = new FileReader();
        reader.onload = function(e) {
            newUser.profileImage = e.target.result;
            if (bannerImage) {
                const bannerReader = new FileReader();
                bannerReader.onload = function(bannerEvent) {
                    newUser.bannerImage = bannerEvent.target.result;
                    registerUser(newUser);
                };
                bannerReader.readAsDataURL(bannerImage);
            } else {
                registerUser(newUser);
            }
        };
        reader.readAsDataURL(profileImage);
    } else {
        registerUser(newUser);
    }

    function registerUser(user) {
        fetch('http://localhost:3000/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        })
        .then(response => response.json())
        .then(data => {
            alert('تم التسجيل بنجاح');
            localStorage.setItem('userId', data.id);
            window.location.href = 'profile.html';
        })
        .catch(error => {
            console.error('Error:', error);
            alert('حدث خطأ أثناء التسجيل');
        });
    }
});

// Login Form Handling
document.getElementById('login-form-123')?.addEventListener('submit', function(event) {
    event.preventDefault();

    const username = document.getElementById('username-123').value;
    const password = document.getElementById('password-123').value;

    fetch('http://localhost:3000/users')
        .then(response => response.json())
        .then(data => {
            const user = data.find(user => user.username === username && user.password === password);
            if (user) {
                alert('تم تسجيل الدخول بنجاح');
                localStorage.setItem('userId', user.id);
                localStorage.setItem('userRole', user.role); // Store user role
                if (user.role === 'admin') {
                    window.location.href = 'dashboard.html'; // Redirect to dashboard
                } else {
                    window.location.href = 'profile.html'; // Redirect to profile page
                }
            } else {
                alert('اسم المستخدم أو كلمة المرور غير صحيحة');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('حدث خطأ أثناء تسجيل الدخول');
        });
}); 


// User Profile Handling
document.addEventListener('DOMContentLoaded', () => {
    const userId = localStorage.getItem('userId');
    const currentPage = window.location.pathname.split('/').pop();

    if (currentPage === 'profile.html' && !userId) {
        window.location.href = 'login.html';
        return;
    }

    if (userId) {
        const userUrl = `http://localhost:3000/users/${userId}`;

        fetch(userUrl)
            .then(response => response.json())
            .then(user => {
                document.getElementById('username-123').textContent = user.name;
                document.getElementById('posts-123').innerHTML = `
                    <h3>المنشورات</h3>
                    <p>${user.description}</p>
                    <p>${user.address}</p>
                    <p>${user.phone}</p>
                    <p>${user.socialMedia.join(', ')}</p>
                `;
                document.getElementById('profile-img-123').src = user.profileImage;
                document.getElementById('banner-img-123').src = user.bannerImage;
                // Load social media links
                user.socialMediaLinks.forEach(link => {
                    const icon = document.getElementById(`${link.name}-link-123`);
                    if (icon) {
                        icon.href = link.url;
                    }
                });
            })
            .catch(error => {
                console.error('Error fetching user data:', error);
            });

        document.getElementById('social-media-form-123')?.addEventListener('submit', event => {
            event.preventDefault();

            const name = document.getElementById('social-media-name-123').value;
            const link = document.getElementById('social-media-link-123').value;

            fetch(userUrl)
                .then(response => response.json())
                .then(user => {
                    const newLink = { name, url: link };
                    user.socialMediaLinks.push(newLink);

                    return fetch(userUrl, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(user)
                    });
                })
                .then(response => response.json())
                .then(updatedUser => {
                    alert('تمت إضافة الوسيلة بنجاح');
                    document.getElementById('social-media-form-123').reset();
                    const icon = document.getElementById(`${name}-link-123`);
                    if (icon) {
                        icon.href = link;
                    }
                })
                .catch(error => {
                    console.error('Error updating social media links:', error);
                });
        });

        document.getElementById('change-profile-btn-123')?.addEventListener('click', () => {
            document.getElementById('profile-upload-123').click();
        });

        document.getElementById('profile-upload-123')?.addEventListener('change', event => {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = e => {
                    const imgSrc = e.target.result;
                    document.getElementById('profile-img-123').src = imgSrc;

                    fetch(userUrl)
                        .then(response => response.json())
                        .then(user => {
                            user.profileImage = imgSrc;

                            return fetch(userUrl, {
                                method: 'PUT',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify(user)
                            });
                        })
                        .then(response => response.json())
                        .then(updatedUser => {
                            alert('تم تحديث الصورة الشخصية بنجاح');
                        })
                        .catch(error => {
                            console.error('Error updating profile image:', error);
                        });
                };
                reader.readAsDataURL(file);
            }
        });

        document.getElementById('change-banner-btn-123')?.addEventListener('click', () => {
            document.getElementById('banner-upload-123').click();
        });

        document.getElementById('banner-upload-123')?.addEventListener('change', event => {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = e => {
                    const imgSrc = e.target.result;
                    document.getElementById('banner-img-123').src = imgSrc;

                    fetch(userUrl)
                        .then(response => response.json())
                        .then(user => {
                            user.bannerImage = imgSrc;

                            return fetch(userUrl, {
                                method: 'PUT',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify(user)
                            });
                        })
                        .then(response => response.json())
                        .then(updatedUser => {
                            alert('تم تحديث صورة الغلاف بنجاح');
                        })
                        .catch(error => {
                            console.error('Error updating banner image:', error);
                        });
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // Update header on login
    const userIdInLocalStorage = localStorage.getItem('userId');
    if (document.getElementById('site-header-123')) {
        const loginLink = document.getElementById('login-link-123');
        const registerLink = document.getElementById('register-link-123');
        const navLinks = document.getElementById('nav-links-123');

        if (userIdInLocalStorage) {
            loginLink.style.display = 'none';
            registerLink.style.display = 'none';
            const profileLink = document.createElement('li');
            profileLink.innerHTML = `<a href="profile.html">الملف الشخصي</a>`;
            navLinks.appendChild(profileLink);
        } else {
            loginLink.style.display = 'inline-block';
            registerLink.style.display = 'inline-block';
        }
    }
});

// Search Functionality
document.getElementById('search-bar')?.addEventListener('input', function(event) {
    const query = event.target.value.toLowerCase();
    const contentItems = document.querySelectorAll('.content-item-123');

    contentItems.forEach(item => {
        const title = item.querySelector('h3').textContent.toLowerCase();
        const publisher = item.querySelector('p:nth-of-type(1)').textContent.toLowerCase();
        const category = item.querySelector('p:nth-of-type(2)').textContent.toLowerCase();

        if (title.includes(query) || publisher.includes(query) || category.includes(query)) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
});

// Dashboard Functionality
document.addEventListener('DOMContentLoaded', () => {
    const userId = localStorage.getItem('userId');

    if (userId) {
        const userUrl = `http://localhost:3000/users/${userId}`;

        fetch(userUrl)
            .then(response => response.json())
            .then(user => {
                if (user.role === 'admin') {
                    fetch('http://localhost:3000/users')
                        .then(response => response.json())
                        .then(users => {
                            const dashboardContent = document.getElementById('dashboard-content-123');
                            users.forEach(u => {
                                const userDiv = document.createElement('div');
                                userDiv.className = 'user-item-123';
                                userDiv.innerHTML = `
                                    <p>اسم المستخدم: ${u.name}</p>
                                    <p>البريد الإلكتروني: ${u.username}</p>
                                    <p>الدور: ${u.role}</p>
                                    <button class="btn-promote-123" data-id="${u.id}">ترقية</button>
                                    <button class="btn-demote-123" data-id="${u.id}">خفض</button>
                                    <button class="btn-delete-123" data-id="${u.id}">حذف</button>
                                `;
                                dashboardContent.appendChild(userDiv);
                            });

                            document.querySelectorAll('.btn-promote-123').forEach(button => {
                                button.addEventListener('click', function() {
                                    const userIdToUpdate = this.getAttribute('data-id');
                                    updateUserRole(userIdToUpdate, 'editor');
                                });
                            });

                            document.querySelectorAll('.btn-demote-123').forEach(button => {
                                button.addEventListener('click', function() {
                                    const userIdToUpdate = this.getAttribute('data-id');
                                    updateUserRole(userIdToUpdate, 'user');
                                });
                            });

                            document.querySelectorAll('.btn-delete-123').forEach(button => {
                                button.addEventListener('click', function() {
                                    const userIdToDelete = this.getAttribute('data-id');
                                    deleteUser(userIdToDelete);
                                });
                            });
                        })
                        .catch(error => {
                            console.error('Error fetching users:', error);
                        });
                }
            })
            .catch(error => {
                console.error('Error fetching user data:', error);
            });
    }

    function updateUserRole(userId, role) {
        fetch(`http://localhost:3000/users/${userId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ role })
        })
        .then(response => response.json())
        .then(data => {
            alert('تم تحديث الدور بنجاح');
            window.location.reload();
        })
        .catch(error => {
            console.error('Error updating role:', error);
        });
    }

    function deleteUser(userId) {
        fetch(`http://localhost:3000/users/${userId}`, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(data => {
            alert('تم حذف المستخدم بنجاح');
            window.location.reload();
        })
        .catch(error => {
            console.error('Error deleting user:', error);
        });
    }
});
document.addEventListener('DOMContentLoaded', () => {
    const userId = localStorage.getItem('userId');
    const userRole = localStorage.getItem('userRole');

    if (userId) {
        const nav = document.querySelector('header nav ul');
        const logoutLink = document.createElement('li');
        logoutLink.classList.add('log-btn');
        logoutLink.innerHTML = '<a href="#" id="logout-link-123">تسجيل الخروج</a>';
        nav.appendChild(logoutLink);

        document.getElementById('logout-link-123').addEventListener('click', (event) => {
            event.preventDefault();
            localStorage.removeItem('userId');
            localStorage.removeItem('userRole');
            window.location.href = 'index.html';
        });
    }
});
document.addEventListener('DOMContentLoaded', () => {
    const userId = localStorage.getItem('userId');
    const userRole = localStorage.getItem('userRole');
    const currentPage = window.location.pathname.split('/').pop();

    if (currentPage === 'dashboard.html' && userRole !== 'admin') {
        window.location.href = 'login.html';
        return;
    }

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

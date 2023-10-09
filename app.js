const createUserForm = document.getElementById('createUserForm');
const retrieveUsersForm = document.getElementById('retrieveUsersForm');
const updateUserForm = document.getElementById('updateUserForm');
const deleteUserForm = document.getElementById('deleteUserForm');
const userList = document.getElementById('userList');

createUserForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(createUserForm);
    const name = formData.get('name');
    const email = formData.get('email');
    try {
        const response = await fetch('/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email }),
        });
        const newUser = await response.json();
        alert(`User created with ID: ${newUser.id}`);
        createUserForm.reset();
    } catch (error) {
        console.error(error);
        alert('Error creating user');
    }
});

retrieveUsersForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const queryParam = document.getElementById('queryParam').value;
    try {
        const response = await fetch(`/users?queryParam=${queryParam}`);
        const users = await response.json();
        userList.innerHTML = '<h3>Search Results:</h3>';
        if (users.length === 0) {
            userList.innerHTML += 'No users found.';
        } else {
            userList.innerHTML += '<ul>';
            users.forEach((user) => {
                userList.innerHTML += `<li>ID: ${user.id}, Name: ${user.name}, Email: ${user.email}</li>`;
            });
            userList.innerHTML += '</ul>';
        }
    } catch (error) {
        console.error(error);
        userList.innerHTML = 'Error retrieving users';
    }
});

updateUserForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const userId = document.getElementById('updateUserId').value;
    const userName = document.getElementById('updateUserName').value;
    const userEmail = document.getElementById('updateUserEmail').value;
    try {
        const response = await fetch(`/users/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: userName, email: userEmail }),
        });
        const updatedUser = await response.json();
        if (response.status === 200) {
            alert(`User updated: ID: ${updatedUser.id}, Name: ${updatedUser.name}, Email: ${updatedUser.email}`);
            updateUserForm.reset();
        } else if (response.status === 404) {
            alert('User not found');
        } else {
            alert('Error updating user');
        }
    } catch (error) {
        console.error(error);
        alert('Error updating user');
    }
});

deleteUserForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const userIdToDelete = document.getElementById('deleteUserId').value;
    try {
        const response = await fetch(`/users/${userIdToDelete}`, {
            method: 'DELETE',
        });
        if (response.status === 200) {
            alert('User deleted');
            deleteUserForm.reset();
        } else if (response.status === 404) {
            alert('User not found');
        } else {
            alert('Error deleting user');
        }
    } catch (error) {
        console.error(error);
        alert('Error deleting user');
    }
});
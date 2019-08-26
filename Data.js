const API = 'https://acme-users-api-rev.herokuapp.com/api';

const fetchUser = async () => {
    const storage = window.localStorage;
    const userId = storage.getItem('userId');
    if (userId) {
        try {
            return (await axios.get(`${API}/users/detail/${userId}`)).data;
        }
        catch (e) {
            storage.removeItem('userId');
            return fetchUser();
        }
    }
    const user = (await axios.get(`${API}/users/random`)).data;
    storage.setItem('userId', user.id);
    return user;
}

const createVacation = async (userId, vacation) => {
    return (await axios.post(`${API}/users/${userId}/vacations`, vacation)).data
}

const deleteVacation = (userId, vacationId) => {
    axios.delete(`${API}/users/${userId}/vacations/${vacationId}`)
}

const getVacations = async (userId) => {
    return (await axios.get(`${API}/users/${userId}/vacations`)).data
}
const AuthService = {
    getToken() {
        return sessionStorage['token']
    },
    validateSession() {
        return (sessionStorage['token'] == ('' || undefined)) ? false : true

    },
    destroySession() {
        sessionStorage.removeItem("token");
    }
}

export { AuthService };
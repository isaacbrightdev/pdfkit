const checkLoginService = async ({ params }) => {
    //await delay(1000);
    let users = [
        {id: 1, fname: 'Test', lname: 'Test', type: 'bank', email: 'bank@gmail.com', password : 'password'},
    ]
    const exist_user = users.filter(function (item) {
        return item.email === params?.email && item.password === params?.password;
    });
    return exist_user;
     
};

export { checkLoginService };
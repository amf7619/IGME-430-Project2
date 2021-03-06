const handleLogin = (e) => {
    e.preventDefault();
    $('boardMessage').animate({height:'hide'}, 350);

    if($('#user').val() == '' || $('#pass').val() == '') {
        handleMessage('Oops! Username or password is empty');
        return false;
    }

    console.log($('input[name=_csrf]').val());

    sendAjax('POST', $('#loginForm').attr('action'), $('#loginForm').serialize(), redirect);

    return false;
}

const handleSignup = (e) => {
    e.preventDefault();
    $('boardMessage').animate({width:'hide'}, 350);

    if($('#user').val() == '' || $('#pass').val() == '' || $('#pass2').val() == '') {
        handleMessage('Oops! All fields are required');
        return false;
    }

    if($('#pass').val() !== $('#pass2').val()) {
        handleMessage("Oops! Passwords do not match");
        return false;
    }

    sendAjax('POST', $('#signupForm').attr('action'), $('#signupForm').serialize(), redirect);

    return false;
}

const LoginWindow = (props) => {
    return (
        <form id='loginForm' name='loginForm'
            onSubmit={handleLogin}
            action='/login'
            method='POST'
            className='mainForm' >
                
            <label htmlFor='username'>Username: </label>
            <input id='user' type='text' name='username' placeholder='username'/>
            <label htmlFor='pass'>Password: </label>
            <input id='pass' type='password' name='pass' placeholder='password'/>
            <input type='hidden' name='_csrf' value={props.csrf}/>
            <input className="formSubmit" type='submit' value='Sign in'/>
        </form>
    )
}

const SignupWindow = (props) => {
    return (
        <form id='signupForm' 
            name='signupForm'
            onSubmit={handleSignup}
            action='/signup'
            method='POST'
            className='mainForm' >
                
            <label htmlFor='username'>Username: </label>
            <input id='user' type='text' name='username' placeholder='username'/>
            <label htmlFor='pass'>Password: </label>
            <input id='pass' type='password' name='pass' placeholder='password'/>
            <label htmlFor='pass2'>Password: </label>
            <input id='pass2' type='password' name='pass2' placeholder='retype password'/>
            <label htmlFor='rank'>Upgrade to Premium</label>
            <input id='rank' type='button' name='rank' value='Default' onClick={premiumButton}/>
            <input type='hidden' name='_csrf' value={props.csrf}/>
            <input className="formSubmit" type='submit' value='Sign up'/>
        </form>
    )
}

//when the premium button is clicked
const premiumButton = e => {
    e.currentTarget.value = 'Premium';
}

const createLoginWindow = (csrf) => {
    ReactDOM.render(
        <LoginWindow csrf={csrf} />,
        document.querySelector('#content'),
    );
};

const createSignupWindow = (csrf) => {
    ReactDOM.render(
        <SignupWindow csrf={csrf} />,
        document.querySelector('#content'),
    );
};

const setup = (csrf) => {
    const loginButton = document.querySelector('#loginButton');
    const signupButton = document.querySelector('#signupButton');

    signupButton.addEventListener('click', (e) => {
        e.preventDefault();
        createSignupWindow(csrf);
        return false;
    });

    loginButton.addEventListener('click', (e) => {
        e.preventDefault();
        createLoginWindow(csrf);
        return false;
    });

    createLoginWindow(csrf);
}

$(document).ready(function() {
    getToken((result) => {
        setup(result.csrfToken);
    });
});

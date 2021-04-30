
class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            view: 'login'
        };
        this.onLogin = this.onLogin.bind(this);
        this.onGoCreate = this.onGoCreate.bind(this);
        this.onGoLogin = this.onGoLogin.bind(this);
    }

    onLogin() {
        this.setState({
            view: 'main'
        });
    }
    onGoCreate() {
        this.setState({
            view: 'createProfile'
        });
    }
    onGoLogin() {
        this.setState({
            view: 'login'
        });

    }

    render() {
        let component = <Login onLogin={this.onLogin} onGoCreate={this.onGoCreate}/>;
        if (this.state.view == 'main') {
            component = <Main />;
        }
        else if (this.state.view == 'createProfile') {
            component = <ProfileCreate onGoLogin={this.onGoLogin()} />;
        }

        return (
            <div className="app">
                {component}
            </div>
        );
    }
}

class Login extends React.Component {
    sendLoginRequest() {
        let formData = new FormData(document.getElementById('login-form'));
        fetch('/api/login/', {
            method: 'POST',
            body: formData
        })
        .then(result => result.text())
        .then(
            (result) => {
                if (result == 'ok') {
                    this.props.onLogin();
                } else {
                    alert('Bad username/password combo.');
                }
            },
            (error) => {
                alert('General login error');
            }
        );
    }

    render() {
        return (
          <div>
            <form id="login-form">
                <input
                  type="text"
                  name="username"
                  id="username"
                  placeholder="username" />
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="password" />
                <br />
                <button id="login-button" onClick={(evt) => {
                    evt.preventDefault();
                    this.sendLoginRequest();
                }}>Login</button>
            </form>
            <p onClick={() => {
                  this.props.onGoCreate()  }}> 
                No profile? Make one here! </p>
          </div>
        );
    }
}

class ProfileCreate extends React.Component {
    sendLoginRequest() {
        let formData = new FormData(document.getElementById('profile-form'));
        fetch('/api/create-profile/', {
            method: 'POST',
            body: formData
        })
        .then(result => result.text())
        .then(
            (result) => {
                if (result == 'ok') {
                    this.props.onLogin();
                } else {
                    alert('Bad username/password combo.');
                }
            },
            (error) => {
                alert('General login error');
            }
        );
    }

    render() {
        return (
          <div>
            <form id="profile-form">
                <input
                  type="text"
                  name="email"
                  id="email"
                  placeholder="email" />
                <input
                  type="text"
                  name="username"
                  id="username"
                  placeholder="username" />
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="password" />
                <br />
                <button id="create-button" onClick={(evt) => {
                    evt.preventDefault();
                    this.sendLoginRequest();
                }}>Create Profile</button>
            </form>

            <p onClick={() => {
                  this.props.onGoLogin()  }}> 
                Go back to login! </p>

          </div>
        );
    }
}

class Main extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            avengers: [],
            isLoaded: false,
            error: null 
        };
    }
/*
    componentDidMount() {
        fetch('/api/main/')
        .then(result => result.json())
        .then(
            (result) => {
                this.setState({
                    isLoaded: true,
                    avengers: result
                });                
            },
            (error) => {
                this.setState({
                    isLoaded: true,
                    error: error
                });
            }
        );
    }
*/
    render() {
        <p> reservations go here! </p>
    }
}

ReactDOM.render(<App />, document.querySelector('#content'));


class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            view: 'login'
        };
        this.onLogin = this.onLogin.bind(this);
        this.onGoCreate = this.onGoCreate.bind(this);
        this.onGoLogin = this.onGoLogin.bind(this);
        this.checkReservations = this.checkReservations.bind(this);
        this.onLogout = this.onLogout.bind(this);
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
    onLogout() {
        this.setState({
            view: 'login'
        });
        fetch('/api/logout/', {
            method: 'GET',
        })
    }
    checkReservations() {
        alert("checking reservations now (FIXME)");
        /*
        /api/refresh/
        /api/get-reserve/
        */
    }

    render() {
        let component = <Login onLogin={this.onLogin} onGoCreate={this.onGoCreate}/>;
        if (this.state.view == 'main') {
            component = <Main checkReservations={this.checkReservations} onLogout={this.onLogout}/>;
        }
        else if (this.state.view == 'createProfile') {
            component = <ProfileCreate onGoLogin={this.onGoLogin} />;
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

            <a href="#" onClick={(evt) => {
                  evt.preventDefault();
                  this.props.onGoCreate();  }}> 
                No profile? Make one here! </a>

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
                    this.props.onGoLogin();
                } else {
                    alert('Cannot create profile right now.');
                }
            },
            (error) => {
                alert('General error');
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

            <a href="#" onClick={(evt) => {
                  evt.preventDefault();
                  this.props.onGoLogin();  }}> 
                Go back to login! </a>

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

    sendReserveRequest() {
        let formData = new FormData(document.getElementById('HPC-Form'));
        fetch('/api/store-reserve/', {
            method: 'POST',
            body: formData
        })
        .then(result => result.text())
        .then(
            (result) => {
                if (result == 'ok') {
                    alert('computer reserved');
                    //this.props.onGoLogin();
                } else {
                    alert('Cannot reserve right now.');
                }
            },
            (error) => {
                alert('General error');
            }
        );


    }


    componentDidMount() {
        setInterval(this.props.checkReservations(), 30000);
    }

    render() {
        return(
        <div>
           <h1 className="text-center">Welcome to the HPC room</h1>
    
            <a href="#" onClick={(evt) => {
                  evt.preventDefault();
                  this.props.onLogout(); }}> 
                Logout </a>

        <div id="HPC-Containers">
            <div className="row Computer-row mx-auto">
                <div className="col-xl-2 panel-left rounded Computer" computerid="1">
                    <h1 className="Computer-head text-center">HPC-1</h1>
                    <img className="computer-img rounded mx-auto" src="{{ url_for('static', filename='img/HPC-green.png') }}" />
                    <h2 id="Status-1" className="text-center" text-color="#228B22">Available</h2>
                    <h5 id="ReserveText-1" className="Reservation text-center" >Reserved by:</h5>
                    <p id="ReserveName-1" className="RnameP text-center" ></p>
                </div>
                <div className="col-xl-2 panel rounded Computer" computerid="2">
                    <h1 className="Computer-head text-center">HPC-2</h1>
                    <img className="computer-img rounded mx-auto" src="{{ url_for('static', filename='img/HPC-red-x.png') }}" />
                    <h2 id="Status-2" className="text-center" text-color="#228B22">Reserved</h2>
                    <h5 id="ReserveText-2" className="Reservation text-center">Reserved by:</h5>
                    <p id="ReserveName-2" className="RnameP text-center">Kevin Bacon</p>
                </div>
                <div className="col-xl-2 panel rounded Computer" computerid="3">
                    <h1 className="Computer-head text-center">HPC-3</h1>
                    <img className="computer-img rounded mx-auto" src="{{ url_for('static', filename='img/HPC-green.png') }}" />
                    <h2 id="Status-3" className="text-center" text-color="#228B22">Available</h2>
                    <h5 id="ReserveText-3" className="Reservation text-center" >Reserved by:</h5>
                    <p id="ReserveName-3" className="RnameP text-center" ></p>
                
                </div>
                <div className="col-xl-2 panel rounded Computer" computerid="4">
                    <h1 className="Computer-head text-center">HPC-4</h1>
                    <img className="computer-img rounded mx-auto" src="{{ url_for('static', filename='img/HPC-green.png') }}" />
                    <h2 id="Status-4" className="text-center" text-color="#228B22">Available</h2>
                    <h5 id="ReserveText-4" className="Reservation text-center" >Reserved by:</h5>
                    <p id="ReserveName-4" className="RnameP text-center" ></p>
                </div>
            </div>
            <div className="row Computer-row mx-auto">
                <div className="col-xl-2 panel-left rounded Computer" computerid="5">
                    <h1 className="Computer-head text-center">HPC-5</h1>
                    <img className="computer-img rounded mx-auto" src="{{ url_for('static', filename='img/HPC-green.png') }}" />
                    <h2 id="Status-5" className="text-center" text-color="#228B22">Available</h2>
                    <h5 id="ReserveText-5" className="Reservation text-center" >Reserved by:</h5>
                    <p id="ReserveName-5" className="RnameP text-center" ></p>
                </div>
                <div className="col-xl-2 panel rounded Computer" computerid="6">
                    <h1 className="Computer-head text-center">HPC-6</h1>
                    <img className="computer-img rounded mx-auto" src="{{ url_for('static', filename='img/HPC-red-x.png') }}" />
                    <h2 id="Status-6" className="text-center" text-color="#228B22">Reserved</h2>
                    <h5 id="ReserveText-6" className="Reservation text-center">Reserved by:</h5>
                    <p id="ReserveName-6" className="RnameP text-center">Duolingo Bird</p>
                </div>
                <div className="col-xl-2 panel rounded Computer" computerid="7">
                    <h1 className="Computer-head text-center">HPC-7</h1>
                    <img className="computer-img rounded mx-auto" src="{{ url_for('static', filename='img/HPC-green.png') }}" />
                    <h2 id="Status-7" className="text-center" text-color="#228B22">Available</h2>
                    <h5 id="ReserveText-7" className="Reservation text-center" >Reserved by:</h5>
                    <p id="ReserveName-7" className="RnameP text-center" ></p>
                
                </div>
                <div className="col-xl-2 panel rounded Computer" computerid="8">
                    <h1 className="Computer-head text-center">HPC-8</h1>
                    <img className="computer-img rounded mx-auto" src="{{ url_for('static', filename='img/HPC-green.png') }}" />
                    <h2 id="Status-8" className="text-center" text-color="#228B22">Available</h2>
                    <h5 id="ReserveText-8" className="Reservation text-center" >Reserved by:</h5>
                    <p id="ReserveName-8" className="RnameP text-center" ></p>
                </div>
            </div>
        </div>
        <div id="form-div">
p
            <div className="row mx-auto justify-content-center">
                <div className="col-xl-3 panel rounded">
                <form id="HPC-Form">
                    <div className="form-group">
                        <label className="text-center" htmlFor="hpc_id">HPC ID</label>
                        <select className="form-control" id="hpc_id" name="hpc_id">
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                            <option value="6">6</option>
                            <option value="7">7</option>
                            <option value="8">8</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label className="text-center"htmlFor="time"># of hours on rental</label>
                        <select className="form-control" id="time" name="time">
                            <option value="2">2 hours</option>
                            <option value="4">4 hours</option>
                            <option value="12">12 hours</option>
                            <option value="24">24 hours</option>
                        </select>
                    </div>
                     <button className="btn btn-primary rent-btn text-center" onClick={(evt) => {
                                evt.preventDefault();
                                this.sendReserveRequest(); 
                              }}>
                        Reserve
                    </button>
                </form>
            </div>
        </div>
        </div>
        </div>
        );
    }
}

ReactDOM.render(<App />, document.querySelector('#content'));

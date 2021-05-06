
class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            view: 'login',
            time: Date.now() 
        };
        this.onLogin = this.onLogin.bind(this);
        this.onGoCreate = this.onGoCreate.bind(this);
        this.onGoLogin = this.onGoLogin.bind(this);
        this.checkReservations = this.checkReservations.bind(this);
        this.onLogout = this.onLogout.bind(this);
        this.isAvailable = this.isAvailable.bind(this);
        this.reserverName = this.reserverName.bind(this);
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
        fetch('/api/refresh/', {
            method: 'Get',
        })
        this.setState({
            time: Date.now()
        });
    }
    isAvailable(compId) {
        //let data = {'id': compId};
        let data = compId;
        fetch('/api/get-reserve/', {
            method: 'GET',
            body: data
        })
        .then(result => result.text())
        .then(
            (result) => {
                if(result == "none") {
                    return "Available";
                }
                else {
                    return "Reserved";
                }
            },
            (error) => {
                alert('General available error');
            }
        );
        return "";
        
    }
    reserverName(compId) {
        //let data = {'id': compId};
        let data = compId;
        fetch('/api/get-reserve/', {
            method: 'GET',
            body: data
        })
        .then(result => result.text())
        .then(
            (result) => {
                if (result == "none") {
                    return "";
                }
                else {
                    return result;
                }
            },
            (error) => {
                alert('General reserver error');
            }
        );
        return "";
    }


    render() {
        let component = <Login onLogin={this.onLogin} onGoCreate={this.onGoCreate}/>;
        if (this.state.view == 'main') {
            component = <Main checkReservations={this.checkReservations} onLogout={this.onLogout}
                                isAvailable={this.isAvailable} reserverName={this.reserverName} />;
        }
        else if (this.state.view == 'createProfile') {
            component = <ProfileCreate onGoLogin={this.onGoLogin} />;
        }

        return (
            <body className="app body">
                {component}
            </body>
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
              <div className="form-group col-md-3">
                <input
                  type="text"
                  className="form-control"
                  name="username"
                  id="username"
                  placeholder="username" />
              </div>
              <div className="form-group col-md-3">
                <input
                  type="password"
                  className="form-control"
                  name="password"
                  id="password"
                  placeholder="password" />
              </div>
                <br />
                <button className="btn btn-primary" id="login-button" onClick={(evt) => {
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
                alert('General creation error');
            }
        );
    }

    render() {
        return (
          <div>
            <form id="profile-form">
              <div className="form-group col-md-3">
                <input
                  className="form-control"
                  type="text"
                  name="email"
                  id="email"
                  placeholder="email" />
              </div>
              <div className="form-group col-md-3">
                <input
                  className="form-control"
                  type="text"
                  name="username"
                  id="username"
                  placeholder="username" />
              </div>
              <div className="form-group col-md-3">
                <input
                  className="form-control"
                  type="password"
                  name="password"
                  id="password"
                  placeholder="password" />
              </div>
                <br />
                <button className="btn btn-primary" id="create-button" onClick={(evt) => {
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
                } else {
                    alert('Cannot reserve right now.');
                }
            },
            (error) => {
                alert('General store error');
            }
        );
    }

    sendCancelRequest() {
        let formData = new FormData(document.getElementById('Cancel-Form'));
        fetch('/api/cancel-reserve/', {
            method: 'POST',
            body: formData
        })
        .then(result => result.text())
        .then(
            (result) => {
                if (result == 'ok') {
                    alert('reservation cancelled');
                } else {
                    alert('Cancel Error');
                }
            },
            (error) => {
                alert('General cancel error');
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
                    <h2 id="Status-1" className="text-center" text-color="#228B22"> {this.props.isAvailable("1")} </h2>
                    <h5 id="ReserveText-1" className="Reservation text-center" >Reserved by:</h5>
                    <p id="ReserveName-1" className="RnameP text-center" > {this.props.reserverName("1")}  </p>
                </div>
                <div className="col-xl-2 panel rounded Computer" computerid="2">
                    <h1 className="Computer-head text-center">HPC-2</h1>
                    <img className="computer-img rounded mx-auto" src="{{ url_for('static', filename='img/HPC-red-x.png') }}" />
                    <h2 id="Status-2" className="text-center" text-color="#228B22"> {this.props.isAvailable("2")} </h2>
                    <h5 id="ReserveText-2" className="Reservation text-center">Reserved by:</h5>
                    <p id="ReserveName-2" className="RnameP text-center"> {this.props.reserverName("2")} </p>
                </div>
                <div className="col-xl-2 panel rounded Computer" computerid="3">
                    <h1 className="Computer-head text-center">HPC-3</h1>
                    <img className="computer-img rounded mx-auto" src="{{ url_for('static', filename='img/HPC-green.png') }}" />
                    <h2 id="Status-3" className="text-center" text-color="#228B22"> {this.props.isAvailable("3")} </h2>
                    <h5 id="ReserveText-3" className="Reservation text-center" >Reserved by:</h5>
                    <p id="ReserveName-3" className="RnameP text-center" > {this.props.reserverName("3")} </p>
                
                </div>
                <div className="col-xl-2 panel rounded Computer" computerid="4">
                    <h1 className="Computer-head text-center">HPC-4</h1>
                    <img className="computer-img rounded mx-auto" src="{{ url_for('static', filename='img/HPC-green.png') }}" />
                    <h2 id="Status-4" className="text-center" text-color="#228B22"> {this.props.isAvailable("4")} </h2>
                    <h5 id="ReserveText-4" className="Reservation text-center" >Reserved by:</h5>
                    <p id="ReserveName-4" className="RnameP text-center" > {this.props.reserverName("4")} </p>
                </div>
            </div>
            <div className="row Computer-row mx-auto">
                <div className="col-xl-2 panel-left rounded Computer" computerid="5">
                    <h1 className="Computer-head text-center">HPC-5</h1>
                    <img className="computer-img rounded mx-auto" src="{{ url_for('static', filename='img/HPC-green.png') }}" />
                    <h2 id="Status-5" className="text-center" text-color="#228B22"> {this.props.isAvailable("5")} </h2>
                    <h5 id="ReserveText-5" className="Reservation text-center" >Reserved by:</h5>
                    <p id="ReserveName-5" className="RnameP text-center" > {this.props.reserverName("5")} </p>
                </div>
                <div className="col-xl-2 panel rounded Computer" computerid="6">
                    <h1 className="Computer-head text-center">HPC-6</h1>
                    <img className="computer-img rounded mx-auto" src="{{ url_for('static', filename='img/HPC-red-x.png') }}" />
                    <h2 id="Status-6" className="text-center" text-color="#228B22"> {this.props.isAvailable("6")} </h2>
                    <h5 id="ReserveText-6" className="Reservation text-center">Reserved by:</h5>
                    <p id="ReserveName-6" className="RnameP text-center"> {this.props.reserverName("6")} </p>
                </div>
                <div className="col-xl-2 panel rounded Computer" computerid="7">
                    <h1 className="Computer-head text-center">HPC-7</h1>
                    <img className="computer-img rounded mx-auto" src="{{ url_for('static', filename='img/HPC-green.png') }}" />
                    <h2 id="Status-7" className="text-center" text-color="#228B22"> {this.props.isAvailable("7")} </h2>
                    <h5 id="ReserveText-7" className="Reservation text-center" >Reserved by:</h5>
                    <p id="ReserveName-7" className="RnameP text-center" > {this.props.reserverName("7")} </p>
                
                </div>
                <div className="col-xl-2 panel rounded Computer" computerid="8">
                    <h1 className="Computer-head text-center">HPC-8</h1>
                    <img className="computer-img rounded mx-auto" src="{{ url_for('static', filename='img/HPC-green.png') }}" />
                    <h2 id="Status-8" className="text-center" text-color="#228B22"> {this.props.isAvailable("8")} </h2>
                    <h5 id="ReserveText-8" className="Reservation text-center" >Reserved by:</h5>
                    <p id="ReserveName-8" className="RnameP text-center" > {this.props.reserverName("8")} </p>
                </div>
            </div>
        </div>

        <div id="form-div">
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

      <div id="form-div">
            <div className="row mx-auto justify-content-center">
                <div className="col-xl-3 panel rounded">
                <form id="Cancel-Form">
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
                     <button className="btn btn-primary rent-btn text-center" onClick={(evt) => {
                                evt.preventDefault();
                                this.cancelReserveRequest(); 
                              }}>
                        Cancel Reserve
                    </button>
                </form>
            </div>
        </div>
        </div>
        </div>
        </div>
        );
    }
}

ReactDOM.render(<App />, document.querySelector('#content'));

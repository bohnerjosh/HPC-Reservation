# Don't call this flask.py!
# Documentation for Flask can be found at:
# https://flask.palletsprojects.com/en/1.1.x/quickstart/

from flask import Flask, render_template, request, session, redirect, url_for, jsonify, abort
from flask_sqlalchemy import SQLAlchemy
import os 
import datetime

app = Flask(__name__)
app.secret_key = b'REPLACE_ME_x#pi*CO0@^z'

sqlite_uri = 'sqlite:///' + os.path.abspath(os.path.curdir) + '/test.db'
app.config['SQLALCHEMY_DATABASE_URI'] = sqlite_uri
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

from models import User, Reserved 

@app.before_first_request
def app_init():
    try:
        User.query.all()

    except:
        db.create_all()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/cancel-reserve/', methods=['POST'])
def cancel_reserve():
    compID = request.args.get('thing') # CHANGE THIS
    user_session = session['username']
    username = Reserved.query.get(compID).username
    if username:
        if username == user_session:
            to_delete = Reserved.query.get(compID)
            db.session.delete(to_delete)
            db.session.commit()
        else:
            return 'machine not rented by user'
    else:
        return 'machine not rented by user'
             

@app.route('/api/login/', methods=['POST'])
def login():
    inuser = request.form['username']
    inpw = request.form['password']
    message = ""
    usermatch = User.query.filter_by(username=inuser, password=inpw).first()
    try:
        if usermatch.username == inuser and usermatch.password == inpw:
            session['username'] = usermatch.username

            return "ok"
        else:
        
            message = "Invalid username/password combination."
            return "not ok"
    except:
        message = "Invalid username/password combination."
    return "ok"

@app.route('/api/create-profile/', methods=['POST'])
def create_profile():
    showerror = False
    message = ""
    inuser = request.form['username']
    usermatch = User.query.filter_by(username=inuser).first()
    try:
        if usermatch.username == inuser:
            showerror = True
            message = "Could not create profile: that username is already taken."
    except:
        message = ""

    inemail = request.form['email']
    inpw = request.form['password']
    
    if inuser == "":
        showerror = True
        message = "Username cannot be blank."
    elif inemail == "":
        showerror = True
        message = "Email cannot be blank."
    elif inpw == "":
        showerror = True
        message = "Password cannot be blank."
    
    if showerror:
        return "not ok"

    p = User(username=inuser, password=inpw, email=inemail)
    db.session.add(p)
    db.session.commit() 

    return "ok"

@app.route('/api/refresh/', methods=['GET'])
def refresh():
    # check all the hpc machines to see if they need to be released
    return 'ok'

@app.route('/api/logout/', methods=['GET'])
def logout():
    del session['username']
    return 'ok'

@app.route('/api/store-reserve/', methods=['POST'])
def store_reserve():
    # getting form data
    in_id = request.form['hpc_id']
    user = session['username']
    in_time = request.form['time']
    checkout = str(datetime.time.now())
    check = Reserved.query.get(in_id).username
    if not check:
        R = Reserved(HPC_id=in_id, username = user, checkout_time = checkout, checkout_length = in_time)
        db.session.add(R)
        db.session.commit()
        return 'ok'

    else:
        return 'This machine is already reserved'

@app.route('/api/get-reserve/', methods=['GET'])
def get_reserve():
    # being passed the ID of the computer, get the username of the person that reserved it
    compID = request.args.get('thing') # CHANGE THIS WHEN IT GETS ASSIGNED
    username = Reserved.query.get(compID).username
    if username:
        return username
    else:
        return 'none'

@app.route('/test/', methods=['GET'])
def test():
    return render_template('test.html')

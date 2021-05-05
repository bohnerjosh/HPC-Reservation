# Set up the DB using the following commands:
# $ python
# > from appserver import db
# > db.create_all()
# > from models import User
# > admin = User(username='admin', email='admin@example.com')
# > db.session.add(admin)
# > db.session.commit()
# > User.query.all()

from appserver import db                                                        

# Example class
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(16), unique=True, nullable=False)
    password = db.Column(db.String(16), unique=False, nullable=False)
    email = db.Column(db.String(80), unique=False, nullable=False)
    def __repr__(self):
        return '<User %r>' % self.username
        
        
    def serialize(self):
        return {
            'id': self.id,
            'username': self.username,
            'password': self.password,
            'email': self.email,
        }
class Reserved(db.model):
    HPC_id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(16), unique=False, nullable=False)
    checkout_time  = db.Column(db.String(16), unique=False, nullable=False)
    checkout_length = db.Column(db.String(16), unique=False, nullable=False)
    def __repr__(self):
        return '<User %r>' % self.username
        
    def serialize(self):
        return {
            'HPC_id': self.HPC_id,
            'username': self.username,
            'checkout_time': self.checkout_time,
            'checkout_length': self.checkout_length,
        }

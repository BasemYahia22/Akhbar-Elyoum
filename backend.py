from flask import Flask , render_template,request,redirect,url_for,flash,session,jsonify
from flask_session import Session
from flask_mail import Message
from flask_mail import Mail
from werkzeug.utils import secure_filename
from random import randint
from datetime import datetime
import os
import time
from flask_socketio import SocketIO, emit
from database_files.users import Users 
# from professor import Professors
# from admin import Admins

# Ensure you have the necessary upload folder and allowed extensions defined
UPLOAD_FOLDER = 'static/uploads'
ALLOWED_EXTENSIONS = {'pdf'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

app = Flask('app')
mail=Mail(app)
app.config['MAX_CONTENT_LENGTH'] = 1024 * 1024
app.config['UPLOAD_EXTENSIONS'] = ['.jpg', '.png', '.gif']
app.config['UPLOAD_PATH'] = 'static/uploads/img'

socketio = SocketIO(app)
app.config['MAIL_SERVER']='smtp.gmail.com'
app.config["MAIL_PORT"]=465
app.config["MAIL_USERNAME"]='commerce4848@gmail.com'
app.config['MAIL_PASSWORD']='tcscpfzcklmxzgvw' #you have to give your password of gmail account
app.config['MAIL_USE_TLS']=False
app.config['MAIL_USE_SSL']=True


mail.init_app(app)
otp=randint(000000,999999)
app.secret_key = b'_5#y2L"F4Q8z\n\xec]/'
SESSION_TYPE='filesystem'
app.config.from_object(__name__)
Session(app)


UPLOAD_FOLDER = 'static/uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # Maximum file size (16 MB)
def allowed_file(filename):
    ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS
# Ensure the upload folder exists
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


@app.route('/', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']
        usertype = request.form['userType']
        stdObj = Users(Email=email,PasswordHash=password , UserType= usertype)
        profObj = Users(Email=email,PasswordHash=password , UserType= usertype)
        adminObj = Users(Email=email,PasswordHash=password ,  UserType= usertype)

        success, std_id, message = stdObj.login()
        if success:
            session['emailUser'] = email
            session['idUser'] = std_id
            stdList =stdObj.set_data()
            session['appUser'] = stdObj
            session['stdList']=stdList
            if stdList[0]['status'] == 1 : 
                return " your Account Closed , Please Contact Admin !"
            else : 
                return {"session" : session , "student_data" : stdObj.get_user_data()}
        
        elif len(adminObj.get_user_data()):
            session['emailUser'] = email
            session['idUser'] = std_id
            admList=adminObj.set_data() 
            session['appUser'] = adminObj
            session['admList']=admList
            if admList[0]['status'] == 1 : 
                return " your Account Closed , Please Contact Admin !"
            else :             
                return redirect(url_for("admin_homepage"))
        
        elif len(profObj.get_user_data()):
            # Store admin's email in session upon successful login
            session['emailUser'] = email
            session['idUser'] = std_id
            proflist=profObj.set_data() 
            session['appUser'] = profObj
            session['proflist']=proflist
            if proflist[0]['status'] == 1 : 
                return " your Account Closed , Please Contact Admin !"
            else :                
                return redirect(url_for("prof_homepage"))
        else:
            return {"error in user"}
    else:
        return {"error in login"}


@app.route('/student_homepage')
def student_homepage() : 
    # std_data = session['stdList']
    stdobj = Users()
    data = stdobj.get_user_data()
    return {"std_data" : data}


@app.route('/prof_homepage')
def prof_homepage() : 
    return "Wellcome to prof "

@app.route('/admin_homepage')
def admin_homepage() : 
    return {"Wellcome to admin "}



if __name__ == '__main__':
  app.run(host='0.0.0.0', port=5000 , debug=True)
     



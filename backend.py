from flask import Flask , render_template,request,redirect,url_for,flash,session,jsonify ,send_from_directory
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
from database_files.courses import Courses 
from database_files.course_regestriation import CourseRegistrations 
from database_files.grades import Grades  
from database_files.students import Students
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


from flask import jsonify  # Import jsonify to return proper JSON responses

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        data = request.get_json()
        if not data:
            return jsonify({"error": "No data provided"}), 400  # Return error if no data is provided

        email = data.get('email')
        password = data.get('password')
        user_type = data.get('usertype')

        if not email or not password or not user_type:
            return jsonify({"error": "Missing email, password, or usertype"}), 400  # Validate input

        # Create a user object based on the provided credentials
        userObj = Users(Email=email, PasswordHash=password, UserType=user_type)
        
        # Attempt to log in the user
        success, user_id, message = userObj.login(email, password)
        print(f"success: {success}, user_id: {user_id}, message: {message}")
        
        if not success  :
            return jsonify({"email" : email , "message" : message}), 400  # Validate input


        # Handle different user types
        if user_type.lower() == "student":
            if  success :   
                userList = userObj.set_data()
                if not userList or userList[0]['status'] == 1:
                    return jsonify({"result": "No", "message": "Your account is closed. Please contact the admin!"}), 403

                # Set session variables
                session['emailUser'] = email
                session['idUser'] = user_id
                session['appUser'] = userObj
                session['stdList'] = userList

                return jsonify({"result": "Yes", "email": email, "usertype": user_type})

        elif user_type.lower() == "admin":
            userList = userObj.set_data()
            if not userList or userList[0]['status'] == 1:
                return jsonify({"result": "No", "message": "Your account is closed. Please contact the admin!"}), 403

            # Set session variables
            session['emailUser'] = email
            session['idUser'] = user_id
            session['appUser'] = userObj
            session['adminList'] = userList

            return jsonify({"result": "Yes", "email": email, "usertype": user_type})

        elif user_type.lower() == "professor":
            userList = userObj.set_data()
            if not userList or userList[0]['status'] == 1:
                return jsonify({"result": "No", "message": "Your account is closed. Please contact the admin!"}), 403

            # Set session variables
            session['emailUser'] = email
            session['idUser'] = user_id
            session['appUser'] = userObj
            session['profList'] = userList

            return jsonify({"result": "Yes", "email": email, "usertype": user_type})

        else:
            return jsonify({"result": "No", "message": "Invalid user type"}), 400  # Handle invalid user types

    else:
        return jsonify({"error": "Invalid request method"}), 405  # Handle non-POST requests
    
    
    
#############################################################################
# ********************* Users **********************
#############################################################################

@app.route('/student_homepage')
def student_homepage():
    std_data = session['stdList']
    stdobj = Users(UserID=std_data[0]['UserID'])
    data = stdobj.get_user_data()
    courseregObj = CourseRegistrations(StudentID=std_data[0]['UserID'])
    couse_reg_data = courseregObj.get_registration_data()
    gradesObj = Grades(StudentID=std_data[0]['UserID'])
    grades_data = gradesObj.get_grade_data()

    stdjobg = Students(StudentID = data[0]['UserID'])
    sutd_data = stdjobg.get_student_data()
    
    # Get all unique CourseIDs from course registration data
    registered_course_ids = list({reg['CourseID'] for reg in couse_reg_data})

    # Fetch course data for all registered courses
    course_data = []
    for course_id in registered_course_ids:
        courseObj = Courses(CourseID=course_id)
        course_data.extend(courseObj.get_course_data())

    # Calculate total credit hours
    total_credit_hours = sum(course['CreditHours'] for course in course_data)
    
    # Extract required fields for grades
    response_data = []
    for grade in grades_data:
        course_id = grade['CourseID']
        course_info = next((course for course in course_data if course['CourseID'] == course_id), None)
        if course_info:
            response_data.append({
                "CourseName": course_info['CourseName'],
                "CourseCode": course_info['CourseCode'],
                "pass_status": grade['pass_status'],
                "Total grades": grade['total_degree'],
                "Grade": grade['Grade'],
                "points": grade['points'],
                "Semester": grade['Semester']
            })

    return {
        "response_data": response_data,
        "total_credit_hours": total_credit_hours,
        "std data" : sutd_data
    }







#############################################################################
@app.route('/prof_homepage')
def prof_homepage() : 
    return "Wellcome to prof "

@app.route('/admin_homepage')
def admin_homepage() : 
    return {"Wellcome to admin "}



if __name__ == '__main__':
  app.run(host='0.0.0.0', port=5000 , debug=True)
     



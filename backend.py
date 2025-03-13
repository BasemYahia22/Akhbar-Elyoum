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
from database_files.semesters import Semesters
from database_files.Review import Review 
from database_files.notification import Notifications

from database_files.subjects_study import SubjectsStudy
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


# Dashboard Page 
#*************************
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
    
    subs_studyObj = SubjectsStudy()
    subs_std_data = subs_studyObj.get_subject_data()
    
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
        "total_credit_hours": total_credit_hours , 
        "student_data" : sutd_data ,
        "subjects_link" : subs_std_data
    }


# Register Page 
#*************************
@app.route('/student_regisiter_course')
def student_regisiter_course():
    std_data = session['stdList']
    stdobj = Users(UserID=std_data[0]['UserID'])
    data = stdobj.get_user_data()
    courseregObj = CourseRegistrations(StudentID=std_data[0]['UserID'])
    couse_reg_data = courseregObj.get_registration_data()
    
    stdjobg = Students(StudentID = data[0]['UserID'])
    sutd_data = stdjobg.get_student_data()
    
    semester_obj = Semesters(student_id=std_data[0]['UserID'])
    semester_data =semester_obj.get_semester_data() 
    # Get all unique CourseIDs from course registration data
    registered_course_ids = list({reg['CourseID'] for reg in couse_reg_data})

    # Fetch course data for all registered courses
    course_data = []
    for course_id in registered_course_ids:
        courseObj = Courses(CourseID=course_id)
        course_data.extend(courseObj.get_course_data())

    # Calculate total credit hours
    total_credit_hours = sum(course['CreditHours'] for course in course_data)
    
    return {
        "course_data" : course_data,
        "total_credit_hours": total_credit_hours , 
        "student_data" : sutd_data ,
        "semester_data_hours" : semester_data
    }


# Courses Page 
#*************************
@app.route('/student_courses')
def get_student_grades_and_courses():
    # Initialize objects
    std_data = session['stdList']
    student_id = std_data[0]['UserID']
    # stdobj = Users(UserID=std_data[0]['UserID'])
    # data = stdobj.get_user_data()
    # courseregObj = CourseRegistrations(StudentID=std_data[0]['UserID'])
    # couse_reg_data = courseregObj.get_registration_data()
    
    # stdjobg = Students(StudentID = data[0]['UserID'])
    # sutd_data = stdjobg.get_student_data()
    
    # semester_obj = Semesters(student_id=std_data[0]['UserID'])
    # semester_data =semester_obj.get_semester_data() 
    stdobj = Users(UserID=student_id)
    courseregObj = CourseRegistrations(StudentID=student_id)
    stdjobg = Students(StudentID=student_id)
    semester_obj = Semesters(student_id=student_id)

    # Fetch student data
    student_data = stdobj.get_user_data()
    if not student_data:
        return {"error": "Student not found"}

    # Fetch course registration data
    couse_reg_data = courseregObj.get_registration_data()
    if not couse_reg_data:
        return {"error": "No courses registered for this student"}

    # Fetch semester data
    semester_data = semester_obj.get_semester_data()

    # Get all unique CourseIDs from course registration data
    registered_course_ids = list({reg['CourseID'] for reg in couse_reg_data})

    # Fetch course data and grades for each course
    result = {
        "student_id": student_id,
        "student_name": student_data[0].get("Name", ""),  # Assuming 'Name' is a field in the student data
        "courses": []
    }

    for course_id in registered_course_ids:
        # Fetch course data
        courseObj = Courses(CourseID=course_id)
        course_data = courseObj.get_course_data()
        if not course_data:
            continue

        # Fetch grades for the course
        gradesObj = Grades(StudentID=student_id, CourseID=course_id)
        grades_data = gradesObj.get_grade_data()

        # Organize course and grades data
        course_info = {
            "course_id": course_id,
            "course_name": course_data[0].get("CourseName", ""),  # Assuming 'CourseName' is a field in the course data
            "grades": {
                "midterm_grade": grades_data[0].get("MidtermGrade", None),
                "assignment_grade": grades_data[0].get("AssignmentGrade", None),
                "final_grade": grades_data[0].get("FinalGrade", None),
                "total_degree": grades_data[0].get("total_degree", None),
                "points": grades_data[0].get("points", None)
            }
        }

        # Add course info to the result
        result["courses"].append(course_info)

    return result


@app.route('/submit_review', methods=['POST'])
def submit_review():
    # Get JSON data from the client
    data = request.json
    # Initialize objects
    std_data = session['stdList']
    student_id = std_data[0]['UserID']
    # Extract fields from the request
    prof_email = data.get('prof_email')
    review_title = data.get('review_title')
    review_text = data.get('review_text')
    grade = data.get('grade')
    # student_id = data.get('student_id')  # Assuming the student ID is also provided

    # Validate required fields
    if not all([prof_email, review_title, review_text, grade]):
        return jsonify({"error": "Missing required fields"}), 400

    # Save the review to the database
    try:
        review = Review(
            studentID=student_id,
            review_title=review_title,
            email_prof=prof_email,
            review_text=review_text,
            grade = grade
        )
        review.add_review()
        notification_message = f"Your review for {prof_email} has been submitted successfully."
        notification = Notifications(
            UserID=student_id,
            Message=notification_message,
            IsRead=False,
            SentAt=prof_email
        )
        notification.add_notification()
        # Optionally, you can save the grade in another table (e.g., Grades)
        # For now, we'll assume the grade is part of the review.

        # Return a success response
        return jsonify({"message": "Review submitted successfully!"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/student_notifications', methods=['GET'])
def get_notifications():
    # Get the UserID from the query parameters
    # user_id = request.args.get('user_id')
    std_data = session['stdList']
    student_id = std_data[0]['UserID']
    user_id = std_data[0]['UserID']
    # Validate the UserID
    if not user_id:
        return jsonify({"error": "UserID is required"}), 400

    try:
        # Fetch notifications for the user
        notification = Notifications(UserID=student_id)
        notifications = notification.get_notification_data()

        # Format the notifications for the response
        notifications_list = []
        for notif in notifications:
            notifications_list.append({
                "NotificationID": notif["NotificationID"],
                "UserID": notif["UserID"],
                "Message": notif["Message"],
                "SentAt": notif["SentAt"],
                "IsRead": bool(notif["IsRead"])
            })

        # Return the notifications as JSON
        return jsonify({"notifications": notifications_list}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
# NOtifications Page 
#*************************


#############################################################################
@app.route('/prof_homepage')
def prof_homepage() : 
    return "Wellcome to prof "

@app.route('/admin_homepage')
def admin_homepage() : 
    return {"Wellcome to admin "}



if __name__ == '__main__':
  app.run(host='0.0.0.0', port=5000 , debug=True)
     



from flask import Flask , render_template,request,redirect,url_for,flash,session,jsonify ,send_from_directory , request, session, jsonify
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
from database_files.semester_grade import SemesterGrades
from database_files.notification import Notifications
from database_files.professor import Professors
from database_files.subjects_study import SubjectsStudy
from flask_cors import CORS
from database_files.assignment_submition import AssignmentSubmissions

from database_files.assignments import Assignments
# from professor import Professors
# from admin import Admins

# Ensure you have the necessary upload folder and allowed extensions defined
UPLOAD_FOLDER = 'static/uploads'
ALLOWED_EXTENSIONS = {'pdf'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS




app = Flask(__name__)
app.config['SESSION_TYPE'] = 'filesystem'  # Store session in the filesystem
CORS(app)


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
        
        stdjobg = Students(StudentID=user_id)
        sutd_data = stdjobg.get_student_data()
        print(f"student data : {sutd_data}")
        
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
    std_data_session = session['stdList']
    stdobj = Users(UserID=std_data_session[0]['UserID'])
    
    std_data_session = stdobj.get_user_data()
    
    courseregObj = CourseRegistrations(StudentID=std_data_session[0]['UserID'])
    couse_reg_data = courseregObj.get_registration_data()
    
    gradesObj = Grades(StudentID=std_data_session[0]['UserID'])
    max_semster = gradesObj.get_max_semester_info()
    
    gradesObj2 = Grades(StudentID=std_data_session[0]['UserID'] , semester_id=max_semster['MaxSemesterID'])
    grades_data = gradesObj2.get_grade_data()
    

    stdjobg = Students(StudentID=std_data_session[0]['UserID'])
    sutd_data = stdjobg.get_current_squad_and_semester()
    # print(f"std_data_current : {std_data_current}")
    # max_semster_std = stdjobg.get_max_semester_info()
    
    # stdjobg2 = Students(StudentID=std_data_session[0]['UserID'] ,semester_number=std_data_current[0]['MaxSemesterID'])
    # sutd_data = stdjobg2.get_student_data()
    
    subs_studyObj = SubjectsStudy(squad_number=sutd_data[0]['squad_number'], department=sutd_data[0]['department'] , semester_id=sutd_data[0]['semester_numer'])
    subs_std_data = subs_studyObj.get_data_by_squad_number_and_deparmt_semester()
    
    # Get all unique CourseIDs from course registration data
    registered_course_ids = list({reg['CourseID'] for reg in couse_reg_data})

    # Fetch course data for all registered courses
    course_data = []
    for course_id in registered_course_ids:
        courseObj = Courses(CourseID=course_id)
        course_data.extend(courseObj.get_course_data())

    # Calculate total credit hours and total grade points
    total_credit_hours = 0
    total_grade_points = 0
    
    # Extract required fields for grades
    response_data = []
    for grade in grades_data:
        course_id = grade['CourseID']
        course_info = next((course for course in course_data if course['CourseID'] == course_id), None)
        if course_info:
            credit_hours = course_info['CreditHours']
            points = grade['points']
            total_credit_hours += credit_hours
            total_grade_points += points * credit_hours
            
            response_data.append({
                "CourseName": course_info['CourseName'],
                "CreditHours": credit_hours,
                "CourseCode": course_info['CourseCode'],
                "pass_status": grade['pass_status'],
                "Total grades": grade['total_degree'],
                "Grade": grade['Grade'],
                "points": points,
                "Semester": grade['Semester']
            })
    
    # Calculate GPA
    gpa = total_grade_points / total_credit_hours if total_credit_hours > 0 else 0
    
    semester_gradeobj = SemesterGrades(student_id=std_data_session[0]['UserID'] , semester_id = sutd_data[0]['semester_numer'])
    ses_grades = semester_gradeobj.get_data_by_student_and_semester()
  
    
    semester_gradeobj = SemesterGrades(student_id=std_data_session[0]['UserID'])
    ses_gradesss = semester_gradeobj.get_grade_data()
            
    print(f"ses_grades : {ses_gradesss}")
    total_grade_points = 0
    total_registered_hours = 0

    for grade in ses_gradesss:
        gpa = grade['GPA']
        registered_hours = grade['total_req_hours']

        total_grade_points += gpa * registered_hours
        total_registered_hours += registered_hours

    # Calculate CGPA
    cgpa = total_grade_points / total_registered_hours if total_registered_hours > 0 else 0

    return {
        "response_data": std_data_session,
        "total_credit_hours": total_credit_hours,
        "total_grade_points": total_grade_points,
        "GPA_semester" : ses_grades ,
        "user info" : std_data_session,
        "student_data": sutd_data,
        "subjects_link": subs_std_data , 
        "Accumulated Registered Hours" : total_registered_hours , 
        "CGPA" : cgpa
    }


@app.route('/search_for_grades', methods=['POST'])
def search_for_grades() : 
    std_data_session = session['stdList']
    stdobj = Users(UserID=std_data_session[0]['UserID'])
    std_data_session = stdobj.get_user_data()
    data = request.json
    
    squad_number = data.get('squad_number' , " ")
    semester_name = data.get('semester_name' , " ")
    semes_num= 0
    if semester_name.lower() == "semester 1" : 
        semes_num = 1
    elif  semester_name.lower() == "semester 2" :
        semes_num = 2 
    elif  semester_name.lower() == "semester 3" :
        semes_num = 3
    elif  semester_name.lower() == "semester 4" :
        semes_num = 4
        
        # Fetch course data for all registered courses
        
    stdjobg = Students(StudentID=std_data_session[0]['UserID'] , squad_number=squad_number , semester_number=semes_num )
    student_data_searched = stdjobg.get_data_by_squad_semester_std()
        
    courseregObj = CourseRegistrations(StudentID=std_data_session[0]['UserID'], department=student_data_searched[0]['department'] ,squad_number=squad_number , semester_number=semes_num )
    couse_reg_data = courseregObj.get_data_by_squad_semester_std()
    print(f"couse_reg_data : {couse_reg_data}")
    
    # gradesObj = Grades(StudentID=std_data_session[0]['UserID'])
    # max_semster = gradesObj.get_max_semester_info()
    
    gradesObj2 = Grades(StudentID=std_data_session[0]['UserID'] ,squad_number = squad_number , semester_id=semes_num)
    grades_data = gradesObj2.get_data_by_squad_semester_std()
    print(f"grades_data : {grades_data}")

    # stdjobg = Students(StudentID=std_data_session[0]['UserID'])
    # max_semster_std = stdjobg.get_max_semester_info()
         
    
    # Get all unique CourseIDs from course registration data
    registered_course_ids = list({reg['CourseID'] for reg in couse_reg_data})
        
    course_data = []
    for course_id in registered_course_ids:
        courseObj = Courses(CourseID=course_id)
        course_data.extend(courseObj.get_course_data())

    # Calculate total credit hours and total grade points
    total_credit_hours = 0
    total_grade_points = 0
    
    # Extract required fields for grades
    response_data = []
    for grade in grades_data:
        course_id = grade['CourseID']
        course_info = next((course for course in course_data if course['CourseID'] == course_id), None)
        if course_info:
            credit_hours = course_info['CreditHours']
            points = grade['points']
            total_credit_hours += credit_hours
            total_grade_points += points * credit_hours
            
            response_data.append({
                "CourseName": course_info['CourseName'],
                "CreditHours": credit_hours,
                "CourseCode": course_info['CourseCode'],
                "pass_status": grade['pass_status'],
                "Total grades": grade['total_degree'],
                "Grade": grade['Grade'],
                "points": points,
                "Semester": grade['Semester']
            })
            
            
    return {
        "grades_data"  :response_data 
    }

# Register Page 
#*************************
@app.route('/student_register_course', methods=['GET', 'POST'])
def student_register_course():
    std_data = session['stdList']
    
    stdobj = Users(UserID=std_data[0]['UserID'])
    student_data = stdobj.get_user_data()

    studentObj = Students(StudentID=std_data[0]['UserID'])
    current_data = studentObj.get_current_squad_and_semester()

    student_id = current_data[0]['StudentID']
    semester_number = current_data[0]['semester_numer']
    squad_number = current_data[0]['squad_number']
    department = current_data[0]['department']

    # Mapping semester number to the name
    semester_mapping = {
        1: "Semester 1",
        2: "Semester 2",
        3: "Semester 3",
        4: "Semester 4"
    }
    semester_name = semester_mapping.get(semester_number, "Unknown Semester")

    if request.method == 'POST':
        # Retrieve the course IDs from JSON data
        data = request.get_json()
        course_ids = data.get('course_ids', [])

        # Register the selected courses
        for course_id in course_ids:
            registration = CourseRegistrations(
                StudentID=student_id,
                CourseID=course_id,
                Semester=semester_name,
                semester_number=semester_number,
                squad_number=squad_number,
                status_registration="Yes",
                department=department
            )
            registration.add_registration()

        return {"message": "Registration successful"}, 200

    # For GET request: Retrieve available courses
    available_coursesObj = Courses(semester_number=semester_number, squad_number=squad_number, department=department)
    available_courses = available_coursesObj.get_course_data_dept_semester_squad()

    # Fetch current semester data and total credit hours
    semester_dataObj = Semesters(semester_number=semester_number)
    semester_data = semester_dataObj.get_semester_data_with_number()
    total_available_hours = current_data[0]['available_hours_registered']

    return {
        "student_data": student_data,
        "available_courses": available_courses,
        "semester_credit_hours": semester_data[0]['semester_credit'],
        "total_available_hours": total_available_hours,
        "semester_data": semester_data
    }


# Courses Page 
#*************************
@app.route('/student_courses')
def get_student_grades_and_courses():
    # Initialize objects
    std_data = session['stdList']
    student_id = std_data[0]['UserID']
    # student_id = 2
    
    stdobj = Users(UserID=student_id)

    stdjobg = Students(StudentID=student_id )

    student_data = stdjobg.get_current_squad_and_semester()
    
    
    print(f"student_data : {student_data}")
    courseregObj = CourseRegistrations(StudentID=student_id , 
                                       department = student_data[0]['department'] , 
                                       squad_number=student_data[0]['squad_number'],
                                       semester_number=student_data[0]['semester_numer'])
    
    semester_obj = Semesters(student_id=student_id , semester_number=student_data[0]['semester_numer'])

    # Fetch student data
    # student_data = stdobj.get_user_data()
    if not student_data:
        return {"error": "Student not found"}

    # Fetch course registration data
    couse_reg_data = courseregObj.get_data_by_squad_semester_std()
    # print(f"couse_reg_data : {couse_reg_data}")
    if not couse_reg_data:
        return {"error": "No courses registered for this student"}

    # Fetch semester data
    semester_data = semester_obj.get_data_by_squad_semester_std()

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
        # print(50*"*")
        # print(f"course_data : {course_data}")

        # print(50*"*")
        profObj = Users(UserID=course_data[0]['prof_id'])
        prof_data= profObj.get_user_data()
        # print(f"prof_data : {prof_data}")
        # Organize course and grades data
        if prof_data == [] : 
            prof_data = [{"FirstName" : "Not exist" ,"Email" : "Not exist" }]
        course_info = {
            "course_id": course_id,
            "course_name": course_data[0].get("CourseName", " "),  # Assuming 'CourseName' is a field in the course data
            "course_code": course_data[0].get("CourseCode", " "),  
            "prof_id" : course_data[0].get('prof_id', " "),
            "prof_name" : prof_data[0].get('FirstName' , " ") ,
            "prof_email" : prof_data[0].get('Email' , " "),
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

    return {
        "result" : result , 
        "student_data" : std_data , 
        "student_info" : student_data 
    }


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


# NOtifications Page 
#*************************
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
        notifications_list = notification.get_notification_data()

        # # Format the notifications for the response
        # notifications_list = []
        # for notif in notifications:
        #     notifications_list.append({
        #         "NotificationID": notif["NotificationID"],
        #         "UserID": notif["UserID"],
        #         "Message": notif["Message"],
        #         "SentAt": notif["SentAt"],
        #         "IsRead": bool(notif["IsRead"])
        #     })

        # Return the notifications as JSON
        return jsonify({"notifications": notifications_list , "Student_data" : std_data}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Assigments page for student
#############################################################################
@app.route('/assignments_page_students', methods = ['GET' , 'POST'])
def assignments_page_students() : 
    std_data = session['stdList']
    std_id = std_data[0]['UserID']
    # std_id = 2
    userobj = Users(UserID=std_id)
    user_std_data = userobj.get_user_data()
    
    stdObj = Students(StudentID=std_id )
    student_data_info = stdObj.get_current_squad_and_semester()
    
    if request.method == 'POST':
        # Retrieve the course IDs from JSON data
        data = request.get_json()
        try:
            file_link = data.get('file_link')
            if file_link is None:
                raise ValueError("file_link is missing")
        except Exception as e:
            return {"error": str(e)}
        try:
            assigment_name = data.get('assigment_name')
            if assigment_name is None:
                raise ValueError("assigment_name is missing")
        except Exception as e:
            return {"error": str(e)}
        try:
            prof_email = data.get('prof_email')
            if prof_email is None:
                raise ValueError("prof_email is missing")
        except Exception as e:
            return {"error": str(e)}
        try:
            course_code = data.get('course_code')
            if course_code is None:
                raise ValueError("course_code is missing")
        except Exception as e:
            return {"error": str(e)}
        
        userObj = Users(Email=prof_email)
        user_info = userobj.get_user_data_with_email(prof_email)
        
        print(50*"*")
        print(f"user_info : {user_info}")
        print(50*"*")
        courseobj = Courses(CourseCode=course_code)
        course_data = courseobj.get_course_Code_data()
        
        assignmestObj = Assignments(assignment_name=assigment_name)
        assignment_id = assignmestObj.get_assignment_name_data()
        print(f"assignment_id : {assignment_id}")
        
        assignmestObj = AssignmentSubmissions(
            assignment_id=assignment_id[0]['id'],
            squad_number=student_data_info[0]['squad_number'], 
            semester_number=student_data_info[0]['semester_numer'],
            department=student_data_info[0]['department'], 
            prof_id=user_info[0]['UserID'],
            course_id=course_data[0]['CourseID'],
            file_upload_link=file_link,
            student_id=std_id  # Add this line
        )
        assignmestObj.add_submission()
        
        return  jsonify({"result":"Added" , "message":"assignment submited..!" }), 200
    
    assignmestObj = Assignments(squad_number=student_data_info[0]['squad_number'], 
                                semester_number=student_data_info[0]['semester_numer'],
                                department=student_data_info[0]['department'])
    ass_data = assignmestObj.get_data_by_squad_semester_depart_semes()
    
    return jsonify({"assignments_data": ass_data , "Student_data" : student_data_info }), 200

    

##########################################################################################################################################################
##########################################################################################################################################################
##########################################################################################################################################################




#############################################################################
# Professors
#############################################################################
@app.route('/prof_homepage')
def prof_homepage() : 
    return "Wellcome to prof "

@app.route('/admin_homepage')
def admin_homepage() : 
    return {"Wellcome to admin "}



if __name__ == '__main__':
  app.run(host='0.0.0.0', port=5000 , debug=True)
     



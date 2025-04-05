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
from database_files.admin import Admins
from database_files.assignments import Assignments
import jwt
from datetime import datetime, timedelta
from flask import Flask, request, jsonify
from functools import wraps
# from professor import Professors
# from admin import Admins

# Ensure you have the necessary upload folder and allowed extensions defined
UPLOAD_FOLDER = 'static/uploads'
ALLOWED_EXTENSIONS = {'pdf'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


app = Flask(__name__)
app.config['SESSION_TYPE'] = 'filesystem'  # Store session in the filesystem
CORS(app, resources={r"/*": {"origins": "http://localhost:5173", "supports_credentials":True } })

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

@app.route('/login', methods=['POST'])
def login():
    if request.method == 'POST':
        data = request.get_json()
        if not data:
            return jsonify({"error": "No data provided"}), 400

        email = data.get('email')
        password = data.get('password')
        user_type = data.get('usertype')

        if not email or not password or not user_type:
            return jsonify({"error": "Missing email, password, or usertype"}), 400

        userObj = Users(Email=email, PasswordHash=password, UserType=user_type)
        success, user_id, message = userObj.login(email, password, user_type)
        
        user_obj = Users(UserID =user_id )
        user_data = user_obj.get_user_data()
        
        if user_data[0]['status']== 1 : 
            return jsonify({"email" : user_data[0]['Email']  ,"error" : "This account is Disabled please call Admin"}), 400
            
        if not success:
            return jsonify({"email": email, "message": message}), 400

        # Generate access token (short-lived)
        access_token_payload = {
            'user_id': user_id,
            'email': email,
            'user_type': user_type.lower(),
            'token_type': 'access',
            'exp': datetime.utcnow() + timedelta(minutes=15)  # 15 minutes expiration
        }
        access_token = jwt.encode(access_token_payload, app.secret_key, algorithm='HS256')

        # Generate refresh token (long-lived)
        refresh_token_payload = {
            'user_id': user_id,
            'email': email,
            'user_type': user_type.lower(),
            'token_type': 'refresh',
            'exp': datetime.utcnow() + timedelta(days=7)  # 7 days expiration
        }
        refresh_token = jwt.encode(refresh_token_payload, app.secret_key, algorithm='HS256')

        return jsonify({
            "result": "Yes",
            "email": email,
            "usertype": user_type,
            "access_token": access_token,
            "refresh_token": refresh_token,
            "expires_in": 1800  # 30 minutes in seconds
        })
    else:
        return jsonify({"error": "Invalid request method"}), 405

@app.route('/refresh', methods=['POST'])
def refresh():
    try:
        data = request.get_json()
        if not data or 'refresh_token' not in data:
            return jsonify({"error": "Refresh token is required"}), 400

        refresh_token = data['refresh_token']
        
        try:
            # Decode the refresh token
            payload = jwt.decode(refresh_token, app.secret_key, algorithms=['HS256'])
            
            # Verify it's a refresh token
            if payload.get('token_type') != 'refresh':
                return jsonify({"error": "Invalid token type"}), 401
                
            # Generate new access token
            access_token_payload = {
                'user_id': payload['user_id'],
                'email': payload['email'],
                'user_type': payload['user_type'],
                'token_type': 'access',
                'exp': datetime.utcnow() + timedelta(minutes=15)
            }
            new_access_token = jwt.encode(access_token_payload, app.secret_key, algorithm='HS256')
            
            return jsonify({
                "access_token": new_access_token,
                "expires_in": 900  # 15 minutes in seconds
            })
            
        except jwt.ExpiredSignatureError:
            return jsonify({"error": "Refresh token has expired"}), 401
        except jwt.InvalidTokenError:
            return jsonify({"error": "Invalid refresh token"}), 401
            
    except Exception as e:
        return jsonify({"error": str(e)}), 500     

#############################################################################
# ********************* Users **********************
#############################################################################
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({"error": "Token is missing"}), 401

        try:
            payload = jwt.decode(token, app.secret_key, algorithms=['HS256'])
            request.user_id = payload['user_id']
            request.email = payload['email']
            request.user_type = payload['user_type']
        except jwt.ExpiredSignatureError:
            return jsonify({"error": "Token has expired"}), 401
        except jwt.InvalidTokenError:
            return jsonify({"error": "Invalid token"}), 401

        return f(*args, **kwargs)
    return decorated


# Dashboard Page 
#*************************
@app.route('/student_homepage', methods=['GET'])
@token_required
def student_homepage():
    # Extract user data from the JWT
    user_id = request.user_id
    user_type = request.user_type
    # print(f"user type : {user_type}")
    # Ensure the user is a student
    if str(user_type).lower() != 'student':
        return jsonify({"error": "Unauthorized access"}), 403

    # Fetch user data using the user_id from the JWT
    stdobj = Users(UserID=user_id , UserType="Student")
    std_data = stdobj.get_user_data_student()
    
    if not std_data:
        return jsonify({"error": "User data not found"}), 404

    # Fetch student-specific data
    stdjobg = Students(StudentID_fk=user_id)
    sutd_data = stdjobg.get_current_squad_and_semester_fk()
    # print(f"sutd_data : {sutd_data}")
    if not sutd_data:
        return jsonify({"error": "Student data not found"}), 404

    # Fetch course registration data
    courseregObj = CourseRegistrations(StudentID=user_id , squad_number =sutd_data[0]['squad_number'] , semester_number = sutd_data[0]['semester_numer'])
    couse_reg_data = courseregObj.get_registration_data_semester_squad()
    # print(f"Course_regisiter_last_update : {couse_reg_data}")
    gradesObj2 = Grades(
        StudentID=user_id,
        squad_number=sutd_data[0]['squad_number'],
        semester_id=sutd_data[0]['semester_numer']
    )
    
    grades_data = gradesObj2.get_grade_data_based_on_sqaud_semester_depart_stdid_course()
    # print(f"grades data : {grades_data}")
    # Fetch subjects data
    subs_studyObj = SubjectsStudy(
        squad_number=sutd_data[0]['squad_number'],
        semester_id=sutd_data[0]['semester_numer']
    )
    subs_std_data = subs_studyObj.get_data_by_squad_number_and_deparmt_semester()
    if not subs_std_data : 
        subs_std_data = [{}]
    if not couse_reg_data : 
        couse_reg_data = []
        
    # Get all unique CourseIDs from course registration data
    registered_course_ids = list({reg['CourseID'] for reg in couse_reg_data})

    # Fetch course data for all registered courses
    course_data = []
    for course_id in registered_course_ids:
        courseObj = Courses(CourseID=course_id)
        course_data.extend(courseObj.get_course_data())

    # print(f"course_data : {course_data}")
    # Calculate total credit hours and total grade points
    total_credit_hours = 0
    total_grade_points = 0
    
    # Extract required fields for grades

    response_data = []
    for grade in grades_data:
        course_id = grade['CourseID']
        # Replace next() with list comprehension to get all matching courses
        matching_courses = [course for course in course_data if course['CourseID'] == course_id]
        
        for course_info in matching_courses:  # Iterate through all matches
            credit_hours = course_info['CreditHours']
            points = grade['points']
            total_credit_hours += credit_hours
            total_grade_points += points * credit_hours
            
            response_data.append({
                "CourseName": course_info['CourseName'],
                "CreditHours": credit_hours,
                "CourseCode": course_info['CourseCode'],
                "pass_status": grade['pass_status'],
                "Total_grades": grade['total_degree'],
                "Grade": grade['Grade'],
                "points": points,
                "Semester": grade['Semester']
            }) 
    semesterObj = Semesters( squad_number= sutd_data[0]['squad_number'] , semester_number=sutd_data[0]['semester_numer'])
    semester_data = semesterObj.get_data_by_squad_semester_squad_number_with_id()
    
    semester_gradeobj = SemesterGrades(student_id=user_id ,  squad_number= sutd_data[0]['squad_number'] , semester_id=sutd_data[0]['semester_numer'])
    ses_gradesss = semester_gradeobj.get_data_by_student_and_semester_and_Squad()
    if not ses_gradesss : 
        ses_gradesss=[{"GPA" : 0 ,"total_req_hours" : 0}]
    # Calculate CGPA
    total_grade_points = 0
    total_registered_hours = 0

    for grade in ses_gradesss:
        gpa = grade['GPA']
        registered_hours = grade['total_req_hours']
        total_grade_points += gpa * registered_hours
        total_registered_hours += registered_hours

    cgpa = total_grade_points / total_registered_hours if total_registered_hours > 0 else 0
    
    # Return the response
    return jsonify({
        "credit_hours": total_credit_hours,
        "GPA": ses_gradesss[0]['GPA'],
        "user_info": std_data[0],
        "student_data": sutd_data[0],
        "subjects_link": subs_std_data[0],
        "Accumulated_Registered_Hours": total_registered_hours,
        "CGPA": cgpa , 
        "Grades_data" : response_data, 
        "Semester_info" : semester_data
    })
    
    
@app.route('/search_for_grades', methods=['POST'])
@token_required
def search_for_grades():
    # Extract user data from the JWT
    user_id = request.user_id
    user_type = request.user_type

    # Ensure the user is a student
    if str(user_type).lower() != 'student':
        return jsonify({"error": "Unauthorized access"}), 403

    # Fetch user data using the user_id from the JWT
    stdobj = Users(UserID=user_id)
    std_data_session = stdobj.get_user_data()
    # print(f"std_data_session : {std_data_session}")
    
    if not std_data_session:
        return jsonify({"error": "User data not found"}), 404

    # Get request data
    data = request.json
    squad_number_std = data.get('squad_number', " ")
    semester_name = data.get('semester_name', " ")
    semes_num = 0

    # Map semester name to semester number
    if semester_name.lower() == "first semester":
        semes_num = 1
    elif semester_name.lower() == "second semester":
        semes_num = 2
    elif semester_name.lower() == "third semester":
        semes_num = 3
    elif semester_name.lower() == "fourth semester":
        semes_num = 4

    # Fetch student data based on squad number and semester
    # print(f"semes_num : {semes_num} ,squad_number_std: {squad_number_std} ")
    stdjobg = Students(StudentID_fk=user_id, squad_number=squad_number_std, semester_number=semes_num)
    student_data_searched = stdjobg.get_student_data_squad_number_fkk()
    
    # print(f"student_data_searched : {student_data_searched}")
    # print(50 * "*")

    if not student_data_searched:
        return jsonify({"error": "Student data not found"}), 404

    # # Fetch course registration data
    # courseregObj = CourseRegistrations(
    #     StudentID=student_data_searched[0]['StudentID'],
    #     squad_number=squad_number_std,
    #     semester_number=semes_num
    # )
    
    # couse_reg_data = courseregObj.get_data_by_squad_semester_std()
    # if not couse_reg_data : 
    #     return {"message" : "No Courses Registered based on your search"},400
    # print(f"couse_reg_data : {couse_reg_data}")
    # print(50 * "*")

    # Fetch grades data
    gradesObj2 = Grades(
        StudentID=user_id,
        squad_number=squad_number_std,
        semester_id=semes_num 
    )
    # print(f"user_id : {user_id} ,squad_number_std: {squad_number_std} ,semes_num : {semes_num}  ") 
    grades_data = gradesObj2.get_data_by_squad_semester_std()
    print(f"grades_data : {grades_data}")

    # Get all unique CourseIDs from course registration data
    registered_course_ids = list({reg['CourseID'] for reg in grades_data})

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
            
    return jsonify({
        "grades_data": response_data
    })


# Register Page 
#*************************

# version 1
#########################
# @app.route('/student_register_course', methods=['GET', 'POST'])
# @token_required
# def student_register_course():
#     # Extract user data from the JWT
#     user_id = request.user_id
#     user_type = request.user_type

#     # Ensure the user is a student
#     if str(user_type).lower() != 'student':
#         return jsonify({"error": "Unauthorized access"}), 403

#     # Fetch user data using the user_id from the JWT
#     stdobj = Users(UserID=user_id)
#     student_data = stdobj.get_user_data()
    
#     if not student_data:
#         return jsonify({"error": "User data not found"}), 404

#     # Fetch current squad and semester data
#     studentObj = Students(StudentID_fk=user_id)
#     current_data = studentObj.get_current_squad_and_semester_fk()
    
#     if not current_data:
#         return jsonify({"error": "Student data not found"}), 404

#     student_id = current_data[0]['StudentID_fk']
#     semester_number = current_data[0]['semester_numer']
#     squad_number = current_data[0]['squad_number']
#     department = current_data[0]['department']

#     # Mapping semester number to the name
#     semester_mapping = {
#         1: "first semester",
#         2: "second semester",
#         3: "third semester",
#         4: "fourth semester"
#     }
#     semester_name = semester_mapping.get(semester_number, "Unknown Semester")

#     if request.method == 'POST':
#         # Retrieve the course IDs from JSON data
#         data = request.get_json()

#         course_ids = data.get('course_ids', [])
#         already_registered_courses = []
        
#         if not data or 'course_ids' not in data or not data['course_ids']:
#             return jsonify({'error': 'No course IDs provided'}), 400
        
#         # Check if any course is already registered
#         for course_id in course_ids:
#             registration = CourseRegistrations(
#                 StudentID=student_id,
#                 CourseID=course_id,
#                 Semester=semester_name,
#                 semester_number=semester_number,
#                 squad_number=squad_number,
#                 status_registration="Yes",
#                 department=department
#             )
            
#             if registration.is_already_registered():
#                 already_registered_courses.append(course_id)
        
#         # If there are already registered courses, return an error immediately
#         if already_registered_courses:
#             return jsonify({
#                 "error": "Some courses are already registered",
#                 "already_registered_courses": already_registered_courses
#             }), 400  # Bad Request

#         # Register the selected courses if none were already registered
#         for course_id in course_ids:
#             courseobj = Courses(CourseID=course_id)
#             course_data = courseobj.get_course_data()
#             registration = CourseRegistrations(
#                 StudentID=student_id,
#                 CourseID=course_id,
#                 Semester=semester_name,
#                 semester_number=semester_number,
#                 squad_number=squad_number,
#                 status_registration="Yes",
#                 department=department, 
#                 prof_id=course_data[0]['prof_id']
#             )

#             registration.add_registration()

#         return jsonify({"message": "Registration successful", "result": "Yes"}), 200

#     # For GET request: Retrieve available courses
#     available_coursesObj = Courses(semester_number=semester_number, squad_number=squad_number , course_status=0)
#     available_courses = available_coursesObj.get_course_data_dept_semester_squad()

#     # Fetch current semester data and total credit hours
#     semester_dataObj = Semesters(semester_number=semester_number , squad_number=squad_number)
#     semester_data = semester_dataObj.get_semester_data_with_number_with_squad()
#     total_available_hours = semester_data[0]['available_hours_regisitered']

#     include_keys = {"CourseCode", "CourseID", "CourseName", "CreditHours", "semester_number", "squad_number", "prof_id"}

#     # Filter and add professor names
#     filtered_courses = []
#     for course in available_courses:
#         course_data = {key: course[key] for key in include_keys if key in course}
        
#         # Fetch professor name based on prof_id
#         prof_id = course.get("prof_id")
#         print(f"prof_id : {prof_id}")
#         if prof_id:
#             prof_obj = Users(UserID=prof_id)
#             professor_name = prof_obj.get_user_data()
#             course_data["ProfessorName"] = professor_name[0]['FirstName']

#         filtered_courses.append(course_data)
    
#     return jsonify({
#         "student_data": student_data[0],
#         "available_courses": filtered_courses,
#         "semester_credit_hours": semester_data[0]['semester_credit'],
#         "total_available_hours": total_available_hours
#     })


#Version 2
####################
@app.route('/student_register_course', methods=['GET', 'POST'])
@token_required
def student_register_course():
    # Extract user data from the JWT
    user_id = request.user_id
    user_type = request.user_type

    # Ensure the user is a student
    if str(user_type).lower() != 'student':
        return jsonify({"error": "Unauthorized access"}), 403

    # Fetch user data using the user_id from the JWT
    stdobj = Users(UserID=user_id)
    student_data = stdobj.get_user_data()
    
    if not student_data:
        return jsonify({"error": "User data not found"}), 404

    # Fetch current squad and semester data
    studentObj = Students(StudentID_fk=user_id)
    current_data = studentObj.get_current_squad_and_semester_fk()
    
    if not current_data:
        return jsonify({"error": "Student data not found"}), 404

    student_id = current_data[0]['StudentID_fk']
    semester_number = current_data[0]['semester_numer']
    squad_number = current_data[0]['squad_number']
    department = current_data[0]['department']

    # Mapping semester number to the name
    semester_mapping = {
        1: "first semester",
        2: "second semester",
        3: "third semester",
        4: "fourth semester"
    }
    semester_name = semester_mapping.get(semester_number, "Unknown Semester")

    if request.method == 'POST':
        # Retrieve the course IDs from JSON data
        data = request.get_json()

        course_ids = data.get('course_ids', [])
        already_registered_courses = []
        missing_prerequisites = []
        invalid_courses = []
        
        if not data or 'course_ids' not in data or not data['course_ids']:
            return jsonify({'error': 'No course IDs provided'}), 400
        
        # Validate each course
        for course_id in course_ids:
            # Check if course exists and get its data
            course_obj = Courses(CourseID=course_id)
            course_data = course_obj.get_course_data()
            
            if not course_data:
                invalid_courses.append(course_id)
                continue
                
            # Check if already registered
            registration = CourseRegistrations(
                StudentID=student_id,
                CourseID=course_id,
                semester_number=semester_number,
                squad_number=squad_number
            )
            
            if registration.is_already_registered():
                already_registered_courses.append({
                    'course_id': course_id,
                    'course_name': course_data[0].get('CourseName', 'Unknown')
                })
                continue
            
            # Check for prerequisite courses
            if course_data[0].get('PrerequisiteCourseID'):
                prerequisite_id = course_data[0]['PrerequisiteCourseID']
                prereq_course_data = Courses(CourseID=prerequisite_id).get_course_data()
                
                # Check if prerequisite course was passed
                grade_obj = Grades(
                    StudentID=student_id,
                    CourseID=prerequisite_id
                )
                prerequisite_grade = grade_obj.get_grade_data_based_course_id_and_student()
                
                if not prerequisite_grade or prerequisite_grade[0].get('pass_status') != 'Passed':
                    missing_prerequisites.append({
                        'course_id': course_id,
                        'course_name': course_data[0].get('CourseName', 'Unknown'),
                        'prerequisite_id': prerequisite_id,
                        'prerequisite_name': prereq_course_data[0].get('CourseName', 'Unknown') if prereq_course_data else 'Unknown'
                    })
        
        # If there are any validation errors, return them immediately
        if invalid_courses or already_registered_courses or missing_prerequisites:
            return jsonify({
                "error": "Registration validation failed",
                "invalid_courses": invalid_courses,
                "already_registered_courses": already_registered_courses,
                "missing_prerequisites": missing_prerequisites
            }), 400

        # Register the selected courses if validation passes
        successful_registrations = []
        for course_id in course_ids:
            course_obj = Courses(CourseID=course_id)
            course_data = course_obj.get_course_data()
            
            try:
                registration = CourseRegistrations(
                    StudentID=student_id,
                    CourseID=course_id,
                    Semester=semester_name,
                    semester_number=semester_number,
                    squad_number=squad_number,
                    status_registration="Yes",
                    department=department,
                    prof_id=course_data[0]['prof_id']
                )
                registration.add_registration()
                successful_registrations.append({
                    'course_id': course_id,
                    'course_name': course_data[0].get('CourseName', 'Unknown')
                })
            except Exception as e:
                # Log the error but continue with other courses
                print(f"Failed to register course {course_id}: {str(e)}")
                continue

        return jsonify({
            "message": "Registration completed",
            "successful_registrations": successful_registrations,
            "result": "Yes"
        }), 200

    # For GET request: Retrieve available courses
    available_coursesObj = Courses(
        semester_number=semester_number,
        squad_number=squad_number,
        course_status=0
    )
    available_courses = available_coursesObj.get_course_data_dept_semester_squad()

    # Fetch current semester data and total credit hours
    semester_dataObj = Semesters(
        semester_number=semester_number,
        squad_number=squad_number
    )
    semester_data = semester_dataObj.get_semester_data_with_number_with_squad()
    total_available_hours = semester_data[0]['available_hours_regisitered']

    # Get currently registered courses to filter them out
    registered_courses_obj = CourseRegistrations(
        StudentID=student_id,
        semester_number=semester_number,
        squad_number=squad_number
    )
    registered_courses = registered_courses_obj.get_data_by_squad_semester_std() or []

    # Prepare response data
    response_data = {
        "student_data": {
            "user_id": student_data[0].get('UserID'),
            "first_name": student_data[0].get('FirstName'),
            "last_name": student_data[0].get('LastName'),
            "email": student_data[0].get('Email'),
            "user_type": student_data[0].get('UserType')
        },
        "semester_info": {
            "number": semester_number,
            "name": semester_name,
            "credit_hours": semester_data[0].get('semester_credit'),
            "available_hours": total_available_hours,
            "squad_number": squad_number,
            "department": department
        }
    }

    # Prepare course data with registration status and prerequisites
    course_list = []
    for course in available_courses or []:
        course_id = course.get('CourseID')
        
        # Check if already registered
        is_registered = any(
            reg.get('CourseID') == course_id 
            for reg in registered_courses
        )
        
        # Check prerequisite status
        prerequisite_status = {}
        if course.get('PrerequisiteCourseID'):
            prereq_grade = Grades(
                StudentID=student_id,
                CourseID=course['PrerequisiteCourseID']
            ).get_grade_data_based_course_id_and_student()
            
            prerequisite_status = {
                'prerequisite_id': course.get('PrerequisiteCourseID' , 0),
                'passed': bool(prereq_grade and prereq_grade[0].get('pass_status') == 'Passed')
            }

        course_list.append({
            "course_id": course_id,
            "course_code": course.get('CourseCode'),
            "course_name": course.get('CourseName'),
            "credit_hours": course.get('CreditHours'),
            "professor_id": course.get('prof_id'),
            "is_registered": is_registered,
            "prerequisite": prerequisite_status
        })

    response_data["available_courses"] = course_list
    return jsonify(response_data), 200

#Version 3
####################
# @app.route('/student_register_course', methods=['POST'])
# @token_required
# def student_register_course():
#     # Extract user data from the JWT
#     user_id = request.user_id
#     user_type = request.user_type

#     # Ensure the user is a student
#     if str(user_type).lower() != 'student':
#         return jsonify({"error": "Unauthorized access"}), 403

#     # Fetch user data
#     stdobj = Users(UserID=user_id)
#     student_data = stdobj.get_user_data()
#     if not student_data:
#         return jsonify({"error": "User data not found"}), 404

#     # Fetch current squad and semester data
#     studentObj = Students(StudentID_fk=user_id)
#     current_data = studentObj.get_current_squad_and_semester_fk()
#     if not current_data:
#         return jsonify({"error": "Student data not found"}), 404

#     student_id = current_data[0]['StudentID_fk']
#     semester_number = current_data[0]['semester_numer']
#     squad_number = current_data[0]['squad_number']
#     department = current_data[0]['department']

#     # Get request data
#     data = request.get_json()
#     course_ids = data.get('course_ids', [])
    
#     if not data or 'course_ids' not in data or not data['course_ids']:
#         return jsonify({'error': 'No course IDs provided'}), 400

#     # Prepare response containers
#     already_registered = []
#     missing_prerequisites = []
#     successfully_registered = []
#     invalid_courses = []

#     for course_id in course_ids:
#         # Check if course exists
#         course_obj = Courses(CourseID=course_id)
#         course_data = course_obj.get_course_data()
#         if not course_data:
#             invalid_courses.append(course_id)
#             continue

#         # Check if already registered
#         registration_check = CourseRegistrations(
#             StudentID=student_id,
#             CourseID=course_id,
#             semester_number=semester_number,
#             squad_number=squad_number
#         )
#         if registration_check.is_already_registered():
#             already_registered.append({
#                 'course_id': course_id,
#                 'course_name': course_data[0].get('CourseName'),
#                 'course_code': course_data[0].get('CourseCode')
#             })
#             continue

#         # Check for prerequisite courses
#         if course_data[0].get('PrerequisiteCourseID'):
#             prereq_id = course_data[0]['PrerequisiteCourseID']
#             prereq_course = Courses(CourseID=prereq_id).get_course_data()
            
#             # Check if prerequisite was passed
#             grade_check = Grades(
#                 StudentID=student_id,
#                 CourseID=prereq_id
#             )
#             prereq_grade = grade_check.get_grade_data_based_course_id_and_student()
            
#             if not prereq_grade or prereq_grade[0].get('pass_status') != 'Passed':
#                 missing_prerequisites.append({
#                     'course_id': course_id,
#                     'course_name': course_data[0].get('CourseName'),
#                     'course_code': course_data[0].get('CourseCode'),
#                     'prerequisite': {
#                         'course_id': prereq_id,
#                         'course_name': prereq_course[0].get('CourseName') if prereq_course else 'Unknown',
#                         'course_code': prereq_course[0].get('CourseCode') if prereq_course else 'Unknown',
#                         'status': 'Failed' if prereq_grade else 'Not Taken',
#                         'message': 'You must pass this prerequisite course first'
#                     }
#                 })
#                 continue

#         # If all checks pass, register the course
#         try:
#             registration = CourseRegistrations(
#                 StudentID=student_id,
#                 CourseID=course_id,
#                 Semester=f"Semester {semester_number}",
#                 semester_number=semester_number,
#                 squad_number=squad_number,
#                 status_registration="Active",
#                 department=department,
#                 prof_id=course_data[0]['prof_id']
#             )
#             registration.add_registration()
#             successfully_registered.append({
#                 'course_id': course_id,
#                 'course_name': course_data[0].get('CourseName'),
#                 'course_code': course_data[0].get('CourseCode')
#             })
#         except Exception as e:
#             print(f"Error registering course {course_id}: {str(e)}")
#             continue

#     # Prepare final response
#     response = {
#         'success': bool(successfully_registered),
#         'successfully_registered': successfully_registered,
#         'already_registered': already_registered,
#         'missing_prerequisites': missing_prerequisites,
#         'invalid_courses': invalid_courses
#     }

#     if missing_prerequisites or invalid_courses or already_registered:
#         response['message'] = "Some courses couldn't be registered"
#         status_code = 207  # Multi-status
#     elif successfully_registered:
#         response['message'] = "All courses registered successfully"
#         status_code = 200
#     else:
#         response['message'] = "No courses were registered"
#         status_code = 400

#     return jsonify(response), status_code

# Courses Page 
#*************************
#########################
@app.route('/student_courses', methods=['GET'])
@token_required
def get_student_grades_and_courses():
    # Extract user data from the JWT
    user_id = request.user_id
    user_type = request.user_type

    # Ensure the user is a student
    if str(user_type).lower() != 'student':
        return jsonify({"error": "Unauthorized access"}), 403

    # Fetch user data using the user_id from the JWT
    stdobj = Users(UserID=user_id)
    stdu_data = stdobj.get_user_data()
    
    if not stdu_data:
        return jsonify({"error": "User data not found"}), 404

    # Fetch current squad and semester data
    stdjobg = Students(StudentID_fk=user_id)
    student_data = stdjobg.get_current_squad_and_semester_fk()
    
    if not student_data:
        return jsonify({"error": "Student data not found"}), 404

    # Fetch course registration data
    courseregObj = CourseRegistrations(
        StudentID=user_id, 
        department=student_data[0]['department'], 
        squad_number=student_data[0]['squad_number'],
        semester_number=student_data[0]['semester_numer']
    )
    couse_reg_data = courseregObj.get_data_by_squad_semester_std()
    
    if not couse_reg_data:
        return jsonify({"error": "No courses registered for this student"}), 404

    # Get all unique CourseIDs from course registration data
    registered_course_ids = list({reg['CourseID'] for reg in couse_reg_data})
    
    # Prepare the response
    result = {
        "student_id": user_id,
        "student_name": stdu_data[0].get("FirstName", ""), 
        "courses": []
    }

    # # Fetch course and grade data for each registered course
    # assignmentsObj = AssignmentSubmissions(student_id=user_id)
    # ass_data = assignmentsObj.get_submission_data_by_student_id()
    
    
    for course_id in registered_course_ids:
        courseObj = Courses(CourseID=course_id)
        course_data = courseObj.get_course_data()
        
        assignmentsObj = AssignmentSubmissions(student_id=user_id , course_id=course_id)
        ass_data = assignmentsObj.get_submission_data_by_student_id_course()
        print(f"ass_data : {ass_data}")
        assignments_data_final = []
        for assignments in ass_data : 
            
            assign_obj = Assignments(assignment_id=assignments['assignment_id'])
            assign_dd = assign_obj.get_assignment_data()
            print(F"assign_dd : {assign_dd}")
            print(50*"*")
            if not assign_dd : 
                continue
            assignments_data_final.append({
                "assignment_id" : assign_dd[0]['id'],
                "assignment_name" : assign_dd[0]['assignment_name'] , 
                "grade" : assignments['assignment_grade']
            })
    
        if not course_data:
            continue

        # Fetch grades data
        gradesObj = Grades(
            StudentID=user_id,
            squad_number=student_data[0]['squad_number'], 
            semester_id=student_data[0]['semester_numer'],
            CourseID=course_data[0]['CourseID']
        )
        grades_data = gradesObj.get_data_by_squad_semester_std()

        # Skip courses with no grades
        if not grades_data:
            continue  

        # Fetch professor data
        profObj = Users(UserID=course_data[0]['prof_id'])
        prof_data = profObj.get_user_data()

        if not prof_data:  
            prof_data = [{"FirstName": "Not exist", "Email": "Not exist"}]

        # Prepare course info
        course_info = {
            "course_id": course_id,
            "course_name": course_data[0].get("CourseName", " "),
            "course_code": course_data[0].get("CourseCode", " "),  
            "prof_id": course_data[0].get('prof_id', " "),
            "prof_name": prof_data[0].get('FirstName', " "),
            "prof_email": prof_data[0].get('Email', " "),
            "grades": {
                "midterm_grade": grades_data[0].get("MidtermGrade", None),
                "final_grade": grades_data[0].get("FinalGrade", None),
                "total_degree": grades_data[0].get("total_degree", None),
                "points": grades_data[0].get("points", None),
                "year_work": grades_data[0].get("year_work", None)
            } , 
            "assignments_info" : {
                "total_assignment_grade": grades_data[0].get("AssignmentGrade", None),
                "assignments" : assignments_data_final
            }

        }

        result["courses"].append(course_info)


    return jsonify({
        "result": result, 
        "User_info": stdu_data[0], 
        "student_info": student_data[0]
    })


@app.route('/submit_review', methods=['POST'])
@token_required
def submit_review():
    # Extract user data from the JWT
    user_id = request.user_id
    user_type = request.user_type

    # Ensure the user is a student
    if str(user_type).lower() != 'student':
        return jsonify({"error": "Unauthorized access"}), 403

    # Get JSON data from the client
    data = request.json

    # Extract fields from the request
    prof_email = data.get('prof_email')
    course_code = data.get('course_code')
    review_text = data.get('review_text')
    review_type = data.get('grade_type')

    # Validate required fields
    if not all([prof_email, course_code, review_text, review_type]):
        return jsonify({"error": "Missing required fields"}), 400

    # Save the review to the database
    try:
        review = Review(
            studentID=user_id,
            course_code=course_code,
            email_prof=prof_email,
            review_text=review_text,
            review_type=review_type
        )
        review.add_review()

        # Add a notification for the student
        notification_message = f"Your review for {prof_email} has been submitted successfully."
        notification = Notifications(
            UserID=user_id,
            Message=notification_message,
            IsRead=False,
            SentAt=prof_email
        )
        notification.add_notification()

        # Return a success response
        return jsonify({
            "message": "Review submitted successfully!",
            "result": "Yes"
        }), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/submit_review_for_prof', methods=['POST'])
@token_required
def submit_review_for_prof():
    # Extract user data from the JWT
    user_id = request.user_id
    user_type = request.user_type

    # Ensure the user is a student
    if str(user_type).lower() != 'professor':
        return jsonify({"error": "Unauthorized access"}), 403

    # Get JSON data from the client
    data = request.json

    # Extract fields from the request
    prof_email = data.get('student_email')
    course_code = data.get('course_code')
    review_text = data.get('review_text')
    review_type = data.get('review_type')

    # Validate required fields
    if not all([prof_email, course_code, review_text, review_type]):
        return jsonify({"error": "Missing required fields"}), 400

    # Save the review to the database
    try:
        review = Review(
            studentID=user_id,
            course_code=course_code,
            email_prof=prof_email,
            review_text=review_text,
            review_type=review_type
        )
        review.add_review()

        # Add a notification for the student
        notification_message = f"Your review for {prof_email} has been submitted successfully."
        notification = Notifications(
            UserID=user_id,
            Message=notification_message,
            IsRead=False,
            SentAt=prof_email
        )
        notification.add_notification()

        # Return a success response
        return jsonify({
            "message": "Review submitted successfully!",
            "result": "Yes"
        }), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# NOtifications Page 
#*************************

@app.route('/student_notifications', methods=['GET'])
@token_required
def get_notifications_student():
    # Extract user data from the JWT
    user_id = request.user_id
    user_type = request.user_type

    # Ensure the user is a student
    if str(user_type).lower() != 'student':
        return jsonify({"error": "Unauthorized access"}), 403

    try:
        # Fetch notifications for the user
        notification = Notifications(UserID=user_id)
        notifications_list = notification.get_user_data()

        # Enhance notification data with sender/receiver info
        enhanced_notifications = []
        for notif in notifications_list:
            # Initialize default values
            sender_name = "Unknown"
            sender_email = "Unknown"
            receiver_name = "Unknown"
            receiver_email = "Unknown"
            receiver_id = None

            # Get sender information if UserID exists
            if notif.get('UserID'):
                sender = Users(UserID=notif['UserID'])
                sender_data = sender.get_user_data()
                if sender_data and len(sender_data) > 0:
                    sender_name = f"{sender_data[0].get('FirstName', '')} {sender_data[0].get('LastName', '')}".strip()
                    sender_email = sender_data[0].get('Email', 'Unknown')

            # Get receiver information if receiver_email exists
            if notif.get('receiver_email'):
                receiver = Users(Email=notif['receiver_email'])
                receiver_data = receiver.get_user_data_with_email(notif['receiver_email'])
               
                if receiver_data and len(receiver_data) > 0:
                    receiver_name = f"{receiver_data[0].get('FirstName', '')} {receiver_data[0].get('LastName', '')}".strip()
                    receiver_email = receiver_data[0].get('Email', 'Unknown')
                    receiver_id = receiver_data[0].get('UserID')

            enhanced_notif = {
                "notification_id": notif.get('NotificationID'),
                "sender_id": notif.get('UserID'),
                "sender_name": sender_name,
                "sender_email": sender_email,
                "message": notif.get('Message'),
                "is_read": notif.get('IsRead', False),
                "notify_type": notif.get('notify_type'),
                "receiver_id": receiver_id,
                "receiver_name": receiver_name,
                "receiver_email": receiver_email,
                "sent_at": notif.get('SentAt').isoformat() if notif.get('SentAt') else None
            }
            enhanced_notifications.append(enhanced_notif)

        # Fetch student data for the response
        stdobj = Users(UserID=user_id)
        student_data = stdobj.get_user_data()

        if not student_data or len(student_data) == 0:
            return jsonify({"error": "User data not found"}), 404

        # Return the enhanced notifications and student data as JSON
        return jsonify({
            "notifications": enhanced_notifications,
            "student_data": {
                "user_id": student_data[0].get('UserID'),
                "first_name": student_data[0].get('FirstName'),
                "last_name": student_data[0].get('LastName'),
                "email": student_data[0].get('Email'),
                "user_type": student_data[0].get('UserType')
            }
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Assigments page for student
#############################################################################

@app.route('/assignments_page_students', methods=['GET', 'POST'])
@token_required
def assignments_page_students():
    # Extract user data from the JWT
    user_id = request.user_id
    user_type = request.user_type

    # Ensure the user is a student
    if str(user_type).lower() != 'student':
        return jsonify({"error": "Unauthorized access"}), 403

    # Fetch user data using the user_id from the JWT
    userobj = Users(UserID=user_id)
    user_std_data = userobj.get_user_data()
    
    if not user_std_data:
        return jsonify({"error": "User data not found"}), 404

    # Fetch current squad and semester data
    stdObj = Students(StudentID_fk=user_std_data[0]['UserID'])
    student_data_info = stdObj.get_current_squad_and_semester_fk()
    
    if not student_data_info:
        return jsonify({"error": "Student data not found"}), 404

    if request.method == 'POST':
        data = request.get_json()
        try:
            file_link = data.get('file_link')
            if file_link is None:
                raise ValueError("file_link is missing")
            
            assigment_name = data.get('assigment_name')
            if assigment_name is None:
                raise ValueError("assigment_name is missing")

            prof_email = data.get('prof_email')
            if prof_email is None:
                raise ValueError("prof_email is missing")

            course_code = data.get('course_code')
            if course_code is None:
                raise ValueError("course_code is missing")
            
        except Exception as e:
            return jsonify({"error": str(e)}), 400

        # Fetch professor data
        userObj = Users(Email=prof_email)
        user_info = userObj.get_user_data_with_email(prof_email)
        
        if not user_info:
            return jsonify({"error": "Professor data not found"}), 404

        # Fetch course data
        courseobj = Courses(CourseCode=course_code)
        course_data = courseobj.get_course_Code_data()
        
        if not course_data:
            return jsonify({"error": "Course data not found"}), 404

        # Fetch assignment data
        assignmestObjj = Assignments(assignment_name=assigment_name)
        assignment_data = assignmestObjj.get_assignment_name_data()
        
        if not assignment_data:
            return jsonify({"error": "There are no any assignments untill Now"}), 404

        # Update assignment
        assObj = Assignments(
            assignment_id=assignment_data[0]['id'], 
            submit_assignment=1, 
            solved=1,
            description=assignment_data[0]['description'] ,
            assignment_name=assignment_data[0]['assignment_name'],
            semester_number=assignment_data[0]['semester_number'], 
            course_id=assignment_data[0]['course_id'], 
            file_upload_link=assignment_data[0]['file_upload_link'], 
            prof_id=assignment_data[0]['prof_id'], 
            squad_number=assignment_data[0]['squad_number'], 
            department=assignment_data[0]['department'] , 
            assignemnt_date = assignment_data[0]['assignemnt_date'] , 
            submit_date = datetime.today() 
        )
        assObj.update_assignment()

        # Add assignment submission
        assignmestObj = AssignmentSubmissions(
            assignment_id=assignment_data[0]['id'],
            squad_number=student_data_info[0]['squad_number'],
            semester_number=student_data_info[0]['semester_numer'],
            department=student_data_info[0]['department'],
            prof_id=user_info[0]['UserID'],
            course_id=course_data[0]['CourseID'],
            file_upload_link=file_link,
            student_id=user_id ,
            assignment_grade = 0 
        )
        assignmestObj.add_submission()

        return jsonify({"result": "Yes", "message": "Assignment submitted!"}), 200

    # For GET request: Fetch assignments data
    assignmestObj = Assignments(
        squad_number=student_data_info[0]['squad_number'],
        semester_number=student_data_info[0]['semester_numer']
    )
    ass_data = assignmestObj.get_data_by_squad_semester_semes()
    responses =[]
    if not ass_data : 
        return jsonify({"error": "assignments data not found"}), 404
    
    for assignment in ass_data : 
        courseObj = Courses(CourseID=assignment['course_id'])
        userobj = Users(UserID =assignment['prof_id'])
        course_data = courseObj.get_course_data()
        prof_data =userobj.get_user_data()
        responses.append({
            "assignment_id" : assignment['id'],
            "assignment_name" : assignment['assignment_name'] , 
            "assignment_link" : assignment['file_upload_link'],
            "deadline" : assignment['assignemnt_date'] , 
            "course_name" : course_data[0]['CourseName'] , 
            "course_code" : course_data[0]['CourseCode'] , 
            "prof_name" : prof_data[0]['FirstName'] , 
            "Submit_assignment" :assignment['submit_assignment']
        })
         
    
    return jsonify({
        "assignments_data": responses,
        "Student_data": student_data_info[0] , 
        "user_info" : user_std_data
    }), 200
    
  
# Show Assignements info
@app.route('/show_assignments_info', methods=['POST'])
@token_required
def show_assignments_info() : 
        # Extract user data from the JWT

    user_id = request.user_id
    user_type = request.user_type
    userobj = Users(UserID=user_id)
    user_std_data = userobj.get_user_data()

    if not user_std_data:
        return jsonify({"error": "User data not found"}), 404

    # Fetch professor-specific data
    std_obj = Students(StudentID_fk=user_id)
    std_data = std_obj.get_student_data_with_StudentID_fk()
    if not std_data:
         return jsonify({"error": "student data not found"}), 404
        # Ensure the user is a professor
    if str(user_type).lower() != 'student':
        return jsonify({"error": "Unauthorized access"}), 403
    
    data = request.get_json()
    ass_id = data.get("assignment_id")
    
    assignObj = Assignments(assignment_id=ass_id)
    assign_data = assignObj.get_assignment_data()
    course_obj =Courses(CourseID=assign_data[0]['course_id'])
    course_info = course_obj.get_course_data()
    prof_obj = Users(UserID=course_info[0]['prof_id'])
    prof_data = prof_obj.get_user_data()
    assignment_data_all = {
        "student_submit" : assign_data[0]['submit_assignment'],
        "deadline" : assign_data[0]['assignemnt_date'],
        "prof_name" : f'{prof_data[0]['FirstName']} {prof_data[0]['LastName']}' ,
        "prof_id" :  prof_data[0]['UserID'],
        "assignment_id" : assign_data[0]['id'] ,
        "assignment_name" : assign_data[0]['assignment_name'],
        "course_name" : course_info[0]['CourseName'],
        "course_code" : course_info[0]['CourseCode'],
        "file_upload_link" : assign_data[0]['file_upload_link'],
        "Squad_number" : assign_data[0]['squad_number'] , 
        "department" : assign_data[0]['department'],
        "semester_number" : assign_data[0]["semester_number"] , 
        "assignment_description" :  assign_data[0]['description'] 
    }
     
    return jsonify({"assignments_data": assignment_data_all , 
                    "student_info" :user_std_data[0],
                    "student_info_2" : std_data[0]})  # Wrap response in jsonify


##########################################################################################################################################################
##########################################################################################################################################################
##########################################################################################################################################################


#############################################################################
# Professors
#############################################################################

@app.route('/prof_homepage', methods=['GET'])
@token_required
def prof_homepage():
    # Extract user data from the JWT
    user_id = request.user_id
    user_type = request.user_type

    # Ensure the user is a professor
    if str(user_type).lower() != 'professor':
        return jsonify({"error": "Unauthorized access"}), 403

    # Fetch user data using the user_id from the JWT
    userobj = Users(UserID=user_id)
    user_std_data = userobj.get_user_data()

    if not user_std_data:
        return jsonify({"error": "User data not found"}), 404

        # Fetch professor-specific data
    profobj = Professors(prof_user_id=user_id)
    prof_data = profobj.get_professor_data_with_prof_user_id()
    if not prof_data:
         return jsonify({"error": "Professor data not found"}), 404


    # Get professor information
    prof_info = {
        "std_code": user_std_data[0].get("std_code"),
        "FirstName": user_std_data[0].get("FirstName"),
        "LastName": user_std_data[0].get("LastName"),
        "UserID": user_std_data[0].get("UserID"),
        "gender": user_std_data[0].get("gender"),
        "UserType": user_std_data[0].get("UserType") , 
        "Department": prof_data[0].get("Department")
    }

    # Get total courses, assigned tasks, and submitted tasks
    courses = profobj.get_total_courses()
    assignments_obj = Assignments(prof_id=user_id)
    assigned_tasks = assignments_obj.get_assigned_tasks()
    submited_tasks = assignments_obj.get_submited_tasks()

    # Get total number of students
    courses_register_obj = CourseRegistrations(prof_id=user_id)
    number_students = courses_register_obj.get_total_students()

    # Get last 5 notifications
    notification_obj = Notifications(UserID=user_id)
    notification_data = notification_obj.get_user_data()

    # Format notification data
    formatted_notifications = []
    for notification in notification_data:
        formatted_notifications.append({
            "UserID": notification.get("UserID"),
            "Message": notification.get("Message"),
            "Receiver": notification.get("Receiver"),
            "notify_type": notification.get("notify_type")
        })

    # Get recent assignments
    assignment_obj = AssignmentSubmissions(prof_id=user_id)
    assigments_submited_data = assignment_obj.get_submission_data_by_prof_id()

    recent_assigments = []
    for submission in assigments_submited_data:
        assignment_obj_from_prof = Assignments(assignment_id=submission['assignment_id'])
        ass_data = assignment_obj_from_prof.get_assignment_data()

        if ass_data:
            recent_assigments.append({
                "student_name": user_std_data[0].get("FirstName"),
                "assignment_id" : ass_data[0].get("id"),
                "assignment_name": ass_data[0].get("assignment_name"),
                "assignment_link": ass_data[0].get("file_upload_link"),
                "submit_date": ass_data[0].get("submit_date"),
                "Submit_assignment" : ass_data[0].get("submit_assignment")
            })

    # Return the response
    return jsonify({
        "prof_info": prof_info,
        "courses": courses[0],
        "number_students": number_students[0],
        "assigned_tasks": assigned_tasks[0],
        "submited_tasks": submited_tasks[0],
        "recent_notifications": formatted_notifications,
        "recent_assigments": recent_assigments
    })

#############################################################################
# Assignments Page

@app.route('/assignments_page', methods=['GET'])
@token_required
def assignments_page():
    # Extract user data from the JWT
    user_id = request.user_id
    user_type = request.user_type

    # Ensure the user is a professor
    if str(user_type).lower() != 'professor':
        return jsonify({"error": "Unauthorized access"}), 403
    # Fetch user data using the user_id from the JWT
    
    userobj = Users(UserID=user_id)
    user_std_data = userobj.get_user_data()

    if not user_std_data:
        return jsonify({"error": "User data not found"}), 404

        # Fetch professor-specific data
    profobj = Professors(prof_user_id=user_id)
    prof_data = profobj.get_professor_data_with_prof_user_id()
    if not prof_data:
         return jsonify({"error": "Professor data not found"}), 404
     
    assObj = Assignments(prof_id=user_id)
    assignments_data = assObj.get_assignment_data()

    response = []  # Use a list to store multiple assignments

    for assignment in assignments_data:
        course_obj = Courses(CourseID=assignment['course_id'])
        course_data = course_obj.get_course_data()

        # Ensure course_data is not empty
        course_name = course_data[0]['CourseName'] if course_data else "Unknown Course"
        # std_obj = Students(StudentID=assignment['student_i'])
        response.append({
            "assignment_id": assignment['id'],
            "assignment_name": assignment['assignment_name'],
            "course_name": course_name, 
            "course_code" : course_data[0]['CourseCode'],
            "description" : assignment['description'],
            "squad_number" : assignment['squad_number'] , 
            "semester_number" : assignment['semester_number'] , 
            "file_link": assignment['file_upload_link'],
            "deadline": assignment['assignemnt_date'] ,  # Fixed spelling
            "department" : assignment['department']
        })

    return jsonify({"assignments_data": response , 
                    "professor_info" :user_std_data[0],
                    "prof_data_2" : prof_data[0]})  # Wrap response in jsonify


@app.route('/add_new_assignment', methods=['POST', "GET"])
@token_required
def add_new_assignment():
    user_id = request.user_id
    user_type = request.user_type
    userobj = Users(UserID=user_id)
    user_std_data = userobj.get_user_data()

    if not user_std_data:
        return jsonify({"error": "User data not found"}), 404

    # Fetch professor-specific data
    profobj = Professors(prof_user_id=user_id)
    prof_data = profobj.get_professor_data_with_prof_user_id()
    if not prof_data:
        return jsonify({"error": "Professor data not found"}), 404
        
    # Ensure the user is a professor
    if str(user_type).lower() != 'professor':
        return jsonify({"error": "Unauthorized access"}), 403

    if request.method == "POST":
        data = request.get_json()
        
        if not data:
            return jsonify({"error": "Invalid request data"}), 400

        # Extracting assignment details from JSON payload
        assignment_name = data.get("assignment_name")
        course_code = data.get("course_code")
        file_upload_link = data.get("file_upload_link", "")
        squad_number = data.get("squad_number")
        department = data.get("department")
        semester_number = data.get("semester_number")
        description = data.get("description", "")
        deadline = data.get("assignment_date")

        if not assignment_name or not course_code or not squad_number or not department or not semester_number:
            return jsonify({"error": "Missing required fields"}), 400

        courseobj = Courses(CourseCode=course_code)
        course_data = courseobj.get_course_data_from_CourseCode()

        # Creating assignment object
        assignment = Assignments(
            assignment_name=assignment_name,
            course_id=course_data[0]['CourseID'],
            file_upload_link=file_upload_link,
            prof_id=user_id,
            squad_number=squad_number,
            department=department,
            semester_number=semester_number,
            description=description,
            submit_date="Not Submitted",
            assignemnt_date=deadline,
            solved=0,  # Default value for solved
            submit_assignment=0  # Default value for submit_assignment
        )

        # Storing the assignment in the database
        assignment.add_assignment()

        return jsonify({"message": "Assignment added successfully", "result": "Yes"}), 201

    # Get all courses taught by this professor
    courses_obj = Courses(prof_id=user_id)
    courses_data = courses_obj.get_course_data_of_prof()
    
    if not courses_data:
        return jsonify({"error": "No courses found for this professor"}), 404

    # Prepare the response data
    professor_courses = []
    for course in courses_data:
        professor_courses.append({
            "course_id": course['CourseID'],
            "course_name": course['CourseName'],
            "course_code": course['CourseCode'],
            "squad_number": course['squad_number'],
            "department": course['department'],
            "semester_number": course['semester_number']
        })

    return jsonify({
        "professor_courses": professor_courses,
        "professor_info": {
            "professor_id": user_id,
            "professor_name": f"{user_std_data[0]['FirstName']} {user_std_data[0]['LastName']}"
        }
    }), 200


@app.route('/update_assignment', methods=['POST'])
@token_required
def update_assignment():
    user_id = request.user_id
    user_type = request.user_type
    userobj = Users(UserID=user_id)
    user_std_data = userobj.get_user_data()

    if not user_std_data:
        return jsonify({"error": "User data not found"}), 404

        # Fetch professor-specific data
    profobj = Professors(prof_user_id=user_id)
    prof_data = profobj.get_professor_data_with_prof_user_id()
    if not prof_data:
         return jsonify({"error": "Professor data not found"}), 404
        # Ensure the user is a professor
    if str(user_type).lower() != 'professor':
        return jsonify({"error": "Unauthorized access"}), 403

    data = request.get_json()

    # Validate input data
    if not data:
        return jsonify({"error": "Invalid request data"}), 400

    assignment_id = data.get("assignment_id")
    if not assignment_id:
        return jsonify({"error": "Assignment ID is required"}), 400

    # Fetch the assignment
    assignment = Assignments(assignment_id=assignment_id)
    existing_assignment = assignment.get_assignment_data()

    if not existing_assignment:
        return jsonify({"error": "Assignment not found"}), 404

    # Create assignment object with updated values
    updated_assignment = Assignments(
        assignment_id=assignment_id,
        assignment_name=data.get("assignment_name", existing_assignment[0]['assignment_name']),
        course_id=data.get("course_id", existing_assignment[0]['course_id']),
        file_upload_link=data.get("file_upload_link", existing_assignment[0]['file_upload_link']),
        squad_number=data.get("squad_number", existing_assignment[0]['squad_number']),
        department=data.get("department", existing_assignment[0]['department']),
        semester_number=data.get("semester_number", existing_assignment[0]['semester_number']),
        description=data.get("description", existing_assignment[0]['description']),
        submit_date=data.get("submit_date", existing_assignment[0]['submit_date']),
        assignemnt_date=data.get("assignment_date", existing_assignment[0]['assignemnt_date']),
        solved=data.get("solved", existing_assignment[0]['solved']), 
        prof_id=data.get("prof_id", existing_assignment[0]['solved']),
        submit_assignment=data.get("submit_assignment", existing_assignment[0]['submit_assignment'])
    )

    # Update assignment in the database
    updated_assignment.update_assignment()

    return jsonify({"message": "Assignment updated successfully", "result" :"Yes"}), 200


@app.route('/delete_assignment', methods=['POST'])
@token_required
def delete_assignment():
    user_id = request.user_id
    user_type = request.user_type
    userobj = Users(UserID=user_id)
    user_std_data = userobj.get_user_data()

    if not user_std_data:
        return jsonify({"error": "User data not found"}), 404

        # Fetch professor-specific data
    profobj = Professors(prof_user_id=user_id)
    prof_data = profobj.get_professor_data_with_prof_user_id()
    if not prof_data:
         return jsonify({"error": "Professor data not found"}), 404
        # Ensure the user is a professor
    if str(user_type).lower() != 'professor':
        return jsonify({"error": "Unauthorized access"}), 403

    data = request.get_json()
    
    if not data or "assignment_id" not in data:
        return jsonify({"error": "Assignment ID is required"}), 400

    assignment_id = data.get("assignment_id")

    # Check if the assignment exists
    assignment = Assignments(assignment_id=assignment_id)
    existing_assignment = assignment.get_assignment_data()
    
    if not existing_assignment:
        return jsonify({"error": "Assignment not found"}), 404

    # Delete the assignment
    assignment.delete_assignment()

    return jsonify({"message": "Assignment deleted successfully" , "result" : "Yes"}), 200


#############################################################################

# Notificaiton Page
@app.route('/professor_notifications', methods=['GET'])
@token_required
def get_notifications_professor():
    # Extract user data from the JWT
    user_id = request.user_id
    user_type = request.user_type
    userobj = Users(UserID=user_id)
    user_std_data = userobj.get_user_data()

    if not user_std_data:
        return jsonify({"error": "User data not found"}), 404

        # Fetch professor-specific data
    profobj = Professors(prof_user_id=user_id)
    prof_data = profobj.get_professor_data_with_prof_user_id()
    if not prof_data:
         return jsonify({"error": "Professor data not found"}), 404
        # Ensure the user is a professor
    if str(user_type).lower() != 'professor':
        return jsonify({"error": "Unauthorized access"}), 403

    try:
        # Fetch notifications for the user
        notification = Notifications(UserID=user_id)
        notifications_list = notification.get_notification_data()

        # Fetch user data for the response
        stdobj = Users(UserID=user_id)
        student_data = stdobj.get_user_data()

        if not student_data:
            return jsonify({"error": "User data not found"}), 404

        # Return the notifications and student data as JSON
        return jsonify({
            "notifications": notifications_list,
            "prof_data": student_data[0]
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

#############################################################################

# Student grades Page
@app.route('/student_grades_page_from_prof', methods=['GET'])
@token_required
def student_grades_page_from_prof():
    # Extract user data from the JWT
    user_id = request.user_id
    user_type = request.user_type
    userobj = Users(UserID=user_id)
    user_std_data = userobj.get_user_data()

    if not user_std_data:
        return jsonify({"error": "User data not found"}), 404

        # Fetch professor-specific data
    profobj = Professors(prof_user_id=user_id)
    prof_data = profobj.get_professor_data_with_prof_user_id()
    if not prof_data:
         return jsonify({"error": "Professor data not found"}), 404
        # Ensure the user is a professor
    if str(user_type).lower() != 'professor':
        return jsonify({"error": "Unauthorized access"}), 403

    # Get all semester grades
    semester_grades_obj = SemesterGrades()
    semester_grades_data = semester_grades_obj.get_grade_data()
    
    if not semester_grades_data:
        return jsonify({"error": "No semester grades found"}), 404

    # Prepare response data
    student_grades_list = []

    std_id = []
    for semester_grade in semester_grades_data:
        student_id = semester_grade['student_id']
        std_id.append(student_id)
        # print(f"std_id : {std_id}")
        # if student_id not in std_id : 
        #     continue
        # Fetch student details
        student_obj = Users(UserID=student_id)
        student_info = student_obj.get_user_data()
        
        if not student_info:
            continue

        # Fetch student academic data
        studentobj = Students(StudentID_fk=student_id)
        student_academic_data = studentobj.get_current_squad_and_semester_fk()
        
        if not student_academic_data:
            continue

        # Get year work from grades table if needed
        grades_obj = Grades(StudentID=student_id)
        grade_data = grades_obj.get_grade_data()
        year_work = grade_data[0]['year_work'] if grade_data else None

        # Build the response record
        student_record = {
            "user_id": student_id,
            "first_name": f"{student_info[0]['FirstName']} {student_info[0]['LastName']}",
            "department": student_academic_data[0]['department'],
            "semester": semester_grade['semester_id'],
            "squad": semester_grade['squad_number'],
            "GPA": semester_grade['GPA'],
            "year_work": year_work
        }
        
        student_grades_list.append(student_record)

    return jsonify({
        "student_grades": student_grades_list
    }), 200



@app.route('/update_student_grades', methods=['POST'])
@token_required
def update_student_grades():
    # Extract user data from the JWT
    user_id = request.user_id
    user_type = request.user_type

    # Ensure the user is a professor
    if str(user_type).lower() != 'professor':
        return jsonify({"error": "Unauthorized access"}), 403

    # Fetch professor-specific data
    profobj = Professors(prof_user_id=user_id)
    prof_data = profobj.get_professor_data_with_prof_user_id()
    if not prof_data:
        return jsonify({"error": "Professor data not found"}), 404

    # Get data from the request body
    data = request.get_json()
    if not data:
        return jsonify({"error": "Request body is required"}), 400

    # Extract required fields
    student_id = data.get('student_id')
    course_id = data.get('course_id')
    midterm_grade = data.get('midterm_grade')
    assignment_grade = data.get('assignment_grade')
    final_grade = data.get('final_grade')
    total_degree = data.get('total_degree')
    year_work = data.get('year_work')

    # Validate required fields
    if not student_id or not course_id:
        return jsonify({"error": "Student ID and Course ID are required"}), 400

    # Fetch the grade record for the student and course
    studentobj = Students(StudentID_fk=student_id)
    student_data = studentobj.get_current_squad_and_semester_fk()
    
    grades_obj = Grades(StudentID=student_id, CourseID=course_id)
    grade_data = grades_obj.get_grade_data_based_course_id_and_student()

    if not grade_data:
        return jsonify({"error": "Grade record not found for the given student and course"}), 404

    semesterobj = Semesters(id=student_data[0]['semester_numer'])
    semes_data = semesterobj.get_semester_data()
    print(f"squad_number : {grade_data[0]['squad_number']}\n student_id: {student_id}\ncourse_id: {course_id}\nsemester_numer : {student_data[0]['semester_numer']}\n ")
    # Update the grades
    # print("Grade data contents:", grade_data[0])
    if not grade_data[0].get('semester_id') or not grade_data[0].get('squad_number'):
        return jsonify({"error": "Missing semester_id or squad_number in grade record"}), 400
    
    grades_obj = Grades(
            GradeID=grade_data[0]['GradeID'],
            StudentID=student_id, 
            CourseID=course_id, 
            MidtermGrade=midterm_grade,
            AssignmentGrade=assignment_grade,
            FinalGrade=final_grade,
            total_degree=total_degree,
            pass_status=grade_data[0]['pass_status'], 
            department=grade_data[0]['department'],
            year_work=year_work, 
            semester_id=grade_data[0]['semester_id'],
            squad_number=grade_data[0]['squad_number'],
            points=grade_data[0]['points'],
            Grade=grade_data[0]['Grade'],
            Semester=semes_data[0]['semester_name']
        )
    grades_obj.update_grade()
        
        # Calculate and update GPA after grade update
    update_student_gpa(student_id, student_data[0]['semester_numer'] , student_data[0]['squad_number'])

    # Return success response
    return jsonify({"message": "Grades updated successfully", "result": "Yes"}), 200


def convert_grade_to_points(grade):
    """
    Convert letter grade to grade points based on university scale
    Modify this according to your university's grading system
    """
    grade_scale = {
        'A+': 4.0,
        'A': 4.0,
        'A-': 3.7,
        'B+': 3.3,
        'B': 3.0,
        'B-': 2.7,
        'C+': 2.3,
        'C': 2.0,
        'C-': 1.7,
        'D+': 1.3,
        'D': 1.0,
        'F': 0.0
    }
    return grade_scale.get(grade.upper(), 0.0)

def update_student_gpa(student_id, semester_id , squad_number):
    """
    Calculate and update the student's GPA for a specific semester
    and update total passed credit hours
    """
    try:
        # Get all grades for the student in this semester
        grades_obj = Grades(StudentID=student_id , squad_number=squad_number, semester_id=semester_id)
        semester_grades = grades_obj.get_data_by_squad_semester_std()
        
        if not semester_grades:
            return
        
        total_grade_points = 0
        total_credit_hours = 0
        total_passed_credit_hours = 0
        
        for grade in semester_grades:
            # Get course credit hours
            course_obj = Courses(CourseID=grade['CourseID'])
            course_data = course_obj.get_course_data()
            
            if not course_data:
                continue
                
            credit_hours = course_data[0]['CreditHours']
            
            # Convert letter grade to grade points
            grade_points = convert_grade_to_points(grade['Grade'])
            
            # Calculate contribution to GPA
            total_grade_points += grade_points * credit_hours
            total_credit_hours += credit_hours
            
            # Check if the grade is passing (you might need to adjust this condition)
            if grade.get('pass_status', '').lower() == 'passed' or grade_points >= 1.0:  # Assuming D (1.0) is passing
                total_passed_credit_hours += credit_hours
        
        # Calculate GPA
        if total_credit_hours > 0:
            gpa = total_grade_points / total_credit_hours
        else:
            gpa = 0.0
            
        # Update semester_grades table
        semester_grade_obj = SemesterGrades(student_id=student_id,semester_id=semester_id,squad_number=squad_number)
        semes_data = semester_grade_obj.get_data_by_student_and_semester_and_Squad()
        
        semester_grade_obj = SemesterGrades(
            student_id=student_id,
            semester_id=semester_id,
            squad_number=squad_number,
            gpa=gpa,
            TotalPassedCreditHours=total_credit_hours , 
            TotalRegisteredCreditHours = total_credit_hours ,
            available_hours_registered = semes_data[0]['available_hours_registered'],
            total_req_hours=total_credit_hours
        )
        
        # Check if record exists
        existing_record = semester_grade_obj.get_data_by_student_and_semester()
        print(f"existing_record : {existing_record}")
        if existing_record:
            semester_grade_obj = SemesterGrades(
                id= existing_record[0]['semester_grade_id'],
                student_id=student_id,
                semester_id=semester_id,
                squad_number=squad_number,
                gpa=gpa,
                total_req_hours=total_credit_hours,
            TotalPassedCreditHours=total_credit_hours , 
            TotalRegisteredCreditHours = total_credit_hours ,
            available_hours_registered = semes_data[0]['available_hours_registered']
            )
            semester_grade_obj.update_grade()
        else:
            semester_grade_obj.add_grade()
            
        # Update student's cumulative GPA and total passed credit hours
        # update_cumulative_gpa(student_id, total_passed_credit_hours)
        
    except Exception as e:
        print(f"Error updating GPA: {str(e)}")
        raise


#############################################################################
 
# Student assignments
@app.route('/student_assignments_submited', methods=['GET'])
@token_required
def student_assignments_submited():
    # Extract user data from the JWT
    user_id = request.user_id
    user_type = request.user_type

    # Ensure the user is a professor
    if str(user_type).lower() != 'professor':
        return jsonify({"error": "Unauthorized access"}), 403

    # Fetch professor-specific data
    profobj = Professors(prof_user_id=user_id)
    prof_data = profobj.get_professor_data_with_prof_user_id()
    if not prof_data:
        return jsonify({"error": "Professor data not found"}), 404

    # Fetch all assignment submissions for the professor
    submissions_obj = AssignmentSubmissions(prof_id=user_id)
    submissions_data = submissions_obj.get_submission_data_by_prof_id()

    if not submissions_data:
        return jsonify({"error": "No assignment submissions found for this professor"}), 404

    # Prepare the response data
    submitted_assignments = []

    # Loop through each submission to fetch additional details
    for submission in submissions_data:
        # Fetch student details
        student_obj = Users(UserID=submission['student_id'])
        student_info = student_obj.get_user_data()

        if not student_info:
            continue  # Skip if student data is not found

        # Fetch course details
        course_obj = Courses(CourseID=submission['course_id'])
        course_data = course_obj.get_course_data()

        if not course_data:
            continue  # Skip if course data is not found

        # Fetch assignment details
        assignment_obj = Assignments(assignment_id=submission['assignment_id'])
        assignment_data = assignment_obj.get_assignment_data()

        if not assignment_data:
            continue  # Skip if assignment data is not found

        # Append the required data to the response
        submitted_assignments.append({
            "student_name": f"{student_info[0]['FirstName']} {student_info[0]['LastName']}",
            "squad": submission['squad_number'],
            "department": submission['department'],
            "course_name": course_data[0]['CourseName'],
            "assignment_name": assignment_data[0]['assignment_name'],
            "file": submission['file_upload_link'],
            "assignment_grade": submission['assignment_grade'],
            "student_id" : submission['student_id'],
            "assignment_id" : submission['assignment_id'], 
            "submit_id" : submission['submit_id']
        })

    # Return the response
    return jsonify({"submitted_assignments": submitted_assignments , "user_info" : prof_data}), 200

 
@app.route('/update_assignment_grade', methods=['POST'])
@token_required
def update_assignment_grade():
    # Extract user data from the JWT
    user_id = request.user_id
    user_type = request.user_type

    # Ensure the user is a professor
    if str(user_type).lower() != 'professor':
        return jsonify({"error": "Unauthorized access"}), 403

    # Fetch professor-specific data
    profobj = Professors(prof_user_id=user_id)
    prof_data = profobj.get_professor_data_with_prof_user_id()
    if not prof_data:
        return jsonify({"error": "Professor data not found"}), 404

    # Get data from the request body
    data = request.get_json()
    if not data:
        return jsonify({"error": "Request body is required"}), 400

    # Extract required fields
    student_id = data.get('student_id')
    assignment_id = data.get('assignment_id')
    assignment_grade = data.get('assignment_grade')

    # Validate required fields
    if not student_id or not assignment_id or assignment_grade is None:
        return jsonify({"error": "Student ID, Assignment ID, and Assignment Grade are required"}), 400

    # Fetch student data
    studentobj = Students(StudentID_fk=student_id)
    student_data = studentobj.get_current_squad_and_semester_fk()

    if not student_data:
        return jsonify({"error": "Student data not found"}), 404

    # Fetch the assignment submission record for the student and assignment
    submission_obj = AssignmentSubmissions(student_id=student_id, assignment_id=assignment_id)
    submission_data = submission_obj.get_submission_data_by_student_id_assignment_id()

    if not submission_data:
        return jsonify({"error": "Assignment submission not found for the given student and assignment"}), 404

    # Fetch semester data
    semesterobj = Semesters(squad_number=student_data[0]['squad_number'] , semester_number=student_data[0]['semester_numer'])
    semes_data = semesterobj.get_semester_data_with_number_with_squad()

    if not semes_data:
        return jsonify({"error": "Semester data not found"}), 404

    # Update the assignment grade
    try:
        submission_obj = AssignmentSubmissions(
            submit_id=submission_data[0]['submit_id'],
            student_id=student_id,
            assignment_id=assignment_id,
            assignment_grade=assignment_grade,
            squad_number=student_data[0]['squad_number'],
            department=student_data[0]['department'],
            semester_number=student_data[0]['semester_numer'],
            course_id=submission_data[0]['course_id'],
            prof_id=user_id,
            file_upload_link=submission_data[0]['file_upload_link']
        )
        submission_obj.update_submission()
    except Exception as e:
        return jsonify({"error": f"Failed to update assignment grade: {str(e)}"}), 500

    # Return success response
    return jsonify({"message": "Assignment grade updated successfully" , "result" : "Yes"}), 200

 
# @app.route('/show_more_grades_student', methods=['POST'])
# @token_required
# def show_more_grades_student():
#     # Extract user data from the JWT
#     user_id = request.user_id
#     user_type = request.user_type

#     userobj= Users(UserID=user_id)
#     prof_data = userobj.get_user_data()
#     # Ensure the user is a professor
#     if str(user_type).lower() != 'professor':
#         return jsonify({"error": "Unauthorized access"}), 403


#     # Get the student_id from the request body
#     data = request.get_json()
#     if not data or 'student_id' not in data:
#         return jsonify({"error": "Student ID is required in the request body"}), 400

#     student_id = data.get('student_id')

#     # Fetch student data
#     student_obj = Users(UserID=student_id)
#     student_info = student_obj.get_user_data()
#     if not student_info:
#         return jsonify({"error": "Student data not found"}), 404

#     # Fetch student academic data (GPA, department, semester, squad)
#     student_academic_obj = Students(StudentID=student_id)
#     student_academic_data = student_academic_obj.get_student_data()
#     if not student_academic_data:
#         return jsonify({"error": "Student academic data not found"}), 404

#     # Fetch all grades for the student
#     grades_obj = Grades(StudentID=student_id)
#     grade_data = grades_obj.get_grade_data()

#     if not grade_data:
#         return jsonify({"error": "No grades found for this student"}), 404

#     # Prepare the response data
#     student_grades_info = []

#     # Loop through each grade to fetch course details
#     for grade in grade_data:
#         course_obj = Courses(CourseID=grade['CourseID'])
#         course_data = course_obj.get_course_data()

#         if not course_data:
#             continue  # Skip if course data is not found

#         # Append the required data to the response
#         student_grades_info.append({
#             "course_id" : course_data[0]['CourseID'],
#             "course_name": course_data[0]['CourseName'],
#             "course_code": course_data[0]['CourseCode'],
#             "grades": {
#                 "midterm_grade": grade['MidtermGrade'],
#                 "assignment_grade": grade['AssignmentGrade'],
#                 "final_grade": grade['FinalGrade'],
#                 "total_degree": grade['total_degree'],
#                 "pass_status": grade['pass_status'],
#                 "year_work": grade['year_work']
#             }
#         })

#     # Include GPA in the response
#     response_data = {
#         "student_id": student_id,
#         "student_email" : student_info[0]['Email'],
#         "first_name": student_info[0]['FirstName'],
#         "last_name": student_info[0]['LastName'],
#         "department": student_academic_data[0]['department'],
#         "semester": student_academic_data[0]['semester_numer'],
#         "squad": student_academic_data[0]['squad_number'],
#         "GPA": student_academic_data[0]['CumulativeGPA'],
#         "courses_grades": student_grades_info , 
#         "prof_info" : prof_data
#     }

#     # Return the response
#     return jsonify(response_data), 200
 

@app.route('/show_more_grades_student', methods=['POST'])
@token_required
def show_more_grades_student():
    # Extract user data from the JWT
    user_id = request.user_id
    user_type = request.user_type
    userobj = Users(UserID=user_id, UserType=user_type)
    user_std_data = userobj.get_user_data_admin()

    if not user_std_data:
        return jsonify({"error": "User data not found"}), 404

    # Ensure the user is an admin
    if str(user_type).lower() != 'professor':
        return jsonify({"error": "Unauthorized access"}), 403
    
    professor_info = {
        "professor_name": user_std_data[0]['FirstName'] + " " + user_std_data[0]['LastName'],
        "professor_email": user_std_data[0]['Email'],
        "professor_gender": user_std_data[0]['gender'],
        "professor_id": user_std_data[0]['UserID']
    }

    # Get the student_id from the request body
    data = request.get_json()
    if not data or 'student_id' not in data:
        return jsonify({"error": "Student ID is required in the request body"}), 400

    student_id = data.get('student_id')
    semester_number = data.get('semester_number')
    squad_number = data.get('squad_number')

    # Fetch student data
    student_obj = Users(UserID=student_id)
    student_info = student_obj.get_user_data()
    if not student_info:
        return jsonify({"error": "Student data not found"}), 404

    # Fetch student academic data (GPA, department, semester, squad)
    student_academic_obj = Students(StudentID_fk=student_id , semester_number=semester_number ,squad_number=squad_number )
    student_academic_data = student_academic_obj.get_student_data_squad_number_fkk()
    
    if not student_academic_data:
        return jsonify({"error": "Student academic data not found"}), 404

    semester_obj = SemesterGrades(student_id=student_id , semester_id=student_academic_data[0]['semester_numer'])
    semester_data = semester_obj.get_grade_data_stdid_semester()
    # Fetch all grades for the student  
    grades_obj = Grades(StudentID=student_id , squad_number=squad_number , semester_id=semester_number)
    grade_data = grades_obj.get_data_by_squad_semester_std()

    if not grade_data:
        return jsonify({"error": "No grades found for this student"}), 404

    # Prepare the response data
    student_grades_info = []

    # Loop through each grade to fetch course details
    for grade in grade_data:
        course_obj = Courses(CourseID=grade['CourseID'])
        course_data = course_obj.get_course_data()

        if not course_data:
            continue  # Skip if course data is not found

        # Append the required data to the response
        student_grades_info.append({
            "course_id" : course_data[0]['CourseID'],
            "course_name": course_data[0]['CourseName'],
            "course_code": course_data[0]['CourseCode'],
            "grades": {
                "midterm_grade": grade['MidtermGrade'],
                "assignment_grade": grade['AssignmentGrade'],
                "final_grade": grade['FinalGrade'],
                "total_degree": grade['total_degree'],
                "pass_status": grade['pass_status'],
                "year_work": grade['year_work']
            }
        })

    # Include GPA in the response
    response_data = {
        "student_id": student_id,
        "student_email" : student_info[0]['Email'],
        "first_name": student_info[0]['FirstName'],
        "last_name": student_info[0]['LastName'],
        "department": student_academic_data[0]['department'],
        "semester": student_academic_data[0]['semester_numer'],
        "squad": student_academic_data[0]['squad_number'],
        "GPA": semester_data[0]['GPA'],
        "courses_grades": student_grades_info , 
        "professor_info" : professor_info
    }

    # Return the response
    return jsonify(response_data), 200
  
#############################################################################
#############################################################################
# admin
#############################################################################

# Home Page : 
###############################################
@app.route('/admin_homepage')
@token_required
def admin_homepage() : 
    user_id = request.user_id
    user_type = request.user_type
    userobj = Users(UserID=user_id , UserType=user_type)
    user_std_data = userobj.get_user_data_admin()

    if not user_std_data:
        return jsonify({"error": "User data not found"}), 404

        # Ensure the user is a professor
    if str(user_type).lower() != 'admin':
        return jsonify({"error": "Unauthorized access"}), 403
    
    admin_info = {
       "admin_name" : user_std_data[0]['FirstName'] + " " + user_std_data[0]['LastName'] , 
       "admin_email" :  user_std_data[0]['Email'] ,
       "admin_gender" : user_std_data[0]['gender'] , 
       "admin_id" : user_std_data[0]['UserID']
    }
    
    coursesobj = Courses()
    userobj = Users()
    gradobj = Grades()
    regobj = CourseRegistrations()

    # Cards
    ############################
    total_number_courses = coursesobj.total_number_courses()    
    total_number_students = userobj.total_number_of_students()
    total_number_professors = userobj.total_number_of_professors()
    total_number_register_students = regobj.get_total_students_registered()
    total_student_fail =gradobj.get_total_students_fail() 
    total_students_success = gradobj.get_total_students_success()
    
    
    # Recent 5 Notifications
    ################################ 
    notifyObj = Notifications(UserID=user_id)
    last_recent_notification = notifyObj.get_user_data()
    
    # Top 10 students with higher GPA
    gradeobj = SemesterGrades()
    top_ten_students_grades = gradeobj.get_top_ten_students_with_higher_grades() 
    print(f"top_ten_students_grades : {top_ten_students_grades}")
    top_ten_students_grades_dashboard = []
    for std_grade in top_ten_students_grades : 
        print(F"semester number : {std_grade['semester_id']} , squad number : {std_grade['squad_number']}")
        studentobj = Students(StudentID_fk=std_grade['student_id']  , squad_number=std_grade['squad_number'] , semester_number=std_grade['semester_id'])
        student_data = studentobj.get_student_fk_data_squad_number()
        if not student_data : 
            continue 
        
        print(f"student_data : {student_data}")
        userobj = Users(UserID=std_grade['student_id'])
        user_data = userobj.get_user_data()
        top_ten_students_grades_dashboard.append({
            "student_name" : user_data[0]['FirstName'] + " " + user_data[0]['LastName'] , 
            "student_email" : user_data[0]['Email'],
            "Squad_number" : student_data[0]['squad_number'] , 
            "department" : student_data[0]['department'] , 
            "semester_number" : student_data[0]['semester_numer'],
            "GPA" : std_grade['GPA'] , 
            "total_regsiter_hours" : std_grade['total_req_hours'],
            "student_id" : student_data[0]['StudentID'] , 
            "student_fk_id" : student_data[0]['StudentID_fk']
        })
    
    return jsonify({
        "cards": {
            "total_courses": total_number_courses[0].get('number_of_courses', 0) if total_number_courses else 0,
            "total_students": total_number_students[0]['Count(Distinct UserID)'],
            "total_professors": total_number_professors[0].get('number_of_professor', 0) if total_number_professors else 0,
            "total_registered_students": total_number_register_students[0].get('total_number_students', 0) if total_number_register_students else 0,
            "students_failed": total_student_fail[0].get('number_of_students_success', 0) if total_student_fail else 0,
            "students_passed": total_students_success[0].get('number_of_students_success', 0) if total_students_success else 0
        },
        "notifications": last_recent_notification,
        "students_grades_top_ten": top_ten_students_grades_dashboard , 
        "admin_info" : admin_info
    }), 200


# User Management Page
###############################################
@app.route('/all_students_info', methods=['GET'])
@token_required
def get_all_students_info():
    user_id = request.user_id
    user_type = request.user_type
    userobj = Users(UserID=user_id , UserType=user_type)
    user_std_data = userobj.get_user_data_admin()

    if not user_std_data:
        return jsonify({"error": "User data not found"}), 404

        # Ensure the user is a professor
    if str(user_type).lower() != 'admin':
        return jsonify({"error": "Unauthorized access"}), 403
    
    admin_info = {
       "admin_name" : user_std_data[0]['FirstName'] + " " + user_std_data[0]['LastName'] , 
       "admin_email" :  user_std_data[0]['Email'] ,
       "admin_gender" : user_std_data[0]['gender'] , 
       "admin_id" : user_std_data[0]['UserID']
    }
    
    
    # Get all student users
    user_obj = Users(UserType='Student')
    students_data = user_obj.get_user_data_by_userttype()
    
    if not students_data:
        return jsonify({"error": "No students found"}), 404
    
    # Prepare response with all students' info
    response_data = []
    for student in students_data:
        # Get student-specific data
        student_obj = Students(StudentID_fk=student['UserID'])
        student_details = student_obj.get_current_squad_and_semester_fk()
        response_data.append({
            "student_name": f"{student['FirstName']} {student['LastName']}",
            "student_id": student['UserID'],
            "email": student['Email'],
            "gender": student['gender'],
            "status": student['status'],
            "std_code": student['std_code'],
            "password" : student['PasswordHash'],
            "student_details": {
                "Major": student_details[0]['Major'] if student_details else None,
                "AcademicLevel": student_details[0]['AcademicLevel'] if student_details else None,
                "squad_number": student_details[0]['squad_number'] if student_details else None,
                "semester_number": student_details[0]['semester_numer'] if student_details else None,
                "department": student_details[0]['department'] if student_details else None
            }
        })
    
    return jsonify({"students": response_data , "admin_info" : admin_info}), 200


@app.route('/all_professors_info', methods=['GET'])
@token_required
def get_all_professors_info():
    user_id = request.user_id
    user_type = request.user_type
    userobj = Users(UserID=user_id , UserType=user_type)
    user_std_data = userobj.get_user_data_admin()

    if not user_std_data:
        return jsonify({"error": "User data not found"}), 404

        # Ensure the user is a professor
    if str(user_type).lower() != 'admin':
        return jsonify({"error": "Unauthorized access"}), 403
    
    admin_info = {
       "admin_name" : user_std_data[0]['FirstName'] + " " + user_std_data[0]['LastName'] , 
       "admin_email" :  user_std_data[0]['Email'] ,
       "admin_gender" : user_std_data[0]['gender'] , 
       "admin_id" : user_std_data[0]['UserID']
    }
    
    # Get all professor users
    user_obj = Users(UserType='Professor')
    professors_data = user_obj.get_user_data_by_userttype()
    
    if not professors_data:
        return jsonify({"error": "No professors found"}), 404
    
    # Prepare response with all professors' info
    response_data = []
    for professor in professors_data:
        # Get professor-specific data
        prof_obj = Professors(prof_user_id=professor['UserID'])
        prof_details = prof_obj.get_professor_data_with_prof_user_id()
        total_courses = prof_obj.get_total_courses()
        
        response_data.append({
            "professor_name": f"{professor['FirstName']} {professor['LastName']}",
            "professor_id": professor['UserID'],
            "email": professor['Email'],
            "gender": professor['gender'],
            "status": professor['status'],
            "std_code" : professor['std_code'],
            "PasswordHash" : professor['PasswordHash'],
            "professor_details": {
                "Department": prof_details[0]['Department'] if prof_details else None,
                "TotalCourses": total_courses[0]['Courses_Number'] if total_courses else 0,
                "ProfessorID": prof_details[0]['ProfessorID'] if prof_details else None
            }
        })
    
    return jsonify({"professors": response_data, "admin_info" : admin_info}), 200


@app.route('/all_admins_info', methods=['GET'])
@token_required
def get_all_admins_info():
    user_id = request.user_id
    user_type = request.user_type
    userobj = Users(UserID=user_id , UserType=user_type)
    user_std_data = userobj.get_user_data_admin()

    if not user_std_data:
        return jsonify({"error": "User data not found"}), 404

        # Ensure the user is a professor
    if str(user_type).lower() != 'admin':
        return jsonify({"error": "Unauthorized access"}), 403
    
    admin_info = {
       "admin_name" : user_std_data[0]['FirstName'] + " " + user_std_data[0]['LastName'] , 
       "admin_email" :  user_std_data[0]['Email'] ,
       "admin_gender" : user_std_data[0]['gender'] , 
       "admin_id" : user_std_data[0]['UserID']
    }
    
    # Get all admin users
    user_obj = Users(UserType='Admin')
    admins_data = user_obj.get_user_data_by_userttype()
    
    if not admins_data:
        return jsonify({"error": "No admins found"}), 404
    
    # Prepare response with all admins' info
    response_data = []
    for admin in admins_data:
        # Get admin-specific data
        admin_obj = Admins(AdminID=admin['UserID'])
        admin_details = admin_obj.get_admin_data()
        
        response_data.append({
            "admin_name": f"{admin['FirstName']} {admin['LastName']}",
            "admin_id": admin['UserID'],
            "email": admin['Email'],
            "gender": admin['gender'],
            "status": admin['status'],
            "std_code" : admin['std_code'],
            "PasswordHash" : admin['PasswordHash'],
            "admin_details": {
                "Role": admin_details[0]['Role'] if admin_details else "Not specified"
            }
        })
    
    return jsonify({"admins": response_data, "admin_info" : admin_info}), 200


# Student APIS :
################################
# Student Management Endpoints

@app.route('/update_student', methods=['POST'])
@token_required
def update_student():
    # Verify admin access
    user_id = request.user_id
    user_type = request.user_type
    userobj = Users(UserID=user_id , UserType=user_type)
    user_std_data = userobj.get_user_data_admin()

    if not user_std_data:
        return jsonify({"error": "User data not found"}), 404

        # Ensure the user is a professor
    if str(user_type).lower() != 'admin':
        return jsonify({"error": "Unauthorized access"}), 403
    
    admin_info = {
       "admin_name" : user_std_data[0]['FirstName'] + " " + user_std_data[0]['LastName'] , 
       "admin_email" :  user_std_data[0]['Email'] ,
       "admin_gender" : user_std_data[0]['gender'] , 
       "admin_id" : user_std_data[0]['UserID']
    }
    
    data = request.get_json()
    
    # Get student user data
    student_id = data.get('user_id')
    user_obj = Users(UserID=student_id)
    user_data = user_obj.get_user_data()
    
    if not user_data:
        return jsonify({"error": "Student not found"}), 404
    
    # Update user data
    updated_user = Users(
        UserID=student_id,
        FirstName=data.get('first_name', user_data[0]['FirstName']),
        LastName=data.get('last_name', user_data[0]['LastName']),
        Email=data.get('email', user_data[0]['Email']),
        PasswordHash=data.get('password', user_data[0]['PasswordHash']),
        gender=data.get('gender', user_data[0]['gender']),
        status=data.get('status', user_data[0]['status']),
        std_code=data.get('std_code', user_data[0]['std_code']),
        UserType=data.get('UserType', user_data[0]['UserType'])
    )
    updated_user.update_user()
    
    # Update student-specific data
    student_obj = Students(StudentID_fk=student_id)
    student_data = student_obj.get_student_data()
    
    if student_data:
        updated_student = Students(
            StudentID=student_data[0]['StudentID'],
            StudentID_fk=student_id,
            Major=data.get('major', student_data[0]['Major']),
            AcademicLevel=data.get('academic_level', student_data[0]['AcademicLevel']),
            std_code=data.get('std_code', student_data[0]['std_code']),
            squad_number=data.get('squad_number', student_data[0]['squad_number']),
            semester_number=data.get('semester_number', student_data[0]['semester_numer']),
            department=data.get('department', student_data[0]['department'])
        )
        updated_student.update_student()
    
    return jsonify({"result": "Yes", "message": "Student updated successfully" ,  "admin_info" : admin_info}), 200


# @app.route('/remove_student', methods=['POST'])
# @token_required
# def remove_student():
#     # Verify admin access
#     user_type = request.user_type
#     if str(user_type).lower() != 'admin':
#         return jsonify({"error": "Unauthorized access"}), 403
    
#     data = request.get_json()
#     student_id = data.get('user_id')
    
#     # Then delete the user
#     user_obj = Users(UserID=student_id)
#     user_obj.delete_user()
    
#     # First delete student-specific data
#     student_obj = Students(StudentID_fk=student_id)
#     student_data = student_obj.get_student_data_with_StudentID_fk()
#     if student_data:
#         student_obj.delete_student()
     
#     return jsonify({"result": "success", "message": "Student removed successfully"}), 200


@app.route('/toggle_student_status', methods=['POST'])
@token_required
def toggle_student_status():
    # Verify admin access
    user_id = request.user_id
    user_type = request.user_type
    userobj = Users(UserID=user_id , UserType=user_type)
    user_std_data = userobj.get_user_data_admin()

    if not user_std_data:
        return jsonify({"error": "User data not found"}), 404

        # Ensure the user is a professor
    if str(user_type).lower() != 'admin':
        return jsonify({"error": "Unauthorized access"}), 403
    
    admin_info = {
       "admin_name" : user_std_data[0]['FirstName'] + " " + user_std_data[0]['LastName'] , 
       "admin_email" :  user_std_data[0]['Email'] ,
       "admin_gender" : user_std_data[0]['gender'] , 
       "admin_id" : user_std_data[0]['UserID']
    }
    
    data = request.get_json()
    student_id = data.get('user_id')
    new_status = data.get('status')
    
    if new_status not in [0, 1]:
        return jsonify({"error": "Invalid status value"}), 400
    
    user_obj = Users(UserID=student_id)
    user_data = user_obj.get_user_data()
    
    if not user_data:
        return jsonify({"error": "Student not found"}), 404
    
    updated_user = Users(
        UserID=student_id,
        FirstName=user_data[0]['FirstName'],
        LastName=user_data[0]['LastName'],
        Email=user_data[0]['Email'],
        PasswordHash=user_data[0]['PasswordHash'],
        UserType=user_data[0]['UserType'],
        gender=user_data[0]['gender'],
        status=new_status,
        std_code=user_data[0]['std_code']
    )
    updated_user.update_user()
    
    status_message = "activated" if new_status == 0 else "deactivated"
    return jsonify({"result": "success", "message": f"Student {status_message} successfully"}), 200

# @app.route('/add_new_student', methods=['POST'])
# @token_required
# def add_new_student():
#     try:
#         # Verify admin access
#         user_id = request.user_id
#         user_type = request.user_type
        
#         # Validate admin status first
#         if str(user_type).lower() != 'admin':
#             return jsonify({"error": "Unauthorized access - Admin privileges required"}), 403

#         # Get admin info
#         admin_obj = Users(UserID=user_id, UserType=user_type)
#         admin_data = admin_obj.get_user_data_admin()
        
#         if not admin_data:
#             return jsonify({"error": "Admin user data not found"}), 404

#         admin_info = {
#             "admin_name": f"{admin_data[0]['FirstName']} {admin_data[0]['LastName']}",
#             "admin_email": admin_data[0]['Email'],
#             "admin_gender": admin_data[0]['gender'],
#             "admin_id": admin_data[0]['UserID']
#         }

#         # Get and validate request data
#         data = request.get_json()
#         if not data:
#             return jsonify({"error": "No data provided in request"}), 400

#         # Validate required fields
#         required_fields = ['FirstName', 'LastName', 'Email', 'PasswordHash', 'gender']
#         missing_fields = [field for field in required_fields if field not in data or not data[field]]
        
#         if missing_fields:
#             return jsonify({
#                 "error": "Missing required fields",
#                 "missing_fields": missing_fields
#             }), 400

#         # Check if email already exists
#         if Users().get_user_data_with_email(data['Email']):
#             return jsonify({
#                 "error": "Email already exists",
#                 "email": data['Email']
#             }), 409

#         # Start database transaction
#             # Create user first
#         new_user = Users(
#             FirstName=data['FirstName'],
#             LastName=data['LastName'],
#             Email=data['Email'],
#             PasswordHash=data['PasswordHash'],
#             UserType='Student',
#             gender=data['gender'],
#             status=data.get('status', 0),  # Default to inactive
#             std_code=data.get('std_code', '10')  # Default std_code
#         )
        
#         # Insert user and get the new user ID
#         new_user.add_user()
#         created_user = Users().get_user_data_with_email(data['Email'])
        
#         if not created_user:
#             return jsonify({"error": "Failed to retrieve created user"}), 500
            
#         new_user_id = created_user[0]['UserID']

#         # Now create student record with proper foreign key
#         std_obj = Students(
#             StudentID=new_user_id,  # This should match the UserID
#             StudentID_fk=new_user_id,  # This should also match
#             Major=data.get('Major', 'Undecided'),
#             std_code=data.get('std_code', '10'),
#             department=data.get('department', 'General'),
#             squad_number=data.get('squad_number', 1),
#             semester_number=data.get('semester_number', 1),
#             AcademicLevel=data.get('AcademicLevel', 1)
#         )
        
#         student_inserted = std_obj.add_student()
        
#         if not student_inserted:
#             return jsonify({
#                 "error": "User created but failed to insert student data",
#                 "user_id": new_user_id
#             }), 500

#         # Commit transaction if everything succeeded

#         response_data = {
#             "result": "success",
#             "message": "Student created successfully",
#             "user_id": new_user_id,
#             "student_id": new_user_id,  # Same as user_id in this model
#             "admin_info": admin_info
#         }

#         return jsonify(response_data), 201

#     except Exception as e:
#         return jsonify({
#             "error": "Failed to process request",
#             "details": str(e)
#         }), 500
 
 
@app.route('/add_new_student', methods=['POST'])
@token_required
def add_new_student():
    user_id = request.user_id
    user_type = request.user_type
    
    if str(user_type).lower() != 'admin':
        return jsonify({"error": "Unauthorized access - Admin privileges required"}), 403

    # Get admin info
    admin_obj = Users(UserID=user_id, UserType=user_type)
    admin_data = admin_obj.get_user_data_admin()
    
    if not admin_data:
        return jsonify({"error": "Admin user data not found"}), 404

    admin_info = {
        "admin_name": f"{admin_data[0]['FirstName']} {admin_data[0]['LastName']}",
        "admin_email": admin_data[0]['Email'],
        "admin_gender": admin_data[0]['gender'],
        "admin_id": admin_data[0]['UserID']
    }

    # Get and validate request data
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided in request"}), 400

    # Validate required fields
    required_fields = ['FirstName', 'LastName', 'Email', 'PasswordHash', 'gender']
    missing_fields = [field for field in required_fields if field not in data or not data[field]]
    
    if missing_fields:
        return jsonify({
            "error": "Missing required fields",
            "missing_fields": missing_fields
        }), 400

    # Check if email already exists
    if Users().get_user_data_with_email(data['Email']):
        return jsonify({
            "error": "Email already exists",
            "email": data['Email']
        }), 409

    new_user = Users(
        FirstName=data['FirstName'],
        LastName=data['LastName'],
        Email=data['Email'],
        PasswordHash=data['PasswordHash'],
        UserType='Student',
        gender=data['gender'],
        status=data.get('status', 0),
        std_code=data.get('std_code', 'std10')
    )
    new_user.add_user()


    # Get the newly created user ID
    created_user = Users().get_user_data_with_email(data['Email'])
    if not created_user:
        return jsonify({"error": "Failed to retrieve created user"}), 500

    # new_user_id = created_user[0]['UserID']

    # Create student record with only StudentID_fk (not StudentID)
    std_obj = Students(
        StudentID_fk=created_user[0]['UserID'],  # This is the crucial foreign key
        Major=data.get('Major', 'Undecided'),
        std_code=data.get('std_code', '10'),
        department=data.get('department', 'General'),
        squad_number=data.get('squad_number', 1),
        semester_number=data.get('semester_number', 1),
        AcademicLevel=data.get('AcademicLevel', 1)
    )
    
    # Add student (StudentID will be auto-generated)
    std_obj.add_student()
    
    # if not student_inserted:
    #     # Attempt to clean up the user record if student creation failed
    #     try:
    #         cleanup_user = Users(UserID=new_user_id)
    #         cleanup_user.delete_user()
    #     except Exception as cleanup_error:
    #         # Log this error in production
    #         print(f"Cleanup failed: {str(cleanup_error)}")
            

    # # Get the auto-generated StudentID
    # student_data = Students(StudentID_fk=new_user_id).get_student_data_with_StudentID_fk()
    # if not student_data:
    #     return jsonify({
    #         "error": "Student created but failed to retrieve student data",
    #         "user_id": new_user_id
    #     }), 500

    response_data = {
        "result": "success",
        "message": "Student created successfully",
        # "user_id": new_user_id,
        # "student_id": student_data[0]['StudentID'],  # The auto-generated ID
        "admin_info": admin_info
    }

    return jsonify(response_data), 201




################################################################################################
# Professor Management Endpoints

@app.route('/update_professor', methods=['POST'])
@token_required
def update_professor():
    # Verify admin access
    user_id = request.user_id
    user_type = request.user_type
    userobj = Users(UserID=user_id , UserType=user_type)
    user_std_data = userobj.get_user_data_admin()

    if not user_std_data:
        return jsonify({"error": "User data not found"}), 404

        # Ensure the user is a professor
    if str(user_type).lower() != 'admin':
        return jsonify({"error": "Unauthorized access"}), 403
    
    admin_info = {
       "admin_name" : user_std_data[0]['FirstName'] + " " + user_std_data[0]['LastName'] , 
       "admin_email" :  user_std_data[0]['Email'] ,
       "admin_gender" : user_std_data[0]['gender'] , 
       "admin_id" : user_std_data[0]['UserID']
    }
    
    
    data = request.get_json()
    
    # Get professor user data
    professor_id = data.get('user_id')
    user_obj = Users(UserID=professor_id)
    user_data = user_obj.get_user_data()
    
    if not user_data:
        return jsonify({"error": "Professor not found"}), 404
    
    # Update user data
    updated_user = Users(
        UserID=professor_id,
        FirstName=data.get('first_name', user_data[0]['FirstName']),
        LastName=data.get('last_name', user_data[0]['LastName']),
        Email=data.get('email', user_data[0]['Email']),
        PasswordHash=data.get('password', user_data[0]['PasswordHash']),
        gender=data.get('gender', user_data[0]['gender']),
        status=data.get('status', user_data[0]['status']),
        std_code=data.get('std_code', user_data[0]['std_code']),
        UserType=data.get('UserType', user_data[0]['UserType'])
    )
    updated_user.update_user()
    
    # Update professor-specific data
    prof_obj = Professors(prof_user_id=professor_id)
    prof_data = prof_obj.get_professor_data_with_prof_user_id()
    
    if prof_data:
        updated_prof = Professors(
            ProfessorID=prof_data[0]['ProfessorID'],
            prof_user_id=professor_id,
            Department=data.get('department', prof_data[0]['Department']),
            course_id=data.get('course_id', prof_data[0]['course_id'])
        )
        updated_prof.update_professor()
    
    return jsonify({"result": "success", "message": "Professor updated successfully" , "admin_info" : admin_info}), 200


# @app.route('/remove_professor', methods=['POST'])
# @token_required
# def remove_professor():
#     # Verify admin access
#     user_type = request.user_type
#     if str(user_type).lower() != 'admin':
#         return jsonify({"error": "Unauthorized access"}), 403
    
#     data = request.get_json()
#     professor_id = data.get('user_id')
    
#     # First delete professor-specific data
#     prof_obj = Professors(prof_user_id=professor_id)
#     prof_data = prof_obj.get_professor_data_with_prof_user_id()
#     if prof_data:
#         prof_obj.delete_professor()
    
#     # Then delete the user
#     user_obj = Users(UserID=professor_id)
#     user_obj.delete_user()
    
#     return jsonify({"result": "success", "message": "Professor removed successfully"}), 200


@app.route('/toggle_professor_status', methods=['POST'])
@token_required
def toggle_professor_status():
    # Verify admin access
    user_id = request.user_id
    user_type = request.user_type
    userobj = Users(UserID=user_id , UserType=user_type)
    user_std_data = userobj.get_user_data_admin()

    if not user_std_data:
        return jsonify({"error": "User data not found"}), 404

        # Ensure the user is a professor
    if str(user_type).lower() != 'admin':
        return jsonify({"error": "Unauthorized access"}), 403
    
    admin_info = {
       "admin_name" : user_std_data[0]['FirstName'] + " " + user_std_data[0]['LastName'] , 
       "admin_email" :  user_std_data[0]['Email'] ,
       "admin_gender" : user_std_data[0]['gender'] , 
       "admin_id" : user_std_data[0]['UserID']
    }
    
    
    data = request.get_json()
    professor_id = data.get('user_id')
    new_status = data.get('status')
    
    if new_status not in [0, 1]:
        return jsonify({"error": "Invalid status value"}), 400
    
    user_obj = Users(UserID=professor_id)
    user_data = user_obj.get_user_data()
    
    if not user_data:
        return jsonify({"error": "Professor not found"}), 404
    
    updated_user = Users(
        UserID=professor_id,
        FirstName=user_data[0]['FirstName'],
        LastName=user_data[0]['LastName'],
        Email=user_data[0]['Email'],
        PasswordHash=user_data[0]['PasswordHash'],
        UserType=user_data[0]['UserType'],
        gender=user_data[0]['gender'],
        status=new_status,
        std_code=user_data[0]['std_code']
    )
    updated_user.update_user()
    
    status_message = "activated" if new_status == 0 else "deactivated"
    return jsonify({"result": "success", "message": f"Professor {status_message} successfully"}), 200


@app.route('/add_professor', methods=['POST'])
@token_required
def add_professor():
    # Verify admin access
    user_id = request.user_id
    user_type = request.user_type
    userobj = Users(UserID=user_id , UserType=user_type)
    user_std_data = userobj.get_user_data_admin()

    if not user_std_data:
        return jsonify({"error": "User data not found"}), 404

        # Ensure the user is a professor
    if str(user_type).lower() != 'admin':
        return jsonify({"error": "Unauthorized access"}), 403
    
    admin_info = {
       "admin_name" : user_std_data[0]['FirstName'] + " " + user_std_data[0]['LastName'] , 
       "admin_email" :  user_std_data[0]['Email'] ,
       "admin_gender" : user_std_data[0]['gender'] , 
       "admin_id" : user_std_data[0]['UserID']
    }
    
    
    data = request.get_json()
    
    # Validate required fields
    required_fields = ['FirstName', 'LastName', 'Email', 'PasswordHash', 'gender', 'Department']
    for field in required_fields:
        if not data.get(field):
            return jsonify({"error": f"Missing required field: {field}"}), 400
    
    # Check if email exists
    if Users().get_user_data_with_email(data['Email']):
        return jsonify({"error": "Email already registered"}), 409
    
    try:
        # Create user
        new_user = Users(
            FirstName=data['FirstName'],
            LastName=data['LastName'],
            Email=data['Email'],
            PasswordHash=data['PasswordHash'],
            UserType='Professor',
            gender=data['gender'],
            status=data.get('status', 0),  # Default: active
            std_code='20'  # Professor code
        )
        new_user.add_user()
        
        # Get new user ID
        user_id = Users(Email=data['Email']).get_user_data_with_email(data['Email'])[0]['UserID']
        
        # Add professor-specific data
        prof_obj = Professors(
            prof_user_id=user_id,
            Department=data['Department'],
            course_id=data.get('course_id')  # Optional
        )
        prof_obj.add_professor()
        
        return jsonify({
            "result": "success",
            "message": "Professor added successfully",
            "professor_id": user_id
        }), 201
    
    except Exception as e:
        return jsonify({"error": f"Failed to add professor: {str(e)}"}), 500


# Admin Management Endpoints
#########################################################

@app.route('/update_admin', methods=['POST'])
@token_required
def update_admin():
    # Verify admin access
    user_id = request.user_id
    user_type = request.user_type
    userobj = Users(UserID=user_id , UserType=user_type)
    user_std_data = userobj.get_user_data_admin()

    if not user_std_data:
        return jsonify({"error": "User data not found"}), 404

        # Ensure the user is a professor
    if str(user_type).lower() != 'admin':
        return jsonify({"error": "Unauthorized access"}), 403
    
    admin_info = {
       "admin_name" : user_std_data[0]['FirstName'] + " " + user_std_data[0]['LastName'] , 
       "admin_email" :  user_std_data[0]['Email'] ,
       "admin_gender" : user_std_data[0]['gender'] , 
       "admin_id" : user_std_data[0]['UserID']
    }
    
    
    data = request.get_json()
    
    # Get admin user data
    admin_id = data.get('user_id')
    user_obj = Users(UserID=admin_id)
    user_data = user_obj.get_user_data()
    
    if not user_data:
        return jsonify({"error": "Admin not found"}), 404
    
    # Update user data
    updated_user = Users(
        UserID=admin_id,
        FirstName=data.get('first_name', user_data[0]['FirstName']),
        LastName=data.get('last_name', user_data[0]['LastName']),
        Email=data.get('email', user_data[0]['Email']),
        PasswordHash=data.get('password', user_data[0]['PasswordHash']),
        gender=data.get('gender', user_data[0]['gender']),
        status=data.get('status', user_data[0]['status']),
        std_code=data.get('std_code', user_data[0]['std_code']),
        UserType =data.get('UserType', user_data[0]['UserType'])
    )
    updated_user.update_user()
    
    # Update admin-specific data
    admin_obj = Admins(AdminID=admin_id)
    admin_data = admin_obj.get_admin_data()
    
    if admin_data:
        updated_admin = Admins(
            AdminID=admin_id,
            Role=data.get('role', admin_data[0]['Role'])
        )
        updated_admin.update_admin()
    
    return jsonify({"result": "success", "message": "Admin updated successfully"}), 200


# @app.route('/remove_admin', methods=['POST'])
# @token_required
# def remove_admin():
#     # Verify admin access
#     user_type = request.user_type
#     if str(user_type).lower() != 'admin':
#         return jsonify({"error": "Unauthorized access"}), 403
    
#     data = request.get_json()
#     admin_id = data.get('user_id')
    
#     # First delete admin-specific data
#     admin_obj = Admins(AdminID=admin_id)
#     admin_data = admin_obj.get_admin_data()
#     if admin_data:
#         admin_obj.delete_admin()
    
#     # Then delete the user
#     user_obj = Users(UserID=admin_id)
#     user_obj.delete_user()
    
#     return jsonify({"result": "success", "message": "Admin removed successfully"}), 200


@app.route('/toggle_admin_status', methods=['POST'])
@token_required
def toggle_admin_status():
    # Verify admin access
    user_type = request.user_type
    if str(user_type).lower() != 'admin':
        return jsonify({"error": "Unauthorized access"}), 403
    
    data = request.get_json()
    admin_id = data.get('user_id')
    new_status = data.get('status')
    
    if new_status not in [0, 1]:
        return jsonify({"error": "Invalid status value"}), 400
    
    user_obj = Users(UserID=admin_id)
    user_data = user_obj.get_user_data()
    
    if not user_data:
        return jsonify({"error": "Admin not found"}), 404
    
    updated_user = Users(
        UserID=admin_id,
        FirstName=user_data[0]['FirstName'],
        LastName=user_data[0]['LastName'],
        Email=user_data[0]['Email'],
        PasswordHash=user_data[0]['PasswordHash'],
        UserType=user_data[0]['UserType'],
        gender=user_data[0]['gender'],
        status=new_status,
        std_code=user_data[0]['std_code']
    )
    updated_user.update_user()
    
    status_message = "activated" if new_status == 0 else "deactivated"
    return jsonify({"result": "success", "message": f"Admin {status_message} successfully"}), 200


@app.route('/add_admin', methods=['POST'])
@token_required
def add_admin():
    # Verify admin access
    if request.user_type.lower() != 'admin':
        return jsonify({"error": "Unauthorized access"}), 403
    
    data = request.get_json()
    
    # Validate required fields
    required_fields = ['FirstName', 'LastName', 'Email', 'PasswordHash', 'gender']
    for field in required_fields:
        if not data.get(field):
            return jsonify({"error": f"Missing required field: {field}"}), 400
    
    # Check if email exists
    if Users().get_user_data_with_email(data['Email']):
        return jsonify({"error": "Email already registered"}), 409
    
    try:
        # Create user
        new_user = Users(
            FirstName=data['FirstName'],
            LastName=data['LastName'],
            Email=data['Email'],
            PasswordHash=data['PasswordHash'],
            UserType='Admin',
            gender=data['gender'],
            status=data.get('status', 0),  # Default: active
            std_code='30'  # Admin code
        )
        new_user.add_user()
        
        # Get new user ID
        user_id = Users(Email=data['Email']).get_user_data_with_email(data['Email'])[0]['UserID']
        
        # Add admin-specific data
        admin_obj = Admins(
            AdminID=user_id,
            Role=data.get('Role', 'Regular')  # Default role
        )
        admin_obj.add_admin()
        
        return jsonify({
            "result": "success",
            "message": "Admin added successfully",
            "admin_id": user_id
        }), 201
    
    except Exception as e:
        return jsonify({"error": f"Failed to add admin: {str(e)}"}), 500
    
   
# Course Management page 
#################################################### 
@app.route('/show_course_management_page', methods=['GET'])
@token_required
def show_course_management_page():
    user_id = request.user_id
    user_type = request.user_type
    userobj = Users(UserID=user_id, UserType=user_type)
    user_std_data = userobj.get_user_data_admin()

    if not user_std_data:
        return jsonify({"error": "User data not found"}), 404

    # Ensure the user is an admin
    if str(user_type).lower() != 'admin':
        return jsonify({"error": "Unauthorized access"}), 403
    
    admin_info = {
        "admin_name": user_std_data[0]['FirstName'] + " " + user_std_data[0]['LastName'],
        "admin_email": user_std_data[0]['Email'],
        "admin_gender": user_std_data[0]['gender'],
        "admin_id": user_std_data[0]['UserID']
    }

    try:
        # Get all courses
        course_obj = Courses()
        all_courses = course_obj.get_course_data()
        
        # Prepare the response data
        course_management_data = []
        
        for course in all_courses:
            # Get professor information if prof_id exists
            prof_info = None
            if course['prof_id']:
                # Get professor user data
                prof_user_obj = Users(UserID=course['prof_id'])
                prof_user_data = prof_user_obj.get_user_data()
                
                if prof_user_data:
                    # Get professor specific data
                    prof_obj = Professors(prof_user_id=course['prof_id'])
                    prof_data = prof_obj.get_professor_data_with_prof_user_id()
                    
                    prof_info = {
                        "prof_id": course['prof_id'],
                        "prof_name": f"{prof_user_data[0]['FirstName']} {prof_user_data[0]['LastName']}",
                        "prof_department": prof_data[0]['Department'] if prof_data else None
                    }
            
            # Prepare course status (you might need to adjust this based on your business logic)
            course_status = 0  # Default status, adjust as needed
            
            course_management_data.append({
                "course_id": course['CourseID'],
                "course_name": course['CourseName'],
                "course_code": course['CourseCode'],
                "prof_name": prof_info['prof_name'] if prof_info else "Not Assigned",
                "semester_number": course['semester_number'],
                "squad_number": course['squad_number'],
                "credit_hours": course['CreditHours'],
                "department": course['department'],
                "course_status": course['course_status'],
                "prof_info": prof_info if prof_info else None
            })
        
        return jsonify({
            "admin_info": admin_info,
            "course_management_data": course_management_data,
            "total_courses": len(all_courses),
            "message": "Course management data retrieved successfully"
        }), 200
        
    except Exception as e:
        return jsonify({
            "error": f"Failed to retrieve course management data: {str(e)}",
            "admin_info": admin_info
        }), 500


@app.route('/update_course', methods=['POST'])
@token_required
def update_course():
    user_id = request.user_id
    user_type = request.user_type
    userobj = Users(UserID=user_id, UserType=user_type)
    user_std_data = userobj.get_user_data_admin()

    if not user_std_data:
        return jsonify({"error": "User data not found"}), 404

    # Ensure the user is an admin
    if str(user_type).lower() != 'admin':
        return jsonify({"error": "Unauthorized access"}), 403
    
    admin_info = {
        "admin_name": user_std_data[0]['FirstName'] + " " + user_std_data[0]['LastName'],
        "admin_email": user_std_data[0]['Email'],
        "admin_gender": user_std_data[0]['gender'],
        "admin_id": user_std_data[0]['UserID']
    }


    data = request.get_json()
    course_id = data.get("course_id")
    # Validate required fields
    if 'course_id' not in data:
        return jsonify({"error": "Course ID is required"}), 400

    try:
        # Get current course data
        course_obj = Courses(CourseID=course_id)
        current_course = course_obj.get_course_data()
        
        if not current_course:
            return jsonify({"error": "Course not found"}), 404

        # Update course with new data (only update fields that are provided)
        updated_fields = {
            'CourseCode': data.get('course_code', current_course[0]['CourseCode']),
            'CourseName': data.get('course_name', current_course[0]['CourseName']),
            'CreditHours': data.get('credit_hours', current_course[0]['CreditHours']),
            'PrerequisiteCourseID': data.get('prerequisite_id', current_course[0]['PrerequisiteCourseID']),
            'prof_id': data.get('prof_id', current_course[0]['prof_id']),
            'squad_number': data.get('squad_number', current_course[0]['squad_number']),
            'semester_number': data.get('semester_number', current_course[0]['semester_number']),
            'department': data.get('department', current_course[0] ['department']),
            'Final_grade': data.get('Final_grade', current_course[0] ['Final_grade']),
            'mitterm_grade': data.get('mitterm_grade', current_course[0] ['mitterm_grade']),
            'points': data.get('points', current_course[0] ['points']),
            'course_status': data.get('course_status', current_course[0] ['course_status'])
        }
        print(f"prof_id : {updated_fields['prof_id']}")
        # prof_id = data.get("prof_id" , " ")
        # Create updated course object
        updated_course = Courses(
            CourseID=data['course_id'],
            CourseCode=updated_fields['CourseCode'],
            CourseName=updated_fields['CourseName'],
            CreditHours=updated_fields['CreditHours'],
            PrerequisiteCourseID=updated_fields['PrerequisiteCourseID'],
            squad_number=updated_fields['squad_number'],
            semester_number=updated_fields['semester_number'],
            department=updated_fields['department'],
            Final_grade=updated_fields['Final_grade'],
            mitterm_grade=updated_fields['mitterm_grade'],
            points=updated_fields['points'],
            prof_id=updated_fields['prof_id'] ,
            course_status=updated_fields['course_status']
        )
        
        # Perform the update
        updated_course.update_course()

        # Get the updated course data
        updated_course_data = updated_course.get_course_data()

        return jsonify({
            "message": "Course updated successfully",
            "result" : "Yes" ,
            "admin_info" : admin_info
        }), 200

    except Exception as e:
        return jsonify({"error": f"Failed to update course: {str(e)}"}), 500


@app.route('/delete_course', methods=['POST'])
@token_required
def delete_course():
    user_id = request.user_id
    user_type = request.user_type
    userobj = Users(UserID=user_id, UserType=user_type)
    user_std_data = userobj.get_user_data_admin()

    if not user_std_data:
        return jsonify({"error": "User data not found"}), 404

    # Ensure the user is an admin
    if str(user_type).lower() != 'admin':
        return jsonify({"error": "Unauthorized access"}), 403
    
    admin_info = {
        "admin_name": user_std_data[0]['FirstName'] + " " + user_std_data[0]['LastName'],
        "admin_email": user_std_data[0]['Email'],
        "admin_gender": user_std_data[0]['gender'],
        "admin_id": user_std_data[0]['UserID']
    }


    data = request.get_json()
    course_id = data.get("course_id")
    # Validate required fields
    if 'course_id' not in data:
        return jsonify({"error": "Course ID is required"}), 400

    try:
        # Verify course exists
        course_obj = Courses(CourseID=course_id)
        course_data = course_obj.get_course_data()
        
        if not course_data:
            return jsonify({"error": "Course not found"}), 404

        # Delete the course
        course_obj.delete_course()

        return jsonify({
            "message": "Course deleted successfully",
            "course_id": course_id
        }), 200

    except Exception as e:
        return jsonify({"error": f"Failed to delete course: {str(e)}"}), 500
  
  
@app.route('/update_course_status', methods=['POST'])
@token_required
def update_course_status():
    user_id = request.user_id
    user_type = request.user_type
    userobj = Users(UserID=user_id, UserType=user_type)
    user_std_data = userobj.get_user_data_admin()

    if not user_std_data:
        return jsonify({"error": "User data not found"}), 404

    # Ensure the user is an admin
    if str(user_type).lower() != 'admin':
        return jsonify({"error": "Unauthorized access"}), 403
    
    admin_info = {
        "admin_name": user_std_data[0]['FirstName'] + " " + user_std_data[0]['LastName'],
        "admin_email": user_std_data[0]['Email'],
        "admin_gender": user_std_data[0]['gender'],
        "admin_id": user_std_data[0]['UserID']
    }

    data = request.get_json()
    course_id = data.get("course_id")
    course_status = data.get("course_status")
    
    # Validate required fields
    if 'course_id' not in data:
        return jsonify({"error": "Course ID is required"}), 400

    try:
        # Get the current course data
        course_obj = Courses(CourseID=course_id)
        course_data = course_obj.get_course_data()
        
        if not course_data:
            return jsonify({"error": "Course not found"}), 404

        # Update all course fields with provided values or keep existing ones
        pre = course_data[0]['PrerequisiteCourseID']
        if not pre : 
            pre = 0 
        updated_course = Courses(
            CourseID=course_id,
            CourseCode=data.get('course_code', course_data[0]['CourseCode']),
            CourseName=data.get('course_name', course_data[0]['CourseName']),
            CreditHours=data.get('credit_hours', course_data[0]['CreditHours']),
            PrerequisiteCourseID=data.get('prerequisite_id',pre ),
            prof_id=data.get('prof_id', course_data[0]['prof_id']),
            mitterm_grade=data.get('mitterm_grade', course_data[0]['mitterm_grade']),
            Final_grade=data.get('final_grade', course_data[0]['Final_grade']),
            points=data.get('points', course_data[0]['points']),
            squad_number=data.get('squad_number', course_data[0]['squad_number']),
            semester_number=data.get('semester_number', course_data[0]['semester_number']),
            department=data.get('department', course_data[0]['department']),
            course_status=course_status  # Default to 0 if status doesn't exist
        )

        # Perform the update
        updated_course.update_course()

        # Get the updated course data
        updated_course_data = updated_course.get_course_data()

        return jsonify({
            "message": "Course updated successfully",
            "result" : "Yes" , 
            "admin_info" : admin_info
        }), 200

    except Exception as e:
        return jsonify({"error": f"Failed to update course: {str(e)}"}), 500
 
 
# @app.route('/add_course_with_professor', methods=['POST'])
# @token_required
# def add_course_with_professor():
#     user_id = request.user_id
#     user_type = request.user_type
#     userobj = Users(UserID=user_id, UserType=user_type)
#     user_std_data = userobj.get_user_data_admin()

#     if not user_std_data:
#         return jsonify({"error": "User data not found"}), 404

#     # Ensure the user is an admin
#     if str(user_type).lower() != 'admin':
#         return jsonify({"error": "Unauthorized access"}), 403
    
#     admin_info = {
#         "admin_name": user_std_data[0]['FirstName'] + " " + user_std_data[0]['LastName'],
#         "admin_email": user_std_data[0]['Email'],
#         "admin_gender": user_std_data[0]['gender'],
#         "admin_id": user_std_data[0]['UserID']
#     }

#     data = request.get_json()
    
#     # Validate required fields
#     required_fields = [
#         'course_code', 
#         'course_name', 
#         'credit_hours',
#         'semester_number',
#         'squad_number',
#         'department',
#         'prof_id'
#     ]
    
#     for field in required_fields:
#         if field not in data or not str(data[field]).strip():
#             return jsonify({"error": f"Missing or empty required field: {field}"}), 400

#     try:
#         # Verify professor exists and is actually a professor
#         prof_user = Users(UserID=data['prof_id'])
#         prof_data = prof_user.get_user_data()
        
#         if not prof_data:
#             return jsonify({"error": "Professor user not found"}), 404
            
#         if prof_data[0]['UserType'].lower() != 'professor':
#             return jsonify({"error": "Specified user is not a professor"}), 400

#         # Check if course code already exists
#         existing_course = Courses(CourseCode=data['course_code']).get_course_data_from_CourseCode()
#         if existing_course:
#             return jsonify({"error": "Course code already exists"}), 409

#         # Create new course
#         new_course = Courses(
#             CourseCode=data['course_code'],
#             CourseName=data['course_name'],
#             CreditHours=data['credit_hours'],
#             semester_number=data['semester_number'],
#             squad_number=data['squad_number'],
#             department=data['department'],
#             prof_id=data['prof_id'],
#             course_status=0,  # Default to active status
#             PrerequisiteCourseID=data.get('prerequisite_id'),
#             mitterm_grade=data.get('mitterm_grade', 0),
#             Final_grade=data.get('final_grade', 0),
#             points=data.get('points', 0) 
#         )
        
#         new_course.add_course()

#         # Get the newly created course data
#         created_course = Courses(CourseCode=data['course_code']).get_course_data_from_CourseCode()
#         print(f"created_course : {created_course}")
#         print(50*"*")
#         # Update professor's course association
#         professor_obj = Professors(prof_user_id=data['prof_id'])
#         professor_data = professor_obj.get_professor_data_with_prof_user_id()
#         print(f"professor_data : {professor_data}")
#         if professor_data:
#             # Professor exists in Professors table - update their course list
#             professor_obj = Professors(
#                 prof_user_id=data['prof_id'],
#                 course_id=created_course[0]['CourseID'],
#                 Department=data['department'] ,
#                 ProfessorID = data['prof_id']
#             )
            
#             professor_obj.update_professor()
#         else:
#             # Professor not in Professors table - add them
#             professor_obj = Professors(
#                 prof_user_id=data['prof_id'],
#                 course_id=created_course[0]['CourseID'],
#                 Department=data['department'] ,
#                 ProfessorID = data['ProfessorID']
                
#             )
#             professor_obj.add_professor()

#         return jsonify({
#             "message": "Course created successfully with professor association",
#             "course": {
#                 "course_id": created_course[0]['CourseID'],
#                 "course_code": created_course[0]['CourseCode'],
#                 "course_name": created_course[0]['CourseName'],
#                 "credit_hours": created_course[0]['CreditHours'],
#                 "prof_id": created_course[0]['prof_id'],
#                 "semester_number": created_course[0]['semester_number'],
#                 "squad_number": created_course[0]['squad_number'],
#                 "department": created_course[0]['department'],
#                 "status": created_course[0]['course_status']
#             },
#             "professor": {
#                 "prof_id": prof_data[0]['UserID'],
#                 "prof_name": f"{prof_data[0]['FirstName']} {prof_data[0]['LastName']}",
#                 "prof_email": prof_data[0]['Email']
#             } , "result" : "Yes"
#         }), 201

#     except Exception as e:
#         return jsonify({"error": f"Failed to create course: {str(e)}"}), 500 
 
@app.route('/add_course_with_professor', methods=['GET', 'POST'])
@token_required
def add_course_with_professor():
    user_id = request.user_id
    user_type = request.user_type
    userobj = Users(UserID=user_id, UserType=user_type)
    user_std_data = userobj.get_user_data_admin()

    if not user_std_data:
        return jsonify({"error": "User data not found"}), 404

    # Ensure the user is an admin
    if str(user_type).lower() != 'admin':
        return jsonify({"error": "Unauthorized access"}), 403
    
    admin_info = {
        "admin_name": f"{user_std_data[0]['FirstName']} {user_std_data[0]['LastName']}",
        "admin_email": user_std_data[0]['Email'],
        "admin_gender": user_std_data[0]['gender'],
        "admin_id": user_std_data[0]['UserID']
    }
    prof_data = []
    # Handle GET request - Return all courses for a professor
    if request.method == 'GET':
        try:
            # Get all courses for this professor
            coursesobj = Courses()
            course_data = coursesobj.get_course_data()
            # Format the courses data
            user_info = Users(UserType="Professor")
            user_data= user_info.get_user_data_by_userttype()
            prof_info = []
            for prof in user_data : 
                prof_data = {
                    "prof_name" : prof['FirstName'] , 
                    "prof_id" : prof['UserID'] ,
                    "prof_email" : prof['Email'],
                    "prof_code" : prof['std_code']
                }
                prof_info.append(prof_data)
                
            
            courses_list = []
            for course in course_data:
                courses_list.append({
                    "course_id": course['CourseID'],
                    "course_code": course['CourseCode'],
                    "course_name": course['CourseName'],
                    "credit_hours": course['CreditHours'],
                    "semester_number": course['semester_number'],
                    "squad_number": course['squad_number'],
                    "department": course['department'],
                    "status": course['course_status']
                })

            return jsonify({
                "admin_info":admin_info,
                "courses": courses_list,
                "prof_info" : prof_info,
                "result": "success"
            }), 200

        except Exception as e:
            return jsonify({"error": f"Failed to retrieve courses: {str(e)}"}), 500

    # Handle POST request - Create new course with professor
    elif request.method == 'POST':
        data = request.get_json()
        
        # Validate required fields
        required_fields = [
            'course_code', 
            'course_name', 
            'credit_hours',
            'semester_number',
            'squad_number',
            'department',
            'prof_id'
        ]
        
        for field in required_fields:
            if field not in data or not str(data[field]).strip():
                return jsonify({"error": f"Missing or empty required field: {field}"}), 400

        try:
            # Verify professor exists and is actually a professor
            prof_user = Users(UserID=data['prof_id'])
            prof_data = prof_user.get_user_data()
            
            if not prof_data:
                return jsonify({"error": "Professor user not found"}), 404
                
            if prof_data[0]['UserType'].lower() != 'professor':
                return jsonify({"error": "Specified user is not a professor"}), 400

            # Check if course code already exists
            existing_course = Courses(CourseCode=data['course_code']).get_course_data_from_CourseCode()
            if existing_course:
                return jsonify({"error": "Course code already exists"}), 409

            # Create new course
            new_course = Courses(
                CourseCode=data['course_code'],
                CourseName=data['course_name'],
                CreditHours=data['credit_hours'],
                semester_number=data['semester_number'],
                squad_number=data['squad_number'],
                department=data['department'],
                prof_id=data['prof_id'],
                course_status=0,  # Default to active status
                PrerequisiteCourseID=data.get('prerequisite_id'),
                mitterm_grade=data.get('mitterm_grade', 0),
                Final_grade=data.get('final_grade', 0),
                points=data.get('points', 0) 
            )
            
            new_course.add_course()

            # Get the newly created course data
            created_course = Courses(CourseCode=data['course_code']).get_course_data_from_CourseCode()

            # Update professor's course association
            professor_obj = Professors(prof_user_id=data['prof_id'])
            professor_data = professor_obj.get_professor_data_with_prof_user_id()
            
            if professor_data:
                # Professor exists in Professors table - update their course list
                professor_obj = Professors(
                    prof_user_id=data['prof_id'],
                    course_id=created_course[0]['CourseID'],
                    Department=data['department'],
                    ProfessorID=data['prof_id']
                )
                professor_obj.update_professor()
            else:
                # Professor not in Professors table - add them
                professor_obj = Professors(
                    prof_user_id=data['prof_id'],
                    course_id=created_course[0]['CourseID'],
                    Department=data['department'],
                    ProfessorID=data['prof_id']
                )
                professor_obj.add_professor()

            return jsonify({
                "message": "Course created successfully with professor association",
                "course": {
                    "course_id": created_course[0]['CourseID'],
                    "course_code": created_course[0]['CourseCode'],
                    "course_name": created_course[0]['CourseName'],
                    "credit_hours": created_course[0]['CreditHours'],
                    "prof_id": created_course[0]['prof_id'],
                    "semester_number": created_course[0]['semester_number'],
                    "squad_number": created_course[0]['squad_number'],
                    "department": created_course[0]['department'],
                    "status": created_course[0]['course_status']
                },
                "professor": {
                    "prof_id": prof_data[0]['UserID'],
                    "prof_name": f"{prof_data[0]['FirstName']} {prof_data[0]['LastName']}",
                    "prof_email": prof_data[0]['Email']
                },
                "result": "success"
            }), 201

        except Exception as e:
            return jsonify({"error": f"Failed to create course: {str(e)}"}), 500

# schedule Management page 
####################################################  
@app.route('/get_scheduling_info', methods=['GET'])
@token_required
def get_scheduling_info():
    try:
        user_id = request.user_id
        user_type = request.user_type
        userobj = Users(UserID=user_id, UserType=user_type)
        user_std_data = userobj.get_user_data_admin()

        if not user_std_data:
            return jsonify({"error": "User data not found"}), 404

        # Ensure the user is an admin
        if str(user_type).lower() != 'admin':
            return jsonify({"error": "Unauthorized access"}), 403
        
        admin_info = {
            "admin_name": user_std_data[0]['FirstName'] + " " + user_std_data[0]['LastName'],
            "admin_email": user_std_data[0]['Email'],
            "admin_gender": user_std_data[0]['gender'],
            "admin_id": user_std_data[0]['UserID']
        }
        # Get optional query parameters for filtering
        department = request.args.get('department')
        squad_number = request.args.get('squad_number')
        semester_number = request.args.get('semester_number')
        
        # Get all subjects study data
        subjects_obj = SubjectsStudy(
            department=department,
            squad_number=squad_number,
            semester_id=semester_number
        )
        
        # Get subjects based on filters (or all if no filters)
        if department and squad_number and semester_number:
            subjects_data = subjects_obj.get_data_by_squad_number_and_deparmt_semester()
        else:
            subjects_data = subjects_obj.get_subject_data()
        
        if not subjects_data:
            return jsonify({"message": "No scheduling data found", "data": []}), 200
        
        # Prepare response data
        scheduling_info = []
        
        for subject in subjects_data:
            # Get semester details for each subject
            semester_obj = Semesters(id=subject['semester_id'])
            semester_data = semester_obj.get_semester_data()
            
            if semester_data:
                semester_info = {
                    "semester_number": semester_data[0]['semester_number'],
                    "semester_name": semester_data[0]['semester_name'],
                    "semester_year_range": semester_data[0]['semester_year_range']
                }
            else:
                semester_info = {
                    "semester_number": None,
                    "semester_name": None,
                    "semester_year_range": None
                }
            
            scheduling_info.append({
                "id": subject['id'],
                "file_name": subject['file_name'],
                "file_path": subject['file_path'],
                "department": subject['department'],
                "squad_number": subject['squad_number'],
                "semester_info": semester_info
            })
        
        return jsonify({
            "message": "Scheduling data retrieved successfully",
            "count": len(scheduling_info),
            "data": scheduling_info
        }), 200
        
    except Exception as e:
        return jsonify({
            "error": f"Failed to retrieve scheduling information: {str(e)}"
        }), 500
 
@app.route('/add_schedule', methods=['POST'])
@token_required
def add_schedule():
    try:
        user_id = request.user_id
        user_type = request.user_type
        userobj = Users(UserID=user_id, UserType=user_type)
        user_std_data = userobj.get_user_data_admin()

        if not user_std_data:
            return jsonify({"error": "User data not found"}), 404

        # Ensure the user is an admin
        if str(user_type).lower() != 'admin':
            return jsonify({"error": "Unauthorized access"}), 403
        
        admin_info = {
            "admin_name": user_std_data[0]['FirstName'] + " " + user_std_data[0]['LastName'],
            "admin_email": user_std_data[0]['Email'],
            "admin_gender": user_std_data[0]['gender'],
            "admin_id": user_std_data[0]['UserID']
        }
        
        admin_info = {
            "admin_name": user_std_data[0]['FirstName'] + " " + user_std_data[0]['LastName'],
            "admin_email": user_std_data[0]['Email'],
            "admin_gender": user_std_data[0]['gender'],
            "admin_id": user_std_data[0]['UserID']
        }
        # Verify admin privileges
        if request.user_type.lower() != 'admin':
            return jsonify({"error": "Unauthorized access"}), 403

        data = request.get_json()
        
        # Validate required fields
        required_fields = ['file_name', 'file_path', 'department', 'squad_number', 'semester_id']
        for field in required_fields:
            if field not in data or not str(data[field]).strip():
                return jsonify({"error": f"Missing or empty required field: {field}"}), 400

        # Verify semester exists
        semester = Semesters(id=data['semester_id']).get_semester_data()
        if not semester:
            return jsonify({"error": "Semester not found"}), 404

        # Create new schedule
        new_schedule = SubjectsStudy(
            file_name=data['file_name'],
            file_path=data['file_path'],
            department=data['department'],
            squad_number=data['squad_number'],
            semester_id=data['semester_id']
        )
        new_schedule.add_subject()

        # Get the created schedule
        created_schedule = SubjectsStudy(
            department=data['department'],
            squad_number=data['squad_number'],
            semester_id=data['semester_id']
        ).get_data_by_squad_number_and_deparmt_semester()

        return jsonify({
            "message": "Schedule added successfully",
            "result": "Yes"
        }), 201

    except Exception as e:
        return jsonify({"error": f"Failed to add schedule: {str(e)}"}), 500
 
@app.route('/update_schedule', methods=['POST'])
@token_required
def update_schedule():
    try:
        # Verify admin privileges
        user_id = request.user_id
        user_type = request.user_type
        userobj = Users(UserID=user_id, UserType=user_type)
        user_std_data = userobj.get_user_data_admin()

        if not user_std_data:
            return jsonify({"error": "User data not found"}), 404

        # Ensure the user is an admin
        if str(user_type).lower() != 'admin':
            return jsonify({"error": "Unauthorized access"}), 403
        
        admin_info = {
            "admin_name": user_std_data[0]['FirstName'] + " " + user_std_data[0]['LastName'],
            "admin_email": user_std_data[0]['Email'],
            "admin_gender": user_std_data[0]['gender'],
            "admin_id": user_std_data[0]['UserID']
        }

        data = request.get_json()
        
        # Validate required fields
        if 'id' not in data:
            return jsonify({"error": "Schedule ID is required"}), 400

        # Get existing schedule
        schedule = SubjectsStudy(id=data['id']).get_subject_data()
        if not schedule:
            return jsonify({"error": "Schedule not found"}), 404

        # Update fields
        updated_schedule = SubjectsStudy(
            id=data['id'],
            file_name=data.get('file_name', schedule[0]['file_name']),
            file_path=data.get('file_path', schedule[0]['file_path']),
            department=data.get('department', schedule[0]['department']),
            squad_number=data.get('squad_number', schedule[0]['squad_number']),
            semester_id=data.get('semster_number', schedule[0]['semester_id'])
        )
        updated_schedule.update_subject()

        return jsonify({
            "message": "Schedule updated successfully",
            "schedule": updated_schedule.get_subject_data()[0]
        }), 200

    except Exception as e:
        return jsonify({"error": f"Failed to update schedule: {str(e)}"}), 500 
 
@app.route('/remove_schedule', methods=['POST'])
@token_required
def remove_schedule():
    try:
        # Verify admin privileges
        user_id = request.user_id
        user_type = request.user_type
        userobj = Users(UserID=user_id, UserType=user_type)
        user_std_data = userobj.get_user_data_admin()

        if not user_std_data:
            return jsonify({"error": "User data not found"}), 404

        # Ensure the user is an admin
        if str(user_type).lower() != 'admin':
            return jsonify({"error": "Unauthorized access"}), 403
        
        admin_info = {
            "admin_name": user_std_data[0]['FirstName'] + " " + user_std_data[0]['LastName'],
            "admin_email": user_std_data[0]['Email'],
            "admin_gender": user_std_data[0]['gender'],
            "admin_id": user_std_data[0]['UserID']
        }

        data = request.get_json()
        
        # Validate required field
        if 'id' not in data:
            return jsonify({"error": "Schedule ID is required"}), 400

        # Verify schedule exists
        schedule = SubjectsStudy(id=data['id']).get_subject_data()
        if not schedule:
            return jsonify({"error": "Schedule not found"}), 404

        # Delete schedule
        SubjectsStudy(id=data['id']).delete_subject()

        return jsonify({
            "message": "Schedule removed successfully",
            "deleted_id": data['id']
        }), 200

    except Exception as e:
        return jsonify({"error": f"Failed to remove schedule: {str(e)}"}), 500 
 

# Student grades Page
#########################################
@app.route('/student_grades_page_from_admin', methods=['GET'])
@token_required
def student_grades_page_from_admin():
    # Extract user data from the JWT
    user_id = request.user_id
    user_type = request.user_type
    userobj = Users(UserID=user_id, UserType=user_type)
    user_std_data = userobj.get_user_data_admin()

    if not user_std_data:
        return jsonify({"error": "User data not found"}), 404

    # Ensure the user is an admin
    if str(user_type).lower() != 'admin':
        return jsonify({"error": "Unauthorized access"}), 403
    
    admin_info = {
        "admin_name": user_std_data[0]['FirstName'] + " " + user_std_data[0]['LastName'],
        "admin_email": user_std_data[0]['Email'],
        "admin_gender": user_std_data[0]['gender'],
        "admin_id": user_std_data[0]['UserID']
    }

    # Get all semester grades
    semester_grades_obj = SemesterGrades()
    semester_grades_data = semester_grades_obj.get_grade_data()
    
    if not semester_grades_data:
        return jsonify({"error": "No semester grades found"}), 404

    # Prepare response data
    student_grades_list = []


    for semester_grade in semester_grades_data:
        student_id = semester_grade['student_id']

        # Fetch student details
        student_obj = Users(UserID=student_id)
        student_info = student_obj.get_user_data()
        
        if not student_info:
            continue

        # Fetch student academic data
        student_academic_obj = Students(StudentID_fk=student_id)
        student_academic_data = student_academic_obj.get_student_data_with_StudentID_fk()
        
        if not student_academic_data:
            continue

        # Find matching academic record for this semester/squad

        # Get year work from grades table if needed
        grades_obj = Grades(StudentID=student_id)
        grade_data = grades_obj.get_grade_data()
        year_work = grade_data[0]['year_work'] if grade_data else None

        # Build the response record
        student_record = {
            "user_id": student_id,
            "first_name": f"{student_info[0]['FirstName']} {student_info[0]['LastName']}",
            "department": student_academic_data[0]['department'],
            "semester": semester_grade['semester_id'],
            "squad": semester_grade['squad_number'],
            "GPA": semester_grade['GPA'],
            "year_work": year_work
        }
        
        student_grades_list.append(student_record)

    return jsonify({
        "student_grades": student_grades_list,
        "admin_info": admin_info
    }), 200


@app.route('/show_more_grades_student_from_admin', methods=['POST'])
@token_required
def show_more_grades_student_from_admin():
    # Extract user data from the JWT
    user_id = request.user_id
    user_type = request.user_type
    userobj = Users(UserID=user_id, UserType=user_type)
    user_std_data = userobj.get_user_data_admin()

    if not user_std_data:
        return jsonify({"error": "User data not found"}), 404

    # Ensure the user is an admin
    if str(user_type).lower() != 'admin':
        return jsonify({"error": "Unauthorized access"}), 403
    
    admin_info = {
        "admin_name": user_std_data[0]['FirstName'] + " " + user_std_data[0]['LastName'],
        "admin_email": user_std_data[0]['Email'],
        "admin_gender": user_std_data[0]['gender'],
        "admin_id": user_std_data[0]['UserID']
    }

    # Get the student_id from the request body
    data = request.get_json()
    if not data or 'student_id' not in data:
        return jsonify({"error": "Student ID is required in the request body"}), 400

    student_id = data.get('student_id')
    semester_number = data.get('semester_number')
    squad_number = data.get('squad_number')

    # Fetch student data
    student_obj = Users(UserID=student_id)
    student_info = student_obj.get_user_data()
    if not student_info:
        return jsonify({"error": "Student data not found"}), 404

    # Fetch student academic data (GPA, department, semester, squad)
    student_academic_obj = Students(StudentID=student_id , semester_number=semester_number ,squad_number=squad_number )
    student_academic_data = student_academic_obj.get_data_by_squad_semester_std()
    if not student_academic_data:
        return jsonify({"error": "Student academic data not found"}), 404

    semester_obj = SemesterGrades(student_id=student_id , semester_id=student_academic_data[0]['semester_numer'])
    semester_data = semester_obj.get_grade_data_stdid_semester()
    # Fetch all grades for the student  
    grades_obj = Grades(StudentID=student_id , squad_number=squad_number , semester_id=semester_number)
    grade_data = grades_obj.get_data_by_squad_semester_std()


    
    if not grade_data:
        return jsonify({"error": "No grades found for this student"}), 404

    # Prepare the response data
    student_grades_info = []

    # Loop through each grade to fetch course details
    for grade in grade_data:
        course_obj = Courses(CourseID=grade['CourseID'])
        course_data = course_obj.get_course_data()

        if not course_data:
            continue  # Skip if course data is not found

        # Append the required data to the response
        student_grades_info.append({
            "course_id" : course_data[0]['CourseID'],
            "course_name": course_data[0]['CourseName'],
            "course_code": course_data[0]['CourseCode'],
            "grades": {
                "midterm_grade": grade['MidtermGrade'],
                "assignment_grade": grade['AssignmentGrade'],
                "final_grade": grade['FinalGrade'],
                "total_degree": grade['total_degree'],
                "pass_status": grade['pass_status'],
                "year_work": grade['year_work']
            }
        })

    # Include GPA in the response
    response_data = {
        "student_id": student_id,
        "student_email" : student_info[0]['Email'],
        "first_name": student_info[0]['FirstName'],
        "last_name": student_info[0]['LastName'],
        "department": student_academic_data[0]['department'],
        "semester": student_academic_data[0]['semester_numer'],
        "squad": student_academic_data[0]['squad_number'],
        "GPA": semester_data[0]['GPA'],
        "courses_grades": student_grades_info , 
        "admin_info" : admin_info
    }

    # Return the response
    return jsonify(response_data), 200
 

# @app.route('/calculate_semester_grades', methods=['POST'])
# @token_required
# def calculate_semester_grades():
#     try:
#         # Verify admin privileges
#         if request.user_type.lower() != 'admin':
#             return jsonify({"error": "Unauthorized access"}), 403

#         data = request.get_json()
        
#         # Validate required fields
#         if 'semester_id' not in data:
#             return jsonify({"error": "Semester ID is required"}), 400

#         semester_id = data['semester_id']
        
#         # Grade point mapping (customize based on your institution's scale)
#         GRADE_POINTS = {
#             'A+': 4.0,
#             'A': 4.0,
#             'A-': 3.7,
#             'B+': 3.3,
#             'B': 3.0,
#             'B-': 2.7,
#             'C+': 2.3,
#             'C': 2.0,
#             'D': 1.0,
#             'F': 0.0
#         }

#         # Get all students who have grades for this semester
#         grades_obj = Grades(semester_id=semester_id)
#         all_grades = grades_obj.get_grade_data()
        
#         if not all_grades:
#             return jsonify({"message": "No grades found for this semester"}), 200

#         # Group grades by student
#         students_grades = {}
#         for grade in all_grades:
#             student_id = grade['StudentID']
#             if student_id not in students_grades:
#                 students_grades[student_id] = []
#             students_grades[student_id].append(grade)

#         results = []
        
#         for student_id, grades in students_grades.items():
#             total_grade_points = 0
#             total_credit_hours = 0
#             passed_credit_hours = 0
#             passed_courses = 0
            
#             # Calculate semester GPA
#             for grade in grades:
#                 # Get course credit hours
#                 course = Courses(CourseID=grade['CourseID']).get_course_data()
#                 if not course:
#                     continue
                    
#                 credit_hours = course[0]['CreditHours']
#                 grade_letter = grade['Grade']
                
#                 # Calculate grade points
#                 grade_points = GRADE_POINTS.get(grade_letter, 0)
#                 total_grade_points += grade_points * credit_hours
#                 total_credit_hours += credit_hours
                
#                 # Check if course was passed
#                 if grade_letter != 'F':
#                     passed_credit_hours += credit_hours
#                     passed_courses += 1
            
#             # Avoid division by zero
#             semester_gpa = total_grade_points / total_credit_hours if total_credit_hours > 0 else 0
            
#             # Get student's current academic record
#             student = Students(StudentID=student_id).get_student_data()
#             if not student:
#                 continue
                
#             student = student[0]
            
#             # Calculate cumulative GPA and credit hours
#             previous_total_hours = student['TotalPassedCreditHours'] or 0
#             previous_gpa = student['CumulativeGPA'] or 0
#             previous_total_points = previous_gpa * previous_total_hours
            
#             new_total_hours = previous_total_hours + passed_credit_hours
#             new_total_points = previous_total_points + (semester_gpa * passed_credit_hours)
            
#             cumulative_gpa = new_total_points / new_total_hours if new_total_hours > 0 else 0
            
#             # Update student record
#             updated_student = Students(
#                 StudentID=student_id,
#                 CumulativeGPA=cumulative_gpa,
#                 TotalPassedCreditHours=new_total_hours,
#                 TotalRegisteredCreditHours=(student['TotalRegisteredCreditHours'] or 0) + total_credit_hours
#             )
#             updated_student.update_student()
            
#             # Add/update semester grades record
#             semester_grade = SemesterGrades(
#                 semester_id=semester_id,
#                 student_id=student_id,
#                 gpa=semester_gpa,
#                 total_req_hours=total_credit_hours
#             )
            
#             # Check if record exists
#             existing_record = semester_grade.get_grade_data_stdid_semester()
#             if existing_record:
#                 semester_grade.id = existing_record[0]['semester_grade_id']
#                 semester_grade.update_grade()
#             else:
#                 semester_grade.add_grade()
            
#             results.append({
#                 "student_id": student_id,
#                 "semester_gpa": round(semester_gpa, 2),
#                 "cumulative_gpa": round(cumulative_gpa, 2),
#                 "passed_credit_hours": passed_credit_hours,
#                 "total_credit_hours": total_credit_hours,
#                 "passed_courses": passed_courses
#             })

#         return jsonify({
#             "message": "Semester grades calculated successfully",
#             "semester_id": semester_id,
#             "results": results
#         }), 200

#     except Exception as e:
#         return jsonify({"error": f"Failed to calculate semester grades: {str(e)}"}), 500


# Notificaiton Page
@app.route('/admin_notifications', methods=['GET'])
@token_required
def get_admin_notifications():
    user_id = request.user_id
    user_type = request.user_type
    userobj = Users(UserID=user_id , UserType=user_type)
    user_std_data = userobj.get_user_data_admin()

    if not user_std_data:
        return jsonify({"error": "User data not found"}), 404

        # Ensure the user is a professor
    if str(user_type).lower() != 'admin':
        return jsonify({"error": "Unauthorized access"}), 403
    
    admin_info = {
       "admin_name" : user_std_data[0]['FirstName'] + " " + user_std_data[0]['LastName'] , 
       "admin_email" :  user_std_data[0]['Email'] ,
       "admin_gender" : user_std_data[0]['gender'] , 
       "admin_id" : user_std_data[0]['UserID']
    }

    try:
        # Fetch notifications for the user
        notification = Notifications(UserID=user_id)
        notifications_list = notification.get_notification_data()

        # Fetch user data for the response
        stdobj = Users(UserID=user_id)
        student_data = stdobj.get_user_data()

        if not student_data:
            return jsonify({"error": "User data not found"}), 404

        # Return the notifications and student data as JSON
        return jsonify({
            "notifications": notifications_list,
            "prof_data": student_data[0]
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

   
# student Grades Management Page :    
    
if __name__ == '__main__':
  app.run(host='0.0.0.0', port=5000 , debug=True)
     



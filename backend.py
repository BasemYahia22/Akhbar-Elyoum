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
            return jsonify({"error": "No data provided"}), 400  # Return error if no data is provided

        email = data.get('email')
        password = data.get('password')
        user_type = data.get('usertype')

        if not email or not password or not user_type:
            return jsonify({"error": "Missing email, password, or usertype"}), 400  # Validate input

        # Create a user object based on the provided credentials
        userObj = Users(Email=email, PasswordHash=password, UserType=user_type)
        user_data = userObj.get_user_data_with_email_password(email, password)
        
        # Attempt to log in the user
        success, user_id, message = userObj.login(email, password, user_type)
        print(f"success: {success}, user_id: {user_id}, message: {message}")
        
        if not success:
            return jsonify({"email": email, "message": message}), 400  # Validate input

        # Handle different user types
        if str(user_type).lower() == "student":
            if success:
                userList = userObj.set_data()
                if not userList or userList[0]['status'] == 1:
                    return jsonify({"result": "No", "message": "Your account is closed. Please contact the admin!"}), 403

                # Get student data
                stdjobg = Students(StudentID=user_id)
                sutd_data = stdjobg.get_student_data()
                print(f"Student data: {sutd_data}")

                # Generate JWT
                payload = {
                    'user_id': user_id,
                    'email': email,
                    'user_type': str(user_type).lower(),
                    'exp': datetime.utcnow() + timedelta(hours=1)  # Token expires in 1 hour
                }
                token = jwt.encode(payload, app.secret_key, algorithm='HS256')

                return jsonify({
                    "result": "Yes",
                    "email": email,
                    "usertype": user_type,
                    "token": token
                })

        elif user_type.lower() == "admin":
            userList = userObj.set_data()
            if not userList or userList[0]['status'] == 1:
                return jsonify({"result": "No", "message": "Your account is closed. Please contact the admin!"}), 403

            # Generate JWT
            payload = {
                'user_id': user_id,
                'email': email,
                'user_type': user_type,
                'exp': datetime.utcnow() + timedelta(hours=1)  # Token expires in 1 hour
            }
            token = jwt.encode(payload, app.secret_key, algorithm='HS256')

            return jsonify({
                "result": "Yes",
                "email": email,
                "usertype": user_type,
                "token": token
            })

        elif user_type.lower() == "professor":
            userList = userObj.set_data()
            if not userList or userList[0]['status'] == 1:
                return jsonify({"result": "No", "message": "Your account is closed. Please contact the admin!"}), 403

            # Generate JWT
            payload = {
                'user_id': user_id,
                'email': email,
                'user_type': user_type,
                'exp': datetime.utcnow() + timedelta(hours=1)  # Token expires in 1 hour
            }
            token = jwt.encode(payload, app.secret_key, algorithm='HS256')

            return jsonify({
                "result": "Yes",
                "email": email,
                "usertype": user_type,
                "token": token
            })

        else:
            return jsonify({"result": "No", "message": "Invalid user type"}), 400  # Handle invalid user types

    else:
        return jsonify({"error": "Invalid request method"}), 405  # Handle non-POST requests
      
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
    print(f"user type : {user_type}")
    # Ensure the user is a student
    if str(user_type).lower() != 'student':
        return jsonify({"error": "Unauthorized access"}), 403

    # Fetch user data using the user_id from the JWT
    stdobj = Users(UserID=user_id)
    std_data = stdobj.get_user_data()
    
    if not std_data:
        return jsonify({"error": "User data not found"}), 404

    # Fetch student-specific data
    stdjobg = Students(StudentID=user_id)
    sutd_data = stdjobg.get_current_squad_and_semester()
    
    if not sutd_data:
        return jsonify({"error": "Student data not found"}), 404

    # Fetch course registration data
    courseregObj = CourseRegistrations(StudentID=user_id)
    couse_reg_data = courseregObj.get_registration_data()
    
    # Fetch grades data
    gradesObj = Grades(StudentID=user_id)
    max_semster = gradesObj.get_max_semester_info()
    
    gradesObj2 = Grades(
        StudentID=user_id,
        squad_number=sutd_data[0]['squad_number'],
        department=sutd_data[0]['department'],
        semester_id=sutd_data[0]['semester_numer']
    )
    grades_data = gradesObj2.get_grade_data_based_on_sqaud_semester_depart_stdid_course()

    # Fetch subjects data
    subs_studyObj = SubjectsStudy(
        squad_number=sutd_data[0]['squad_number'],
        department=sutd_data[0]['department'],
        semester_id=sutd_data[0]['semester_numer']
    )
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
                "Total_grades": grade['total_degree'],
                "Grade": grade['Grade'],
                "points": points,
                "Semester": grade['Semester']
            })
    
    # Fetch semester grades
    semester_gradeobj = SemesterGrades(student_id=user_id, semester_id=sutd_data[0]['semester_numer'])
    ses_grades = semester_gradeobj.get_data_by_student_and_semester()
  
    semesterObj = Semesters(id =sutd_data[0]['semester_numer'])
    semester_data = semesterObj.get_semester_data()
    
  
    semester_gradeobj = SemesterGrades(student_id=user_id)
    ses_gradesss = semester_gradeobj.get_grade_data()
    
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
        "CGPA": total_grade_points,
        "GPA": ses_grades[0]['GPA'],
        "user_info": std_data[0],
        "student_data": sutd_data[0],
        "subjects_link": subs_std_data[0],
        "Accumulated_Registered_Hours": total_registered_hours,
        "CGPA": cgpa , 
        "Grades_data" : response_data, 
        "Semester_info" : semester_data[0]
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
    if semester_name.lower() == "semester 1":
        semes_num = 1
    elif semester_name.lower() == "semester 2":
        semes_num = 2
    elif semester_name.lower() == "semester 3":
        semes_num = 3
    elif semester_name.lower() == "semester 4":
        semes_num = 4

    # Fetch student data based on squad number and semester
    stdjobg = Students(StudentID=user_id, squad_number=squad_number_std, semester_number=semes_num)
    student_data_searched = stdjobg.get_student_data_squad_number()
    
    # print(f"student_data_searched : {student_data_searched}")
    print(50 * "*")

    if not student_data_searched:
        return jsonify({"error": "Student data not found"}), 404

    # Fetch course registration data
    courseregObj = CourseRegistrations(
        StudentID=student_data_searched[0]['StudentID'],
        squad_number=student_data_searched[0]['squad_number'],
        semester_number=student_data_searched[0]['semester_numer']
    )
    couse_reg_data = courseregObj.get_data_by_squad_semester_std()
    
    # print(f"couse_reg_data : {couse_reg_data}")
    print(50 * "*")

    # Fetch grades data
    gradesObj2 = Grades(
        StudentID=user_id,
        squad_number=squad_number_std,
        semester_id=semes_num 
    )
    print(f"user_id : {user_id} ,squad_number_std: {squad_number_std} ,semes_num : {semes_num}  ") 
    grades_data = gradesObj2.get_data_by_squad_semester_std()
    print(f"grades_data : {grades_data}")

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
            
    return jsonify({
        "grades_data": response_data
    })


# Register Page 
#*************************

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
    studentObj = Students(StudentID=user_id)
    current_data = studentObj.get_current_squad_and_semester()
    
    if not current_data:
        return jsonify({"error": "Student data not found"}), 404

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
        already_registered_courses = []
        
        if not data or 'course_ids' not in data or not data['course_ids']:
            return jsonify({'error': 'No course IDs provided'}), 400
        
        # Check if any course is already registered
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
            
            if registration.is_already_registered():
                already_registered_courses.append(course_id)
        
        # If there are already registered courses, return an error immediately
        if already_registered_courses:
            return jsonify({
                "error": "Some courses are already registered",
                "already_registered_courses": already_registered_courses
            }), 400  # Bad Request

        # Register the selected courses if none were already registered
        for course_id in course_ids:
            courseobj = Courses(CourseID=course_id)
            course_data = courseobj.get_course_data()
            
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

        return jsonify({"message": "Registration successful", "result": "Yes"}), 200

    # For GET request: Retrieve available courses
    available_coursesObj = Courses(semester_number=semester_number, squad_number=squad_number, department=department)
    available_courses = available_coursesObj.get_course_data_dept_semester_squad()

    # Fetch current semester data and total credit hours
    semester_dataObj = Semesters(semester_number=semester_number)
    semester_data = semester_dataObj.get_semester_data_with_number()
    total_available_hours = current_data[0]['available_hours_registered']

    include_keys = {"CourseCode", "CourseID", "CourseName", "CreditHours", "semester_number", "squad_number", "ProfID"}

    # Filter and add professor names
    filtered_courses = []
    for course in available_courses:
        course_data = {key: course[key] for key in include_keys if key in course}
        
        # Fetch professor name based on ProfID
        prof_id = course.get("ProfID")
        if prof_id:
            prof_obj = Users(UserID=prof_id)
            professor_name = prof_obj.get_user_data()
            course_data["ProfessorName"] = professor_name[0]['FirstName']

        filtered_courses.append(course_data)
    
    return jsonify({
        "student_data": student_data[0],
        "available_courses": filtered_courses,
        "semester_credit_hours": semester_data[0]['semester_credit'],
        "total_available_hours": total_available_hours
    })

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
    stdjobg = Students(StudentID=user_id)
    student_data = stdjobg.get_current_squad_and_semester()
    
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
        notifications_list = notification.get_notification_data()

        # Fetch user data for the response
        stdobj = Users(UserID=user_id)
        student_data = stdobj.get_user_data()

        if not student_data:
            return jsonify({"error": "User data not found"}), 404

        # Return the notifications and student data as JSON
        return jsonify({
            "notifications": notifications_list,
            "Student_data": student_data[0]
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
    stdObj = Students(StudentID=user_std_data[0]['UserID'])
    student_data_info = stdObj.get_current_squad_and_semester()
    
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
            return jsonify({"error": "Assignment data not found"}), 404

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
        semester_number=student_data_info[0]['semester_numer'],
        department=student_data_info[0]['department']
    )
    ass_data = assignmestObj.get_data_by_squad_semester_depart_semes()
    responses =[]
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

        response.append({
            "assignment_id": assignment['id'],
            "assignment_name": assignment['assignment_name'],
            "course_name": course_name,
            "file_link": assignment['file_upload_link'],
            "deadline": assignment['assignemnt_date']  # Fixed spelling
        })

    return jsonify({"assignments_data": response , 
                    "professor_info" :user_std_data[0],
                    "prof_data_2" : prof_data[0]})  # Wrap response in jsonify

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
    profobj = Professors(prof_user_id=user_id)
    prof_data = profobj.get_professor_data_with_prof_user_id()
    if not prof_data:
         return jsonify({"error": "Professor data not found"}), 404
        # Ensure the user is a professor
    if str(user_type).lower() != 'professor':
        return jsonify({"error": "Unauthorized access"}), 403
    
    data = request.get_json()
    ass_id = data.get("assignment_id")
    
    assignObj = Assignments(assignment_id=ass_id)
    assign_data = assignObj.get_assignment_data()
    course_obj =Courses(CourseID=assign_data[0]['course_id'])
    course_info = course_obj.get_course_data()
    
    assignment_data_all = {
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
                    "professor_info" :user_std_data[0],
                    "prof_data_2" : prof_data[0]})  # Wrap response in jsonify


@app.route('/add_new_assignment', methods=['POST' , "GET"])
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

    if request.method == "POST" : 
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
            submit_date="Not Submited",
            assignemnt_date=deadline,
            solved=0,  # Default value for solved
            submit_assignment=0  # Default value for submit_assignment
        )

        # Storing the assignment in the database
        assignment.add_assignment()

        return jsonify({"message": "Assignment added successfully" , "result" :"Yes"}), 201


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
        assignemnt_date=data.get("assignemnt_date", existing_assignment[0]['assignemnt_date']),
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
# admin
#############################################################################
@app.route('/admin_homepage')
def admin_homepage() : 
    return {"Wellcome to admin "}



if __name__ == '__main__':
  app.run(host='0.0.0.0', port=5000 , debug=True)
     



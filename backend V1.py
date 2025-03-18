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
        user_data = userObj.get_user_data_with_email_password(email ,password)
        # Attempt to log in the user
        success, user_id, message = userObj.login(email, password , user_type)
        print(f"success: {success}, user_id: {user_id}, message: {message}")
        
        stdjobg = Students(StudentID=user_id)
        sutd_data = stdjobg.get_student_data()
        print(f"student data : {sutd_data}")
        
        if not success  :
            return jsonify({"email" : email , "message" : message}), 400  # Validate input


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

                # Store data in session
                session['emailUser'] = email
                session['idUser'] = user_id
                session['appUser'] = userObj
                session['stdList'] = user_data  # Store student data in session

                return jsonify({"result": "Yes", "email": email, "usertype": user_type})

        elif user_type.lower() == "admin":
            userList = userObj.set_data()
            if not userList or userList[0]['status'] == 1:
                return jsonify({"result": "No", "message": "Your account is closed. Please contact the admin!"}), 403

            # Set session variables
            session['emailUser'] = email
            session['idUser'] = user_id
            session['appUser'] = userObj
            session['adminList'] = user_data

            return jsonify({"result": "Yes", "email": email, "usertype": user_type})

        elif user_type.lower() == "professor":
            userList = userObj.set_data()
            if not userList or userList[0]['status'] == 1:
                return jsonify({"result": "No", "message": "Your account is closed. Please contact the admin!"}), 403

            # Set session variables
            session['emailUser'] = email
            session['idUser'] = user_id
            session['appUser'] = userObj
            session['profList'] = user_data

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
    # stdobj = Users(UserID=2)
    
    std_data_session = stdobj.get_user_data()
    
    stdjobg = Students(StudentID=std_data_session[0]['UserID'])
    sutd_data = stdjobg.get_current_squad_and_semester()
    
    courseregObj = CourseRegistrations(StudentID=std_data_session[0]['UserID'])
    couse_reg_data = courseregObj.get_registration_data()
    
    gradesObj = Grades(StudentID=std_data_session[0]['UserID'])
    max_semster = gradesObj.get_max_semester_info()
    
    gradesObj2 = Grades(StudentID=sutd_data[0]['StudentID'] ,
                        squad_number=sutd_data[0]['squad_number'] , 
                        department=sutd_data[0]['department'] , 
                        semester_id=sutd_data[0]['semester_numer'])
    
    grades_data = gradesObj2.get_grade_data_based_on_sqaud_semester_depart_stdid_course()

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
    # gpa = total_grade_points / total_credit_hours if total_credit_hours > 0 else 0
    
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
    print(f"sutd_data : {sutd_data}")
    print(50*"*")
    print(f"subs_std_data : {subs_std_data}")
    print(50*"*")
    print(f"std_data_session : {std_data_session}")
    
    return {
        
        "credit_hours": total_credit_hours,
        "CGPA": total_grade_points,
        "GPA" : ses_grades[0]['GPA'] ,
        "user info" : std_data_session[0],
        "student_data": sutd_data[0],
        "subjects_link": subs_std_data[0] , 
        "Accumulated Registered Hours" : total_registered_hours , 
        "CGPA" : cgpa
    }


@app.route('/search_for_grades', methods=['POST'])
def search_for_grades() : 
    std_session = session['stdList']
    std_id = std_session[0]['UserID']
    # std_id = 2
    stdobj = Users(UserID=std_id)
    std_data_session = stdobj.get_user_data()
    print(f"std_data_session : {std_data_session}")
    
    data = request.json
    squad_number_std = data.get('squad_number' , " ")
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
    print(50*"*")
    stdjobg = Students(StudentID=std_data_session[0]['UserID'] , squad_number=squad_number_std , semester_number=semes_num )
    student_data_searched = stdjobg.get_student_data_squad_number()
    
    print(f"student_data_searched : {student_data_searched}")
    print(50*"*")

    courseregObj = CourseRegistrations(StudentID = student_data_searched[0]['StudentID'],
                                       squad_number=student_data_searched[0]['squad_number'] , 
                                       semester_number=student_data_searched[0]['semester_numer'] )
    
    
    couse_reg_data = courseregObj.get_data_by_squad_semester_std()
    
    print(f"couse_reg_data : {couse_reg_data}")
    print(50*"*")

    # gradesObj = Grades(StudentID=std_data_session[0]['UserID'])
    # max_semster = gradesObj.get_max_semester_info()
    
    gradesObj2 = Grades(StudentID=std_data_session[0]['UserID'] ,squad_number = squad_number_std , semester_id=semes_num)
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


@app.route('/get_student_data', methods=['GET'])
def get_student_data():
    if 'stdList' in session:
        return jsonify({"studentData": session['stdList']}), 200
    else:
        return jsonify({"error": "No student data found"}), 404


# Register Page 
#*************************

@app.route('/student_register_course', methods=['GET', 'POST'])
def student_register_course():
    std_data = session['stdList']
    std_id = std_data[0]['UserID']
    # std_id = 2
    stdobj = Users(UserID=std_id)
    student_data = stdobj.get_user_data()

    studentObj = Students(StudentID=std_id)
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
        already_registered_courses = []
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
            # Check if already registered
            if registration.is_already_registered():
                already_registered_courses.append(course_id)
                continue  # Skip registering duplicate course

            registration.add_registration()

        if already_registered_courses:
            return {
                "message": "Some courses were already registered",
                "already_registered_courses": already_registered_courses
            }, 400  # Bad Request
        

        return {"message": "Registration successful"}, 200

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
    
    return {
        "student_data": student_data[0],
        "available_courses": filtered_courses,
        "semester_credit_hours": semester_data[0]['semester_credit'],
        "total_available_hours": total_available_hours
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
    stdu_data = stdobj.get_user_data()

    stdjobg = Students(StudentID=stdu_data[0]['UserID'])
    student_data = stdjobg.get_current_squad_and_semester()

    if not student_data:
        return {"error": "Student not found"}

    courseregObj = CourseRegistrations(
        StudentID=student_id, 
        department=student_data[0]['department'], 
        squad_number=student_data[0]['squad_number'],
        semester_number=student_data[0]['semester_numer']
    )

    # Fetch course registration data
    couse_reg_data = courseregObj.get_data_by_squad_semester_std()
    if not couse_reg_data:
        return {"error": "No courses registered for this student"}

    registered_course_ids = list({reg['CourseID'] for reg in couse_reg_data})
    
    result = {
        "student_id": student_id,
        "student_name": stdu_data[0].get("FirstName", ""), 
        "courses": []
    }

    for course_id in registered_course_ids:
        courseObj = Courses(CourseID=course_id)
        course_data = courseObj.get_course_data()
        
        if not course_data:
            continue

        gradesObj = Grades(
            StudentID=student_id,
            squad_number=student_data[0]['squad_number'], 
            semester_id=student_data[0]['semester_numer'],
            CourseID=course_data[0]['CourseID']
        )
        grades_data = gradesObj.get_data_by_squad_semester_std()

        # **Skip courses with no grades**
        if not grades_data:
            continue  

        profObj = Users(UserID=course_data[0]['prof_id'])
        prof_data = profObj.get_user_data()

        if not prof_data:  
            prof_data = [{"FirstName": "Not exist", "Email": "Not exist"}]

        course_info = {
            "course_id": course_id,
            "course_name": course_data[0].get("CourseName", " "),
            "course_code": course_data[0].get("CourseCode", " "),  
            "prof_id": course_data[0].get('prof_id', " "),
            "prof_name": prof_data[0].get('FirstName', " "),
            "prof_email": prof_data[0].get('Email', " "),
            "grades": {
                "midterm_grade": grades_data[0].get("MidtermGrade", None),
                "assignment_grade": grades_data[0].get("AssignmentGrade", None),
                "final_grade": grades_data[0].get("FinalGrade", None),
                "total_degree": grades_data[0].get("total_degree", None),
                "points": grades_data[0].get("points", None)
            }
        }

        result["courses"].append(course_info)

    return {
        "result": result, 
        "User_info": std_data[0], 
        "student_info": student_data[0]
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
    course_code = data.get('course_code')
    review_text = data.get('review_text')
    review_type = data.get('grade_type')
    # student_id = data.get('student_id')  # Assuming the student ID is also provided

    # Validate required fields
    if not all([prof_email, course_code, review_text, review_type]):
        return jsonify({"error": "Missing required fields"}), 400

    # Save the review to the database
    try:
        review = Review(
            studentID=student_id,
            course_code=course_code,
            email_prof=prof_email,
            review_text=review_text,
            review_type = review_type
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
        return jsonify({"message": "Review submitted successfully!" , "result" : "Yes"}), 201
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
        return jsonify({"notifications": notifications_list , "Student_data" : std_data[0]}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Assigments page for student
#############################################################################
@app.route('/assignments_page_students', methods=['GET', 'POST'])
def assignments_page_students():
    std_data = session['stdList']
    std_id = std_data[0]['UserID']
    # std_id = 2
    userobj = Users(UserID=std_id)
    user_std_data = userobj.get_user_data()

    stdObj = Students(StudentID=user_std_data[0]['UserID'])
    student_data_info = stdObj.get_current_squad_and_semester()

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
            return {"error": str(e)}

        userObj = Users(Email=prof_email)
        user_info = userobj.get_user_data_with_email(prof_email)

        courseobj = Courses(CourseCode=course_code)
        course_data = courseobj.get_course_Code_data()

        assignmestObjj = Assignments(assignment_name=assigment_name)
        assignment_data = assignmestObjj.get_assignment_name_data()
        print(50*"*")
        print(f"assignment_data : {assignment_data}")
        print(50*"*")
        assObj = Assignments(
            assignment_id = assignment_data[0]['id'] , 
            submit_assignment = 1 , 
            assignment_name = assignment_data[0]['assignment_name'] ,
            semester_number = assignment_data[0]['semester_number'] , 
            solved = assignment_data[0]['solved'] , 
            course_id = assignment_data[0]['course_id'] , 
            file_upload_link=assignment_data[0]['file_upload_link'] , 
            prof_id=assignment_data[0]['prof_id'] , 
            squad_number=assignment_data[0]['squad_number'] , 
            department= assignment_data[0]['department'] 
        )
        assObj.update_assignment()
        

        assignmestObj = AssignmentSubmissions(
            assignment_id=assignment_data[0]['id'],
            squad_number=student_data_info[0]['squad_number'],
            semester_number=student_data_info[0]['semester_numer'],
            department=student_data_info[0]['department'],
            prof_id=user_info[0]['UserID'],
            course_id=course_data[0]['CourseID'],
            file_upload_link=file_link,
            student_id=std_id
        )
        
        assignmestObj.add_submission()


        return jsonify({"result": "Yes", "message": "Assignment submitted!"}), 200

    assignmestObj = Assignments(
        squad_number=student_data_info[0]['squad_number'],
        semester_number=student_data_info[0]['semester_numer'],
        department=student_data_info[0]['department']
    )
    
    ass_data = assignmestObj.get_data_by_squad_semester_depart_semes()

    return jsonify({"assignments_data": ass_data, "Student_data": student_data_info[0]}), 200

    
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
     



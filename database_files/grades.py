from database_files.database import DatabaseCRUD
from abc import ABC, abstractmethod

class IGrades(ABC):
    @abstractmethod
    def get_grade_data(self):
        pass

    @abstractmethod
    def add_grade(self):
        pass

    @abstractmethod
    def update_grade(self):
        pass

    @abstractmethod
    def delete_grade(self):
        pass

class Grades(IGrades):
    def __init__(self, GradeID=None,department=None  , year_work=None, squad_number=None , StudentID=None,Grade=None,semester_id= None ,points = None, CourseID=None, MidtermGrade=None, AssignmentGrade=None, FinalGrade=None, Semester=None ,assigments_grades=None, pass_status = None , total_degree = None):
        self.__GradeID = GradeID
        self.__StudentID = StudentID
        self.__CourseID = CourseID
        self.__MidtermGrade = MidtermGrade
        self.__AssignmentGrade = AssignmentGrade
        self.__FinalGrade = FinalGrade
        self.__Semester = Semester
        self.__pass_status = pass_status
        self.__assigments_grades = assigments_grades
        self.__total_degree = total_degree
        self.__Grade = Grade
        self.__points = points
        self.__semester_id = semester_id
        self.__squad_number = squad_number
        self.__department = department
        self.__year_work = year_work
        
        

    def get_grade_data(self):
        dbconn = DatabaseCRUD()
        cond = ["GradeID=" + str(self.__GradeID)] if self.__GradeID else ["1=1"]
        grade_data = dbconn.DBRead(tbl='Grades', sfld='*', scond=cond)
        return grade_data

    def get_grade_data_based_course_id(self):
        dbconn = DatabaseCRUD()
        cond = ["CourseID=" + str(self.__CourseID)] 
        grade_data = dbconn.DBRead(tbl='Grades', sfld='*', scond=cond)
        return grade_data

    def get_grade_data_based_course_id_and_student(self):
        dbconn = DatabaseCRUD()
        cond = [f"CourseID={self.__CourseID} and StudentID={self.__StudentID}"] 
        grade_data = dbconn.DBRead(tbl='Grades', sfld='*', scond=cond)
        return grade_data

    def get_grade_data_based_on_id_semes_id(self):
        dbconn = DatabaseCRUD()
        cond = [f"GradeID={self.__GradeID} and semester_id={self.__semester_id}"] 
        grade_data = dbconn.DBRead(tbl='Grades', sfld='*', scond=cond)
        return grade_data

    def get_grade_data_based_on_sqaud_semester_CourseID_stdid(self):
        dbconn = DatabaseCRUD()
        cond = [f"StudentID={self.__StudentID} and squad_number={self.__squad_number} and CourseID='{self.__CourseID}' and semester_id={self.__semester_id}"] 
        grade_data = dbconn.DBRead(tbl='Grades', sfld='*', scond=cond)
        return grade_data

    def get_grade_data_based_on_sqaud_semester_depart_stdid_course(self):
        dbconn = DatabaseCRUD()
        
        # Properly formatted condition
        cond = f"StudentID={self.__StudentID} AND squad_number={self.__squad_number} AND department='{self.__department}' AND semester_id={self.__semester_id}"
        
        # Fetch grade data
        grade_data = dbconn.DBRead(tbl='Grades', sfld='*', scond=[cond])
        
        return grade_data


    def add_grade(self):
        dbconn = DatabaseCRUD()
        dbconn.DBCreate(tbl='Grades', sidName='GradeID', sfld='StudentID, CourseID,squad_number , department , MidtermGrade, AssignmentGrade, FinalGrade, Semester,pass_status , assigments_grades , total_degree ,Grade , points , semester_id , year_work',
                        svalue=f"{self.__StudentID}, {self.__CourseID},{self.__squad_number},'{self.__department}' ,{self.__MidtermGrade}, {self.__AssignmentGrade}, {self.__FinalGrade}, '{self.__Semester}', '{self.__pass_status}' ,{self.__assigments_grades} ,{self.__total_degree},'{self.__Grade}' ,{self.__points},{self.__semester_id} , {self.__year_work} ")

    def update_grade(self):
        dbconn = DatabaseCRUD()
        cond = ["GradeID=" + str(self.__GradeID)]
        sfld = f"StudentID={self.__StudentID}, CourseID={self.__CourseID} , department='{self.__department}',squad_number={self.__squad_number} , MidtermGrade={self.__MidtermGrade}, AssignmentGrade={self.__AssignmentGrade}, FinalGrade={self.__FinalGrade}, Semester='{self.__Semester}', pass_status='{self.__pass_status}',  total_degree={self.__total_degree} , Grade='{self.__Grade}' , points={self.__points} , semester_id={self.__semester_id} , year_work={self.__year_work}"
        dbconn.DBUpdate(tbl='Grades', sfld=sfld, scond=cond)

    def delete_grade(self):
        dbconn = DatabaseCRUD()
        cond = ["GradeID=" + str(self.__GradeID)]
        dbconn.DBDelete(tbl='Grades', scond=cond)
        
    def get_max_semester_info(self):
        dbconn = DatabaseCRUD()
        
        # Step 1: Get the max semester ID for the student
        cond = [f"StudentID={self.__StudentID}"]
        max_semester_id_data = dbconn.DBRead(tbl='Grades', sfld='MAX(semester_id) AS MaxSemesterID', scond=cond)
        
        if not max_semester_id_data or not max_semester_id_data[0]['MaxSemesterID']:
            return None

        max_semester_id = max_semester_id_data[0]['MaxSemesterID']
        
        return {
            "MaxSemesterID": max_semester_id
        }


    def get_data_by_squad_semester_std_with_courses(self):
        if not self.__StudentID or not self.__semester_id:
            raise ValueError("Student ID and Semester ID are required")

        dbconn = DatabaseCRUD()
        cond = [f"StudentID={self.__StudentID} AND CourseID='{self.__CourseID}' AND semester_id={self.__semester_id} AND squad_number={self.__squad_number}"]
        grade_data = dbconn.DBRead(tbl='Grades', sfld='*', scond=cond)

        if not grade_data:
            return None

        return grade_data

    def get_data_by_squad_semester_std(self):
        if not self.__StudentID or not self.__semester_id or not self.__squad_number:
            raise ValueError("Student ID, Semester ID, and Squad Number are required")

        dbconn = DatabaseCRUD()
        
        # SQL condition
        cond = f"StudentID={self.__StudentID} AND semester_id={self.__semester_id} AND squad_number={self.__squad_number}"
        
        # Perform DB read
        grade_data = dbconn.DBRead(tbl='Grades', sfld='*', scond=[cond])

        # Return None if no data found, otherwise return data
        return grade_data if grade_data else None

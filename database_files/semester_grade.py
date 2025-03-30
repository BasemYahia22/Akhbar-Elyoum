from database_files.database import DatabaseCRUD
from abc import ABC, abstractmethod

class ISemesterGrades(ABC):
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

class SemesterGrades(ISemesterGrades):
    def __init__(self, id=None , TotalRegisteredCreditHours = None ,TotalPassedCreditHours=None ,available_hours_registered=None  , semester_id=None,squad_number = None , student_id=None, gpa=None, total_req_hours=None):
        self.__id = id
        self.__semester_id = semester_id
        self.__student_id = student_id
        self.__gpa = gpa
        self.__TotalRegisteredCreditHours = TotalRegisteredCreditHours
        self.__TotalPassedCreditHours = TotalPassedCreditHours
        self.__available_hours_registered = available_hours_registered
        self.__total_req_hours = total_req_hours 
        self.__squad_number = squad_number 
         
        

    def get_grade_data(self):
        dbconn = DatabaseCRUD()
        cond = ["semester_grade_id=" + str(self.__id)] if self.__id else ["1=1"]
        grade_data = dbconn.DBRead(tbl='semester_grades', sfld='*', scond=cond)
        return grade_data
    
    
    def get_grade_data_stdid_semester(self):
        dbconn = DatabaseCRUD()
        cond = f"student_id = {self.__student_id} AND semester_id = {self.__semester_id}"
        grade_data = dbconn.DBRead(tbl='semester_grades', sfld='*', scond=cond)
        return grade_data


    def add_grade(self):
        dbconn = DatabaseCRUD()
        dbconn.DBCreate(
            tbl='semester_grades',
            sidName='semester_grade_id',  # Auto-increment field, no need to pass a value
            sfld='semester_id, student_id, GPA, total_req_hours,squad_number,available_hours_registered,TotalPassedCreditHours,TotalRegisteredCreditHours',
            svalue=f"{self.__semester_id}, {self.__student_id}, {self.__gpa}, {self.__total_req_hours},{self.__squad_number},{self.__available_hours_registered} , {self.__TotalPassedCreditHours} , {self.__TotalRegisteredCreditHours}"
        )

    def update_grade(self):
        dbconn = DatabaseCRUD()
        cond = ["semester_grade_id=" + str(self.__id)]
        sfld = f"semester_id={self.__semester_id},  student_id={self.__student_id}, available_hours_registered={self.__available_hours_registered} , TotalPassedCreditHours = {self.__TotalPassedCreditHours} , TotalRegisteredCreditHours = {self.__TotalRegisteredCreditHours} , GPA={self.__gpa}, total_req_hours={self.__total_req_hours} , squad_number={self.__squad_number}"
        dbconn.DBUpdate(tbl='semester_grades', sfld=sfld, scond=cond)

    def delete_grade(self):
        dbconn = DatabaseCRUD()
        cond = ["semester_grade_id=" + str(self.__id)]
        dbconn.DBDelete(tbl='semester_grades', scond=cond)


    def get_data_by_student_and_semester(self):
        if not self.__student_id or not self.__semester_id:
            raise ValueError("Student ID and Semester ID are required")

        dbconn = DatabaseCRUD()
        cond = [f"student_id={self.__student_id} AND semester_id={self.__semester_id}"]
        grade_data = dbconn.DBRead(tbl='semester_grades', sfld='*', scond=cond)

        if not grade_data:
            return None

        return grade_data

    def get_data_by_student_and_semester_and_Squad(self):
        if not self.__student_id or not self.__semester_id or not self.__squad_number:
            raise ValueError("Student ID and Semester ID are required")

        dbconn = DatabaseCRUD()
        cond = [f"student_id={self.__student_id} AND semester_id={self.__semester_id} and squad_number={self.__squad_number}"]
        grade_data = dbconn.DBRead(tbl='semester_grades', sfld='*', scond=cond)

        if not grade_data:
            return None

        return grade_data
    

    def get_top_ten_students_with_higher_grades(self):
        dbconn = DatabaseCRUD()
        
        # Fetch the latest semester_id
        # max_semester_query = "SELECT FROM semester_grades"
        max_semester_id = dbconn.DBRead(tbl='semester_grades', sfld='MAX(semester_id)')

        if not max_semester_id:
            return None

        # Extract the max semester_id value
        max_semester_id = max_semester_id[0]['MAX(semester_id)'] # Assuming DBReadRaw returns a list of tuples

        # Now fetch the top 10 students for the latest semester
        cond = [f"semester_id = {max_semester_id}"]
        grade_data = dbconn.DBRead(tbl='semester_grades', sfld='*', scond=cond, sorderBy="GPA", slimit="10")

        if not grade_data:
            return None

        return grade_data

    
    
    
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
    def __init__(self, id=None, semester_id=None, student_id=None, gpa=None, total_req_hours=None):
        self.__id = id
        self.__semester_id = semester_id
        self.__student_id = student_id
        self.__gpa = gpa
        self.__total_req_hours = total_req_hours 
         
        

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
            sfld='semester_id, student_id, GPA, total_req_hours',
            svalue=f"{self.__semester_id}, {self.__student_id}, {self.__gpa}, {self.__total_req_hours}"
        )

    def update_grade(self):
        dbconn = DatabaseCRUD()
        cond = ["semester_grade_id=" + str(self.__id)]
        sfld = f"semester_id={self.__semester_id}, student_id={self.__student_id}, GPA={self.__gpa}, total_req_hours={self.__total_req_hours}"
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
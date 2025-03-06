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
    def __init__(self, GradeID=None, StudentID=None, CourseID=None, MidtermGrade=None, AssignmentGrade=None, FinalGrade=None, Semester=None):
        self.__GradeID = GradeID
        self.__StudentID = StudentID
        self.__CourseID = CourseID
        self.__MidtermGrade = MidtermGrade
        self.__AssignmentGrade = AssignmentGrade
        self.__FinalGrade = FinalGrade
        self.__Semester = Semester

    def get_grade_data(self):
        dbconn = DatabaseCRUD()
        cond = ["GradeID=" + str(self.__GradeID)] if self.__GradeID else ["1=1"]
        grade_data = dbconn.DBRead(tbl='Grades', sfld='*', scond=cond)
        return grade_data

    def add_grade(self):
        dbconn = DatabaseCRUD()
        dbconn.DBCreate(tbl='Grades', sidName='GradeID', sfld='StudentID, CourseID, MidtermGrade, AssignmentGrade, FinalGrade, Semester',
                        svalue=f"{self.__StudentID}, {self.__CourseID}, {self.__MidtermGrade}, {self.__AssignmentGrade}, {self.__FinalGrade}, '{self.__Semester}'")

    def update_grade(self):
        dbconn = DatabaseCRUD()
        cond = ["GradeID=" + str(self.__GradeID)]
        sfld = f"StudentID={self.__StudentID}, CourseID={self.__CourseID}, MidtermGrade={self.__MidtermGrade}, AssignmentGrade={self.__AssignmentGrade}, FinalGrade={self.__FinalGrade}, Semester='{self.__Semester}'"
        dbconn.DBUpdate(tbl='Grades', sfld=sfld, scond=cond)

    def delete_grade(self):
        dbconn = DatabaseCRUD()
        cond = ["GradeID=" + str(self.__GradeID)]
        dbconn.DBDelete(tbl='Grades', scond=cond)
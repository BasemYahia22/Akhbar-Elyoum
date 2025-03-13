from database_files.database import DatabaseCRUD
from abc import ABC, abstractmethod

class ICourses(ABC):
    @abstractmethod
    def get_course_data(self):
        pass

    @abstractmethod
    def add_course(self):
        pass

    @abstractmethod
    def update_course(self):
        pass

    @abstractmethod
    def delete_course(self):
        pass

class Courses(ICourses):
    def __init__(self, CourseID=None, CourseCode=None, CourseName=None,squad_number = None , CreditHours=None, PrerequisiteCourseID=None , ProfID = None ,  mitterm_grade = None, Final_grade = None , points = None):
        self.__CourseID = CourseID
        self.__CourseCode = CourseCode
        self.__CourseName = CourseName
        self.__CreditHours = CreditHours
        self.__PrerequisiteCourseID = PrerequisiteCourseID
        self.__ProfID = ProfID
        self.__mitterm_grade = mitterm_grade
        self.__Final_grade = Final_grade
        self.__points = points
        self.__squad_number = squad_number

    def get_course_data(self):
        dbconn = DatabaseCRUD()
        cond = ["CourseID=" + str(self.__CourseID)] if self.__CourseID else ["1=1"]
        course_data = dbconn.DBRead(tbl='Courses', sfld='*', scond=cond)
        return course_data

    def add_course(self):
        dbconn = DatabaseCRUD()
        dbconn.DBCreate(tbl='Courses', sidName='CourseID', sfld='CourseCode, CourseName, CreditHours, PrerequisiteCourseID , ProfID,mitterm_grade ,Final_grade,points ,squad_number',
                        svalue=f"'{self.__CourseCode}', '{self.__CourseName}', {self.__CreditHours}, {self.__PrerequisiteCourseID} , {self.__ProfID} , {self.__mitterm_grade} , {self.__Final_grade} , {self.__points} , {self.__squad_number}")

    def update_course(self):
        dbconn = DatabaseCRUD()
        cond = ["CourseID=" + str(self.__CourseID)]
        sfld = f"CourseCode='{self.__CourseCode}', CourseName='{self.__CourseName}', CreditHours={self.__CreditHours}, PrerequisiteCourseID={self.__PrerequisiteCourseID},ProfID={self.__ProfID} ,mitterm_grade={self.__mitterm_grade} ,Final_grade={self.__Final_grade} ,points={self.__points}, squad_number={self.__squad_number}"
        dbconn.DBUpdate(tbl='Courses', sfld=sfld, scond=cond)

    def delete_course(self):
        dbconn = DatabaseCRUD()
        cond = ["CourseID=" + str(self.__CourseID)]
        dbconn.DBDelete(tbl='Courses', scond=cond)
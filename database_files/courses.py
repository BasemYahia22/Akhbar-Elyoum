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
    def __init__(self, CourseID=None, CourseCode=None, CourseName=None, CreditHours=None, PrerequisiteCourseID=None):
        self.__CourseID = CourseID
        self.__CourseCode = CourseCode
        self.__CourseName = CourseName
        self.__CreditHours = CreditHours
        self.__PrerequisiteCourseID = PrerequisiteCourseID

    def get_course_data(self):
        dbconn = DatabaseCRUD()
        cond = ["CourseID=" + str(self.__CourseID)] if self.__CourseID else ["1=1"]
        course_data = dbconn.DBRead(tbl='Courses', sfld='*', scond=cond)
        return course_data

    def add_course(self):
        dbconn = DatabaseCRUD()
        dbconn.DBCreate(tbl='Courses', sidName='CourseID', sfld='CourseCode, CourseName, CreditHours, PrerequisiteCourseID',
                        svalue=f"'{self.__CourseCode}', '{self.__CourseName}', {self.__CreditHours}, {self.__PrerequisiteCourseID}")

    def update_course(self):
        dbconn = DatabaseCRUD()
        cond = ["CourseID=" + str(self.__CourseID)]
        sfld = f"CourseCode='{self.__CourseCode}', CourseName='{self.__CourseName}', CreditHours={self.__CreditHours}, PrerequisiteCourseID={self.__PrerequisiteCourseID}"
        dbconn.DBUpdate(tbl='Courses', sfld=sfld, scond=cond)

    def delete_course(self):
        dbconn = DatabaseCRUD()
        cond = ["CourseID=" + str(self.__CourseID)]
        dbconn.DBDelete(tbl='Courses', scond=cond)
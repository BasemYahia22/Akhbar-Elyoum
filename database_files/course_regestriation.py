from database_files.database import DatabaseCRUD
from abc import ABC, abstractmethod

class ICourseRegistrations(ABC):
    @abstractmethod
    def get_registration_data(self):
        pass

    @abstractmethod
    def add_registration(self):
        pass

    @abstractmethod
    def update_registration(self):
        pass

    @abstractmethod
    def delete_registration(self):
        pass

class CourseRegistrations(ICourseRegistrations):
    def __init__(self, RegistrationID=None,squad_number=None , department =None , semester_number=None , StudentID=None, CourseID=None, Semester=None , status_registration = None):
        self.__RegistrationID = RegistrationID
        self.__StudentID = StudentID
        self.__CourseID = CourseID
        self.__Semester = Semester
        self.__status_registration = status_registration
        self.__squad_number = squad_number
        self.__department = department 
        self.__semester_number = semester_number
        

    def get_registration_data(self):
        dbconn = DatabaseCRUD()
        cond = ["RegistrationID=" + str(self.__RegistrationID)] if self.__RegistrationID else ["1=1"]
        registration_data = dbconn.DBRead(tbl='CourseRegistrations', sfld='*', scond=cond)
        return registration_data
    
    def add_registration(self):
        dbconn = DatabaseCRUD()
        dbconn.DBCreate(
            tbl='CourseRegistrations',
            sidName='RegistrationID',
            sfld='StudentID, CourseID, Semester, status_registration, semester_number, department, squad_number',
            svalue=f"{self.__StudentID}, {self.__CourseID}, '{self.__Semester}', '{self.__status_registration}', {self.__semester_number}, '{self.__department}', {self.__squad_number}"
        )
        
    def update_registration(self):
        dbconn = DatabaseCRUD()
        cond = ["RegistrationID=" + str(self.__RegistrationID)]
        sfld = f"StudentID={self.__StudentID}, CourseID={self.__CourseID}, Semester='{self.__Semester}', status_registration='{self.__status_registration}' ,semester_number={self.__semester_number} ,department='{self.__department}', squad_number={self.__squad_number} "
        dbconn.DBUpdate(tbl='CourseRegistrations', sfld=sfld, scond=cond)

    def delete_registration(self):
        dbconn = DatabaseCRUD()
        cond = ["RegistrationID=" + str(self.__RegistrationID)]
        dbconn.DBDelete(tbl='CourseRegistrations', scond=cond)
        
    
    def get_data_by_squad_semester_std(self):
        if not self.__StudentID or not self.__semester_number:
            raise ValueError("Student ID and Semester ID are required")

        dbconn = DatabaseCRUD()
        cond = [f"StudentID={self.__StudentID} AND semester_number={self.__semester_number} AND squad_number={self.__squad_number}"]
        grade_data = dbconn.DBRead(tbl='CourseRegistrations', sfld='*', scond=cond)

        if not grade_data:
            return None

        return grade_data
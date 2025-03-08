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
    def __init__(self, RegistrationID=None, StudentID=None, CourseID=None, Semester=None , status_registration = None):
        self.__RegistrationID = RegistrationID
        self.__StudentID = StudentID
        self.__CourseID = CourseID
        self.__Semester = Semester
        self.__status_registration = status_registration

    def get_registration_data(self):
        dbconn = DatabaseCRUD()
        cond = ["RegistrationID=" + str(self.__RegistrationID)] if self.__RegistrationID else ["1=1"]
        registration_data = dbconn.DBRead(tbl='CourseRegistrations', sfld='*', scond=cond)
        return registration_data

    def add_registration(self):
        dbconn = DatabaseCRUD()
        dbconn.DBCreate(tbl='CourseRegistrations', sidName='RegistrationID', sfld='StudentID, CourseID, Semester,status_registration',
                        svalue=f"{self.__StudentID}, {self.__CourseID}, '{self.__Semester}' ,'{self.__status_registration}'")

    def update_registration(self):
        dbconn = DatabaseCRUD()
        cond = ["RegistrationID=" + str(self.__RegistrationID)]
        sfld = f"StudentID={self.__StudentID}, CourseID={self.__CourseID}, Semester='{self.__Semester}', status_registration='{self.__status_registration}'"
        dbconn.DBUpdate(tbl='CourseRegistrations', sfld=sfld, scond=cond)

    def delete_registration(self):
        dbconn = DatabaseCRUD()
        cond = ["RegistrationID=" + str(self.__RegistrationID)]
        dbconn.DBDelete(tbl='CourseRegistrations', scond=cond)
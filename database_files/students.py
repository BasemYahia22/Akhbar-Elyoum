from database_files.database import DatabaseCRUD
from abc import ABC, abstractmethod

class IStudents(ABC):
    @abstractmethod
    def get_student_data(self):
        pass

    @abstractmethod
    def add_student(self):
        pass

    @abstractmethod
    def update_student(self):
        pass

    @abstractmethod
    def delete_student(self):
        pass

class Students(IStudents):
    def __init__(self, StudentID=None, Major=None, AcademicLevel=None, CumulativeGPA=None, TotalPassedCreditHours=None, TotalRegisteredCreditHours=None):
        self.__StudentID = StudentID
        self.__Major = Major
        self.__AcademicLevel = AcademicLevel
        self.__CumulativeGPA = CumulativeGPA
        self.__TotalPassedCreditHours = TotalPassedCreditHours
        self.__TotalRegisteredCreditHours = TotalRegisteredCreditHours

    def get_student_data(self):
        dbconn = DatabaseCRUD()
        cond = ["StudentID=" + str(self.__StudentID)] if self.__StudentID else ["1=1"]
        student_data = dbconn.DBRead(tbl='Students', sfld='*', scond=cond)
        return student_data

    def add_student(self):
        dbconn = DatabaseCRUD()
        dbconn.DBCreate(tbl='Students', sidName='StudentID', sfld='Major, AcademicLevel, CumulativeGPA, TotalPassedCreditHours, TotalRegisteredCreditHours',
                        svalue=f"'{self.__Major}', {self.__AcademicLevel}, {self.__CumulativeGPA}, {self.__TotalPassedCreditHours}, {self.__TotalRegisteredCreditHours}")

    def update_student(self):
        dbconn = DatabaseCRUD()
        cond = ["StudentID=" + str(self.__StudentID)]
        sfld = f"Major='{self.__Major}', AcademicLevel={self.__AcademicLevel}, CumulativeGPA={self.__CumulativeGPA}, TotalPassedCreditHours={self.__TotalPassedCreditHours}, TotalRegisteredCreditHours={self.__TotalRegisteredCreditHours}"
        dbconn.DBUpdate(tbl='Students', sfld=sfld, scond=cond)

    def delete_student(self):
        dbconn = DatabaseCRUD()
        cond = ["StudentID=" + str(self.__StudentID)]
        dbconn.DBDelete(tbl='Students', scond=cond)
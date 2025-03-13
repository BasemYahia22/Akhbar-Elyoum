from database_files.database import DatabaseCRUD
from abc import ABC, abstractmethod

class ISemesters(ABC):
    @abstractmethod
    def get_semester_data(self):
        pass

    @abstractmethod
    def add_semester(self):
        pass

    @abstractmethod
    def update_semester(self):
        pass

    @abstractmethod
    def delete_semester(self):
        pass

class Semesters(ISemesters):
    def __init__(self, id=None, semester_number=None, semester_credit=None, semester_start_date=None, student_id=None):
        self.__id = id
        self.__semester_number = semester_number
        self.__semester_credit = semester_credit
        self.__semester_start_date = semester_start_date
        self.__student_id = student_id

    def get_semester_data(self):
        dbconn = DatabaseCRUD()
        cond = ["id=" + str(self.__id)] if self.__id else ["1=1"]
        semester_data = dbconn.DBRead(tbl='semesters', sfld='*', scond=cond)
        return semester_data

    def add_semester(self):
        dbconn = DatabaseCRUD()
        dbconn.DBCreate(
            tbl='semesters',
            sidName='id',  # Auto-increment field, no need to pass a value
            sfld='semester_number, semester_credit, semester_start_date, student_id',
            svalue=f"{self.__semester_number}, {self.__semester_credit}, '{self.__semester_start_date}', {self.__student_id}"
        )

    def update_semester(self):
        dbconn = DatabaseCRUD()
        cond = ["id=" + str(self.__id)]
        sfld = f"semester_number={self.__semester_number}, semester_credit={self.__semester_credit}, semester_start_date='{self.__semester_start_date}', student_id={self.__student_id}"
        dbconn.DBUpdate(tbl='semesters', sfld=sfld, scond=cond)

    def delete_semester(self):
        dbconn = DatabaseCRUD()
        cond = ["id=" + str(self.__id)]
        dbconn.DBDelete(tbl='semesters', scond=cond)
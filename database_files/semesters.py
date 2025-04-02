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
    def __init__(self, id=None, semester_number=None , semester_credit=None , available_hours_regisitered=None ,semester_name = None , semester_year_range = None , squad_number=None, semester_start_date=None):
        self.__id = id
        self.__semester_number = semester_number
        self.__squad_number = squad_number
        self.__semester_start_date = semester_start_date
        self.__semester_name = semester_name
        self.__semester_year_range = semester_year_range
        self.__semester_credit = semester_credit
        self.__available_hours_regisitered = available_hours_regisitered

    def get_semester_data(self):
        dbconn = DatabaseCRUD()
        cond = ["id=" + str(self.__id)] if self.__id else ["1=1"]
        semester_data = dbconn.DBRead(tbl='semesters', sfld='*', scond=cond)
        return semester_data

    def get_semester_data_with_number(self):
        dbconn = DatabaseCRUD()
        cond = [f"semester_number={self.__semester_number}"] 
        semester_data = dbconn.DBRead(tbl='semesters', sfld='*', scond=cond)
        return semester_data

    def get_semester_data_with_number_with_squad(self):
        dbconn = DatabaseCRUD()
        cond = [f"semester_number={self.__semester_number} and squad_number={self.__squad_number}"] 
        semester_data = dbconn.DBRead(tbl='semesters', sfld='*', scond=cond)
        return semester_data

    def add_semester(self):
        dbconn = DatabaseCRUD()
        dbconn.DBCreate(
            tbl='semesters',
            sidName='id',  # Auto-increment field, no need to pass a value
            sfld='semester_number, squad_number, semester_start_date , semester_name , semester_year_range , available_hours_regisitered , semester_credit',
            svalue=f"{self.__semester_number}, {self.__squad_number}, '{self.__semester_start_date}',  '{self.__semester_name}', '{self.__semester_year_range}' , {self.__available_hours_regisitered} , {self.__semester_credit}"
        )

    def update_semester(self):
        dbconn = DatabaseCRUD()
        cond = ["id=" + str(self.__id)]
        sfld = f"semester_number={self.__semester_number}, squad_number={self.__squad_number}, semester_start_date='{self.__semester_start_date}', semester_name='{self.__semester_name}' , semester_year_range ='{self.__semester_year_range}' , available_hours_regisitered={self.__available_hours_regisitered} , semester_credit={self.__semester_credit}"
        dbconn.DBUpdate(tbl='semesters', sfld=sfld, scond=cond)

    def delete_semester(self):
        dbconn = DatabaseCRUD()
        cond = ["id=" + str(self.__id)]
        dbconn.DBDelete(tbl='semesters', scond=cond)
        
    def get_data_by_squad_semester_squad_number_with_id(self):
        if not self.__semester_number:
            raise ValueError("Student ID and Semester ID are required")

        dbconn = DatabaseCRUD()
        cond = [f" squad_number={self.__squad_number} AND semester_number={self.__semester_number}"]
        grade_data = dbconn.DBRead(tbl='semesters', sfld='*', scond=cond)

        if not grade_data:
            return None

        return grade_data
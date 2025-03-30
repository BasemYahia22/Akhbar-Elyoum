from database_files.database import DatabaseCRUD
from abc import ABC, abstractmethod

class ISubjectsStudy(ABC):
    @abstractmethod
    def get_subject_data(self):
        pass

    @abstractmethod
    def add_subject(self):
        pass

    @abstractmethod
    def update_subject(self):
        pass

    @abstractmethod
    def delete_subject(self):
        pass

class SubjectsStudy(ISubjectsStudy):
    def __init__(self, id=None, file_name=None,semester_id =None , file_path=None , squad_number = None , department = None):
        self.__id = id
        self.__file_name = file_name
        self.__file_path = file_path
        self.__squad_number = squad_number
        self.__department = department
        self.__semester_id = semester_id

    def get_subject_data(self):
        dbconn = DatabaseCRUD()
        cond = ["id=" + str(self.__id)] if self.__id else ["1=1"]
        subject_data = dbconn.DBRead(tbl='subjects_study', sfld='*', scond=cond)
        return subject_data

    def get_data_by_squad_number_and_deparmt_semester(self):
        if not self.__semester_id:
            raise ValueError("department and Semester ID and squad_number are required")
        dbconn = DatabaseCRUD()
        cond = [f"semester_id={self.__semester_id} and squad_number={self.__squad_number}"]
        grade_data = dbconn.DBRead(tbl='subjects_study', sfld='*', scond=cond)
        if not grade_data:
            return None

        return grade_data


    def add_subject(self):
        dbconn = DatabaseCRUD()
        dbconn.DBCreate(
            tbl='subjects_study',
            sidName='id',  # Auto-increment field, no need to pass a value
            sfld='file_name, file_path , squad_number ,department ',
            svalue=f"'{self.__file_name}', '{self.__file_path}' , {self.__squad_number}, '{self.__department}'"
        )

    def update_subject(self):
        dbconn = DatabaseCRUD()
        cond = ["id=" + str(self.__id)]
        sfld = f"file_name='{self.__file_name}', file_path='{self.__file_path}', squad_number={self.__squad_number}, department='{self.__department}'"
        dbconn.DBUpdate(tbl='subjects_study', sfld=sfld, scond=cond)

    def delete_subject(self):
        dbconn = DatabaseCRUD()
        cond = ["id=" + str(self.__id)]
        dbconn.DBDelete(tbl='subjects_study', scond=cond)
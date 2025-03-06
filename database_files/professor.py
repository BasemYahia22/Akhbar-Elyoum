from database_files.database import DatabaseCRUD
from abc import ABC, abstractmethod

class IProfessors(ABC):
    @abstractmethod
    def get_professor_data(self):
        pass

    @abstractmethod
    def add_professor(self):
        pass

    @abstractmethod
    def update_professor(self):
        pass

    @abstractmethod
    def delete_professor(self):
        pass

class Professors(IProfessors):
    def __init__(self, ProfessorID=None, Department=None):
        self.__ProfessorID = ProfessorID
        self.__Department = Department

    def get_professor_data(self):
        dbconn = DatabaseCRUD()
        cond = ["ProfessorID=" + str(self.__ProfessorID)] if self.__ProfessorID else ["1=1"]
        professor_data = dbconn.DBRead(tbl='Professors', sfld='*', scond=cond)
        return professor_data

    def add_professor(self):
        dbconn = DatabaseCRUD()
        dbconn.DBCreate(tbl='Professors', sidName='ProfessorID', sfld='Department',
                        svalue=f"'{self.__Department}'")

    def update_professor(self):
        dbconn = DatabaseCRUD()
        cond = ["ProfessorID=" + str(self.__ProfessorID)]
        sfld = f"Department='{self.__Department}'"
        dbconn.DBUpdate(tbl='Professors', sfld=sfld, scond=cond)

    def delete_professor(self):
        dbconn = DatabaseCRUD()
        cond = ["ProfessorID=" + str(self.__ProfessorID)]
        dbconn.DBDelete(tbl='Professors', scond=cond)
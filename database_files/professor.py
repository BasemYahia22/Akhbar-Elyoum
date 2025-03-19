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
    def __init__(self, ProfessorID=None, Department=None,prof_user_id = None , course_id = None):
        self.__ProfessorID = ProfessorID
        self.__Department = Department
        self.__course_id = course_id
        self.__prof_user_id = prof_user_id


    def get_professor_data(self):
        dbconn = DatabaseCRUD()
        cond = ["ProfessorID=" + str(self.__ProfessorID)] if self.__ProfessorID else ["1=1"]
        professor_data = dbconn.DBRead(tbl='Professors', sfld='*', scond=cond)
        return professor_data

    def get_professor_data_with_prof_user_id(self):
        dbconn = DatabaseCRUD()
        cond = ["prof_user_id=" + str(self.__prof_user_id)]
        professor_data = dbconn.DBRead(tbl='Professors', sfld='*', scond=cond)
        return professor_data

    def add_professor(self):
        dbconn = DatabaseCRUD()
        dbconn.DBCreate(tbl='Professors', sidName='ProfessorID', sfld='Department , course_id , prof_user_id',
                        svalue=f"'{self.__Department}' , '{self.__course_id}' , '{self.__prof_user_id}'")

    def update_professor(self):
        dbconn = DatabaseCRUD()
        cond = ["ProfessorID=" + str(self.__ProfessorID)]
        sfld = f"Department='{self.__Department}' , course_id={self.__course_id} , prof_user_id={self.__prof_user_id}"
        dbconn.DBUpdate(tbl='Professors', sfld=sfld, scond=cond)

    def delete_professor(self):
        dbconn = DatabaseCRUD()
        cond = ["ProfessorID=" + str(self.__ProfessorID)]
        dbconn.DBDelete(tbl='Professors', scond=cond)
        
        
    def get_total_courses(self) : 
        dbconn = DatabaseCRUD()
        cond = [f"prof_user_id = {self.__prof_user_id}"]
        data = dbconn.DBRead(tbl="Professors" , scond=cond , sfld="count(distinct course_id) as Courses_Number")
        return data
from database_files.database import DatabaseCRUD
from abc import ABC, abstractmethod

class IAssignments(ABC):
    @abstractmethod
    def get_assignment_data(self):
        pass

    @abstractmethod
    def add_assignment(self):
        pass

    @abstractmethod
    def update_assignment(self):
        pass

    @abstractmethod
    def delete_assignment(self):
        pass

class Assignments(IAssignments):
    def __init__(self, assignment_id=None,submit_assignment=None , assignment_name=None,solved= None 
                 , course_id=None, file_upload_link=None, prof_id=None, squad_number=None,
                 department=None, semester_number=None , submit_date=None , assignemnt_date=None):
        
        self.__assignment_id = assignment_id
        self.__assignment_name = assignment_name
        self.__course_id = course_id
        self.__file_upload_link = file_upload_link
        self.__prof_id = prof_id
        self.__squad_number = squad_number
        self.__department = department
        self.__semester_number = semester_number
        self.__solved = solved
        self.__submit_assignment = submit_assignment
        self.__submit_date = submit_date
        self.__assignemnt_date = assignemnt_date

    def get_assignment_data(self):
        dbconn = DatabaseCRUD()
        cond = ["id=" + str(self.__assignment_id)] if self.__assignment_id else ["1=1"]
        assignment_data = dbconn.DBRead(tbl='assignments', sfld='*', scond=cond)
        return assignment_data

    def get_assignment_name_data(self):
        dbconn = DatabaseCRUD()
        cond = [f"assignment_name='{self.__assignment_name}'"] 
        assignment_data = dbconn.DBRead(tbl='assignments', sfld='*', scond=cond)
        return assignment_data

    def add_assignment(self):
        dbconn = DatabaseCRUD()
        dbconn.DBCreate(
            tbl='assignments',
            sidName='id',  # Auto-increment field
            sfld='assignment_name, course_id, file_upload_link, prof_id, squad_number, department, semester_number , solved , submit_assignment,submit_date,assignemnt_date',
            svalue=f"'{self.__assignment_name}', {self.__course_id}, '{self.__file_upload_link}', {self.__prof_id}, {self.__squad_number}, '{self.__department}', {self.__semester_number} , {self.__solved} , {self.__submit_assignment} , '{self.__submit_date}','{self.__assignemnt_date}' "
        )

    def update_assignment(self):
        dbconn = DatabaseCRUD()
        cond = ["id=" + str(self.__assignment_id)]
        sfld = (
            f"assignment_name='{self.__assignment_name}', course_id={self.__course_id}, file_upload_link='{self.__file_upload_link}', "
            f"prof_id={self.__prof_id}, squad_number={self.__squad_number},solved={self.__solved} ,  department='{self.__department}', "
            f"semester_number={self.__semester_number} , submit_assignment={self.__submit_assignment} , assignemnt_date='{self.__assignemnt_date}' , submit_date='{self.__submit_date}'"
        )
        dbconn.DBUpdate(tbl='assignments', sfld=sfld, scond=cond)

    def delete_assignment(self):
        dbconn = DatabaseCRUD()
        cond = ["id=" + str(self.__assignment_id)]
        dbconn.DBDelete(tbl='assignments', scond=cond)

    def get_data_by_squad_semester_depart_semes(self):
        if not self.__squad_number or not self.__semester_number:
            raise ValueError("squad_number and Semester number are required")

        dbconn = DatabaseCRUD()
        cond = [f"squad_number={self.__squad_number} AND semester_number={self.__semester_number} AND department='{self.__department}'"]
        grade_data = dbconn.DBRead(tbl='assignments', sfld='*', scond=cond)

        if not grade_data:
            return None

        return grade_data
    
    def get_assigned_tasks(self) :
        dbconns = DatabaseCRUD()
        cond = [f"prof_id={self.__prof_id}"]
        data = dbconns.DBRead(tbl="assignments" , sfld=f"count(id)" , scond=cond)
        return data
    
    def get_submited_tasks(self) :
        dbconns = DatabaseCRUD()
        cond = [f"prof_id={self.__prof_id} and solved = 1"]
        data = dbconns.DBRead(tbl="assignments" , sfld=f"count(id)" , scond=cond)
        return data
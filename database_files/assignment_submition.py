from database_files.database import DatabaseCRUD
from abc import ABC, abstractmethod


class IAssignmentSubmissions(ABC):
    @abstractmethod
    def get_submission_data(self):
        pass

    @abstractmethod
    def add_submission(self):
        pass

    @abstractmethod
    def update_submission(self):
        pass

    @abstractmethod
    def delete_submission(self):
        pass


class AssignmentSubmissions(IAssignmentSubmissions):
    def __init__(self, submit_id=None, assignment_id=None, course_id=None, prof_id=None, student_id=None, file_upload_link=None,
                 squad_number=None, department=None, assignment_grade=None , semester_number=None):
        self.__submit_id = submit_id
        self.__assignment_id = assignment_id
        self.__course_id = course_id
        self.__prof_id = prof_id
        self.__student_id = student_id
        self.__file_upload_link = file_upload_link
        self.__squad_number = squad_number
        self.__department = department
        self.__semester_number = semester_number
        self.__assignment_grade = assignment_grade

    def get_submission_data(self):
        dbconn = DatabaseCRUD()
        cond = ["submit_id=" + str(self.__submit_id)] if self.__submit_id else ["1=1"]
        return dbconn.DBRead(tbl='assignments_submitions', sfld='*', scond=cond)

    def get_submission_data_by_prof_id(self):
        dbconn = DatabaseCRUD()
        cond = ["prof_id=" + str(self.__prof_id)]
        return dbconn.DBRead(tbl='assignments_submitions', sfld='*', scond=cond, sorderBy="")

    def get_submission_data_by_student_id_course(self):
        dbconn = DatabaseCRUD()
        cond = [f"student_id={self.__student_id} AND course_id={self.__course_id}"]
        return dbconn.DBRead(tbl='assignments_submitions', sfld='*', scond=cond, sorderBy="")

    def get_submission_data_by_student_id_assignment_id(self):
        dbconn = DatabaseCRUD()
        cond = [f"student_id={self.__student_id} AND assignment_id={self.__assignment_id}"]
        return dbconn.DBRead(tbl='assignments_submitions', sfld='*', scond=cond, sorderBy="")

    def get_submission_data_by_student_id_course(self):
        dbconn = DatabaseCRUD()
        cond = [f"student_id={self.__student_id} AND course_id={self.__course_id}"]
        return dbconn.DBRead(tbl='assignments_submitions', sfld='*', scond=cond, sorderBy="")

    def add_submission(self):
        dbconn = DatabaseCRUD()
        dbconn.DBCreate(
            tbl='assignments_submitions',
            sidName='submit_id',  # Auto-increment field
            sfld='assignment_id, course_id, prof_id, student_id, file_upload_link, squad_number, department, semester_number ,assignment_grade',
            svalue=f"'{self.__assignment_id}', {self.__course_id}, {self.__prof_id}, {self.__student_id}, '{self.__file_upload_link}', {self.__squad_number}, '{self.__department}', {self.__semester_number} , {self.__assignment_grade}"
        )

    def update_submission(self):
        dbconn = DatabaseCRUD()
        cond = ["submit_id=" + str(self.__submit_id)]
        sfld = (
            f"assignment_id={self.__assignment_id}, course_id={self.__course_id}, prof_id={self.__prof_id}, student_id={self.__student_id}, assignment_grade={self.__assignment_grade},"
            f"file_upload_link='{self.__file_upload_link}', squad_number={self.__squad_number}, department='{self.__department}', semester_number={self.__semester_number}"
        )
        dbconn.DBUpdate(tbl='assignments_submitions', sfld=sfld, scond=cond)

    def delete_submission(self):
        dbconn = DatabaseCRUD()
        cond = ["submit_id=" + str(self.__submit_id)]
        dbconn.DBDelete(tbl='assignments_submitions', scond=cond)

    def get_data_by_squad_semester_department(self):
        if not self.__squad_number or not self.__semester_number or not self.__department:
            raise ValueError("squad_number, semester_number, and department are required")

        dbconn = DatabaseCRUD()
        cond = [f"squad_number={self.__squad_number} AND semester_number={self.__semester_number} AND department='{self.__department}'"]
        return dbconn.DBRead(tbl='assignments_submitions', sfld='*', scond=cond)
    
    
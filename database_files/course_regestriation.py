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
    def __init__(self, RegistrationID=None,squad_number=None , prof_id=None, department =None , semester_number=None , StudentID=None, CourseID=None, Semester=None , status_registration = None):
        self.__RegistrationID = RegistrationID
        self.__StudentID = StudentID
        self.__CourseID = CourseID
        self.__Semester = Semester
        self.__status_registration = status_registration
        self.__squad_number = squad_number
        self.__department = department 
        self.__semester_number = semester_number
        self.__prof_id = prof_id
        

    def get_registration_data(self):
        dbconn = DatabaseCRUD()
        cond = ["RegistrationID=" + str(self.__RegistrationID)] if self.__RegistrationID else ["1=1"]
        registration_data = dbconn.DBRead(tbl='CourseRegistrations', sfld='*', scond=cond)
        return registration_data

    def get_registration_data_semester_squad(self):
        dbconn = DatabaseCRUD()
        cond = [f"StudentID={self.__StudentID} and squad_number={self.__squad_number} and semester_number={self.__semester_number}"]
        registration_data = dbconn.DBRead(tbl='CourseRegistrations', sfld='*', scond=cond)
        return registration_data
    
    def add_registration(self):
        dbconn = DatabaseCRUD()
        dbconn.DBCreate(
            tbl='CourseRegistrations',
            sidName='RegistrationID',
            sfld='StudentID, CourseID, Semester, status_registration, semester_number, department, squad_number , prof_id',
            svalue=f"{self.__StudentID}, {self.__CourseID}, '{self.__Semester}', '{self.__status_registration}', {self.__semester_number}, '{self.__department}', {self.__squad_number} , {self.__prof_id}"
        )
        
    def update_registration(self):
        dbconn = DatabaseCRUD()
        cond = ["RegistrationID=" + str(self.__RegistrationID)]
        sfld = f"StudentID={self.__StudentID}, CourseID={self.__CourseID}, Semester='{self.__Semester}', status_registration='{self.__status_registration}' ,semester_number={self.__semester_number} ,department='{self.__department}', squad_number={self.__squad_number},prof_id={self.__prof_id} "
        dbconn.DBUpdate(tbl='CourseRegistrations', sfld=sfld, scond=cond)

    def delete_registration(self):
        dbconn = DatabaseCRUD()
        cond = ["RegistrationID=" + str(self.__RegistrationID)]
        dbconn.DBDelete(tbl='CourseRegistrations', scond=cond)
        
    
    def get_data_by_squad_semester_std(self):
        if not self.__StudentID or not self.__semester_number:
            raise ValueError("Student ID and Semester ID are required")

        dbconn = DatabaseCRUD()
        cond = [f"StudentID={self.__StudentID}  AND semester_number={self.__semester_number} AND squad_number={self.__squad_number}"]
        grade_data = dbconn.DBRead(tbl='CourseRegistrations', sfld='*', scond=cond)

        if not grade_data:
            return None

        return grade_data
    
    def get_data_by_squad_semester_std_with_department(self):
        if not self.__StudentID or not self.__semester_number:
            raise ValueError("Student ID and Semester ID are required")

        dbconn = DatabaseCRUD()
        cond = [f"StudentID={self.__StudentID} and department='{self.__department}' AND semester_number={self.__semester_number} AND squad_number={self.__squad_number}"]
        grade_data = dbconn.DBRead(tbl='CourseRegistrations', sfld='*', scond=cond)

        if not grade_data:
            return None

        return grade_data
    
    
    def is_already_registered(self):
        """Check if the student is already registered for the course in the same semester & squad."""
        if not self.__StudentID or not self.__CourseID or not self.__semester_number or not self.__squad_number:
            raise ValueError("Student ID, Course ID, Semester Number, and Squad Number are required")

        dbconn = DatabaseCRUD()
        cond = [
            f"StudentID={self.__StudentID}",
            f"CourseID={self.__CourseID}",
            f"semester_number={self.__semester_number}",
            f"squad_number={self.__squad_number}"
        ]
        existing_registration = dbconn.DBRead(tbl='CourseRegistrations', sfld='*', scond=cond)

        return bool(existing_registration)  # 
    
    def get_total_students(self) : 
        dbconn = DatabaseCRUD()
        cond = [f"prof_id={self.__prof_id}"]
        data =dbconn.DBRead(tbl="CourseRegistrations" , sfld="count(distinct StudentID) as total_number_students" , scond=cond)
        return data  
    
    def get_total_students_registered(self) : 
        dbconn = DatabaseCRUD()
        data =dbconn.DBRead(tbl="CourseRegistrations" , sfld="count(distinct StudentID) as total_number_students" )
        return data  